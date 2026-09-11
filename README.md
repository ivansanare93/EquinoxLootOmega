# EquinoxLootOmega
Repositorio para la aplicación que organiza Loot de la RAID de Equinox

## Features

### Loot Manager
- **Character Management**: Add, edit, and delete raid characters with their class and specialization
- **Loot Assignment**: Assign items from raid bosses to characters based on compatibility
- **Real-time Synchronization**: Multiple users can view and update data simultaneously using Firebase Firestore
- **Filtering**: Filter assignments by class, boss, and difficulty
- **Excel Export**: Export assignment data to Excel spreadsheets
- **Blizzard API Integration**: Direct integration with WoW Retail Game Data API for live raid and loot data

### Roster Signup Tool
- **Class & Role Registration**: Guild members can sign up their class, specialization, and preferred roles
- **Multi-Role Support**: Players can indicate if they can Tank, Heal, or DPS
- **Persistent Current Roster**: The current roster, raid metadata, and attendance states are saved automatically in `localStorage`
- **Season Management**: Officers can create seasons, activate one season at a time, and archive old seasons without losing history
- **Raid History & Attendance**: Closing a roster stores a seasonal snapshot and updates per-player attendance stats
- **Filtering & Export**: Filter by class or role, export the generated roster to Excel, and export/import seasonal backups in JSON
- **Real-time Sync + Local Safety Net**: Signups still sync through Firebase, while seasonal tracking remains local to the browser

## Firebase Integration

This application uses Firebase Firestore for data storage and real-time synchronization across multiple users.

### Setup

1. **Configure Firebase Credentials** (First time setup):
   ```bash
   cd client
   cp firebase-config.js.example firebase-config.js
   ```
   Then edit `client/firebase-config.js` with your Firebase project credentials.
   
   See [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) for detailed instructions.

2. **Internet Connection Required**: The application needs internet access to connect to Firebase services

3. **Automatic Synchronization**: Changes made by any user are automatically visible to all connected users

**Important**: Never commit `client/firebase-config.js` to version control (it's already in `.gitignore`)

For detailed Firebase setup information, see [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).

## Deployment

### GitHub Pages Deployment

This application can be deployed to GitHub Pages with automatic builds via GitHub Actions. The deployment process securely injects Firebase credentials from GitHub Secrets during the build, ensuring credentials are never committed to the repository.

**Quick Setup:**
1. Configure Firebase credentials as GitHub Secrets (7 required secrets)
2. Enable GitHub Pages with "GitHub Actions" as the source
3. Push to `main` branch or manually trigger deployment

For detailed deployment instructions, see [docs/GITHUB_PAGES_DEPLOYMENT.md](docs/GITHUB_PAGES_DEPLOYMENT.md).

## Usage

### Main Tools Dashboard
1. Start the server with `npm start`
2. Open http://localhost:3000/ or http://localhost:3000/index.html in a web browser
3. Select the tool you need:
   - **Loot Manager**: For current raid loot management
   - **Roster Signup**: For expansion roster planning
   - **API Demo**: To explore Blizzard API integration

### Loot Manager
1. Add characters using the "Gestión de Personajes" form
2. Assign loot items to characters using the "Asignación de Objetos" section
3. View and filter assignments in the "Visualización de Asignaciones" table
4. Export data to Excel if needed

### Roster Signup Tool
1. Fill out the registration form with character name, class, and specialization
2. Select which roles you can play (Tank, Healer, DPS)
3. Add any additional notes (optional)
4. Create a season from the **Temporadas y Asistencia** panel and leave only one active at a time
5. Generate or review the current roster, adjust each member status (`confirmado`, `pendiente`, `ausente`), and set raid name/date
6. Use **Cerrar y guardar roster** to archive the raid inside the active season and start a clean roster for the next run
7. Review the active season history and attendance summary, or export/import a JSON backup when needed

#### Roster seasons and browser storage
- Seasonal data is stored in `localStorage` under the keys `equinox_seasons` and `equinox_current_roster`.
- The page restores the current roster automatically on reload, browser restart, or when revisiting the page on the same device/browser.
- If an old local format or corrupt JSON is detected, the app attempts a migration and keeps a backup copy in a `equinox_backup_*` key before resetting.
- `localStorage` is limited to the current browser profile/device. It is not shared automatically between browsers, devices, or users.
- Use the built-in **Exportar datos** button to save a full JSON backup and **Importar datos** to restore it with basic schema validation.

## Blizzard API Integration

This application now includes a Node.js backend API that integrates with the official Blizzard WoW Retail Game Data API.

**🚀 Quick Start**: See [docs/QUICK_START.md](docs/QUICK_START.md) to get up and running in 5 minutes!

### Backend Features

- **OAuth Authentication**: Automatic token management using Battle.net Client Credentials Flow
- **API Endpoints**:
  - `/api/raids` - List all available raids (EU region, Spanish locale)
  - `/api/raids/:id` - Get raid details with encounters
  - `/api/encounters/:id/loot` - Get loot drops for a specific boss
  - `/api/encounters/:id/loot/filtered` - Get filtered loot by player class and specialization
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
   - Main Dashboard: http://localhost:3000/ or http://localhost:3000/index.html
   - Roster Signup: http://localhost:3000/roster-signup.html
   - Loot Manager: http://localhost:3000/LarancioOrtegaLoot.html
   - API Demo: http://localhost:3000/api-demo.html

For detailed setup instructions, see [docs/BLIZZARD_API_SETUP.md](docs/BLIZZARD_API_SETUP.md).

## File Structure

### Frontend (`client/`)
- `index.html` - Main dashboard with navigation to all tools
- `roster-signup.html` - Roster signup tool for expansion planning
- `LarancioOrtegaLoot.html` - Loot manager with Firebase SDK integration
- `api-demo.html` - Interactive API demo page
- `app.js` - Application logic with Firebase Firestore integration
- `data.js` - Raid boss and loot item data
- `style.css` - Styling

### Backend (`src/`)
- `server.js` - Express server with API endpoints
- `services/blizzardAuth.js` - OAuth authentication service
- `services/blizzardApi.js` - Blizzard API client with caching
- `routes/api.js` - API route definitions

### Configuration
- `package.json` - Node.js dependencies and scripts
- `.env.example` - Environment configuration template
- `.gitignore` - Git ignore rules

### Documentation (`docs/`)
- `README.md` - This file (project root)
- `QUICK_START.md` - Quick start guide (5 minutes to get started!)
- `FIREBASE_SETUP.md` - Detailed Firebase setup and configuration
- `GITHUB_PAGES_DEPLOYMENT.md` - GitHub Pages deployment guide with secure credentials
- `BLIZZARD_API_SETUP.md` - Blizzard API integration guide
- `FILTERED_LOOT_API.md` - Filtered loot API documentation
- `TESTING.md` - Testing documentation
- `MIGRATION_SUMMARY.md` - Migration notes
- `SECURITY_FIX_SUMMARY.md` - Security vulnerability remediation summary

### Scripts (`scripts/`)
- `test-api.js` - API test script

## Migration from Realtime Database

**Note**: This application previously used Firebase Realtime Database for data storage. The new version uses Firebase Firestore. Data from Realtime Database should be manually migrated to Firestore if needed.

