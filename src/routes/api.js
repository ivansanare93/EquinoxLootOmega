const express = require('express');
const router = express.Router();

/**
 * Initialize routes with Blizzard API service
 * @param {BlizzardApiService} apiService - Blizzard API service instance
 */
function initializeRoutes(apiService) {
  /**
   * GET /api/journal-instances
   * Get list of all journal instances (raids and dungeons)
   */
  router.get('/journal-instances', async (req, res) => {
    try {
      const data = await apiService.getJournalInstances();
      
      res.json({
        success: true,
        message: 'Journal instances fetched successfully',
        region: apiService.region,
        locale: apiService.locale,
        count: data.instances ? data.instances.length : 0,
        instances: data.instances ? data.instances.map(instance => ({
          id: instance.id,
          name: instance.name,
          key: instance.key?.href
        })) : []
      });
    } catch (error) {
      console.error('Error fetching journal instances:', error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Failed to fetch journal instances',
        endpoint: '/api/journal-instances'
      });
    }
  });

  /**
   * GET /api/raids
   * Get list of available raids in EU region
   */
  router.get('/raids', async (req, res) => {
    try {
      const data = await apiService.getRaids();
      
      // Filter to only include raids (not dungeons)
      const raids = data.instances
        ? data.instances.filter(instance => instance.category?.type === 'RAID' || 
                                           instance.name.toLowerCase().includes('raid'))
        : [];

      res.json({
        success: true,
        region: apiService.region,
        locale: apiService.locale,
        count: raids.length,
        raids: raids.map(raid => ({
          id: raid.id,
          name: raid.name,
          key: raid.key?.href
        }))
      });
    } catch (error) {
      console.error('Error fetching raids:', error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Failed to fetch raids',
        endpoint: '/api/raids'
      });
    }
  });

  /**
   * GET /api/raids/:id
   * Get raid details including encounters (bosses)
   */
  router.get('/raids/:id', async (req, res) => {
    try {
      const raidId = parseInt(req.params.id);
      
      if (isNaN(raidId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid raid ID. Must be a number.'
        });
      }

      const data = await apiService.getRaidDetails(raidId);

      res.json({
        success: true,
        raid: {
          id: data.id,
          name: data.name,
          description: data.description,
          minimum_level: data.minimum_level,
          encounters: data.encounters ? data.encounters.map(encounter => ({
            id: encounter.id,
            name: encounter.name,
            key: encounter.key?.href
          })) : []
        }
      });
    } catch (error) {
      console.error(`Error fetching raid ${req.params.id}:`, error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Failed to fetch raid details',
        endpoint: `/api/raids/${req.params.id}`
      });
    }
  });

  /**
   * GET /api/encounters/:id/loot
   * Get loot drops for a specific encounter (boss)
   */
  router.get('/encounters/:id/loot', async (req, res) => {
    try {
      const encounterId = parseInt(req.params.id);
      
      if (isNaN(encounterId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid encounter ID. Must be a number.'
        });
      }

      const data = await apiService.getEncounter(encounterId);

      // Extract items from encounter
      const items = data.items ? data.items.map(item => ({
        id: item.item?.id,
        name: item.item?.name,
        quality: item.quality?.type,
        key: item.item?.key?.href
      })) : [];

      res.json({
        success: true,
        encounter: {
          id: data.id,
          name: data.name,
          description: data.description,
          instance: data.instance ? {
            id: data.instance.id,
            name: data.instance.name
          } : null
        },
        loot: items
      });
    } catch (error) {
      console.error(`Error fetching encounter ${req.params.id}:`, error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Failed to fetch encounter loot',
        endpoint: `/api/encounters/${req.params.id}/loot`
      });
    }
  });

  /**
   * GET /api/encounters/:id/loot/filtered
   * Get loot drops for a specific encounter (boss) filtered by class and specialization
   * Query parameters:
   *   - playerClass: Class name in Spanish (e.g., 'Guerrero', 'Mago')
   *   - specialization: Specialization name (optional, e.g., 'Armas', 'Furia', 'Protección')
   */
  router.get('/encounters/:id/loot/filtered', async (req, res) => {
    try {
      const encounterId = parseInt(req.params.id);
      const { playerClass, specialization } = req.query;
      
      if (isNaN(encounterId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid encounter ID. Must be a number.'
        });
      }

      if (!playerClass) {
        return res.status(400).json({
          success: false,
          error: 'playerClass parameter is required'
        });
      }

      // Get encounter data
      const encounterData = await apiService.getEncounter(encounterId);

      // Get all items with their details
      const itemPromises = encounterData.items && Array.isArray(encounterData.items) 
        ? encounterData.items.map(async (encounterItem) => {
        if (!encounterItem.item?.id) return null;
        
        try {
          const [itemData, mediaData] = await Promise.all([
            apiService.getItem(encounterItem.item.id),
            apiService.getItemMedia(encounterItem.item.id).catch(() => null)
          ]);

          const equippableClasses = apiService.getItemEquippableClasses(itemData);
          const iconUrl = mediaData?.assets?.find(asset => asset.key === 'icon')?.value;

          return {
            id: itemData.id,
            name: itemData.name,
            quality: encounterItem.quality?.type,
            level: itemData.level,
            item_class: itemData.item_class?.name,
            item_subclass: itemData.item_subclass?.name,
            inventory_type: itemData.inventory_type?.name,
            icon_url: iconUrl,
            equippable_classes: equippableClasses,
            stats: itemData.stats || [],
            is_equippable: itemData.is_equippable
          };
        } catch (error) {
          console.error(`Error fetching item ${encounterItem.item.id}:`, error.message);
          return null;
        }
      }) : [];

      const allItems = (await Promise.all(itemPromises)).filter(item => item !== null);

      // Filter items by class
      const filteredItems = allItems.filter(item => 
        item.equippable_classes.includes(playerClass)
      );

      res.json({
        success: true,
        encounter: {
          id: encounterData.id,
          name: encounterData.name,
          description: encounterData.description,
          instance: encounterData.instance ? {
            id: encounterData.instance.id,
            name: encounterData.instance.name
          } : null
        },
        filter: {
          playerClass: playerClass,
          specialization: specialization || 'All'
        },
        loot: filteredItems,
        total_items: allItems.length,
        filtered_items: filteredItems.length
      });
    } catch (error) {
      console.error(`Error fetching filtered loot for encounter ${req.params.id}:`, error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Failed to fetch filtered encounter loot',
        endpoint: `/api/encounters/${req.params.id}/loot/filtered`
      });
    }
  });

  /**
   * GET /api/items/:id
   * Get detailed item information including equippable classes
   */
  router.get('/items/:id', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      
      if (isNaN(itemId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID. Must be a number.'
        });
      }

      // Fetch item data and media in parallel
      const [itemData, mediaData] = await Promise.all([
        apiService.getItem(itemId),
        apiService.getItemMedia(itemId).catch(() => null) // Media might not exist for all items
      ]);

      // Get equippable classes
      const equippableClasses = apiService.getItemEquippableClasses(itemData);

      // Extract icon URL
      const iconUrl = mediaData?.assets?.find(asset => asset.key === 'icon')?.value;

      res.json({
        success: true,
        item: {
          id: itemData.id,
          name: itemData.name,
          quality: itemData.quality?.type,
          level: itemData.level,
          required_level: itemData.required_level,
          item_class: itemData.item_class?.name,
          item_subclass: itemData.item_subclass?.name,
          inventory_type: itemData.inventory_type?.name,
          purchase_price: itemData.purchase_price,
          sell_price: itemData.sell_price,
          max_count: itemData.max_count,
          is_equippable: itemData.is_equippable,
          is_stackable: itemData.is_stackable,
          preview_item: itemData.preview_item,
          icon_url: iconUrl,
          equippable_classes: equippableClasses,
          stats: itemData.stats || [],
          spells: itemData.spells || [],
          description: itemData.description
        }
      });
    } catch (error) {
      console.error(`Error fetching item ${req.params.id}:`, error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Failed to fetch item details',
        endpoint: `/api/items/${req.params.id}`
      });
    }
  });

  /**
   * GET /api/cache/stats
   * Get cache statistics (for debugging)
   */
  router.get('/cache/stats', (req, res) => {
    const stats = apiService.getCacheStats();
    res.json({
      success: true,
      cache: stats
    });
  });

  /**
   * DELETE /api/cache
   * Clear all cache
   */
  router.delete('/cache', (req, res) => {
    apiService.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  });

  return router;
}

module.exports = initializeRoutes;
