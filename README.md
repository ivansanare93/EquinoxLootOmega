# EquinoxLootOmega
Repositorio para la aplicación que organiza Loot de la RAID de Equinox

## Features

- **Character Management**: Add, edit, and delete raid characters with their class and specialization
- **Loot Assignment**: Assign items from raid bosses to characters based on compatibility
- **Real-time Synchronization**: Multiple users can view and update data simultaneously using Firebase Realtime Database
- **Filtering**: Filter assignments by class, boss, and difficulty
- **Excel Export**: Export assignment data to Excel spreadsheets

## Firebase Integration

This application uses Firebase Realtime Database for data storage and real-time synchronization across multiple users.

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

## File Structure

- `LarancioOrtegaLoot.html` - Main HTML file with Firebase SDK integration
- `app.js` - Application logic with Firebase Realtime Database integration
- `data.js` - Raid boss and loot item data
- `style.css` - Styling
- `FIREBASE_SETUP.md` - Detailed Firebase setup and configuration documentation

## Migration from localStorage

**Note**: This application previously used localStorage for data storage. The new version uses Firebase Realtime Database. Any data stored in localStorage will not be automatically migrated.

