// ==========================================
// DATOS CENTRALIZADOS - Larancio Loot Manager
// ==========================================

// Información de Bosses (Nombres traducidos al español)
// Nueva banda
const bosses = [
    { id: 1, name: 'Nek\'zali, la Enroscadora de Almas', description: 'Jefe de la nueva banda.' },
    { id: 2, name: 'Centinelas Sepultados', description: 'Jefe de la nueva banda.' },
    { id: 3, name: 'Los Exploradores Perdidos', description: 'Jefe de la nueva banda.' },
    { id: 4, name: 'Vashnik el Maligno', description: 'Jefe de la nueva banda.' },
    { id: 5, name: 'Sszorak', description: 'Jefe de la nueva banda.' },
    { id: 6, name: 'Los Colmillos Gemelos', description: 'Jefe de la nueva banda.' },
    { id: 7, name: 'El Altar Enroscado', description: 'Jefe de la nueva banda.' },
    { id: 8, name: 'Ula\'tek', description: 'Jefe final de la nueva banda.' },
    { id: 9, name: 'Nymrissa', description: 'Jefe boss de mundo.' }
    
];

// ==========================================
// PLACEHOLDER LOOT – HELPERS Y CONSTANTES
// ==========================================

// Tipos de armadura soportados (deben coincidir con las claves de armorCompatibility)
const PLACEHOLDER_ARMOR_TYPES = ['Cloth Armor', 'Leather Armor', 'Mail Armor', 'Plate Armor'];

// Slots de armadura para los ítems placeholder
const PLACEHOLDER_ARMOR_SLOTS = ['Head', 'Chest', 'Legs', 'Hands', 'Feet', 'Shoulders', 'Wrists', 'Waist', 'Back'];

// Traducciones al español de los tipos de armadura
const ARMOR_TYPE_ES = {
    'Cloth Armor':   'Armadura de Tela',
    'Leather Armor': 'Armadura de Cuero',
    'Mail Armor':    'Armadura de Malla',
    'Plate Armor':   'Armadura de Placas'
};

// Traducciones al español de los slots de armadura
const ARMOR_SLOT_ES = {
    'Head':      'Cabeza',
    'Chest':     'Torso',
    'Legs':      'Piernas',
    'Hands':     'Manos',
    'Feet':      'Pies',
    'Shoulders': 'Hombros',
    'Wrists':    'Muñecas',
    'Waist':     'Cintura',
    'Back':      'Espalda'
};

// Categorías adicionales de loot placeholder: armas, escudo, accesorios y trinkets
const PLACEHOLDER_EXTRA_CATEGORIES = [
    { type: 'Two-Handed Weapon', slot: 'Two Hand',  label: 'Arma Dos Manos' },
    { type: 'One-Handed Weapon', slot: 'Main Hand', label: 'Arma Una Mano'  },
    { type: 'Shield',            slot: 'Off Hand',  label: 'Escudo'         },
    { type: 'Off Hand',          slot: 'Off Hand',  label: 'Off Hand'       },
    { type: 'Accessories',       slot: 'Neck',      label: 'Collar'         },
    { type: 'Accessories',       slot: 'Ring',      label: 'Anillo'         },
    { type: 'Trinket',           slot: 'Trinket',   label: 'Abalorio'       }
];

/**
 * Genera un array de ítems placeholder para un boss dado.
 * Cubre todos los tipos de armadura soportados, armas principales,
 * escudo, accesorios (cuello y anillo) y trinkets.
 * TODO: Replace placeholder loot with real loot tables per boss.
 * @param {Object} boss - Objeto con { id: number, name: string }
 * @returns {Array} Array de ítems placeholder
 */
function generatePlaceholderLootForBoss(boss) {
    const items = [];

    // Armaduras: una entrada por tipo de armadura × slot
    PLACEHOLDER_ARMOR_TYPES.forEach(armorType => {
        PLACEHOLDER_ARMOR_SLOTS.forEach(slot => {
            items.push({
                name: `${ARMOR_TYPE_ES[armorType] || armorType} ${ARMOR_SLOT_ES[slot] || slot}`,
                type: armorType,
                slot,
                ilvlBase: 645,
                rarity: 'Épico',
                description: `Ítem placeholder para ${boss.name}. Pendiente de datos reales.`,
                wowheadLink: 'https://www.wowhead.com/item=0',
                bossId: boss.id
            });
        });
    });

    // Armas, escudo, accesorios y trinkets
    PLACEHOLDER_EXTRA_CATEGORIES.forEach(({ type, slot, label }) => {
        items.push({
            name: label,
            type,
            slot,
            ilvlBase: 645,
            rarity: 'Épico',
            description: `Ítem placeholder para ${boss.name}. Pendiente de datos reales.`,
            wowheadLink: 'https://www.wowhead.com/item=0',
            bossId: boss.id
        });
    });

    return items;
}

// Loot por boss (se irá completando con los ítems de cada raid)
// TODO: Replace placeholder loot with real loot tables per boss
const lootByBoss = Object.fromEntries(
    bosses.map(boss => [boss.id, generatePlaceholderLootForBoss(boss)])
);

// Array plano optimizado para selects y búsquedas
const lootItems = Object.values(lootByBoss).flat();

// Compatibilidad de armor actualizada
const armorCompatibility = {
    'Cloth Armor': ['Mago', 'Brujo', 'Sacerdote'],
    'Leather Armor': ['Druida', 'Pícaro', 'Monje', 'Cazador de Demonios'],
    'Mail Armor': ['Cazador', 'Chamán', 'Evocador'],
    'Plate Armor': ['Guerrero', 'Paladín', 'Caballero de la Muerte'],
    // Armas genéricas (usadas por los ítems placeholder y como fallback)
    'Two-Handed Weapon': ['Guerrero', 'Paladín', 'Cazador', 'Chamán', 'Monje', 'Druida', 'Caballero de la Muerte', 'Mago', 'Brujo', 'Sacerdote', 'Evocador'],
    'One-Handed Weapon': ['Guerrero', 'Paladín', 'Mago', 'Brujo', 'Sacerdote', 'Pícaro', 'Monje', 'Cazador', 'Druida', 'Caballero de la Muerte', 'Chamán', 'Evocador', 'Cazador de Demonios'],
    'Shield': ['Guerrero', 'Paladín', 'Chamán'],
    'Off Hand': ['Mago', 'Brujo', 'Sacerdote', 'Chamán', 'Druida', 'Paladín', 'Monje', 'Evocador'],
    // Tipos de arma específicos (para ítems reales provenientes de la API de Blizzard)
    // Nota: Pícaro, Monje y Druida no pueden usar Espada de Dos Manos en The War Within
    'One-Handed Sword': ['Guerrero', 'Paladín', 'Brujo', 'Sacerdote', 'Pícaro', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'One-Handed Axe': ['Guerrero', 'Paladín', 'Chamán', 'Caballero de la Muerte'],
    'One-Handed Mace': ['Guerrero', 'Paladín', 'Chamán', 'Sacerdote', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'Two-Handed Sword': ['Guerrero', 'Paladín', 'Caballero de la Muerte'],
    'Two-Handed Axe': ['Guerrero', 'Chamán', 'Caballero de la Muerte'],
    'Two-Handed Mace': ['Guerrero', 'Paladín', 'Chamán', 'Druida', 'Caballero de la Muerte'],
    'Polearm': ['Guerrero', 'Paladín', 'Cazador', 'Chamán', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'Dagger': ['Guerrero', 'Paladín', 'Mago', 'Brujo', 'Sacerdote', 'Pícaro', 'Monje', 'Cazador', 'Druida', 'Caballero de la Muerte', 'Evocador'],
    'Staff': ['Mago', 'Brujo', 'Sacerdote', 'Monje', 'Druida', 'Evocador'],
    'Bow': ['Cazador'],
    'Crossbow': ['Cazador'],
    'Gun': ['Cazador'],
    'Wand': ['Mago', 'Brujo', 'Sacerdote'],
    'Fist Weapon': ['Pícaro', 'Monje', 'Cazador'],
    'Ranged': ['Cazador'],
    'Trinket': ['Todas'],
    'Accessories': ['Todas'],
    'Tier Set': ['Todas'],
    'Tier Set Curio': ['Todas'],
    'Cosmetic': ['Todas'],
    'Material': ['Todas'],
    'Pattern': ['Todas'],
    'Plans': ['Todas'],
    'Formula': ['Todas'],
    'Consumable': ['Todas'],
    'Currency': ['Todas'],
    'Toy': ['Todas'],
    'Mount': ['Todas']
};

// Compatibilidad específica de Trinkets por nombre
const trinketCompatibility = {
    'Núcleo Arcano erradicador': ['Paladín', 'Guerrero', 'Caballero de la Muerte'],
    'Antena astral': ['Todas'],
    'Seda viviente de Loom\'ithar': ['Todas'],
    'Latigazo místico de Naazindhri': ['Todas'],
    'Abrazo de vinculador de almas': ['Paladín', 'Guerrero', 'Druida', 'Caballero de la Muerte', 'Cazador', 'Pícaro', 'Chamán', 'Monje', 'Cazador de Demonios'],
    'Forja ritual de Araz': ['Todas'],
    'Sigilo de la caza cósmica': ['Todas'],
    'Marca de ira incesante': ['Todas'],
    'Núcleo de Vacío diamantino': ['Todas'],
    'Prisma abisal implacable': ['Todas'],
    'Orden del rey-nexo': ['Todas'],
    'Proyector pérfido': ['Todas'],
    'Núcleo del Devoratodo': ['Todas'],
    'Alaridos de un cielo olvidado': ['Todas']
};

// Compatibilidad detallada de Trinkets por especializaciones
// NOTA: Estos son los trinkets que tienen restricciones específicas por especialización
// Los trinkets restantes que aparecen en trinketCompatibility con ['Todas'] no tienen restricciones de especialización
const trinketSpecializationCompatibility = {
    'Abrazo de vinculador de almas': {
        'Paladín': ['Protección', 'Sagrado'],
        'Guerrero': ['Armas', 'Protección', 'Furia'],
        'Druida': ['Guardián', 'Restauración'],
        'Caballero de la Muerte': ['Sangre', 'Escarcha', 'Sin-Muerto'],
        'Cazador': ['Bestias', 'Puntería', 'Supervivencia'],
        'Pícaro': ['Asesinato', 'Subterfugio', 'Forajido'],
        'Chamán': ['Mejora'],
        'Monje': ['Maestro Cervecero', 'Viajero del viento'],
        'Cazador de Demonios': ['Devastación', 'Venganza', 'Devorador']
    },
    'Latigazo místico de Naazindhri': {
        'Mago': ['Fuego', 'Escarcha', 'Arcano'],
        'Paladín': ['Sagrado'],
        'Druida': ['Restauración', 'Equilibrio'],
        'Sacerdote': ['Disciplina', 'Sagrado', 'Sombra'],
        'Chamán': ['Restauración', 'Elemental'],
        'Brujo': ['Afligión', 'Demonología', 'Destrucción'],
        'Monje': ['Tejedor de Niebla'],
        'Evocador': ['Devastación', 'Preservación', 'Aumento']
    },
    'Sigilo de la caza cósmica': {
        'Druida': ['Guardián', 'Feral'],
        'Cazador': ['Bestias', 'Puntería', 'Supervivencia'],
        'Pícaro': ['Asesinato', 'Subterfugio', 'Forajido'],
        'Chamán': ['Mejora'],
        'Monje': ['Maestro Cervecero', 'Viajero del viento'],
        'Cazador de Demonios': ['Devastación', 'Venganza', 'Devorador']
    },
    'Marca de ira incesante': {
        'Druida': ['Guardián'],
        'Monje': ['Maestro Cervecero'],
        'Cazador de Demonios': ['Venganza'],
        'Paladín': ['Protección'],
        'Guerrero': ['Protección'],
        'Caballero de la Muerte': ['Sangre']
    },
    'Núcleo de Vacío diamantino': {
        'Mago': ['Fuego', 'Escarcha', 'Arcano'],
        'Sacerdote': ['Disciplina', 'Sagrado', 'Sombra'],
        'Druida': ['Restauración', 'Equilibrio'],
        'Brujo': ['Aflicción', 'Demonología', 'Destrucción'],
        'Chamán': ['Elemental', 'Restauración'],
        'Monje': ['Tejedor de Niebla'],
        'Paladín': ['Sagrado'],
        'Evocador': ['Devastación', 'Preservación', 'Aumento']
    },
    'Orden del rey-nexo': {
        'Evocador': ['Preservación'],
        'Monje': ['Tejedor de Niebla'],
        'Paladín': ['Sagrado'],
        'Chamán': ['Restauración'],
        'Sacerdote': ['Disciplina', 'Sagrado'],
        'Druida': ['Restauración']
    },
    ' Núcleo del Devoratodo': {
        'Druida': ['Guardián'],
        'Monje': ['Maestro Cervecero'],
        'Cazador de Demonios': ['Venganza'],
        'Paladín': ['Protección'],
        'Guerrero': ['Protección'],
        'Caballero de la Muerte': ['Sangre']
    }
    // TODO: Agregar más trinkets según datos de Wowhead:
    // - Forja ritual de Araz (ID: 242402)
    // - Alaridos de un cielo olvidado (ID: 242399)
    // - Antena astral (ID: 242395) - Confirmado: Para todas las clases
    // - Seda viviente de Loom'ithar (ID: 242393) - Confirmado: Para todas las clases
};

// Especializaciones de tanque por clase (solo las specs que ejercen el rol de tanque)
const TANK_SPECIALIZATIONS = {
    'Guerrero': ['Protección'],
    'Paladín': ['Protección'],
    'Caballero de la Muerte': ['Sangre'],
    'Druida': ['Guardián'],
    'Monje': ['Maestro Cervecero'],
    'Cazador de Demonios': ['Venganza']
};

// Especializaciones por clase (World of Warcraft - Nombres Oficiales en Español)
const classSpecializations = {
    'Guerrero': ['Armas', 'Protección', 'Furia'],
    'Mago': ['Fuego', 'Escarcha', 'Arcano'],
    'Sacerdote': ['Disciplina', 'Sagrado', 'Sombra'],
    'Paladín': ['Protección', 'Retribución', 'Sagrado'],
    'Cazador': ['Bestias', 'Puntería', 'Supervivencia'],
    'Brujo': ['Aflicción', 'Demonología', 'Destrucción'],
    'Chamán': ['Elemental', 'Mejora', 'Restauración'],
    'Druida': ['Feral', 'Guardián', 'Restauración', 'Equilibrio'],
    'Pícaro': ['Asesinato', 'Sutileza', 'Forajido'],
    'Caballero de la Muerte': ['Sangre', 'Escarcha', 'Profano'],
    'Monje': ['Maestro Cervecero', 'Viajero del viento', 'Tejedor de Niebla'],
    'Cazador de Demonios': ['Devastación', 'Venganza', 'Devorador'],
    'Evocador': ['Devastación', 'Preservación', 'Aumento']
};

// Índices de búsqueda para mejor rendimiento
const itemIndexByName = new Map();
lootItems.forEach(item => {
    itemIndexByName.set(item.name, item);
});

const bossIndexById = new Map();
bosses.forEach(boss => {
    bossIndexById.set(boss.id, boss);
});
