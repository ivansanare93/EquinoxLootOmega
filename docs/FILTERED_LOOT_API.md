# Filtered Loot API - Documentation

## Overview

The Filtered Loot API allows you to retrieve raid boss loot filtered by player class and specialization. This endpoint extends the existing loot system to show only items that a specific class can equip.

## Endpoint

```
GET /api/encounters/:id/loot/filtered
```

## Parameters

### Path Parameters

- `id` (required): The encounter (boss) ID
  - Type: `number`
  - Example: `2902` (Ulgrax the Devourer)

### Query Parameters

- `playerClass` (required): The player's class name in Spanish
  - Type: `string`
  - Valid values:
    - `Guerrero` (Warrior)
    - `Paladín` (Paladin)
    - `Cazador` (Hunter)
    - `Pícaro` (Rogue)
    - `Sacerdote` (Priest)
    - `Caballero de la Muerte` (Death Knight)
    - `Chamán` (Shaman)
    - `Mago` (Mage)
    - `Brujo` (Warlock)
    - `Monje` (Monk)
    - `Druida` (Druid)
    - `Cazador de Demonios` (Demon Hunter)
    - `Evocador` (Evoker)
  
- `specialization` (optional): The player's specialization
  - Type: `string`
  - Example: `Armas`, `Furia`, `Protección`, `Fuego`, `Arcano`, `Escarcha`, etc.
  - Note: Currently used for display purposes only; filtering logic can be extended

## Response Format

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
    "specialization": "Armas"
  },
  "loot": [
    {
      "id": 212405,
      "name": "Faulds of the Devourer",
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

### Error Response

```json
{
  "success": false,
  "error": "playerClass parameter is required",
  "endpoint": "/api/encounters/2902/loot/filtered"
}
```

## Example Usage

### JavaScript (Fetch API)

```javascript
const encounterId = 2902; // Ulgrax the Devourer
const playerClass = 'Guerrero';
const specialization = 'Armas';

const url = `http://localhost:3000/api/encounters/${encounterId}/loot/filtered?playerClass=${encodeURIComponent(playerClass)}&specialization=${encodeURIComponent(specialization)}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`Encounter: ${data.encounter.name}`);
      console.log(`Available items for ${data.filter.playerClass}: ${data.filtered_items}/${data.total_items}`);
      
      data.loot.forEach(item => {
        console.log(`- ${item.name} (${item.item_subclass})`);
      });
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => console.error('Request failed:', error));
```

### cURL

```bash
# Get loot for a Warrior
curl "http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Guerrero"

# Get loot for a Mage with Fire specialization
curl "http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Mago&specialization=Fuego"
```

### Node.js (Axios)

```javascript
const axios = require('axios');

async function getFilteredLoot(encounterId, playerClass, specialization = null) {
  try {
    let url = `http://localhost:3000/api/encounters/${encounterId}/loot/filtered?playerClass=${encodeURIComponent(playerClass)}`;
    
    if (specialization) {
      url += `&specialization=${encodeURIComponent(specialization)}`;
    }
    
    const response = await axios.get(url);
    
    if (response.data.success) {
      console.log(`Encounter: ${response.data.encounter.name}`);
      console.log(`Filtered Items: ${response.data.filtered_items}/${response.data.total_items}`);
      
      response.data.loot.forEach(item => {
        console.log(`- ${item.name} (Level ${item.level})`);
      });
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.error || error.message);
  }
}

// Usage
getFilteredLoot(2902, 'Guerrero', 'Armas');
```

## Testing

### Using the Web Demo

1. Start the server:
   ```bash
   npm start
   ```

2. Open the API demo page:
   ```
   http://localhost:3000/api-demo.html
   ```

3. Navigate to section "4.1. Loot Filtrado por Clase y Especialización"

4. Enter:
   - Encounter ID (e.g., 2902)
   - Select your class
   - Optionally enter your specialization

5. Click "Cargar Loot Filtrado"

### Using the Test Script

Run the automated test script:

```bash
npm run test:filtered-loot
```

This will test the endpoint with multiple class combinations.

## How It Works

1. **Encounter Data Retrieval**: The endpoint fetches encounter data from the Blizzard API, including all loot items.

2. **Item Details Fetching**: For each item, it retrieves detailed information including:
   - Item metadata (name, level, quality)
   - Item media (icon)
   - Item statistics and attributes

3. **Class Compatibility Check**: The system determines which classes can equip each item based on:
   - Armor type (Cloth, Leather, Mail, Plate)
   - Weapon type (Swords, Axes, Maces, etc.)
   - Item restrictions

4. **Filtering**: Items are filtered to include only those that the specified class can equip.

5. **Response**: Returns filtered results with metadata about total items vs. available items.

## Class-to-Armor Mapping

| Armor Type | Classes |
|-----------|---------|
| Cloth     | Mago, Sacerdote, Brujo |
| Leather   | Pícaro, Monje, Druida, Cazador de Demonios |
| Mail      | Cazador, Chamán, Evocador |
| Plate     | Guerrero, Paladín, Caballero de la Muerte |

## Notes

- The endpoint uses caching to improve performance and reduce API calls to Blizzard
- Item details are fetched in parallel for better performance
- If an item cannot be fetched, it's skipped (won't cause the entire request to fail)
- The specialization parameter is currently for display purposes but can be extended to filter by stats/attributes
- All responses include both the total number of items and the number of filtered items for transparency

## Future Enhancements

Possible improvements for this endpoint:

1. **Stat-based Filtering**: Filter items based on primary stats (Strength, Agility, Intellect) that match the specialization
2. **Item Level Range**: Add optional min/max item level parameters
3. **Difficulty Filter**: Filter by raid difficulty (Normal, Heroic, Mythic)
4. **Equipped Slot Filter**: Filter by specific equipment slots
5. **Already Owned Filter**: Integration with character data to exclude already owned items

## Error Handling

Common errors and their meanings:

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid encounter ID` | Encounter ID is not a number | Provide a valid numeric encounter ID |
| `playerClass parameter is required` | Missing class parameter | Include `playerClass` in query string |
| `Failed to fetch encounter loot` | Blizzard API error | Check server logs; verify API credentials |
| `Endpoint not found` | Invalid URL | Check endpoint URL and spelling |

## Performance Considerations

- First request for an encounter will be slower as it fetches all item details
- Subsequent requests use cached data and are much faster
- Cache TTL is configurable via `.env` file (default: 1 hour)
- Parallel item fetching reduces latency
- Failed item requests don't block the entire response
