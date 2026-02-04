# Security Notice

## Issue: Exposed Firebase Credentials (February 2026)

### Problem
Firebase API credentials for the project database (project ID: basedatos-57052) were previously hardcoded in the following files:
- `client/LarancioOrtegaLoot.html`
- `client/roster-signup.html`
- `docs/FIREBASE_SETUP.md`

This exposed sensitive credentials in version control, which could allow unauthorized access to the Firebase project.

### Resolution
The following changes have been implemented to secure the credentials:

1. **Externalized Configuration**: Firebase credentials are now stored in `client/firebase-config.js`, which is excluded from version control.

2. **Template File**: A template file `client/firebase-config.js.example` is provided with placeholder values.

3. **Updated .gitignore**: Added `client/firebase-config.js` to `.gitignore` to prevent accidental commits.

4. **Updated Documentation**: `docs/FIREBASE_SETUP.md` now uses placeholder values and provides instructions for secure configuration.

5. **Updated HTML Files**: Both HTML files now import Firebase configuration from the external file instead of hardcoding credentials.

### Required Actions

#### Immediate Actions (Project Owner)
1. **Rotate the exposed Firebase API key** in the Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to Project Settings → General
   - Under "Your apps", find your web app
   - Delete the exposed API key and generate a new one
   
2. **Review Firebase Security Rules** to ensure proper access controls are in place:
   - Navigate to Firestore Database → Rules
   - Ensure rules require authentication for write access
   - Consider implementing user authentication if not already in place

3. **Audit Firebase Project Access Logs**:
   - Check for any unauthorized access using the exposed credentials
   - Review all data modifications during the exposure period

#### Setup for Developers
After cloning the repository:
1. Copy `client/firebase-config.js.example` to `client/firebase-config.js`
2. Add your Firebase credentials to the new file
3. Never commit `client/firebase-config.js` to version control

### Best Practices Going Forward

1. **Never commit credentials** to version control
2. **Use environment variables** or configuration files that are gitignored
3. **Rotate credentials** immediately if exposed
4. **Use Firebase Security Rules** to limit access even with exposed API keys
5. **Implement authentication** for production applications
6. **Regular security audits** of the codebase

### Additional Security Considerations

While Firebase web API keys are designed to be included in client-side code, they should still be protected by:
- Firebase Security Rules that restrict database access
- Firebase App Check to prevent unauthorized app usage
- Rate limiting and quota management
- Regular monitoring of usage patterns

For more information on Firebase security best practices, see:
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/security)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
