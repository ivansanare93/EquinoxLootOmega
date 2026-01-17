# EquinoxLootOmega
Repositorio para la aplicación que organiza Loot de la RAID de Equinox

## Features

- **Character Management**: Add, edit, and delete raid characters with their class and specialization
- **Loot Assignment**: Assign items from raid bosses to characters based on compatibility
- **Real-time Synchronization**: Multiple users can view and update data simultaneously using Firebase Firestore
- **Filtering**: Filter assignments by class, boss, and difficulty
- **Excel Export**: Export assignment data to Excel spreadsheets
- **Blizzard API Integration**: Direct integration with WoW Retail Game Data API for live raid and loot data

## Firebase Integration

This application uses Firebase Firestore for data storage and real-time synchronization across multiple users.

### Setup

1. **Internet Connection Required**: The application needs internet access to connect to Firebase services
2. **No Additional Setup**: The Firebase configuration is already included in the HTML file
3. **Automatic Synchronization**: Changes made by any user are automatically visible to all connected users

For detailed Firebase setup information, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

## Usage

1. Open `LarancioOrtegaLoot.html` in a web browser
2. Add characters using the "Gestión de Personajes" form
3. Assign loot items to characters using the "Asignación de Objetos" section
4. View and filter assignments in the "Visualización de Asignaciones" table
5. Export data to Excel if needed

## Blizzard API Integration

This application now includes a Node.js backend API that integrates with the official Blizzard WoW Retail Game Data API.

**🚀 Quick Start**: See [QUICK_START.md](QUICK_START.md) to get up and running in 5 minutes!

### Backend Features

- **OAuth Authentication**: Automatic token management using Battle.net Client Credentials Flow
- **API Endpoints**:
  - `/api/raids` - List all available raids (EU region, Spanish locale)
  - `/api/raids/:id` - Get raid details with encounters
  - `/api/encounters/:id/loot` - Get loot drops for a specific boss
  - `/api/items/:id` - Get item details including equippable classes
- **Caching**: Built-in caching to reduce API calls and improve performance
- **Error Handling**: Comprehensive error handling for API failures
- **Security**: Serves only public files to prevent sensitive data exposure

### Backend Setup

1. **Get Battle.net API Credentials**:
   - Visit https://develop.battle.net/
   - Create a new client to get your Client ID and Secret

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Blizzard API credentials
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **Access the Application**:
   - API Demo: http://localhost:3000/api-demo.html
   - Main App: http://localhost:3000/LarancioOrtegaLoot.html

For detailed setup instructions, see [BLIZZARD_API_SETUP.md](BLIZZARD_API_SETUP.md).

## File Structure

### Frontend
- `LarancioOrtegaLoot.html` - Main HTML file with Firebase SDK integration
- `app.js` - Application logic with Firebase Firestore integration
- `data.js` - Raid boss and loot item data
- `style.css` - Styling

### Backend (Blizzard API)
- `server.js` - Express server with API endpoints
- `services/blizzardAuth.js` - OAuth authentication service
- `services/blizzardApi.js` - Blizzard API client with caching
- `routes/api.js` - API route definitions
- `package.json` - Node.js dependencies and scripts
- `.env.example` - Environment configuration template

### Documentation
- `README.md` - This file
- `QUICK_START.md` - Quick start guide (5 minutes to get started!)
- `FIREBASE_SETUP.md` - Detailed Firebase setup and configuration
- `BLIZZARD_API_SETUP.md` - Blizzard API integration guide
- `api-demo.html` - Interactive API demo page
- `test-api.js` - API test script

## Migration from Realtime Database

**Note**: This application previously used Firebase Realtime Database for data storage. The new version uses Firebase Firestore. Data from Realtime Database should be manually migrated to Firestore if needed.

