const axios = require('axios');

/**
 * Service for managing OAuth authentication with Battle.net API
 */
class BlizzardAuthService {
  constructor(clientId, clientSecret, region = 'eu') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.region = region;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get OAuth token URL based on region
   * @returns {string} Token URL
   */
  getTokenUrl() {
    const regionUrls = {
      us: 'https://oauth.battle.net/token',
      eu: 'https://oauth.battle.net/token',
      kr: 'https://oauth.battle.net/token',
      tw: 'https://oauth.battle.net/token',
      cn: 'https://oauth.battlenet.com.cn/token'
    };
    return regionUrls[this.region] || regionUrls.eu;
  }

  /**
   * Check if current access token is valid
   * @returns {boolean} True if token is valid
   */
  isTokenValid() {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    // Add 60 second buffer before actual expiry
    return Date.now() < (this.tokenExpiry - 60000);
  }

  /**
   * Obtain a new access token using Client Credentials Flow
   * @returns {Promise<string>} Access token
   */
  async authenticate() {
    try {
      const tokenUrl = this.getTokenUrl();
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post(
        tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token typically expires in 86400 seconds (24 hours)
      const expiresIn = response.data.expires_in || 86400;
      this.tokenExpiry = Date.now() + (expiresIn * 1000);

      console.log(`✓ Battle.net OAuth token obtained, expires in ${expiresIn}s`);
      return this.accessToken;
    } catch (error) {
      console.error('✗ Failed to authenticate with Battle.net:', error.response?.data || error.message);
      throw new Error('Battle.net authentication failed');
    }
  }

  /**
   * Get a valid access token (obtains new one if needed)
   * @returns {Promise<string>} Valid access token
   */
  async getAccessToken() {
    if (!this.isTokenValid()) {
      console.log('Token expired or missing, obtaining new token...');
      await this.authenticate();
    }
    return this.accessToken;
  }
}

module.exports = BlizzardAuthService;
