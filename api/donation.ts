import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Environment variables should contain:
// GOOGLE_SERVICE_ACCOUNT_EMAIL: Service account email
// GOOGLE_PRIVATE_KEY: Private key for service account (with escaped newlines)
// GOOGLE_SHEET_ID: The ID of your Google Sheet

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    fullName, 
    email, 
    phone, 
    location, 
    organization, 
    connectionType, 
    message, 
    contactMethod, 
    consent 
  } = req.body;

  // Validate required fields
  if (!fullName || !email || !connectionType || !consent) {
    return res.status(400).json({ 
      message: 'Missing required fields: fullName, email, connectionType, or consent' 
    });
  }

  try {
    // Set up Google Sheets authentication using service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append the form data to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Donations!A1', // Adjust the sheet name and range as needed for donations
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(), // Timestamp
          fullName,
          email,
          phone || '',
          location || '',
          organization || '',
          connectionType,
          message || '',
          contactMethod || 'either',
          consent ? 'Yes' : 'No'
        ]],
      },
    });

    res.status(200).json({ 
      message: 'Donation form submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting donation form to Google Sheets:', error);
    res.status(500).json({ 
      message: 'Error submitting donation form', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}