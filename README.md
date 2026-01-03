# WebcamWeather

A dynamic website that displays live webcam images/video from webcam.io and real-time weather data from a Tempest weather station.

## Features

- **Live Webcam Display**: Shows the latest images from your webcam.io camera with automatic refresh
- **Current Weather Conditions**: Real-time weather data from your Tempest weather station including:
  - Temperature (actual and feels-like)
  - Humidity
  - Wind speed and gusts
  - Barometric pressure
  - Current conditions
- **Weather Forecast**: 5-day forecast with daily high/low temperatures and precipitation chances
- **Automatic Updates**: Data refreshes automatically every 5 minutes (configurable)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Easy Configuration**: All API credentials stored in a simple JSON configuration file

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/temalo/WebcamWeather.git
cd WebcamWeather
```

### 2. Configure Your APIs

Copy the example configuration file and edit it with your credentials:

```bash
cp config.example.json config.json
```

Edit `config.json` with your actual API credentials:

```json
{
  "webcam": {
    "cameraId": "YOUR_WEBCAM_IO_CAMERA_ID",
    "apiUrl": "https://api.webcam.io/v1"
  },
  "tempest": {
    "stationId": "YOUR_TEMPEST_STATION_ID",
    "token": "YOUR_TEMPEST_API_TOKEN",
    "apiUrl": "https://swd.weatherflow.com/swd/rest"
  },
  "site": {
    "title": "My Webcam Weather Station",
    "refreshInterval": 300000
  }
}
```

#### Getting Your API Credentials

**Webcam.io:**
- Sign up at [webcam.io](https://webcam.io)
- Find your camera ID in your account dashboard
- Note: The webcam integration uses the webcam.io API. You may need to adjust the `apiUrl` based on your specific webcam service

**Tempest Weather Station:**
- Sign up at [WeatherFlow Tempest](https://tempestwx.com)
- Get your Station ID from your station settings
- Generate an API token from your account settings at [tempestwx.com/settings/tokens](https://tempestwx.com/settings/tokens)

### 3. Serve the Website

You can serve this website using any web server. Here are a few options:

**Option 1: Python Simple HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js http-server**
```bash
npx http-server -p 8000
```

**Option 3: PHP Built-in Server**
```bash
php -S localhost:8000
```

**Option 4: Deploy to Azure App Service**

This repository is configured for automatic deployment to Azure App Service. See the [Azure Deployment](#azure-deployment) section below for details.

**Option 5: Deploy to Other Web Hosts**
- Upload all files (including `config.json`) to your web hosting service
- Make sure `config.json` is readable by the web server
- Access via your domain or hosting URL

### 4. Access the Website

Open your browser and navigate to:
```
http://localhost:8000
```

## Configuration Options

### `config.json` Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `webcam.cameraId` | Your webcam.io camera ID | Required |
| `webcam.apiUrl` | Base URL for webcam.io API | `https://api.webcam.io/v1` |
| `tempest.stationId` | Your Tempest weather station ID | Required |
| `tempest.token` | Your Tempest API token | Required |
| `tempest.apiUrl` | Base URL for Tempest API | `https://swd.weatherflow.com/swd/rest` |
| `site.title` | Website title displayed in header | `My Webcam Weather Station` |
| `site.refreshInterval` | Auto-refresh interval in milliseconds | `300000` (5 minutes) |

## File Structure

```
WebcamWeather/
├── .github/
│   └── workflows/
│       └── main_sqltrainerweather.yml  # Azure deployment workflow
├── index.html              # Main HTML page
├── styles.css              # CSS styling
├── app.js                  # JavaScript application logic
├── server.js               # Node.js server for Azure hosting
├── generate-config.js      # Script to generate config.json from env vars
├── web.config              # Azure App Service configuration
├── package.json            # Node.js package configuration
├── config.example.json     # Example configuration (template)
├── config.json             # Your actual configuration (not in git)
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## Customization

### Changing the Refresh Interval

Edit the `refreshInterval` value in `config.json` (in milliseconds):
- 1 minute: `60000`
- 5 minutes: `300000` (default)
- 10 minutes: `600000`

### Styling

You can customize the appearance by editing `styles.css`. The website uses a modern gradient theme with responsive design.

### API Integration

The application is designed to work with:
- **Webcam.io** for webcam images
- **WeatherFlow Tempest API** for weather data

If you need to adapt it for different services, edit the API calls in `app.js`.

## Troubleshooting

### Webcam Image Not Loading
- Verify your `cameraId` is correct
- Check that the webcam.io API URL is correct for your service
- Check browser console for error messages
- Ensure CORS is enabled on the webcam service

### Weather Data Not Loading
- Verify your `stationId` and `token` are correct
- Ensure your Tempest station is online and reporting data
- Check the Tempest API status
- Verify your API token has not expired

### Configuration Not Loading
- Ensure `config.json` exists in the same directory as `index.html`
- Verify the JSON syntax is valid (use a JSON validator)
- Check browser console for error messages
- Make sure the web server can read the config file

## Security Notes

- Keep your `config.json` file secure as it contains API credentials
- Do not commit `config.json` to version control (it's in `.gitignore`)
- Consider using environment variables or server-side configuration for production deployments
- If deploying publicly, consider implementing server-side proxies for API calls to hide credentials

## Azure Deployment

This repository is configured for automatic deployment to Azure App Service using GitHub Actions.

### Prerequisites

1. **Azure Account**: You need an Azure subscription
2. **Azure App Service**: Create an Azure App Service (Web App) with Node.js runtime
3. **GitHub Repository Secrets**: Configure the following secrets in your GitHub repository

### Required GitHub Secrets

Navigate to your repository's **Settings > Secrets and variables > Actions** and add these secrets:

#### Azure Authentication (automatically configured by Azure)
- `AZUREAPPSERVICE_CLIENTID_BBFA7C4F1D884BDC935C74195912EC15`
- `AZUREAPPSERVICE_TENANTID_1387DECCA08345F09D0E209F6AF4B37D`
- `AZUREAPPSERVICE_SUBSCRIPTIONID_94A1B5DA1CFC4F81A6873F5F6A4A0693`

#### Application Configuration (you must add these)
- `WEBCAM_CAMERA_ID` - Your webcam.io camera ID
- `TEMPEST_STATION_ID` - Your Tempest weather station ID
- `TEMPEST_API_TOKEN` - Your Tempest API token

#### Optional Configuration
- `SITE_TITLE` - Custom site title (default: "My Webcam Weather Station")
- `SITE_REFRESH_INTERVAL` - Refresh interval in milliseconds (default: 300000)
- `WEBCAM_API_URL` - Custom webcam API URL (default: https://api.webcam.io/v1)
- `TEMPEST_API_URL` - Custom Tempest API URL (default: https://swd.weatherflow.com/swd/rest)

### How It Works

The deployment process is automated via GitHub Actions:

1. **Trigger**: Pushes to `main` branch or manual workflow dispatch
2. **Build Phase**:
   - Checks out the code
   - Sets up Node.js environment
   - Runs `npm install` to install dependencies
   - Runs `npm run build` which generates `config.json` from environment variables
   - Runs `npm test` to verify the build
3. **Deploy Phase**:
   - Authenticates with Azure using federated credentials
   - Deploys the application to Azure App Service
   - The Node.js server (`server.js`) serves the static files

### Manual Deployment

If you need to deploy manually:

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
export WEBCAM_CAMERA_ID="your_camera_id"
export TEMPEST_STATION_ID="your_station_id"
export TEMPEST_API_TOKEN="your_api_token"

# 3. Generate config.json
npm run build

# 4. Deploy using Azure CLI
az webapp up --name sqltrainerweather --resource-group your-resource-group
```

### Verifying Deployment

After deployment:
1. Visit your Azure App Service URL: `https://sqltrainerweather.azurewebsites.net`
2. Check that the page loads correctly
3. Verify weather data and webcam images are displaying
4. Check Azure App Service logs if there are issues

### Updating Configuration

To update API credentials or configuration:
1. Update the GitHub repository secrets
2. Trigger a new deployment by:
   - Pushing to the `main` branch, or
   - Using the "Run workflow" button in the Actions tab

### Troubleshooting Azure Deployment

**Build fails with missing environment variables:**
- Verify all required secrets are set in GitHub repository settings
- Check the Actions logs for specific missing variables

**Deployment succeeds but site shows error:**
- Check Azure App Service logs in the Azure Portal
- Verify the `config.json` was generated correctly
- Ensure the Node.js version matches what's specified in the workflow

**Site loads but no data displays:**
- Verify your API credentials are correct in GitHub secrets
- Check browser console for API errors
- Verify the Tempest station and webcam are online and accessible

## License

This project is available under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
