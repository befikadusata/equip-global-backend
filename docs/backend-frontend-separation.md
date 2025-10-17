# Backend and Frontend Separation Guide

## Overview
This document explains how the Equip Media International website has separated its backend and frontend components:

- **Frontend**: React application hosted on SiteGround
- **Backend**: Serverless functions hosted on Vercel

## Current Implementation
1. The React frontend was originally using Google Apps Script to submit form data to Google Sheets
2. This has been updated to use a Vercel serverless function as an intermediary
3. The Vercel function securely connects to Google Sheets using service account authentication

## Vercel API Routes
- `/api/contact.ts` - Handles contact form submissions
- `/api/donation.ts` - Handles donation form submissions

## Environment Variables Required on Vercel

For the serverless functions to work, you need to set these environment variables in your Vercel project:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Email of your Google service account
- `GOOGLE_PRIVATE_KEY` - Private key of your Google service account (with escaped newlines)
- `GOOGLE_SHEET_ID` - The ID of your Google Sheet

## Frontend Configuration
The frontend form components have been updated to submit to:
- Contact form: `/api/contact`
- Donation form: `/api/donation`

Instead of directly calling the Google Apps Script URLs.

## Deployment Steps

1. Deploy the frontend React application to SiteGround:
   - Build the application: `npm run build`
   - Upload the contents of the `dist` folder to your SiteGround hosting

2. Deploy the backend serverless functions to Vercel:
   - Link your repository to Vercel
   - Add the required environment variables to your Vercel project settings
   - Vercel will automatically deploy the API routes in the `api` directory

## Frontend API Calls
The frontend makes POST requests to the backend API as if it was a same-origin request. In production, you may need to set up proxy rules or CORS configuration if the frontend is hosted on a different domain than the backend.

## Testing
To test the integration:
1. Submit a test form on the frontend
2. Check that the data appears in your Google Sheet
3. Monitor the Vercel deployment logs for any errors