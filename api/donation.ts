import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Environment variables should contain:
// GOOGLE_SERVICE_ACCOUNT_EMAIL: Service account email
// GOOGLE_PRIVATE_KEY: Private key for service account (with escaped newlines)
// GOOGLE_SHEET_ID: The ID of your Google Sheet

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }
  
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
    // Validate required environment variables
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    console.log('Environment variables check:', {
      hasEmail: !!serviceAccountEmail,
      hasKey: !!privateKey,
      hasSheetId: !!sheetId,
      sheetId: sheetId // Log sheet ID to check if it's correct
    });

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      console.error('Missing required environment variables for Google Sheets API');
      return res.status(500).json({ 
        message: 'Server configuration error: Missing required environment variables' 
      });
    }

    // Set up Google Sheets authentication using service account
    let auth;
    try {
      auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: serviceAccountEmail,
          private_key: Buffer.from(privateKey, 'utf8').toString(),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } catch (authError) {
      console.error('Authentication setup failed:', authError instanceof Error ? authError.message : authError);
      return res.status(500).json({
        message: 'Authentication setup error',
        error: `Failed to setup authentication with Google: ${authError instanceof Error ? authError.message : String(authError)}`
      });
    }

    const sheets = google.sheets({ version: 'v4', auth });

    // Append the form data to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
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

    console.log('Successfully appended donation data to Google Sheet:', response.data);
    res.status(200).json({ 
      message: 'Donation form submitted successfully' 
    });
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    
    // Provide more specific error information
    let errorMessage = 'Error submitting donation form';
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      if (error.message.includes('access')) {
        errorMessage += ' (Possible authentication or permission issue)';
      } else if (error.message.includes('sheet')) {
        errorMessage += ' (Possible sheet ID or range issue)';
      }
    }
    
    res.status(500).json({ 
      message: 'Error submitting donation form', 
      error: errorMessage,
      debug: process.env.NODE_ENV !== 'production' ? (error instanceof Error ? error.message : String(error)) : undefined
    });
  }
}