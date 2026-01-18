#!/usr/bin/env node

/**
 * End-to-end test for the journal-instances endpoint
 * This test verifies that the endpoint properly constructs requests with all required headers
 */

const axios = require('axios');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Capture original axios functions BEFORE any modifications
const originalGet = axios.get;
const originalPost = axios.post;

// Load services
const BlizzardAuthService = require('../src/services/blizzardAuth');
const BlizzardApiService = require('../src/services/blizzardApi');

// Mock Blizzard API server
const mockBlizzardServer = {
  requests: [],
  
  // Simulate Blizzard API behavior
  handleRequest(url, config) {
    const request = { url, config };
    this.requests.push(request);
    
    const headers = config.headers || {};
    const params = config.params || {};
    
    // Check for required headers and parameters
    const hasAuth = headers['Authorization']?.startsWith('Bearer ');
    const hasNamespaceHeader = headers['Battlenet-Namespace'];
    const hasAccept = headers['Accept'] === 'application/json';
    const hasAcceptLang = headers['Accept-Language'];
    const hasNamespaceParam = params.namespace;
    const hasLocale = params.locale;
    
    // Blizzard API returns 404 if namespace is missing (either as header or parameter)
    // According to API docs, namespace can be provided via header OR query param
    if (!hasNamespaceHeader && !hasNamespaceParam) {
      return {
        status: 404,
        data: { code: 404, detail: 'Not Found' }
      };
    }
    
    // Success response
    return {
      status: 200,
      data: {
        instances: [
          { id: 1279, name: 'Nerub-ar Palace', key: { href: 'https://eu.api.blizzard.com/data/wow/journal-instance/1279' } },
          { id: 1200, name: 'Aberrus, the Shadowed Crucible', key: { href: 'https://eu.api.blizzard.com/data/wow/journal-instance/1200' } }
        ]
      }
    };
  },
  
  reset() {
    this.requests = [];
  }
};

// Mock axios for the test
axios.get = async function(url, config) {
  const result = mockBlizzardServer.handleRequest(url, config);
  if (result.status !== 200) {
    const error = new Error('Request failed');
    error.response = result;
    throw error;
  }
  return result;
};

axios.post = async function(url, data, config) {
  // Mock OAuth token endpoint
  if (url.includes('oauth.battle.net/token')) {
    return {
      data: {
        access_token: 'mock-test-token-abc123',
        expires_in: 86400,
        token_type: 'bearer'
      }
    };
  }
  return originalPost(url, data, config);
};

async function runTest() {
  log('\n' + '='.repeat(70), 'yellow');
  log('  End-to-End Test: Journal Instances Endpoint', 'yellow');
  log('='.repeat(70) + '\n', 'yellow');
  
  try {
    log('Step 1: Initialize services', 'cyan');
    const authService = new BlizzardAuthService('test-client-id', 'test-client-secret', 'eu');
    const apiService = new BlizzardApiService(authService, 'eu', 'es_ES');
    log('  ✓ Services initialized\n', 'green');
    
    log('Step 2: Authenticate with Battle.net (mocked)', 'cyan');
    await authService.authenticate();
    log('  ✓ Authentication successful\n', 'green');
    
    log('Step 3: Call getJournalInstances()', 'cyan');
    mockBlizzardServer.reset();
    const result = await apiService.getJournalInstances();
    log('  ✓ Request successful\n', 'green');
    
    log('Step 4: Verify request headers', 'cyan');
    const lastRequest = mockBlizzardServer.requests[mockBlizzardServer.requests.length - 1];
    const headers = lastRequest.config.headers;
    const params = lastRequest.config.params;
    
    const checks = [
      { 
        name: 'Authorization header present',
        pass: headers['Authorization']?.startsWith('Bearer '),
        value: headers['Authorization']
      },
      {
        name: 'Battlenet-Namespace header',
        pass: headers['Battlenet-Namespace'] === 'static-eu',
        value: headers['Battlenet-Namespace']
      },
      {
        name: 'Accept header',
        pass: headers['Accept'] === 'application/json',
        value: headers['Accept']
      },
      {
        name: 'Accept-Language header',
        pass: headers['Accept-Language'] === 'es-ES',
        value: headers['Accept-Language']
      },
      {
        name: 'namespace parameter',
        pass: params.namespace === 'static-eu',
        value: params.namespace
      },
      {
        name: 'locale parameter',
        pass: params.locale === 'es_ES',
        value: params.locale
      }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      allPassed = allPassed && check.pass;
      log(`  ${check.pass ? '✓' : '✗'} ${check.name}: ${check.value}`, check.pass ? 'green' : 'red');
    });
    
    log('\nStep 5: Verify response data', 'cyan');
    const dataChecks = [
      {
        name: 'Response contains instances array',
        pass: Array.isArray(result.instances)
      },
      {
        name: 'Instances array is not empty',
        pass: result.instances && result.instances.length > 0
      },
      {
        name: 'Instance objects have required fields',
        pass: result.instances && result.instances[0].id && result.instances[0].name
      }
    ];
    
    dataChecks.forEach(check => {
      allPassed = allPassed && check.pass;
      log(`  ${check.pass ? '✓' : '✗'} ${check.name}`, check.pass ? 'green' : 'red');
    });
    
    log('\n' + '='.repeat(70), 'yellow');
    if (allPassed) {
      log('  ✅ ALL TESTS PASSED', 'green');
      log('='.repeat(70) + '\n', 'yellow');
      log('The journal-instances endpoint is correctly configured with all required headers.', 'green');
      log('It should now work properly when called from the HTML demo.\n', 'green');
    } else {
      log('  ❌ SOME TESTS FAILED', 'red');
      log('='.repeat(70) + '\n', 'yellow');
    }
    
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    log('\n❌ Test failed with error:', 'red');
    log(error.message, 'red');
    if (error.stack) {
      console.log(error.stack);
    }
    process.exit(1);
  } finally {
    // Restore axios
    axios.get = originalGet;
    axios.post = originalPost;
  }
}

runTest();
