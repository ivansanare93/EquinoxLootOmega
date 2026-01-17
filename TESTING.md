# Testing the Blizzard API Integration

This document explains how to test the API integration to verify it's working correctly.

## Prerequisites

Before testing, make sure you have:
- ✅ Valid Battle.net API credentials in `.env`
- ✅ Dependencies installed (`npm install`)
- ✅ Server running (`npm start`)

## Manual Testing

### 1. Health Check

First, verify the server is running and authenticated:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-17T20:00:00.000Z",
  "region": "eu",
  "locale": "es_ES",
  "tokenValid": true
}
```

### 2. List Raids

Get all available raids:

```bash
curl http://localhost:3000/api/raids
```

Expected response includes a list of raids with IDs and names.

### 3. Get Raid Details

Use a raid ID from the previous step (e.g., 1279 for Nerub-ar Palace):

```bash
curl http://localhost:3000/api/raids/1279
```

Expected response includes raid details and encounters list.

### 4. Get Encounter Loot

Use an encounter ID from the raid details:

```bash
curl http://localhost:3000/api/encounters/2902/loot
```

Expected response includes encounter details and loot items.

### 5. Get Item Details

Use an item ID from the encounter loot:

```bash
curl http://localhost:3000/api/items/212405
```

Expected response includes full item details with equippable classes.

## Automated Testing

Run the test script:

```bash
npm run test:api
```

This will test all endpoints and show results with color-coded output.

## Interactive Testing

Open the demo page in your browser:

```
http://localhost:3000/api-demo.html
```

This provides a user-friendly interface to test all endpoints interactively.

## Testing Checklist

- [ ] Server starts without errors
- [ ] Health check returns status "ok"
- [ ] `/api/raids` returns list of raids
- [ ] `/api/raids/:id` returns raid details
- [ ] `/api/encounters/:id/loot` returns loot items
- [ ] `/api/items/:id` returns item details with equippable classes
- [ ] Cache statistics are accessible
- [ ] Cache can be cleared
- [ ] Error handling works for invalid IDs
- [ ] OAuth token is obtained on startup

## Common Test Scenarios

### Test Invalid ID

```bash
curl http://localhost:3000/api/raids/99999
```

Should return 404 or error message.

### Test Cache

1. Make a request: `curl http://localhost:3000/api/raids`
2. Check cache stats: `curl http://localhost:3000/api/cache/stats`
3. Clear cache: `curl -X DELETE http://localhost:3000/api/cache`
4. Verify cache is empty: `curl http://localhost:3000/api/cache/stats`

### Test Token Expiry

1. Start server
2. Wait for token to expire (24 hours by default)
3. Make an API request
4. Verify token is automatically refreshed

## Expected Response Times

- First request (cache miss): 200-500ms
- Cached request: 5-20ms
- Health check: <10ms

## Troubleshooting Tests

### All tests fail with connection error
- Server is not running: `npm start`
- Port is wrong: Check PORT in `.env`

### Authentication errors
- Invalid credentials: Check `.env` file
- No internet connection: Verify network access

### Rate limiting errors
- Too many requests: Wait a few minutes
- Blizzard API throttling: Use cache to reduce requests

## Performance Testing

Test cache performance:

```bash
# First request (cache miss)
time curl http://localhost:3000/api/raids

# Second request (cache hit)
time curl http://localhost:3000/api/raids
```

Second request should be significantly faster.

## Integration Testing

Test the full flow:

1. Get list of raids
2. Select first raid ID
3. Get raid details
4. Select first encounter ID
5. Get encounter loot
6. Select first item ID
7. Get item details
8. Verify equippable classes are returned

Example script:

```bash
#!/bin/bash

# Get raids
RAIDS=$(curl -s http://localhost:3000/api/raids)
RAID_ID=$(echo $RAIDS | jq -r '.raids[0].id')
echo "Testing with raid ID: $RAID_ID"

# Get raid details
RAID=$(curl -s http://localhost:3000/api/raids/$RAID_ID)
ENCOUNTER_ID=$(echo $RAID | jq -r '.raid.encounters[0].id')
echo "Testing with encounter ID: $ENCOUNTER_ID"

# Get encounter loot
LOOT=$(curl -s http://localhost:3000/api/encounters/$ENCOUNTER_ID/loot)
ITEM_ID=$(echo $LOOT | jq -r '.loot[0].id')
echo "Testing with item ID: $ITEM_ID"

# Get item details
ITEM=$(curl -s http://localhost:3000/api/items/$ITEM_ID)
echo "Item: $(echo $ITEM | jq -r '.item.name')"
echo "Equippable classes: $(echo $ITEM | jq -r '.item.equippable_classes | join(", ")')"
```

## Security Testing

Verify security measures:

```bash
# Should NOT serve .env file
curl http://localhost:3000/.env
# Expected: 404 or Cannot GET

# Should NOT serve node_modules
curl http://localhost:3000/node_modules/express/package.json
# Expected: 404 or Cannot GET

# Should serve public files
curl http://localhost:3000/api-demo.html
# Expected: HTML content
```

## Continuous Testing

For ongoing development, use nodemon for auto-restart:

```bash
npm run dev
```

This will automatically restart the server when files change, making testing easier.
