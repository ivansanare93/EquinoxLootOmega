# Journal Instances Endpoint - Fix Summary

## Problem Description
The `/api/journal-instances` endpoint was returning a 404 error when accessed from the HTML demo (`api-demo.html`), even though:
- The endpoint was correctly defined in the code
- The same Blizzard API endpoint worked on Blizzard's official testing page
- The authentication (OAuth) was properly configured

## Root Cause
After analyzing the Blizzard API documentation and community resources, the issue was identified:

The Blizzard Game Data API requires specific HTTP headers to be present in requests:
1. **Battlenet-Namespace**: Specifies the data namespace (static/dynamic/profile)
2. **Accept**: Set to `application/json` for JSON responses
3. **Accept-Language**: Specifies the preferred language/locale

While the code was sending the `namespace` as a query parameter (which is valid), the Blizzard API also expects or prefers it as a header. Without these headers, the API returns a 404 Not Found error.

## Solution Implemented

### 1. Updated `src/services/blizzardApi.js`
Added the following headers to all Blizzard API requests:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Battlenet-Namespace': namespace,        // Added
  'Accept': 'application/json',            // Added
  'Accept-Language': this.locale.replace('_', '-')  // Added (es_ES → es-ES)
}
```

### 2. Updated Documentation
- Added section explaining the HTTP headers sent to Blizzard API
- Enhanced troubleshooting guide for 404 errors
- Added notes about CORS configuration

### 3. Created Test Suite
- Created `scripts/test-headers-e2e.js` to verify all headers are sent correctly
- Test validates both request structure and response handling
- All tests pass ✓

## How to Verify the Fix

### Option 1: Run the Test Suite
```bash
cd /home/runner/work/EquinoxLootOmega/EquinoxLootOmega
node scripts/test-headers-e2e.js
```

Expected output: All checks should pass with ✓

### Option 2: Test with Real Blizzard API (requires credentials)
1. Create a `.env` file with your Blizzard API credentials:
   ```bash
   cp .env.example .env
   # Edit .env and add your BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open the HTML demo:
   - Navigate to http://localhost:3000/api-demo.html
   - Click "Cargar Journal Instances" button
   - Should see a list of journal instances without any 404 errors

4. Test via API directly:
   ```bash
   curl http://localhost:3000/api/journal-instances
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "Journal instances fetched successfully",
     "region": "eu",
     "locale": "es_ES",
     "count": 50+,
     "instances": [...]
   }
   ```

### Option 3: Run the existing test script
```bash
npm run test:api
```

## Technical Details

### Headers Explained
- **Battlenet-Namespace**: `static-{region}` (e.g., `static-eu`)
  - Tells Blizzard which data namespace to use
  - Static = unchanging game data (items, raids, etc.)
  
- **Accept**: `application/json`
  - Indicates we want JSON responses
  - Required by most modern APIs
  
- **Accept-Language**: `{locale}` (e.g., `es-ES`, `en-US`)
  - Specifies the preferred language for responses
  - Format: language-REGION (lowercase-UPPERCASE)

### Why Both Header and Query Parameter?
The code now sends the namespace both as:
1. Query parameter: `?namespace=static-eu` (standard approach)
2. HTTP header: `Battlenet-Namespace: static-eu` (required by some endpoints)

This ensures compatibility with all Blizzard API endpoints.

## Impact
This fix applies to ALL Blizzard API requests made by the application, not just the journal-instances endpoint. All endpoints now benefit from proper header configuration:
- `/api/journal-instances`
- `/api/raids`
- `/api/raids/:id`
- `/api/encounters/:id/loot`
- `/api/items/:id`

## References
- [Blizzard Game Data API Documentation](https://develop.battle.net/documentation/world-of-warcraft/game-data-apis)
- [Blizzard OAuth Guide](https://develop.battle.net/documentation/guides/using-oauth)
- Community discussions on namespace requirements

## Security Notes
- ✓ No security vulnerabilities introduced (verified with CodeQL)
- ✓ No sensitive data exposed in headers
- ✓ Authentication still uses OAuth 2.0 properly
- ✓ CORS remains properly configured
