# Blizzard API Integration - Setup Guide

This document provides detailed instructions for setting up and using the Blizzard WoW Retail Game Data API integration.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Battle.net API Credentials](#getting-battlenet-api-credentials)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Examples](#examples)

## Prerequisites

- Node.js v14.0.0 or higher
- npm (comes with Node.js)
- Battle.net account
- Blizzard API credentials (Client ID and Client Secret)

## Getting Battle.net API Credentials

1. **Create a Battle.net Account** (if you don't have one):
   - Go to https://battle.net/
   - Click "Create a Free Account"
   - Follow the registration process

2. **Access the Developer Portal**:
   - Visit https://develop.battle.net/
   - Log in with your Battle.net account

3. **Create a New Client**:
   - Navigate to "API Access" or "My Clients"
   - Click "Create Client" or "Register a new client"
   - Fill in the required information:
     - **Client Name**: "EquinoxLootOmega" (or any name you prefer)
     - **Redirect URLs**: Add `http://localhost:3000` (for local development)
     - **Intended Use**: Select "Game Data APIs"
   - Click "Create" or "Register"

4. **Get Your Credentials**:
   - After creating the client, you'll see:
     - **Client ID**: A string like `abc123def456...`
     - **Client Secret**: A secret string (click "Show" to reveal it)
   - **IMPORTANT**: Keep the Client Secret secure and never commit it to version control

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create Environment File**:
   ```bash
   cp .env.example .env
   ```

## Configuration

Edit the `.env` file with your Battle.net credentials and preferences:

```env
# Blizzard Battle.net API Credentials
BLIZZARD_CLIENT_ID=your_client_id_here
BLIZZARD_CLIENT_SECRET=your_client_secret_here

# API Configuration
PORT=3000
REGION=eu
LOCALE=es_ES
NAMESPACE=static-eu

# Cache Configuration (in seconds)
CACHE_TTL=3600
```

### Configuration Options

- **BLIZZARD_CLIENT_ID**: Your Battle.net API Client ID (required)
- **BLIZZARD_CLIENT_SECRET**: Your Battle.net API Client Secret (required)
- **PORT**: Server port (default: 3000)
- **REGION**: Blizzard API region - `us`, `eu`, `kr`, `tw`, `cn` (default: eu)
- **LOCALE**: Response language - `es_ES`, `en_US`, `de_DE`, `fr_FR`, etc. (default: es_ES)
- **CACHE_TTL**: Cache duration in seconds (default: 3600 = 1 hour)

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Verify Server is Running

Open your browser and navigate to:
- **API Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## API Endpoints

### 1. List Raids
**GET** `/api/raids`

Returns a list of all available raids in the configured region.

**Response:**
```json
{
  "success": true,
  "region": "eu",
  "locale": "es_ES",
  "count": 8,
  "raids": [
    {
      "id": 1279,
      "name": "Nerub-ar Palace",
      "key": "https://eu.api.blizzard.com/data/wow/journal-instance/1279"
    }
  ]
}
```

### 2. Get Raid Details
**GET** `/api/raids/:id`

Returns detailed information about a specific raid, including all encounters (bosses).

**Parameters:**
- `id` (path): Raid instance ID (number)

**Example:** `/api/raids/1279`

**Response:**
```json
{
  "success": true,
  "raid": {
    "id": 1279,
    "name": "Nerub-ar Palace",
    "description": "Raid description...",
    "minimum_level": 70,
    "encounters": [
      {
        "id": 2902,
        "name": "Ulgrax the Devourer",
        "key": "https://eu.api.blizzard.com/data/wow/journal-encounter/2902"
      }
    ]
  }
}
```

### 3. Get Encounter Loot
**GET** `/api/encounters/:id/loot`

Returns all loot items that drop from a specific encounter (boss).

**Parameters:**
- `id` (path): Encounter ID (number)

**Example:** `/api/encounters/2902/loot`

**Response:**
```json
{
  "success": true,
  "encounter": {
    "id": 2902,
    "name": "Ulgrax the Devourer",
    "description": "Boss description...",
    "instance": {
      "id": 1279,
      "name": "Nerub-ar Palace"
    }
  },
  "loot": [
    {
      "id": 212405,
      "name": "Bile-Soaked Harness",
      "quality": "EPIC",
      "key": "https://eu.api.blizzard.com/data/wow/item/212405"
    }
  ]
}
```

### 4. Get Item Details
**GET** `/api/items/:id`

Returns detailed information about a specific item, including which classes can equip it.

**Parameters:**
- `id` (path): Item ID (number)

**Example:** `/api/items/212405`

**Response:**
```json
{
  "success": true,
  "item": {
    "id": 212405,
    "name": "Bile-Soaked Harness",
    "quality": "EPIC",
    "level": 623,
    "required_level": 70,
    "item_class": "Armor",
    "item_subclass": "Leather",
    "inventory_type": "Chest",
    "is_equippable": true,
    "icon_url": "https://render.worldofwarcraft.com/...",
    "equippable_classes": [
      "Pícaro",
      "Monje",
      "Druida",
      "Cazador de Demonios"
    ],
    "stats": [...],
    "description": "..."
  }
}
```

### 5. Cache Management

**Get Cache Statistics**
**GET** `/api/cache/stats`

Returns statistics about the API cache.

**Clear Cache**
**DELETE** `/api/cache`

Clears all cached API responses.

### 6. Health Check
**GET** `/health`

Returns server health status and configuration.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-17T19:57:53.684Z",
  "region": "eu",
  "locale": "es_ES",
  "tokenValid": true
}
```

## Examples

### JavaScript (Fetch API)
```javascript
// Get all raids
fetch('http://localhost:3000/api/raids')
  .then(response => response.json())
  .then(data => console.log(data.raids));

// Get raid details
fetch('http://localhost:3000/api/raids/1279')
  .then(response => response.json())
  .then(data => console.log(data.raid));

// Get encounter loot
fetch('http://localhost:3000/api/encounters/2902/loot')
  .then(response => response.json())
  .then(data => console.log(data.loot));

// Get item details
fetch('http://localhost:3000/api/items/212405')
  .then(response => response.json())
  .then(data => console.log(data.item));
```

### cURL
```bash
# Get all raids
curl http://localhost:3000/api/raids

# Get specific raid
curl http://localhost:3000/api/raids/1279

# Get encounter loot
curl http://localhost:3000/api/encounters/2902/loot

# Get item details
curl http://localhost:3000/api/items/212405

# Clear cache
curl -X DELETE http://localhost:3000/api/cache
```

## Authentication Flow

The server uses **OAuth 2.0 Client Credentials Flow** to authenticate with Battle.net:

1. On startup (or when token expires), the server requests an access token
2. The token is cached and reused for all API requests
3. Tokens typically expire after 24 hours
4. The server automatically refreshes the token when needed
5. No user interaction is required

### HTTP Headers Sent to Blizzard API

All requests to the Blizzard Game Data API include the following headers:

- **Authorization**: `Bearer <access_token>` - OAuth 2.0 access token
- **Battlenet-Namespace**: `static-{region}` - Specifies the data namespace (also sent as query parameter)
- **Accept**: `application/json` - Indicates we expect JSON responses
- **Accept-Language**: `{locale}` - Specifies the preferred language (e.g., `es-ES`, `en-US`)

These headers ensure proper authentication and data retrieval from the Blizzard API.

## Caching Strategy

To minimize API calls to Blizzard and improve response times:

- All API responses are cached with a default TTL of 1 hour
- Cache keys are based on the endpoint and parameters
- Cache can be cleared manually via `/api/cache` endpoint
- Cache statistics are available at `/api/cache/stats`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "endpoint": "/api/endpoint"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error
- `503`: Service Unavailable (Blizzard API down)

## Troubleshooting

### "Battle.net authentication failed"
- Verify your Client ID and Client Secret in `.env`
- Ensure your credentials are active in the Battle.net developer portal
- Check your internet connection

### "Missing required environment variables"
- Create a `.env` file based on `.env.example`
- Fill in your BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET

### "Endpoint not found" (404)
- Check that you're using the correct endpoint URL
- Verify the server is running on the expected port
- Ensure the ID parameter is a valid number
- **Note**: If you get a 404 from the Blizzard API itself (not the local server), ensure:
  - The correct namespace is being used for your region (e.g., `static-eu` for Europe)
  - Required headers are being sent (`Battlenet-Namespace`, `Accept`, `Accept-Language`)
  - The endpoint path is correct (e.g., `/data/wow/journal-instance/index`)

### "CORS errors" when accessing from HTML
- Ensure the HTML file is served from `http://localhost:3000` and not opened as `file://`
- The server has CORS enabled for all origins by default
- If needed, check browser console for specific CORS error details

### Cache not working
- Check cache statistics at `/api/cache/stats`
- Clear cache if stale: `DELETE /api/cache`
- Verify CACHE_TTL setting in `.env`

## Additional Resources

- [Blizzard API Documentation](https://develop.battle.net/documentation)
- [WoW Game Data APIs](https://develop.battle.net/documentation/world-of-warcraft/game-data-apis)
- [OAuth 2.0 Guide](https://develop.battle.net/documentation/guides/using-oauth)

## Support

For issues related to:
- **Blizzard API**: Visit https://develop.battle.net/support
- **This Integration**: Open an issue in the project repository
