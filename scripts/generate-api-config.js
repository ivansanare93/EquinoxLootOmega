#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let apiBaseUrl = null;

if (process.env.API_BASE_URL) {
    try {
        apiBaseUrl = new URL(process.env.API_BASE_URL).toString().replace(/\/$/, '');
    } catch {
        console.error('Error: API_BASE_URL must be a valid absolute URL.');
        process.exit(1);
    }
}

const outputPath = path.join(__dirname, '..', 'public', 'api-config.js');
const configContent = `// API configuration generated during the build process.\nwindow.EQUINOX_CONFIG = {\n    apiConfigured: ${Boolean(apiBaseUrl)},\n    apiBaseUrl: ${JSON.stringify(apiBaseUrl)}\n};\n`;

fs.writeFileSync(outputPath, configContent, 'utf8');
console.log(apiBaseUrl
    ? `API configuration generated at: ${outputPath}`
    : `API is not configured; generated disabled configuration at: ${outputPath}`);
