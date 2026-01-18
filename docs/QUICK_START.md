# Quick Start Guide - Blizzard API Integration

This guide will help you get the Blizzard API integration up and running quickly.

## Prerequisites

- Node.js v14 or higher
- npm (comes with Node.js)
- Battle.net account
- Internet connection

## Step 1: Get Battle.net API Credentials

1. Go to https://develop.battle.net/
2. Log in with your Battle.net account
3. Click "Create Client" or "Get Started"
4. Fill in:
   - **Name**: EquinoxLootOmega (or any name)
   - **Redirect URLs**: http://localhost:3000
5. Click "Create"
6. Copy your **Client ID** and **Client Secret**

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   BLIZZARD_CLIENT_ID=your_client_id_here
   BLIZZARD_CLIENT_SECRET=your_client_secret_here
   ```

## Step 4: Start the Server

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

✓ Battle.net OAuth token obtained, expires in 86400s
✓ Server ready to handle requests
```

## Step 5: Test the API

Open your browser and go to:
- **API Demo**: http://localhost:3000/api-demo.html
- **Original App**: http://localhost:3000/LarancioOrtegaLoot.html
- **API Documentation**: http://localhost:3000/api

Or run the test script:
```bash
npm run test:api
```

## Common Issues

### "Missing required environment variables"
- Make sure you created the `.env` file
- Check that your Client ID and Secret are correctly set

### "Battle.net authentication failed"
- Verify your credentials are correct
- Check your internet connection
- Make sure your Battle.net client is active

### Server won't start
- Check if port 3000 is already in use
- Change the PORT in `.env` to a different number

## Next Steps

- Read [BLIZZARD_API_SETUP.md](BLIZZARD_API_SETUP.md) for detailed documentation
- Explore the API endpoints in the demo page
- Integrate the API into your application

## API Endpoints Summary

| Endpoint | Description |
|----------|-------------|
| `GET /api/raids` | List all raids |
| `GET /api/raids/:id` | Get raid details |
| `GET /api/encounters/:id/loot` | Get encounter loot |
| `GET /api/items/:id` | Get item details |
| `GET /health` | Check server status |

## Need Help?

- Check [BLIZZARD_API_SETUP.md](BLIZZARD_API_SETUP.md) for detailed docs
- Visit https://develop.battle.net/documentation
- Open an issue in the repository
