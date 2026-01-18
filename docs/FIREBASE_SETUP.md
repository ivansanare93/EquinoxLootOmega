# Firebase Firestore Setup

This document describes the Firebase Firestore integration for the Equinox Loot Manager application.

## Overview

The application has been migrated from Firebase Realtime Database to Firebase Firestore to enable:
- Real-time data synchronization across multiple users
- Persistent data storage in the cloud
- Automatic updates when any user makes changes
- Better scalability and querying capabilities

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

## Firebase Firestore Database Structure

Data is stored in a collection called `appData` with two documents:

1. **Document**: `appData/assignments`
   ```json
   {
     "data": [
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

2. **Document**: `appData/characters`
   ```json
   {
     "data": [
       {
         "name": "PlayerName",
         "class": "ClassName",
         "specialization": "SpecName"
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
    import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
    ...
</script>
```

### 2. Firebase Project Configuration

Ensure the Firebase project has:
- **Firestore Database** enabled (not Realtime Database)
- Firestore database created in your Firebase console
- Security rules configured to allow read/write access (see Security Rules section below)

### 3. Firestore Database Setup

To set up Firestore for this application:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (basedatos-57052)
3. Click on "Firestore Database" in the left menu
4. If Firestore is not enabled, click "Create database"
5. Choose a location for your database (use the default or select one close to your users)
6. Start in **test mode** for development (you can update security rules later)
7. The application will automatically create the `appData` collection and `assignments`/`characters` documents when you first save data

### 3. Network Access

The application requires internet access to:
- Load Firebase SDK from `www.gstatic.com`
- Connect to Firestore at the Firebase project URL

## Security Rules

For development/testing, you can use permissive rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appData/{document=**} {
      allow read, write: true;
    }
  }
}
```

**⚠️ IMPORTANT FOR PRODUCTION:** The current configuration allows any client to read and write all data. For production use, implement proper authentication and authorization rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appData/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Or for even more security, restrict writes to specific authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appData/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (request.auth.uid == 'admin-uid-1' || 
                       request.auth.uid == 'admin-uid-2');
    }
  }
}
```

Consider implementing Firebase Authentication to control who can access and modify the data.

## How It Works

### 1. Initialization

When the page loads:
1. Firebase SDK is initialized with the configuration
2. Firestore is initialized using `getFirestore()`
3. Initial data is loaded from Firestore using `loadDataFromFirebase()`
4. UI is populated with the loaded data
5. Real-time listeners are set up using `setupFirebaseListener()`

### 2. Data Saving

Whenever data changes (character added, assignment created, etc.):
1. The `saveData()` function is called
2. Data is written to Firestore documents using `setDoc()`:
   - `appData/assignments` document stores the assignments array
   - `appData/characters` document stores the characters array
3. Firestore triggers the real-time listeners on all connected clients

### 3. Real-time Synchronization

The `setupFirebaseListener()` function:
1. Uses `onSnapshot()` to listen for changes to both documents
2. When changes occur, updates the local `characters` and `assignments` arrays
3. Refreshes the UI to reflect the new data
4. Each document (assignments and characters) has its own listener for optimal performance

## Functions Modified

The following functions were modified to use Firestore instead of Realtime Database:

- **`isFirebaseReady()`**: Checks for Firestore availability instead of Realtime Database
- **`saveData()`**: Writes data to Firestore using `setDoc()` for both documents
- **`loadDataFromFirebase()`**: Loads initial data from Firestore using `getDoc()`
- **`setupFirebaseListener()`**: Sets up real-time data synchronization using `onSnapshot()`
- **DOMContentLoaded event**: Initializes Firestore and loads data on page load

## Migration from Realtime Database

The application previously stored data in Firebase Realtime Database:
- Realtime Database path: `/lootData` → Firestore collection: `appData`
- Realtime Database structure was a single object with `characters` and `assignments` properties
- Firestore structure uses separate documents for better scalability and query performance

**Data Migration Steps:**
1. If you have existing data in Realtime Database, you'll need to manually migrate it to Firestore
2. Export data from Realtime Database (can be done via Firebase Console)
3. Create the `appData` collection in Firestore
4. Create two documents: `assignments` and `characters`
5. Each document should have a `data` field containing the respective array

**Note:** The application will create empty documents automatically if they don't exist.

## Troubleshooting

### Firestore not initialized error

If you see "Firestore is not initialized yet" in the console:
- Check that Firebase SDK scripts are loading correctly
- Ensure internet connectivity
- Verify the Firebase configuration is correct
- Make sure Firestore is enabled in your Firebase project (not just Realtime Database)

### Data not syncing

If data changes aren't appearing on other clients:
- Check Firestore security rules allow read/write access
- Verify network connectivity
- Check browser console for errors
- Ensure all clients are connected to the same Firestore database
- Make sure Firestore (not Realtime Database) is being used

### Permission denied errors

If you see permission errors:
- Update Firestore security rules to allow access (see Security Rules section)
- Check that the Firebase project is correctly configured
- Ensure Firestore database is created and active in Firebase Console

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
- The current implementation stores data in two separate documents for better organization and query performance
- Firestore provides better scalability than Realtime Database for this use case
- Error handling is implemented with console logging and user-facing alerts
- Each data type (assignments and characters) has its own real-time listener for optimal performance
