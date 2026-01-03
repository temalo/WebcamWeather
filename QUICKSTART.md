# Quick Start Guide

## Setup in 3 Easy Steps

### 1. Configure Your APIs

```bash
cp config.example.json config.json
```

Edit `config.json` with your credentials:
- **Webcam.io Camera ID**: Get from webcam.io dashboard
- **Tempest Station ID**: Get from tempestwx.com station settings
- **Tempest API Token**: Generate at tempestwx.com/settings/tokens

### 2. Start a Web Server

Choose one of these methods:

**Node.js (Recommended for Azure):**
```bash
npm install
npm run build  # Requires env vars or creates config.json
npm start
```

**Node.js (with http-server):**
```bash
npx http-server -p 8000
```

**Python:**
```bash
python3 -m http.server 8000
```

**PHP:**
```bash
php -S localhost:8000
```

### 3. Open in Browser

Navigate to: `http://localhost:8000`

## What You'll See

- **Live Webcam Section**: Real-time images from your camera
- **Current Weather**: Temperature, humidity, wind, pressure, conditions
- **5-Day Forecast**: Daily highs/lows and precipitation chances
- **Auto-refresh**: Data updates every 5 minutes automatically

## Need Help?

See the main [README.md](README.md) for:
- Detailed configuration options
- Troubleshooting guide
- Customization tips
- Local deployment instructions

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Azure automatic deployment setup
- GitHub Actions configuration
- Production deployment guide

## File Overview

- `index.html` - Main webpage
- `styles.css` - Styling and layout
- `app.js` - JavaScript logic and API calls
- `config.json` - Your API credentials (not in git)
- `config.example.json` - Configuration template
