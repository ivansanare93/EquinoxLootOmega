#!/usr/bin/env node

/**
 * Test script for the filtered loot endpoint
 * 
 * This script demonstrates how to use the new filtered loot API endpoint
 * that returns boss loot filtered by player class and specialization.
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testFilteredLoot(encounterId, playerClass, specialization = null) {
  log(`\n📡 Testing Filtered Loot Endpoint`, 'cyan');
  log(`   Encounter ID: ${encounterId}`, 'blue');
  log(`   Player Class: ${playerClass}`, 'blue');
  if (specialization) {
    log(`   Specialization: ${specialization}`, 'blue');
  }
  
  try {
    let url = `${BASE_URL}/api/encounters/${encounterId}/loot/filtered?playerClass=${encodeURIComponent(playerClass)}`;
    if (specialization) {
      url += `&specialization=${encodeURIComponent(specialization)}`;
    }

    log(`\n   URL: ${url}`, 'blue');
    
    const response = await axios.get(url);
    
    if (response.data.success) {
      log('\n   ✓ Success', 'green');
      log(`\n   Encounter: ${response.data.encounter.name}`, 'cyan');
      log(`   Instance: ${response.data.encounter.instance?.name || 'N/A'}`, 'cyan');
      log(`   Filter: ${response.data.filter.playerClass}${response.data.filter.specialization !== 'All' ? ' (' + response.data.filter.specialization + ')' : ''}`, 'magenta');
      log(`   Total Items: ${response.data.total_items}`, 'yellow');
      log(`   Filtered Items: ${response.data.filtered_items}`, 'green');
      
      if (response.data.loot.length > 0) {
        log(`\n   Available Loot for ${playerClass}:`, 'cyan');
        response.data.loot.forEach((item, index) => {
          log(`   ${index + 1}. ${item.name} (ID: ${item.id})`, 'reset');
          log(`      Type: ${item.item_subclass || item.item_class} | Quality: ${item.quality} | Level: ${item.level}`, 'blue');
          log(`      Equippable by: ${item.equippable_classes.join(', ')}`, 'blue');
        });
      } else {
        log(`\n   ⚠️  No items available for ${playerClass}`, 'yellow');
      }
      return true;
    } else {
      log('   ✗ Failed', 'red');
      log(`   Error: ${response.data.error}`, 'red');
      return false;
    }
  } catch (error) {
    log('   ✗ Failed', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(70), 'yellow');
  log('  Blizzard API - Filtered Loot by Class/Spec - Test Suite', 'yellow');
  log('='.repeat(70) + '\n', 'yellow');

  log('⚠️  Note: These tests require valid Blizzard API credentials', 'yellow');
  log('⚠️  Make sure the server is running: npm start\n', 'yellow');

  // Example test cases
  const testCases = [
    {
      name: 'Warrior - Get loot from Ulgrax the Devourer',
      encounterId: 2902,
      playerClass: 'Guerrero',
      specialization: null
    },
    {
      name: 'Mage - Get loot from Ulgrax the Devourer',
      encounterId: 2902,
      playerClass: 'Mago',
      specialization: null
    },
    {
      name: 'Paladin (Protección) - Get loot from Ulgrax the Devourer',
      encounterId: 2902,
      playerClass: 'Paladín',
      specialization: 'Protección'
    },
    {
      name: 'Druid - Get loot from Ulgrax the Devourer',
      encounterId: 2902,
      playerClass: 'Druida',
      specialization: null
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    log(`\n${'='.repeat(70)}`, 'cyan');
    log(`Test: ${testCase.name}`, 'cyan');
    log('='.repeat(70), 'cyan');
    
    const result = await testFilteredLoot(
      testCase.encounterId,
      testCase.playerClass,
      testCase.specialization
    );
    
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  log('\n' + '='.repeat(70), 'yellow');
  log('  Test Results', 'yellow');
  log('='.repeat(70), 'yellow');
  log(`  Passed: ${passed}`, passed > 0 ? 'green' : 'reset');
  log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  log('='.repeat(70) + '\n', 'yellow');
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
