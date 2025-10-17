# Testing Backend-Frontend Separation

## Manual Testing Steps

1. **Setup Environment**:
   - Set up Google Service Account with access to your Google Sheet
   - Add the required environment variables to your Vercel project:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`
     - `GOOGLE_SHEET_ID`
     - `SITEGROUND_ORIGIN` (if restricting CORS)

2. **Deploy Backend**:
   - Deploy the backend to Vercel
   - Note the deployment URL (e.g., https://your-project.vercel.app)

3. **Configure Frontend**:
   - Set the VITE_VERCEL_BACKEND_URL in your .env file to your Vercel deployment URL
   - Build the frontend: `npm run build`

4. **Deploy Frontend**:
   - Deploy the built frontend to SiteGround

5. **Test Form Submission**:
   - Navigate to the deployed frontend
   - Fill out and submit the contact form
   - Verify that the data appears in your Google Sheet
   - Check Vercel logs for any errors

## API Endpoints Testing

You can also test the API endpoints directly:

**Contact Form API**:
- Endpoint: `POST /api/contact`
- Expected payload:
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "connectionType": "learn-more",
  "consent": true,
  "phone": "",
  "location": "",
  "organization": "",
  "message": "Test message",
  "contactMethod": "either"
}
```

**Donation Form API**:
- Endpoint: `POST /api/donation`
- Expected payload: Same as contact form

## Expected Behavior

- Form submissions from the SiteGround frontend should be sent to the Vercel backend
- The Vercel backend should authenticate with Google Sheets using the service account
- Data should be successfully added to the specified Google Sheet
- CORS headers should allow communication between SiteGround and Vercel