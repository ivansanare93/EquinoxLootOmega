require('dotenv').config();
const express = require('express');
const cors = require('cors');
const BlizzardAuthService = require('./services/blizzardAuth');
const BlizzardApiService = require('./services/blizzardApi');
const initializeRoutes = require('./routes/api');

// Validate required environment variables
const requiredEnvVars = ['BLIZZARD_CLIENT_ID', 'BLIZZARD_CLIENT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env file based on .env.example');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const config = {
  region: process.env.REGION || 'eu',
  locale: process.env.LOCALE || 'es_ES',
  clientId: process.env.BLIZZARD_CLIENT_ID,
  clientSecret: process.env.BLIZZARD_CLIENT_SECRET
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Blizzard services
const authService = new BlizzardAuthService(
  config.clientId,
  config.clientSecret,
  config.region
);

const apiService = new BlizzardApiService(
  authService,
  config.region,
  config.locale
);

// Initialize routes
const apiRoutes = initializeRoutes(apiService);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    region: config.region,
    locale: config.locale,
    tokenValid: authService.isTokenValid()
  });
});

// Root endpoint with API documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'Equinox Loot Omega - Blizzard API Integration',
    version: '1.0.0',
    region: config.region,
    locale: config.locale,
    endpoints: {
      'GET /api/raids': 'List all available raids',
      'GET /api/raids/:id': 'Get raid details with encounters',
      'GET /api/encounters/:id/loot': 'Get loot drops for an encounter',
      'GET /api/items/:id': 'Get item details with equippable classes',
      'GET /api/cache/stats': 'Get cache statistics',
      'DELETE /api/cache': 'Clear API cache',
      'GET /health': 'Health check'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, async () => {
  console.log('===========================================');
  console.log('  Equinox Loot Omega - Blizzard API Server');
  console.log('===========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Region: ${config.region.toUpperCase()}`);
  console.log(`Locale: ${config.locale}`);
  console.log(`API Documentation: http://localhost:${PORT}/api`);
  console.log('===========================================\n');

  // Authenticate on startup
  try {
    console.log('Authenticating with Battle.net...');
    await authService.authenticate();
    console.log('✓ Server ready to handle requests\n');
  } catch (error) {
    console.error('✗ Failed to authenticate with Battle.net on startup');
    console.error('Server will attempt to authenticate on first API request\n');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
