#!/bin/bash

# Local Setup Script for WebcamWeather
# This script helps you set up and run the application locally

echo "================================================"
echo "WebcamWeather Local Setup"
echo "================================================"
echo ""

# Check if config.json exists
if [ ! -f "config.json" ]; then
    echo "❌ config.json not found"
    echo ""
    echo "You have two options:"
    echo ""
    echo "Option 1: Create config.json manually"
    echo "  cp config.example.json config.json"
    echo "  # Then edit config.json with your API credentials"
    echo ""
    echo "Option 2: Generate from environment variables"
    echo "  export WEBCAM_CAMERA_ID='your_camera_id'"
    echo "  export TEMPEST_STATION_ID='your_station_id'"
    echo "  export TEMPEST_API_TOKEN='your_api_token'"
    echo "  npm run build"
    echo ""
    exit 1
fi

echo "✓ config.json found"

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) installed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "================================================"
echo "Starting WebcamWeather server..."
echo "================================================"
echo ""
echo "Server will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start
