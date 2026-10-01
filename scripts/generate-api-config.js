#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
    console.error('Error: API_BASE_URL is required to build the production API configuration.');
    process.exit(1);
}

try {
    new URL(apiBaseUrl);
} catch {
    console.error('Error: API_BASE_URL must be a valid absolute URL.');
    process.exit(1);
}

const outputPath = path.join(__dirname, '..', 'public', 'api-config.js');
const configContent = `// API configuration generated during the build process.\nwindow.EQUINOX_CONFIG = {\n    apiBaseUrl: ${JSON.stringify(apiBaseUrl)}\n};\n`;

fs.writeFileSync(outputPath, configContent, 'utf8');
console.log('API configuration generated at:', outputPath);
