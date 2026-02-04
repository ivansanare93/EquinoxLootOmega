# GitHub Pages Deployment Guide

This guide explains how to deploy the EquinoxLootOmega application to GitHub Pages while securely managing Firebase credentials.

## Overview

The application requires Firebase credentials to function. After the security fix that removed hardcoded credentials from the repository, deploying to GitHub Pages requires a special build process that generates the Firebase configuration file from environment variables.

## Deployment Architecture

### Local Development
- Firebase credentials stored in `client/firebase-config.js` (gitignored)
- Developers copy `client/firebase-config.js.example` and add their credentials
- The local file is never committed to version control

### GitHub Pages Deployment
- Firebase credentials stored as GitHub Secrets
- GitHub Actions workflow builds the application
- Build process generates `firebase-config.js` from environment variables
- Generated file is included in the deployment to GitHub Pages

## Setup Instructions

### Step 1: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets (click "New repository secret" for each):

   | Secret Name | Description | Example Value |
   |------------|-------------|---------------|
   | `FIREBASE_API_KEY` | Your Firebase API key | `AIzaSyAbc123...` |
   | `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
   | `FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
   | `FIREBASE_STORAGE_BUCKET` | Storage bucket | `your-project.firebasestorage.app` |
   | `FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `1234567890` |
   | `FIREBASE_APP_ID` | Firebase app ID | `1:1234567890:web:abc123...` |

**Where to find these values:**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Navigate to **Project Settings** → **General**
- Scroll down to "Your apps" section
- Copy the configuration values

### Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save the settings

### Step 3: Deploy

The deployment happens automatically when you push to the `main` branch. You can also trigger it manually:

1. Go to **Actions** tab
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

The workflow will:
1. Check out the repository
2. Install Node.js dependencies
3. Build static files
4. Generate `firebase-config.js` from GitHub Secrets
5. Deploy to GitHub Pages

### Step 4: Access Your Site

After successful deployment, your site will be available at:
```
https://<username>.github.io/EquinoxLootOmega/
```

Replace `<username>` with your GitHub username or organization name.

## Build Process

### Build Scripts

The `package.json` includes different build scripts for different scenarios:

```bash
# Local development (uses local firebase-config.js)
npm start

# GitHub Pages deployment (generates firebase-config.js from env vars)
npm run build
```

**Build script details:**

- `build:static` - Copies HTML, CSS, and JS files to `public/` directory
- `build:firebase-config` - Generates `firebase-config.js` from environment variables
- `build:local` - Copies local `firebase-config.js` to `public/` for local development
- `build` - Full deployment build (static + firebase-config from env vars)

### Manual Build (for testing)

To test the build process locally:

1. Set environment variables:
   ```bash
   export FIREBASE_API_KEY="your-api-key"
   export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   export FIREBASE_PROJECT_ID="your-project-id"
   export FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
   export FIREBASE_MESSAGING_SENDER_ID="1234567890"
   export FIREBASE_APP_ID="1:1234567890:web:abc123..."
   ```

2. Run the build:
   ```bash
   npm run build
   ```

3. Check the `public/` directory for generated files

## Security Considerations

### Why This Approach is Secure

1. **No Credentials in Repository**: Firebase credentials are never committed to the repository
2. **GitHub Secrets**: Credentials are stored as encrypted secrets in GitHub
3. **Build-time Generation**: The configuration file is generated during build, not stored
4. **Limited Access**: Only repository collaborators can access GitHub Secrets

### Firebase Web API Keys

Firebase web API keys are **included in client-side code** by design, but this doesn't mean they should be publicly shared or committed to repositories without proper security measures. Security is maintained through multiple layers:

- **Firebase Security Rules**: Control who can read/write data (primary security mechanism)
- **Firebase App Check**: Verify requests come from your legitimate app
- **Domain Restrictions**: Limit which domains can use your API key (configure in Firebase Console)
- **Rate Limiting**: Prevent abuse through quota management

**Important**: Even though these keys appear in client code, you should still:
- Avoid committing them to public repositories when possible
- Use environment variables and build-time injection (as this solution does)
- Implement proper Firebase Security Rules (this is your main line of defense)
- Monitor usage patterns for anomalies

### Additional Security Steps

After deployment:

1. **Configure Domain Restrictions** in Firebase Console:
   - Go to **APIs & Services** → **Credentials** in Google Cloud Console
   - Edit your API key
   - Add your GitHub Pages domain to "Website restrictions"

2. **Review Firebase Security Rules**:
   - Ensure Firestore/Realtime Database rules require authentication
   - Implement proper access controls

3. **Enable Firebase App Check** (recommended):
   - Protects against abuse and quota theft
   - See [Firebase App Check documentation](https://firebase.google.com/docs/app-check)

## Troubleshooting

### Deployment Failed

**Check GitHub Actions logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Review the error messages

**Common issues:**
- Missing GitHub Secrets (check all 6 secrets are configured)
- Incorrect secret values (verify against Firebase Console)
- Node.js version mismatch (workflow uses Node 18)

### Site Not Loading Firebase Data

1. **Check browser console** for errors
2. **Verify Firebase configuration** in deployed site:
   - Open browser DevTools → Network tab
   - Look for `firebase-config.js` request
   - Should return 200 status (not 404)
3. **Check Firebase Security Rules**:
   - Ensure rules allow read/write access as needed
4. **Verify domain restrictions** in Firebase Console

### 404 Error on firebase-config.js

This means the build process didn't generate the file:
1. Check that all GitHub Secrets are configured
2. Review the workflow logs for errors in the "Build static files" step
3. Ensure the `build:firebase-config` script is working

## Rollback

If you need to rollback a deployment:

1. Go to **Actions** tab
2. Find a previous successful workflow run
3. Click "Re-run all jobs"

Or:

1. Revert the commit that caused issues
2. Push to `main` branch
3. New deployment will trigger automatically

## Local Development vs Production

### Local Development
- Uses `client/firebase-config.js` (gitignored)
- Run with `npm start`
- Hot reload with `npm run dev`

### Production (GitHub Pages)
- Uses environment variables from GitHub Secrets
- Automatic deployment on push to `main`
- Static files served from GitHub Pages CDN

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/security)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [SECURITY.md](../SECURITY.md) for security-related questions
3. Check [docs/FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firebase configuration help
