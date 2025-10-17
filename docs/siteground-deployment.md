# SiteGround Deployment with Google Apps Script Integration

This document provides instructions for deploying your Equip Media International website on SiteGround and setting up the Google Sheets integration using Google Apps Script.

## Overview

Since SiteGround doesn't support Node.js serverless functions like Netlify, we'll use Google Apps Script as an alternative solution for handling form submissions and storing data in Google Sheets.

## Step 1: Set up Google Apps Script

Follow the instructions in `google-apps-script-setup.md` to create and deploy the Google Apps Script that will handle form submissions to Google Sheets.

## Step 2: Update Frontend Code

Replace the placeholder URL in both form components with your actual Google Apps Script Web App URL:

1. In `src/components/ContactForm.tsx`, update line with the fetch call:
   ```javascript
   const response = await fetch('YOUR_ACTUAL_APPS_SCRIPT_URL', {
   ```

2. In `src/components/DonationForm.tsx`, update line with the fetch call:
   ```javascript
   const response = await fetch('YOUR_ACTUAL_APPS_SCRIPT_URL', {
   ```

## Step 3: Build Your Site

Before uploading to SiteGround, build your site:

```bash
npm run build
```

This will create a `dist` folder containing the build files.

## Step 4: Deploy to SiteGround

### Option A: Using FTP

1. Connect to your SiteGround account
2. Upload all files from the `dist` folder to your domain's public_html folder
3. Ensure the following permissions for all uploaded files:
   - HTML/CSS/JS files: 644 (readable by all)
   - Directories: 755 (executable by all)

### Option B: Using SiteGround's File Manager

1. Log in to your SiteGround account
2. Navigate to the File Manager
3. Upload the contents of the `dist` folder to your website's root directory (public_html)
4. Ensure proper file permissions as mentioned in Option A

## Step 5: Configure SiteGround Settings (if needed)

1. Log in to your SiteGround account
2. Go to Site Tools
3. Navigate to Security > SSL to ensure SSL is properly configured
4. If needed, configure any additional caching settings under Optimizer

## Testing

After deployment:
1. Visit your site and test the contact form
2. Submit test data and verify it appears in your Google Sheet
3. Ensure the thank you message appears after successful form submission

## Troubleshooting

- If forms aren't submitting, check the browser console for errors
- Verify your Google Apps Script URL is correctly added in both form components
- Ensure your Google Sheet is properly configured with the correct column headers
- Check that your Google Apps Script is deployed and accessible
- Confirm that your Google Sheet has the necessary permissions for the script

## Important Notes

1. Google Apps Script has daily execution quotas, so monitor usage if expecting high traffic
2. The Google Apps Script URL must be accessible to the public for form submissions to work
3. Make sure to maintain the same column order in your Google Sheet as specified in the Google Apps Script setup
4. For security reasons, consider setting up Google Forms as an alternative if you face ongoing issues with direct Google Sheets integration