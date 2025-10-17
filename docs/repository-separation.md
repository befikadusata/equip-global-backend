# Repository Separation Guide

This document explains how to separate the frontend and backend into different repositories for better organization and deployment.

## Overview

The original project combined both frontend and backend code in a single repository. This guide details how to separate them into:

- `equip-global-frontend` - The React frontend hosted on SiteGround
- `equip-global-backend` - The Vercel serverless functions

## Separation Process

### Automated Separation

1. Run the separation script:
   ```bash
   ./separate-repos.sh
   ```

2. This will:
   - Create a new directory `../equip-global-backend` with backend code
   - Update the current directory to contain only frontend code
   - Create appropriate README files for each repository

### Manual Separation (Alternative)

If you prefer to do it manually:

#### Backend Repository
Create a new repository containing:
- `api/` directory with serverless functions
- `vercel.json` (deployment configuration)
- `package.json` (with backend dependencies only)
- `README.md` (backend-specific documentation)

#### Frontend Repository
Keep in the original repository:
- `src/` directory with React components
- `public/` directory with static assets
- `package.json` (with frontend dependencies only)
- Vite configuration files
- Frontend-specific documentation

## Post-Separation Setup

### Backend Repository Setup

1. Go to the new backend directory:
   ```bash
   cd ../equip-global-backend
   ```

2. Initialize a new git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial backend setup"
   ```

3. Create a new repository on GitHub/GitLab/other platform
   ```bash
   git remote add origin https://github.com/your-username/equip-global-backend.git
   git branch -M main
   git push -u origin main
   ```

4. Deploy to Vercel:
   - Connect the repository to Vercel
   - Set up environment variables in Vercel dashboard

### Frontend Repository Setup

1. In the original directory (frontend), update the origin:
   ```bash
   git remote set-url origin https://github.com/your-username/equip-global-frontend.git
   ```

2. Update the environment variables in `.env` to point to your new backend URL:
   ```
   VITE_VERCEL_BACKEND_URL=https://your-backend-vercel-project.vercel.app
   ```

3. Push the changes:
   ```bash
   git add .
   git commit -m "Separate repositories: remove backend files"
   git push origin main
   ```

## Updating Form Components

After separation, ensure your form components in the frontend repository still work correctly:

1. In `src/components/ContactForm.tsx` and `src/components/DonationForm.tsx`, the API endpoints should already be configured to use the environment variable for the backend URL.

2. Verify the endpoints are still:
   - Contact: `{VITE_VERCEL_BACKEND_URL}/api/contact`
   - Donation: `{VITE_VERCEL_BACKEND_URL}/api/donation`

## Deployment Workflow

### Backend Deployment (Vercel)

1. Make changes to backend code
2. Push to the backend repository
3. Vercel automatically deploys the changes
4. Note the new deployment URL if it changes

### Frontend Deployment (SiteGround)

1. Update `.env` with the current backend URL if needed
2. Build the frontend: `npm run build`
3. Deploy the `dist/` folder to SiteGround
4. The frontend will communicate with the deployed backend

## Security Considerations

- Backend credentials (Google Service Account) are now completely isolated
- Frontend only contains the public URL to the backend
- CORS headers in the backend can be restricted to specific frontend domains

## Troubleshooting

### Forms Not Submitting After Separation
- Verify the `VITE_VERCEL_BACKEND_URL` environment variable is set correctly
- Check that the backend is deployed and accessible
- Verify CORS settings in the backend

### Build Errors
- Ensure each repository has the correct dependencies in its `package.json`
- Check that environment variables are correctly prefixed (VITE_ for frontend)

This separation provides a clean architecture with proper security and independent deployment cycles for each component.