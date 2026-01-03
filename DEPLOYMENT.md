# Azure Deployment Guide

This guide will help you set up automatic deployment to Azure App Service for the WebcamWeather application.

## Quick Setup Checklist

- [ ] Azure App Service created
- [ ] GitHub repository secrets configured
- [ ] Workflow tested
- [ ] Site verified online

## Step 1: Create Azure App Service

1. Sign in to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** > **Web App**
3. Configure the web app:
   - **Resource Group**: Create new or use existing
   - **Name**: `sqltrainerweather` (or your preferred name)
   - **Publish**: Code
   - **Runtime stack**: Node (LTS version recommended)
   - **Operating System**: Linux or Windows
   - **Region**: Choose closest to your users
4. Click **Review + Create** then **Create**

## Step 2: Configure Azure for GitHub Actions

### Option A: Using Azure Portal (Recommended)

1. Go to your App Service in Azure Portal
2. Navigate to **Deployment Center**
3. Select **GitHub** as the source
4. Authorize Azure to access your GitHub account
5. Select your repository: `temalo/WebcamWeather`
6. Select branch: `main`
7. Azure will automatically:
   - Create the workflow file
   - Set up federated credentials
   - Add necessary secrets to GitHub

### Option B: Manual Setup

If you need to set up credentials manually:

1. Create a Service Principal in Azure:
```bash
az ad sp create-for-rbac \
  --name "WebcamWeatherDeploy" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Web/sites/{app-name} \
  --sdk-auth
```

2. Add the output JSON as a GitHub secret named `AZURE_CREDENTIALS`

## Step 3: Configure GitHub Secrets

Go to your GitHub repository: **Settings > Secrets and variables > Actions**

### Add Required Secrets

Click **New repository secret** and add each of the following:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `WEBCAM_CAMERA_ID` | Your webcam.io camera ID | `abc123xyz` |
| `TEMPEST_STATION_ID` | Your Tempest station ID | `12345` |
| `TEMPEST_API_TOKEN` | Your Tempest API token | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

### Add Optional Secrets (if customizing)

| Secret Name | Description | Default |
|------------|-------------|---------|
| `SITE_TITLE` | Custom site title | My Webcam Weather Station |
| `SITE_REFRESH_INTERVAL` | Refresh interval in ms | 300000 (5 minutes) |
| `WEBCAM_API_URL` | Webcam API base URL | https://api.webcam.io/v1 |
| `TEMPEST_API_URL` | Tempest API base URL | https://swd.weatherflow.com/swd/rest |

## Step 4: Test the Deployment

### Automatic Deployment

The workflow will automatically run when you:
- Push to the `main` branch
- Manually trigger it from Actions tab

### Manual Trigger

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **Build and deploy Node.js app to Azure Web App**
4. Click **Run workflow**
5. Select the branch and click **Run workflow**

### Monitor Deployment

1. Watch the workflow run in the Actions tab
2. Check for any errors in the build or deploy steps
3. Review the logs if deployment fails

## Step 5: Verify Deployment

1. **Access Your Site**
   - Navigate to: `https://sqltrainerweather.azurewebsites.net`
   - Replace with your App Service name if different

2. **Check Functionality**
   - [ ] Page loads without errors
   - [ ] Site title displays correctly
   - [ ] Webcam timelapse widget appears
   - [ ] Weather data loads and displays
   - [ ] Forecast section shows data

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any JavaScript errors
   - Verify API calls are successful

## Troubleshooting

### Build Fails

**Error: Missing required environment variables**
- Solution: Verify all required secrets are added in GitHub
- Check secret names match exactly (case-sensitive)

**Error: npm install fails**
- Solution: Check package.json is valid
- Verify Node.js version compatibility

### Deployment Fails

**Error: Authentication failed**
- Solution: Verify Azure credentials in GitHub secrets
- May need to regenerate credentials in Azure

**Error: App Service not found**
- Solution: Verify app name in workflow matches Azure
- Check resource group and subscription

### Site Issues

**Page shows 503 or won't load**
- Check Azure App Service is running
- Review Application Logs in Azure Portal
- Verify `server.js` is starting correctly

**Weather data not showing**
- Verify API credentials in GitHub secrets
- Check browser console for API errors
- Test API endpoints manually

**Webcam not showing**
- Verify webcam.io embed code in index.html
- Check CORS settings if using API

## Updating the Site

### Update Configuration

1. Update GitHub secrets with new values
2. Trigger a new deployment:
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

### Update Code

1. Make changes to your code
2. Commit and push to `main` branch
3. Workflow will automatically deploy

### Rollback

If you need to rollback:
1. Go to Azure Portal > Your App Service
2. Navigate to **Deployment Center**
3. Click on **Logs**
4. Find a previous successful deployment
5. Click **Redeploy**

## Advanced Configuration

### Custom Domain

1. In Azure Portal, go to your App Service
2. Navigate to **Custom domains**
3. Click **Add custom domain**
4. Follow the wizard to verify and add your domain

### SSL Certificate

1. Navigate to **TLS/SSL settings**
2. Add a certificate (Azure managed or custom)
3. Create TLS/SSL binding for your domain

### Environment Variables in Azure

Alternatively, you can set environment variables directly in Azure:
1. Go to your App Service
2. Navigate to **Configuration**
3. Add Application Settings for each environment variable
4. Restart the app

This approach keeps secrets in Azure instead of GitHub.

## Monitoring

### Application Insights

1. Enable Application Insights for your App Service
2. Monitor:
   - Response times
   - Failed requests
   - Server exceptions
   - Custom events

### Logs

Access logs in Azure Portal:
- **Log stream**: Real-time logging
- **App Service logs**: Application logs
- **Deployment logs**: Deployment history

## Security Best Practices

1. **Rotate API Tokens Regularly**
   - Update Tempest API token periodically
   - Update GitHub secrets when changed

2. **Restrict Access**
   - Use Azure AD authentication if needed
   - Configure IP restrictions if appropriate

3. **Monitor Usage**
   - Check API rate limits
   - Monitor Azure costs
   - Review access logs

4. **Keep Dependencies Updated**
   - Regularly update npm packages
   - Monitor for security vulnerabilities

## Getting Help

- **Azure Issues**: [Azure Support](https://azure.microsoft.com/support/)
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/actions)
- **Repository Issues**: [Create an Issue](https://github.com/temalo/WebcamWeather/issues)

## Next Steps

After successful deployment:
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate
- [ ] Enable Application Insights monitoring
- [ ] Set up alerting for downtime
- [ ] Configure auto-scaling if needed
- [ ] Schedule regular API token rotation
