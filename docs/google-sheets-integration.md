# Google Sheets Integration Setup

## Overview
The donation form on the Partners page collects user information (Full Name, Email, Phone Number, City of Residence) and submits it to a backend API endpoint that connects to a Google Sheet.

## Backend Implementation

Since this Vite/React application is a frontend-only application, you'll need to set up a separate backend service to handle the Google Sheets integration. Below are options for implementing this:

### Option 1: Express.js Backend

Create a separate Node.js/Express.js server with the following code:

```javascript
// server.js
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Google Sheets API setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Get from your Google Sheet URL

// Load service account key from environment
const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  SCOPES
);

const sheets = google.sheets({
  version: 'v4',
  auth: jwtClient,
});

// API endpoint to receive donation form data
app.post('/api/donate', async (req, res) => {
  try {
    const { fullName, email, phone, city } = req.body;

    // Prepare data to add to the sheet
    const data = [[fullName, email, phone, city, new Date().toISOString()]];

    // Append data to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:A', // Adjust the range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: data
      }
    });

    res.status(200).json({ message: 'Data successfully added to Google Sheet' });
  } catch (error) {
    console.error('Error adding data to Google Sheet:', error);
    res.status(500).json({ error: 'Failed to add data to Google Sheet' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Option 2: Using Google Apps Script (Recommended for shared hosting)

For deployment on shared hosting platforms like SiteGround that don't support Node.js serverless functions, you can use Google Apps Script:

1. Create a new Apps Script project at [Google Apps Script](https://script.google.com/)
2. Copy the following code into the script editor:

```javascript
function doPost(e) {
  try {
    // Parse the request body
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.fullName || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Full Name and Email are required'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get the active sheet - replace 'YOUR_SPREADSHEET_ID' with your actual spreadsheet ID
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    
    // Check if it's a contact form submission (has connectionType and consent fields)
    if (data.connectionType !== undefined && data.consent !== undefined) {
      // This is a contact form submission
      // Map connection type to readable format
      const connectionTypeMap = {
        'learn-more': "I'd like to learn more about Equip International",
        'partner-donate': "I want to partner or donate",
        'equip-seminars': "I'm interested in attending Equip Seminars",
        'general-inquiry': "I have a general inquiry"
      };
      
      const connectionTypeReadable = connectionTypeMap[data.connectionType] || data.connectionType;

      // Prepare row data to append to the Google Sheet for contact form
      const rowData = [
        data.fullName,
        data.email,
        data.phone || '',
        data.location || '',
        data.organization || '',
        connectionTypeReadable,
        data.message || '',
        data.contactMethod || 'either',
        data.consent ? 'Yes' : 'No',
        new Date() // Timestamp
      ];
      
      // Append the row to the Google Sheet
      sheet.appendRow(rowData);
      
      return ContentService
        .createTextOutput(JSON.stringify({message: 'Contact data successfully added to Google Sheet'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // This is a donation form submission (only has basic fields)
      // Prepare row data to append to the Google Sheet for donation form
      const rowData = [
        data.fullName,
        data.email,
        data.phone || '',
        data.location || '',  // Using location instead of city for consistency
        new Date() // Timestamp
      ];
      
      // Append the row to the Google Sheet
      sheet.appendRow(rowData);
      
      return ContentService
        .createTextOutput(JSON.stringify({message: 'Donation data successfully added to Google Sheet'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in function:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to add data to Google Sheet'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Replace 'YOUR_SPREADSHEET_ID' with your Google Spreadsheet ID
4. Deploy the script as a Web App (Deploy > New Deployment > Web App)
5. Update your frontend form code to use the deployment URL

### Option 3: Using Google Apps Script

You can also use Google Apps Script to create a web app that handles the form data:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    
    sheet.appendRow([
      data.fullName,
      data.email,
      data.phone,
      data.city,
      new Date()
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({message: 'Data successfully added to Google Sheet'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to add data to Google Sheet'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Google Sheets Setup

1. Create a Google Sheet with columns: Full Name, Email, Phone, City, Date Submitted
2. Get the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
3. Set up Google Service Account or API key for access
4. Share the Google Sheet with the service account email if using service account authentication

## Configuration

1. Install required dependencies:
```bash
npm install googleapis
```

2. Set environment variables with your Google credentials

## Frontend API Call

The frontend form makes a POST request with the form data. You'll need to adjust the URL in the form component to point to your Google Apps Script deployment URL.

For example, update the fetch call in `DonationForm.tsx` and `ContactForm.tsx`:

```javascript
const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(values),
});
```

## Security Considerations

- Never expose Google API credentials in client-side code
- Use server-side validation
- Implement rate limiting to prevent spam
- Consider using Google Forms as an alternative if security is a major concern