#!/usr/bin/env node

/**
 * Test script for Blizzard API Integration
 * 
 * This script demonstrates how to use the API endpoints.
 * For real testing, you need valid Blizzard API credentials in .env file.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url) {
  log(`\n📡 Testing: ${name}`, 'cyan');
  log(`   URL: ${url}`, 'blue');
  
  try {
    const response = await axios.get(url);
    log('   ✓ Success', 'green');
    console.log('   Response:', JSON.stringify(response.data, null, 2).split('\n').map(line => '   ' + line).join('\n'));
    return true;
  } catch (error) {
    log('   ✗ Failed', 'red');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2).split('\n').map(line => '   ' + line).join('\n'));
    } else {
      console.log('   Error:', error.message);
    }
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'yellow');
  log('  Blizzard API Integration - Test Suite', 'yellow');
  log('='.repeat(60) + '\n', 'yellow');

  log('⚠️  Note: These tests require valid Blizzard API credentials', 'yellow');
  log('⚠️  Make sure the server is running: npm start\n', 'yellow');

  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`
    },
    {
      name: 'API Documentation',
      url: `${BASE_URL}/api`
    },
    {
      name: 'List All Raids',
      url: `${BASE_URL}/api/raids`
    },
    {
      name: 'Get Raid Details (Nerub-ar Palace - ID: 1279)',
      url: `${BASE_URL}/api/raids/1279`
    },
    {
      name: 'Get Encounter Loot (Ulgrax the Devourer - ID: 2902)',
      url: `${BASE_URL}/api/encounters/2902/loot`
    },
    {
      name: 'Get Item Details (Example Item - ID: 212405)',
      url: `${BASE_URL}/api/items/212405`
    },
    {
      name: 'Cache Statistics',
      url: `${BASE_URL}/api/cache/stats`
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  log('\n' + '='.repeat(60), 'yellow');
  log('  Test Results', 'yellow');
  log('='.repeat(60), 'yellow');
  log(`  Passed: ${passed}`, passed > 0 ? 'green' : 'reset');
  log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  log('='.repeat(60) + '\n', 'yellow');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 2000 });
    return true;
  } catch (error) {
    log('✗ Server is not running!', 'red');
    log('  Please start the server first: npm start\n', 'yellow');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await runTests();
  } else {
    process.exit(1);
  }
})();
