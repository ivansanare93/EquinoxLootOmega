# Filtered Loot API - Usage Example

## Scenario: Getting Loot for a Warrior Character

This document demonstrates how to use the new filtered loot API to get raid boss loot specific to your character's class and specialization.

## Step-by-Step Guide

### 1. Identify the Boss

First, you need to know the encounter ID of the boss you're interested in. You can get this from the raids endpoint.

**Request:**
```
GET http://localhost:3000/api/raids/1279
```

**Response (excerpt):**
```json
{
  "success": true,
  "raid": {
    "id": 1279,
    "name": "Nerub-ar Palace",
    "encounters": [
      {
        "id": 2902,
        "name": "Ulgrax the Devourer"
      },
      {
        "id": 2917,
        "name": "The Bloodbound Horror"
      }
    ]
  }
}
```

### 2. Get All Boss Loot (Unfiltered)

To see what the boss drops in total:

**Request:**
```
GET http://localhost:3000/api/encounters/2902/loot
```

**Response Example:**
```json
{
  "success": true,
  "encounter": {
    "id": 2902,
    "name": "Ulgrax the Devourer"
  },
  "loot": [
    {
      "id": 212405,
      "name": "Faulds of the Devourer",
      "quality": "EPIC"
    },
    {
      "id": 212408,
      "name": "Boots of the Savage Raid",
      "quality": "EPIC"
    },
    {
      "id": 212410,
      "name": "Vestments of the Consecrated",
      "quality": "EPIC"
    }
    // ... 12 more items
  ]
}
```

**Result:** 15 total items drop from this boss.

### 3. Get Filtered Loot for Your Class (NEW!)

Now, let's say you're playing a **Warrior** (Guerrero). You only want to see items you can actually use:

**Request:**
```
GET http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Guerrero
```

**Response Example:**
```json
{
  "success": true,
  "encounter": {
    "id": 2902,
    "name": "Ulgrax the Devourer",
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
      "name": "Faulds of the Devourer",
      "quality": "EPIC",
      "level": 639,
      "item_class": "Armor",
      "item_subclass": "Plate",
      "inventory_type": "Legs",
      "icon_url": "https://render.worldofwarcraft.com/eu/icons/56/...",
      "equippable_classes": [
        "Guerrero",
        "Paladín",
        "Caballero de la Muerte"
      ],
      "stats": [
        {
          "type": { "name": "Strength" },
          "value": 234
        },
        {
          "type": { "name": "Stamina" },
          "value": 389
        }
      ],
      "is_equippable": true
    },
    {
      "id": 212408,
      "name": "Boots of the Savage Raid",
      "quality": "EPIC",
      "level": 639,
      "item_class": "Armor",
      "item_subclass": "Plate",
      "inventory_type": "Feet",
      "equippable_classes": [
        "Guerrero",
        "Paladín",
        "Caballero de la Muerte"
      ],
      "is_equippable": true
    }
    // ... 6 more items you can use
  ],
  "total_items": 15,
  "filtered_items": 8
}
```

**Result:** 
- Total items from boss: **15**
- Items your Warrior can use: **8**
- **53% of the loot table is relevant to you!**

### 4. Adding Specialization Context

You can also specify your specialization for better context:

**Request:**
```
GET http://localhost:3000/api/encounters/2902/loot/filtered?playerClass=Guerrero&specialization=Armas
```

**Response (header):**
```json
{
  "filter": {
    "playerClass": "Guerrero",
    "specialization": "Armas"
  }
}
```

## Comparison: Different Classes

Let's compare what different classes can get from the same boss:

### Warrior (Guerrero)
```
GET /api/encounters/2902/loot/filtered?playerClass=Guerrero
Result: 8 out of 15 items (53%)
Armor: Plate armor pieces
Weapons: Two-handed swords, axes, maces, polearms
```

### Mage (Mago)
```
GET /api/encounters/2902/loot/filtered?playerClass=Mago
Result: 5 out of 15 items (33%)
Armor: Cloth armor pieces
Weapons: Staves, wands, daggers
```

### Hunter (Cazador)
```
GET /api/encounters/2902/loot/filtered?playerClass=Cazador
Result: 6 out of 15 items (40%)
Armor: Mail armor pieces
Weapons: Bows, guns, crossbows, polearms
```

### Priest (Sacerdote)
```
GET /api/encounters/2902/loot/filtered?playerClass=Sacerdote
Result: 5 out of 15 items (33%)
Armor: Cloth armor pieces
Weapons: Staves, wands, daggers
```

## Benefits of Filtered Loot

1. **Save Time**: No need to check each item individually to see if you can use it
2. **Better Planning**: Know exactly what you're after before the raid
3. **Loot Priority**: Share the filtered list with your raid leader for loot distribution
4. **Multiple Characters**: Quickly compare what different alts can get from the same boss
5. **Efficiency**: Cached responses make repeated queries very fast

## Using in the Web Interface

1. Open `http://localhost:3000/api-demo.html`
2. Navigate to section **"4.1. Loot Filtrado por Clase y Especialización"**
3. Fill in:
   - **Encounter ID**: 2902
   - **Clase**: Guerrero (or your class)
   - **Especialización**: (optional)
4. Click **"Cargar Loot Filtrado"**
5. See your filtered results with item icons and details!

## All Available Classes

The API supports filtering for all WoW classes:

- **Guerrero** (Warrior)
- **Paladín** (Paladin)
- **Cazador** (Hunter)
- **Pícaro** (Rogue)
- **Sacerdote** (Priest)
- **Caballero de la Muerte** (Death Knight)
- **Chamán** (Shaman)
- **Mago** (Mage)
- **Brujo** (Warlock)
- **Monje** (Monk)
- **Druida** (Druid)
- **Cazador de Demonios** (Demon Hunter)
- **Evocador** (Evoker)

## Error Handling

**Missing playerClass:**
```json
{
  "success": false,
  "error": "playerClass parameter is required"
}
```

**Invalid Encounter ID:**
```json
{
  "success": false,
  "error": "Invalid encounter ID. Must be a number."
}
```

**Boss with no loot for your class:**
```json
{
  "success": true,
  "loot": [],
  "total_items": 10,
  "filtered_items": 0
}
```

## Integration Example

Here's how you might use this in your raid planning app:

```javascript
// Get all raid members' potential loot
const raidMembers = [
  { name: "PlayerOne", class: "Guerrero" },
  { name: "PlayerTwo", class: "Mago" },
  { name: "PlayerThree", class: "Sacerdote" }
];

const encounterId = 2902;

for (const member of raidMembers) {
  const response = await fetch(
    `http://localhost:3000/api/encounters/${encounterId}/loot/filtered?playerClass=${member.class}`
  );
  const data = await response.json();
  
  console.log(`${member.name} (${member.class}) can use ${data.filtered_items} items`);
  
  // Track which items have competition
  data.loot.forEach(item => {
    trackLootCompetition(item.id, member.name);
  });
}
```

This helps you see which items will have the most competition for loot!
