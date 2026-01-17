# Firebase Realtime Database Setup

This document describes the Firebase integration for the Equinox Loot Manager application.

## Overview

The application has been migrated from localStorage to Firebase Realtime Database to enable:
- Real-time data synchronization across multiple users
- Persistent data storage in the cloud
- Automatic updates when any user makes changes

## Firebase Configuration

The application uses the following Firebase project:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAcscqKXw5rWd3YpqTHH7Lss2sUFKblBKk",
    authDomain: "basedatos-57052.firebaseapp.com",
    databaseURL: "https://basedatos-57052-default-rtdb.firebaseio.com",
    projectId: "basedatos-57052",
    storageBucket: "basedatos-57052.firebasestorage.app",
    messagingSenderId: "1041816516368",
    appId: "1:1041816516368:web:69073d4862859f75d95795"
};
```

## Firebase Database Structure

Data is stored under separate root-level nodes for better real-time synchronization:

```json
{
  "characters": [
    {
      "name": "PlayerName",
      "class": "ClassName",
      "specialization": "SpecName"
    }
  ],
  "assignments": [
    {
      "character": "PlayerName",
      "item": "ItemName",
      "boss": "bossId",
      "dificultad": "Normal|Heroic|Mythic",
      "ilvl": 684,
      "tipo": "Necesidad|Codicia",
      "note": "Optional note"
    }
  ]
}
```

## Required Setup

### 1. Firebase SDK

The application requires Firebase SDK version 9.22.0 or higher. The SDK is loaded via CDN in the HTML file:

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
    import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';
    ...
</script>
```

### 2. Firebase Project Configuration

Ensure the Firebase project has:
- **Realtime Database** enabled
- Database rules configured to allow read/write access (see Security Rules section below)

### 3. Network Access

The application requires internet access to:
- Load Firebase SDK from `www.gstatic.com`
- Connect to Firebase Realtime Database at `basedatos-57052-default-rtdb.firebaseio.com`

## Security Rules

For development/testing, you can use permissive rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ IMPORTANT FOR PRODUCTION:** The current configuration allows any client to read and write all data. For production use, implement proper authentication and authorization rules:

```json
{
  "rules": {
    "characters": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "assignments": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

Or for even more security, restrict writes to specific authenticated users:

```json
{
  "rules": {
    "characters": {
      ".read": "auth != null",
      ".write": "auth != null && (auth.uid === 'admin-uid-1' || auth.uid === 'admin-uid-2')"
    },
    "assignments": {
      ".read": "auth != null",
      ".write": "auth != null && (auth.uid === 'admin-uid-1' || auth.uid === 'admin-uid-2')"
    }
  }
}
```

Consider implementing Firebase Authentication to control who can access and modify the data.

## How It Works

### 1. Initialization

When the page loads:
1. Firebase SDK is initialized with the configuration
2. UI is populated with empty data initially
3. Real-time listeners are set up using `setupFirebaseListeners()`
4. The listeners immediately load initial data from Firebase and keep it synchronized

### 2. Data Saving

Whenever data changes (character added, assignment created, etc.):
1. The `saveData()` function is called
2. `characters` and `assignments` arrays are written to `/characters` and `/assignments` paths in Firebase respectively
3. Firebase triggers the real-time listeners on all connected clients

### 3. Real-time Synchronization

The `setupFirebaseListeners()` function:
1. Sets up separate listeners for `/characters` and `/assignments` paths in Firebase
2. Uses `onValue` to receive both initial data and all subsequent changes
3. When changes occur, updates the local `characters` and `assignments` arrays
4. Refreshes the UI to reflect the new data

## Functions Modified

The following functions were modified to use Firebase instead of localStorage:

- **`saveData()`**: Writes data to separate Firebase paths (`/assignments` and `/characters`)
- **`setupFirebaseListeners()`**: Sets up real-time data synchronization with separate listeners for assignments and characters
- **DOMContentLoaded event**: Initializes Firebase and loads data on page load using real-time listeners

## Migration from localStorage

The application previously stored data in the browser's localStorage:
- `localStorage.getItem('characters')` → Firebase read from `/characters` via `onValue` listener
- `localStorage.getItem('assignments')` → Firebase read from `/assignments` via `onValue` listener
- `localStorage.setItem('characters', ...)` → Firebase write to `/characters`
- `localStorage.setItem('assignments', ...)` → Firebase write to `/assignments`

**Note:** Any existing localStorage data will not be automatically migrated. Users will start with empty data or the data currently in Firebase.

## Troubleshooting

### Firebase not initialized error

If you see "Firebase is not initialized yet" in the console:
- Check that Firebase SDK scripts are loading correctly
- Ensure internet connectivity
- Verify the Firebase configuration is correct

### Data not syncing

If data changes aren't appearing on other clients:
- Check Firebase Database rules allow read/write access
- Verify network connectivity
- Check browser console for errors
- Ensure all clients are connected to the same Firebase database

### Permission denied errors

If you see permission errors:
- Update Firebase Database security rules to allow access
- Check that the Firebase project is correctly configured

## Testing

To test the Firebase integration:

1. Open the application in multiple browser windows/tabs
2. Add a character in one window
3. Verify the character appears in all other windows automatically
4. Make an assignment in one window
5. Verify it appears in all other windows
6. Close all windows and reopen - data should persist

## Development Notes

- The Firebase configuration includes the API key in the client-side code, which is normal for Firebase web apps
- For production, consider implementing Firebase Authentication to control access
- The current implementation uses a single data node; for large-scale use, consider normalizing the data structure
- Error handling is implemented with console logging; consider adding user-facing error messages for production
