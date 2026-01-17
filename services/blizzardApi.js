const axios = require('axios');
const NodeCache = require('node-cache');

/**
 * Service for interacting with Blizzard WoW Game Data API
 */
class BlizzardApiService {
  constructor(authService, region = 'eu', locale = 'es_ES') {
    this.authService = authService;
    this.region = region;
    this.locale = locale;
    this.namespace = `static-${region}`;
    this.dynamicNamespace = `dynamic-${region}`;
    
    // Cache with default TTL of 1 hour
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
  }

  /**
   * Get API base URL for region
   * @returns {string} API base URL
   */
  getApiUrl() {
    const regionUrls = {
      us: 'https://us.api.blizzard.com',
      eu: 'https://eu.api.blizzard.com',
      kr: 'https://kr.api.blizzard.com',
      tw: 'https://tw.api.blizzard.com',
      cn: 'https://gateway.battlenet.com.cn'
    };
    return regionUrls[this.region] || regionUrls.eu;
  }

  /**
   * Make authenticated request to Blizzard API with caching
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {string} cacheKey - Cache key (optional)
   * @returns {Promise<Object>} API response data
   */
  async request(endpoint, params = {}, cacheKey = null) {
    // Check cache first
    if (cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`✓ Cache hit for: ${cacheKey}`);
        return cached;
      }
    }

    try {
      const token = await this.authService.getAccessToken();
      const url = `${this.getApiUrl()}${endpoint}`;
      
      const response = await axios.get(url, {
        params: {
          namespace: params.namespace || this.namespace,
          locale: this.locale,
          ...params
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Cache the response
      if (cacheKey) {
        this.cache.set(cacheKey, response.data);
        console.log(`✓ Cached response for: ${cacheKey}`);
      }

      return response.data;
    } catch (error) {
      console.error(`✗ API request failed for ${endpoint}:`, error.response?.data || error.message);
      
      // Return more descriptive error
      const statusCode = error.response?.status;
      const message = error.response?.data?.detail || error.message;
      
      throw {
        status: statusCode || 500,
        message: `Blizzard API error: ${message}`,
        endpoint
      };
    }
  }

  /**
   * Get list of all raids
   * @returns {Promise<Object>} Raids index
   */
  async getRaids() {
    return this.request(
      '/data/wow/journal-instance/index',
      {},
      'raids-index'
    );
  }

  /**
   * Get raid details including encounters
   * @param {number} raidId - Raid instance ID
   * @returns {Promise<Object>} Raid details
   */
  async getRaidDetails(raidId) {
    return this.request(
      `/data/wow/journal-instance/${raidId}`,
      {},
      `raid-${raidId}`
    );
  }

  /**
   * Get encounter details
   * @param {number} encounterId - Encounter ID
   * @returns {Promise<Object>} Encounter details
   */
  async getEncounter(encounterId) {
    return this.request(
      `/data/wow/journal-encounter/${encounterId}`,
      {},
      `encounter-${encounterId}`
    );
  }

  /**
   * Get item details
   * @param {number} itemId - Item ID
   * @returns {Promise<Object>} Item details
   */
  async getItem(itemId) {
    return this.request(
      `/data/wow/item/${itemId}`,
      {},
      `item-${itemId}`
    );
  }

  /**
   * Get item media (icon)
   * @param {number} itemId - Item ID
   * @returns {Promise<Object>} Item media data
   */
  async getItemMedia(itemId) {
    return this.request(
      `/data/wow/media/item/${itemId}`,
      {},
      `item-media-${itemId}`
    );
  }

  /**
   * Determine which classes can equip an item based on item class and subclass
   * @param {Object} item - Item data from API
   * @returns {Array<string>} Array of class names that can equip the item
   */
  getItemEquippableClasses(item) {
    // All classes in Spanish
    const allClasses = [
      'Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote',
      'Caballero de la Muerte', 'Chamán', 'Mago', 'Brujo', 'Monje',
      'Druida', 'Cazador de Demonios', 'Evocador'
    ];

    // If item doesn't have class restrictions, all classes can use it
    if (!item.item_class || !item.item_subclass) {
      return allClasses;
    }

    const itemClass = item.item_class.name;
    const itemSubclass = item.item_subclass?.name || '';

    // Armor type mappings
    const armorMappings = {
      'Cloth': ['Mago', 'Sacerdote', 'Brujo'],
      'Leather': ['Pícaro', 'Monje', 'Druida', 'Cazador de Demonios'],
      'Mail': ['Cazador', 'Chamán', 'Evocador'],
      'Plate': ['Guerrero', 'Paladín', 'Caballero de la Muerte']
    };

    // Weapon type mappings
    const weaponMappings = {
      'One-Handed Swords': ['Guerrero', 'Paladín', 'Pícaro', 'Monje', 'Caballero de la Muerte', 'Brujo', 'Mago'],
      'Two-Handed Swords': ['Guerrero', 'Paladín', 'Caballero de la Muerte'],
      'One-Handed Axes': ['Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Chamán', 'Monje', 'Caballero de la Muerte'],
      'Two-Handed Axes': ['Guerrero', 'Paladín', 'Cazador', 'Chamán', 'Caballero de la Muerte'],
      'One-Handed Maces': ['Guerrero', 'Paladín', 'Sacerdote', 'Pícaro', 'Chamán', 'Monje', 'Druida', 'Caballero de la Muerte'],
      'Two-Handed Maces': ['Guerrero', 'Paladín', 'Chamán', 'Druida', 'Caballero de la Muerte'],
      'Polearms': ['Guerrero', 'Paladín', 'Cazador', 'Chamán', 'Monje', 'Druida', 'Caballero de la Muerte'],
      'Staves': ['Mago', 'Sacerdote', 'Brujo', 'Chamán', 'Monje', 'Druida', 'Evocador'],
      'Daggers': ['Todos'],
      'Fist Weapons': ['Pícaro', 'Monje', 'Cazador', 'Chamán', 'Cazador de Demonios'],
      'Bows': ['Guerrero', 'Pícaro', 'Cazador'],
      'Guns': ['Guerrero', 'Pícaro', 'Cazador'],
      'Crossbows': ['Guerrero', 'Pícaro', 'Cazador'],
      'Wands': ['Mago', 'Sacerdote', 'Brujo'],
      'Shields': ['Guerrero', 'Paladín', 'Chamán']
    };

    // Check armor types
    for (const [armorType, classes] of Object.entries(armorMappings)) {
      if (itemSubclass.includes(armorType)) {
        return classes;
      }
    }

    // Check weapon types
    for (const [weaponType, classes] of Object.entries(weaponMappings)) {
      if (itemSubclass.includes(weaponType) || itemClass.includes(weaponType)) {
        return classes === 'Todos' ? allClasses : classes;
      }
    }

    // Trinkets, necks, rings, cloaks - all classes
    if (itemClass.includes('Miscellaneous') || 
        itemSubclass.includes('Neck') || 
        itemSubclass.includes('Finger') ||
        itemSubclass.includes('Trinket') ||
        itemSubclass.includes('Cloak')) {
      return allClasses;
    }

    // Default: return all classes if we can't determine restrictions
    return allClasses;
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.flushAll();
    console.log('✓ Cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}

module.exports = BlizzardApiService;
