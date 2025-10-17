# Google Apps Script Setup for Contact and Donation Forms

This document provides instructions for setting up a Google Apps Script to handle form submissions from your Equip Media International website and store them in a Google Sheet.

## Step 1: Create a Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click the "+ New Project" button
3. Delete the default `myFunction` code
4. Replace it with the code from the `google-apps-script-code.js` file in this repository

## Step 2: Update the Spreadsheet ID

1. Create or open the Google Sheet where you want to store form submissions
2. Copy the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
3. In the Apps Script code, replace `'YOUR_SPREADSHEET_ID'` with your actual spreadsheet ID

## Step 3: Set up the Google Sheet

Ensure your Google Sheet has the following column headers in Row 1 (in this order):
1. Full Name
2. Email
3. Phone
4. Location
5. Organization
6. Connection Type
7. Message
8. Contact Method
9. Consent
10. Date/Time

For donation form submissions, the same columns will be used, but most will be empty.

## Step 4: Deploy as a Web App

1. In the Google Apps Script editor, click on the "Deploy" button (rocket ship icon) in the toolbar
2. Select "New deployment"
3. Click "Select type" and choose "Web app"
4. Fill in the following details:
   - Deployment name: "Contact Form Handler"
   - Description: "Handles form submissions from Equip Media International website"
   - Execute as: "Me"
   - Who has access: "Anyone" (or "Anyone with Google" if you prefer more security)
5. Click "Deploy"
6. You'll see an authorization dialog. Review the permissions and click "Review Permissions", then select your Google account
7. In the "Authorization required" dialog, select "Advanced" then "Go to [Project Name] (unsafe)" at the bottom
8. Click "Allow" to give the script access to Google Sheets

## Step 5: Copy the Web App URL

1. After successful deployment, you'll see a "Web app URL" 
2. Copy this URL as you'll need it to update your frontend form code

## Step 6: Update Frontend Form Code

In both `ContactForm.tsx` and `DonationForm.tsx` files in the `src/components` directory, update the fetch URL:
```javascript
// Change this line in both forms:
const response = await fetch('YOUR_APPS_SCRIPT_WEB_APP_URL', {

// To this (replace WEB_APP_URL with the URL from Step 5):
const response = await fetch('WEB_APP_URL', {
```

## Security Considerations

- The web app is set to be accessible by anyone, which is required for form submissions
- Consider implementing additional validation or rate limiting if you experience spam
- Monitor your Google Apps Script quotas as they have daily limits
- Consider using Google Forms as an alternative if security becomes a major concern

## Troubleshooting

- If you get authentication errors, make sure you've properly authorized the script in Step 4
- If data isn't appearing in the sheet, check that the spreadsheet ID is correct and the sheet is shared with your Google account
- Check the Apps Script execution logs by going to View > Logs in the script editor