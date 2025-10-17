# Equip Global Backend

This repository contains the serverless backend functions for the Equip Global website.

## Overview

This backend handles form submissions from the frontend and securely saves data to Google Sheets using Google Service Account authentication.

## API Endpoints

- `POST /api/contact` - Handles contact form submissions
- `POST /api/donation` - Handles donation form submissions

## Environment Variables

The following environment variables must be set in your deployment environment:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Email address of your Google service account
- `GOOGLE_PRIVATE_KEY` - Private key of your Google service account (with escaped newlines)
- `GOOGLE_SHEET_ID` - The ID of your Google Sheet
- `SITEGROUND_ORIGIN` - Your SiteGround domain for CORS (optional, or use "*" for any origin)

## Deployment

This project is configured for deployment to Vercel.

1. Connect your repository to Vercel
2. Add the required environment variables in the Vercel dashboard
3. Vercel will automatically detect and deploy the serverless functions

## Security

All sensitive operations (Google API authentication) are handled securely in the backend.
