// WebcamWeather Application
class WebcamWeather {
    constructor() {
        this.config = null;
        this.refreshTimer = null;
        this.elevationMeters = null;
        
        // Weather condition thresholds
        this.WEATHER_THRESHOLDS = {
            WINDY_SPEED: 20,
            HUMID_PERCENT: 80,
            HOT_TEMP_C: 30,
            FREEZING_TEMP_C: 0,
            COLD_TEMP_C: 10
        };
    }

    // Initialize the application
    async init() {
        try {
            await this.loadConfig();
            this.updateSiteTitle();
            await this.fetchStationMetadata();
            await this.updateAll();
            this.startAutoRefresh();
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load configuration. Please ensure config.json exists and is valid.');
        }
    }

    // Load configuration from config.json
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error('Configuration file not found.');
            }
            this.config = await response.json();
        } catch (error) {
            throw new Error('Failed to load configuration: ' + error.message);
        }
    }

    // Fetch station metadata including elevation
    async fetchStationMetadata() {
        try {
            if (!this.config.tempest || !this.config.tempest.stationId || !this.config.tempest.token) {
                throw new Error('Tempest configuration is missing');
            }

            const url = `${this.config.tempest.apiUrl}/stations/${this.config.tempest.stationId}?token=${this.config.tempest.token}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.stations && result.stations.length > 0) {
                this.elevationMeters = result.stations[0].station_meta?.elevation || 0;
            } else {
                this.elevationMeters = 0;
            }
        } catch (error) {
            console.error('Failed to fetch station metadata:', error);
            this.elevationMeters = 0;
        }
    }

    // Update site title
    updateSiteTitle() {
        if (this.config && this.config.site && this.config.site.title) {
            document.getElementById('page-title').textContent = this.config.site.title;
            document.getElementById('site-title').textContent = this.config.site.title;
        }
    }

    // Update all data
    async updateAll() {
        await Promise.all([
            this.updateWeather(),
            this.updateForecast()
        ]);
    }

    // Update weather data
    async updateWeather() {
        const loading = document.getElementById('weather-loading');
        const data = document.getElementById('weather-data');
        const error = document.getElementById('weather-error');

        try {
            loading.style.display = 'block';
            error.style.display = 'none';

            if (!this.config.tempest || !this.config.tempest.stationId || !this.config.tempest.token) {
                throw new Error('Tempest configuration is missing');
            }

            // Fetch observations from Tempest API
            const url = `${this.config.tempest.apiUrl}/observations/station/${this.config.tempest.stationId}?token=${this.config.tempest.token}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.obs || result.obs.length === 0) {
                throw new Error('No observation data available');
            }

            // Get the most recent observation
            const obs = result.obs[0];
            
            // Update weather display
            // Tempest API observation array format:
            // [timestamp, windLull, windAvg, windGust, windDirection, windSampleInterval,
            //  pressure, temp, humidity, illuminance, uv, solarRadiation, precipAccum,
            //  precipType, lightningDist, lightningCount, battery, reportInterval]
            
            const tempC = obs.air_temperature || obs[7];
            const tempF = (tempC * 9/5) + 32;
            const humidity = obs.relative_humidity || obs[8];
            const stationPressureMb = obs.station_pressure || obs[6];
            
            // Convert station pressure to sea level pressure
            const elevationM = this.elevationMeters || 0;
            const tempK = tempC + 273.15;
            const seaLevelPressureMb = stationPressureMb * Math.pow(1 - (0.0065 * elevationM) / tempK, -5.257);
            const pressureInHg = seaLevelPressureMb * 0.02953;
            
            const windSpeed = obs.wind_avg || obs[2] || 0;
            const windGust = obs.wind_gust || obs[3] || 0;
            
            // Calculate feels like temperature
            const feelsLikeC = this.calculateFeelsLike(tempC, humidity, windSpeed);
            const feelsLikeF = (feelsLikeC * 9/5) + 32;

            document.getElementById('temp').textContent = `${tempF.toFixed(1)}°F (${tempC.toFixed(1)}°C)`;
            document.getElementById('feels-like').textContent = `${feelsLikeF.toFixed(1)}°F (${feelsLikeC.toFixed(1)}°C)`;
            document.getElementById('humidity').textContent = `${humidity}%`;
            document.getElementById('wind').textContent = `${windSpeed.toFixed(1)} mph (Gust: ${windGust.toFixed(1)} mph)`;
            document.getElementById('pressure').textContent = `${pressureInHg.toFixed(2)} inHg`;
            document.getElementById('conditions').textContent = this.getWeatherCondition(tempC, humidity, windSpeed);

            loading.style.display = 'none';
            data.style.display = 'block';

        } catch (err) {
            console.error('Weather error:', err);
            loading.style.display = 'none';
            error.textContent = 'Unable to load weather data. ' + err.message;
            error.style.display = 'block';
        }
    }

    // Update forecast data
    async updateForecast() {
        const loading = document.getElementById('forecast-loading');
        const data = document.getElementById('forecast-data');
        const error = document.getElementById('forecast-error');

        try {
            loading.style.display = 'block';
            error.style.display = 'none';

            if (!this.config.tempest || !this.config.tempest.stationId || !this.config.tempest.token) {
                throw new Error('Tempest configuration is missing');
            }

            // Fetch forecast from Tempest API
            const url = `${this.config.tempest.apiUrl}/better_forecast?station_id=${this.config.tempest.stationId}&token=${this.config.tempest.token}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.forecast || !result.forecast.daily) {
                throw new Error('No forecast data available');
            }

            // Clear previous forecast
            data.innerHTML = '';

            // Display forecast for next few days (limit to 5 days)
            const days = result.forecast.daily.slice(0, 5);
            
            days.forEach(day => {
                const forecastDiv = document.createElement('div');
                forecastDiv.className = 'forecast-day';
                
                const date = new Date(day.day_start_local * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                
                // Validate temperature values exist
                const tempHigh = day.air_temp_high ?? 0;
                const tempLow = day.air_temp_low ?? 0;
                
                const tempHighF = ((tempHigh * 9/5) + 32).toFixed(1);
                const tempLowF = ((tempLow * 9/5) + 32).toFixed(1);
                const tempHighC = tempHigh.toFixed(1);
                const tempLowC = tempLow.toFixed(1);
                
                forecastDiv.innerHTML = `
                    <h3>${dayName}</h3>
                    <div class="forecast-details">
                        <div class="forecast-detail">
                            <span>High:</span>
                            <span>${tempHighF}°F (${tempHighC}°C)</span>
                        </div>
                        <div class="forecast-detail">
                            <span>Low:</span>
                            <span>${tempLowF}°F (${tempLowC}°C)</span>
                        </div>
                        <div class="forecast-detail">
                            <span>Conditions:</span>
                            <span>${day.conditions || 'N/A'}</span>
                        </div>
                        <div class="forecast-detail">
                            <span>Precip. Chance:</span>
                            <span>${day.precip_probability || 0}%</span>
                        </div>
                    </div>
                `;
                
                data.appendChild(forecastDiv);
            });

            loading.style.display = 'none';
            data.style.display = 'block';

        } catch (err) {
            console.error('Forecast error:', err);
            loading.style.display = 'none';
            error.textContent = 'Unable to load forecast data. ' + err.message;
            error.style.display = 'block';
        }
    }

    // Calculate feels like temperature (simplified heat index/wind chill)
    calculateFeelsLike(tempC, humidity, windSpeed) {
        const tempF = (tempC * 9/5) + 32;
        
        // Wind chill (for cold temperatures)
        if (tempF < 50 && windSpeed > 3) {
            const windChill = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(windSpeed, 0.16)) + (0.4275 * tempF * Math.pow(windSpeed, 0.16));
            return (windChill - 32) * 5/9;
        }
        
        // Heat index (for hot temperatures)
        if (tempF > 80) {
            const hi = -42.379 + (2.04901523 * tempF) + (10.14333127 * humidity) - 
                       (0.22475541 * tempF * humidity) - (0.00683783 * tempF * tempF) - 
                       (0.05481717 * humidity * humidity) + (0.00122874 * tempF * tempF * humidity) + 
                       (0.00085282 * tempF * humidity * humidity) - (0.00000199 * tempF * tempF * humidity * humidity);
            return (hi - 32) * 5/9;
        }
        
        return tempC;
    }

    // Get weather condition description
    getWeatherCondition(temp, humidity, windSpeed) {
        if (windSpeed > this.WEATHER_THRESHOLDS.WINDY_SPEED) return 'Windy';
        if (humidity > this.WEATHER_THRESHOLDS.HUMID_PERCENT) return 'Humid';
        if (temp > this.WEATHER_THRESHOLDS.HOT_TEMP_C) return 'Hot';
        if (temp < this.WEATHER_THRESHOLDS.FREEZING_TEMP_C) return 'Freezing';
        if (temp < this.WEATHER_THRESHOLDS.COLD_TEMP_C) return 'Cold';
        return 'Clear';
    }

    // Show general error
    showError(message) {
        const container = document.querySelector('.container');
        container.innerHTML = `<div class="error" style="grid-column: 1 / -1;">${message}</div>`;
    }

    // Start auto-refresh
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        const interval = (this.config && this.config.site && this.config.site.refreshInterval) 
            ? this.config.site.refreshInterval 
            : 300000; // Default 5 minutes

        this.refreshTimer = setInterval(() => {
            this.updateAll();
        }, interval);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebcamWeather();
    app.init();
});
