# Quick Start: Testing the Filtered Loot Feature

This guide will help you quickly test the new filtered loot API endpoint.

## Prerequisites

1. **Blizzard API Credentials**: You need a Battle.net API Client ID and Secret
   - Get them from: https://develop.battle.net/access/clients
   - Click "Create Client"
   - Note down your Client ID and Client Secret

2. **Node.js**: Version 14 or higher

## Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Credentials

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
BLIZZARD_CLIENT_ID=your_actual_client_id_here
BLIZZARD_CLIENT_SECRET=your_actual_client_secret_here

PORT=3000
REGION=eu
LOCALE=es_ES
NAMESPACE=static-eu
CACHE_TTL=3600
```

### 3. Start the Server

```bash
npm start
```

You should see:
```
===========================================
  Equinox Loot Omega - Blizzard API Server
===========================================
Server running on port 3000
Region: EU
Locale: es_ES
API Documentation: http://localhost:3000/api
===========================================

Authenticating with Battle.net...
✓ Server ready to handle requests
```

## Testing the Filtered Loot Feature

### Option 1: Web Interface (Recommended)

1. Open your browser to: **http://localhost:3000/api-demo.html**

2. Scroll down to section **"4.1. Loot Filtrado por Clase y Especialización"**

3. Fill in the form:
   - **Encounter ID**: `2902` (Ulgrax the Devourer from Nerub-ar Palace)
   - **Clase**: Select your class, e.g., `Guerrero`
   - **Especialización**: (Optional) e.g., `Armas`

4. Click **"Cargar Loot Filtrado"**

5. You should see:
   - Boss name and raid instance
   - Your selected class and spec
   - Total items vs. filtered items
   - List of items you can equip with icons and details

### Option 2: Test Script

Run the automated test:

```bash
npm run test:filtered-loot
```

This will test the endpoint with multiple class combinations and show colored output.

### Option 3: cURL Command

```bash
# Test for Warrior
curl "http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Guerrero"

# Test for Mage with specialization
curl "http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Mago&specialization=Fuego"
```

### Option 4: JavaScript Fetch

Open browser console and run:

```javascript
fetch('http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Guerrero')
  .then(r => r.json())
  .then(data => {
    console.log(`Boss: ${data.encounter.name}`);
    console.log(`Filtered items: ${data.filtered_items}/${data.total_items}`);
    console.table(data.loot.map(item => ({
      Name: item.name,
      Type: item.item_subclass,
      Level: item.level
    })));
  });
```

## Example Test Cases

Try these different class combinations to see the filtering in action:

| Class | Command | Expected Result |
|-------|---------|----------------|
| Guerrero | `?playerClass=Guerrero` | Plate armor, melee weapons |
| Mago | `?playerClass=Mago` | Cloth armor, staves, wands |
| Cazador | `?playerClass=Cazador` | Mail armor, ranged weapons |
| Sacerdote | `?playerClass=Sacerdote` | Cloth armor, staves, wands |
| Druida | `?playerClass=Druida` | Leather armor, staves, maces |

## Common Encounter IDs for Testing

| Boss Name | Encounter ID | Raid |
|-----------|--------------|------|
| Ulgrax the Devourer | 2902 | Nerub-ar Palace |
| The Bloodbound Horror | 2917 | Nerub-ar Palace |
| Sikran | 2898 | Nerub-ar Palace |
| Rasha'nan | 2918 | Nerub-ar Palace |

To find more encounter IDs:
1. Go to: http://localhost:3000/api/raids
2. Pick a raid ID
3. Go to: http://localhost:3000/api/raids/{raid_id}
4. Note the encounter IDs from the response

## Expected Output

### Success Response

```json
{
  "success": true,
  "encounter": {
    "id": 2902,
    "name": "Ulgrax the Devourer",
    "description": "...",
    "instance": {
      "id": 1279,
      "name": "Nerub-ar Palace"
    }
  },
  "filter": {
    "playerClass": "Guerrero",
    "specialization": "All"
  },
  "loot": [
    {
      "id": 212405,
      "name": "Example Item",
      "quality": "EPIC",
      "level": 639,
      "item_class": "Armor",
      "item_subclass": "Plate",
      "inventory_type": "Legs",
      "icon_url": "https://...",
      "equippable_classes": ["Guerrero", "Paladín", "Caballero de la Muerte"],
      "stats": [...],
      "is_equippable": true
    }
  ],
  "total_items": 15,
  "filtered_items": 8
}
```

## Troubleshooting

### Server won't start
- **Error**: "Missing required environment variables"
- **Solution**: Make sure you created `.env` and added your Blizzard API credentials

### Authentication fails
- **Error**: "Failed to authenticate with Battle.net"
- **Solution**: Check that your Client ID and Secret are correct in `.env`

### No items in response
- **Error**: `"filtered_items": 0`
- **Solution**: This is normal - the boss might not drop items for that class. Try a different class or boss.

### Can't find encounter ID
- **Solution**: Use the API to discover IDs:
  1. GET /api/raids - List all raids
  2. GET /api/raids/{id} - Get encounters for a raid

## Next Steps

Once you've verified the feature works:

1. **Integrate into your app**: Use the API endpoint in your main application
2. **Customize filtering**: Extend the logic in `src/routes/api.js` for stat-based filtering
3. **Cache tuning**: Adjust `CACHE_TTL` in `.env` based on your needs
4. **Monitor performance**: Use `/api/cache/stats` to see cache effectiveness

## Documentation

- **API Reference**: `docs/FILTERED_LOOT_API.md`
- **Usage Examples**: `docs/FILTERED_LOOT_USAGE_EXAMPLE.md`
- **Implementation Details**: `docs/IMPLEMENTATION_SUMMARY.md`

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify API credentials are valid
3. Test with the standard endpoints first (e.g., `/api/raids`)
4. Review the documentation files

Happy looting! 🎮
