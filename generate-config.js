#!/usr/bin/env node

/**
 * This script generates config.json from environment variables
 * Usage: node generate-config.js
 * 
 * Required environment variables:
 * - WEBCAM_CAMERA_ID
 * - TEMPEST_STATION_ID
 * - TEMPEST_API_TOKEN
 * 
 * Optional environment variables:
 * - SITE_TITLE (defaults to "My Webcam Weather Station")
 * - SITE_REFRESH_INTERVAL (defaults to 300000ms / 5 minutes)
 * - WEBCAM_API_URL (defaults to "https://api.webcam.io/v1")
 * - TEMPEST_API_URL (defaults to "https://swd.weatherflow.com/swd/rest")
 */

const fs = require('fs');
const path = require('path');

// Check for required environment variables
const requiredEnvVars = [
    'WEBCAM_CAMERA_ID',
    'TEMPEST_STATION_ID',
    'TEMPEST_API_TOKEN'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('ERROR: Missing required environment variables:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    console.error('\nPlease set these environment variables before running this script.');
    process.exit(1);
}

// Build configuration object from environment variables
const config = {
    webcam: {
        cameraId: process.env.WEBCAM_CAMERA_ID,
        apiUrl: process.env.WEBCAM_API_URL || "https://api.webcam.io/v1"
    },
    tempest: {
        stationId: process.env.TEMPEST_STATION_ID,
        token: process.env.TEMPEST_API_TOKEN,
        apiUrl: process.env.TEMPEST_API_URL || "https://swd.weatherflow.com/swd/rest"
    },
    site: {
        title: process.env.SITE_TITLE || "My Webcam Weather Station",
        refreshInterval: (() => {
            const interval = parseInt(process.env.SITE_REFRESH_INTERVAL || "300000", 10);
            if (isNaN(interval) || interval < 0) {
                console.error('ERROR: Invalid SITE_REFRESH_INTERVAL value. Must be a positive number.');
                process.exit(1);
            }
            return interval;
        })()
    }
};

// Write config.json
const configPath = path.join(__dirname, 'config.json');

try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('✓ config.json generated successfully');
    console.log(`  Location: ${configPath}`);
    console.log('\nConfiguration:');
    console.log(`  Webcam Camera ID: ${config.webcam.cameraId}`);
    console.log(`  Tempest Station ID: ${config.tempest.stationId}`);
    console.log(`  Site Title: ${config.site.title}`);
    console.log(`  Refresh Interval: ${config.site.refreshInterval}ms`);
} catch (error) {
    console.error('ERROR: Failed to write config.json:', error.message);
    process.exit(1);
}
