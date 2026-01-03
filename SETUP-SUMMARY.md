# Azure Deployment Setup - Summary

## ✅ What Has Been Configured

This repository has been fully configured for automatic deployment to Azure App Service. Here's what was added:

### 1. Core Files Added

- **`package.json`** - Node.js package configuration with build and start scripts
- **`server.js`** - Simple Node.js HTTP server to serve static files on Azure
- **`generate-config.js`** - Script that generates config.json from environment variables
- **`web.config`** - Azure App Service IIS configuration for Node.js hosting
- **`.deployment`** - Azure deployment configuration

### 2. GitHub Actions Workflow Updated

File: `.github/workflows/main_sqltrainerweather.yml`

**Changes:**
- Added environment variables to the build step
- Configured to generate config.json from GitHub secrets during deployment
- Added support for current branch (for testing)

**Workflow Process:**
1. Checkout code from GitHub
2. Setup Node.js environment
3. Install npm dependencies
4. Run build script (generates config.json from environment variables)
5. Run tests
6. Authenticate with Azure
7. Deploy to Azure App Service

### 3. Documentation Added

- **`DEPLOYMENT.md`** - Complete Azure deployment guide with step-by-step instructions
- **`README.md`** - Updated with Azure deployment section
- **`QUICKSTART.md`** - Updated with Node.js server instructions
- **`start-local.sh`** - Helper script for local development

### 4. Git Configuration Updated

- **`.gitignore`** - Enhanced to exclude:
  - config.json (sensitive data)
  - node_modules/
  - package-lock.json
  - Various log files

## 🔑 Required Actions for Deployment

To enable automatic deployment, you need to configure GitHub repository secrets:

### Step 1: Add GitHub Secrets

Go to: **Repository Settings > Secrets and variables > Actions**

Add these required secrets:

| Secret Name | Description | Where to Get It |
|------------|-------------|-----------------|
| `WEBCAM_CAMERA_ID` | Your webcam.io camera ID | webcam.io dashboard |
| `TEMPEST_STATION_ID` | Your Tempest station ID | tempestwx.com station settings |
| `TEMPEST_API_TOKEN` | Your Tempest API token | tempestwx.com/settings/tokens |

Optional secrets (with defaults):

| Secret Name | Default Value | Description |
|------------|---------------|-------------|
| `SITE_TITLE` | "My Webcam Weather Station" | Website title |
| `SITE_REFRESH_INTERVAL` | 300000 | Refresh interval (ms) |
| `WEBCAM_API_URL` | https://api.webcam.io/v1 | Webcam API URL |
| `TEMPEST_API_URL` | https://swd.weatherflow.com/swd/rest | Tempest API URL |

### Step 2: Verify Azure Configuration

The workflow expects these Azure secrets (should already be configured):
- `AZUREAPPSERVICE_CLIENTID_BBFA7C4F1D884BDC935C74195912EC15`
- `AZUREAPPSERVICE_TENANTID_1387DECCA08345F09D0E209F6AF4B37D`
- `AZUREAPPSERVICE_SUBSCRIPTIONID_94A1B5DA1CFC4F81A6873F5F6A4A0693`

These are automatically set up when you configure GitHub deployment from Azure Portal.

### Step 3: Deploy

Once secrets are configured, deployment happens automatically when you:
- Push to the `main` branch
- Manually trigger the workflow from GitHub Actions tab

## 🧪 How to Test Locally

### Option 1: Using the Helper Script

```bash
# Generate config from environment variables
export WEBCAM_CAMERA_ID="your_camera_id"
export TEMPEST_STATION_ID="your_station_id"
export TEMPEST_API_TOKEN="your_api_token"
npm run build

# Start the server
./start-local.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Generate config.json from environment variables
export WEBCAM_CAMERA_ID="your_camera_id"
export TEMPEST_STATION_ID="your_station_id"
export TEMPEST_API_TOKEN="your_api_token"
npm run build

# Start the server
npm start
```

Visit: http://localhost:8080

### Option 3: Traditional Method (No Node.js build)

```bash
# Copy example config
cp config.example.json config.json

# Edit config.json with your credentials
nano config.json

# Start any web server
python3 -m http.server 8000
```

Visit: http://localhost:8000

## 📋 Deployment Checklist

Use this checklist to verify your deployment setup:

- [ ] All required GitHub secrets are configured
- [ ] Azure App Service is created and running
- [ ] Azure authentication secrets are in GitHub
- [ ] Workflow file is in `.github/workflows/` directory
- [ ] Test local build: `npm run build` (with env vars)
- [ ] Test local server: `npm start`
- [ ] Push to main branch or trigger workflow manually
- [ ] Monitor workflow execution in Actions tab
- [ ] Verify deployment in Azure Portal
- [ ] Visit Azure App Service URL
- [ ] Verify webcam and weather data display correctly

## 🔍 Verification Commands

```bash
# Test config generation
WEBCAM_CAMERA_ID="test" \
TEMPEST_STATION_ID="test" \
TEMPEST_API_TOKEN="test" \
npm run build

# Verify config.json was created
cat config.json

# Test server locally
npm start
# Visit http://localhost:8080 in browser

# Check workflow file syntax
cat .github/workflows/main_sqltrainerweather.yml
```

## 📚 Additional Resources

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Quick Start**: See `QUICKSTART.md`
- **Main Documentation**: See `README.md`
- **Azure Documentation**: https://docs.microsoft.com/azure/app-service/
- **GitHub Actions**: https://docs.github.com/actions

## 🎯 Next Steps

1. **Configure GitHub Secrets** - Add your API credentials
2. **Test Deployment** - Push to main or manually trigger workflow
3. **Verify Site** - Check your Azure App Service URL
4. **Optional Setup**:
   - Configure custom domain
   - Set up SSL certificate
   - Enable Application Insights
   - Configure auto-scaling

## 💡 Key Points

- ✅ **config.json is auto-generated** from environment variables during deployment
- ✅ **No secrets in code** - everything uses GitHub secrets or Azure settings
- ✅ **Automatic deployment** on push to main branch
- ✅ **Works locally** with same npm commands
- ✅ **Secure** - API credentials never committed to repository

## ❓ Getting Help

If you encounter issues:
1. Check `DEPLOYMENT.md` for troubleshooting guide
2. Review workflow logs in GitHub Actions tab
3. Check Azure App Service logs in Azure Portal
4. Verify all secrets are correctly configured
5. Ensure API credentials are valid and active

## 🔒 Security Reminders

- Never commit config.json to the repository
- Keep GitHub secrets secure
- Rotate API tokens periodically
- Monitor Azure costs and usage
- Review access logs regularly

---

**Status**: ✅ Repository is fully configured for Azure deployment
**Action Required**: Add GitHub secrets and trigger deployment
