// DATOS CARGADOS DESDE data.js - Ver ese archivo para la definición de bosses, lootByBoss, armorCompatibility, etc.

// Entidades (inicializadas vacías, se cargarán desde Firebase)
let characters = [];
let assignments = [];

// ===== FIREBASE HELPERS =====

/**
 * Extract data array from Firestore document snapshot
 * Firestore documents store arrays in a 'data' field: { data: [...] }
 * @param {DocumentSnapshot} docSnap - Firestore document snapshot
 * @returns {Array} The data array or empty array if not found
 */
function extractDataArray(docSnap) {
    if (!docSnap || !docSnap.exists()) {
        console.log('extractDataArray: Document does not exist or is null');
        return [];
    }
    
    try {
        const docData = docSnap.data();
        
        if (!docData) {
            console.warn('extractDataArray: Document exists but data() returned null/undefined');
            return [];
        }
        
        const dataField = docData.data;
        
        // Validate that the data field is actually an array
        if (!Array.isArray(dataField)) {
            console.warn('extractDataArray: Invalid data format - expected array, got:', typeof dataField);
            return [];
        }
        
        return dataField;
    } catch (error) {
        console.error('extractDataArray: Error extracting data array:', error);
        return [];
    }
}

/**
 * Check if Firebase Firestore is ready and initialized
 * @returns {boolean}
 */
function isFirebaseReady() {
    return !!(window.firestoreDB && window.firestoreDoc && window.firestoreSetDoc && window.firestoreGetDoc && window.firestoreOnSnapshot);
}

// ===== UTILIDADES Y HELPERS =====

/**
 * Helper: Crear opción DOM
 * @param {string|number} value - Valor de la opción
 * @param {string} text - Texto visible
 * @returns {HTMLOptionElement}
 */
function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
}

/**
 * Helper: Limpiar y popular un select
 * @param {string} selectId - ID del elemento select
 * @param {Array} items - Items a agregar
 * @param {Function} getText - Función para obtener texto del item
 */
function populateSelect(selectId, items, getText) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    items.forEach(item => {
        select.appendChild(createOption(item.value, getText(item)));
    });
}

/**
 * Helper: Obtener datos del formulario de personaje
 * @returns {Object} {name, class, specialization}
 */
function getCharacterFormData() {
    return {
        name: document.getElementById('nombre').value,
        class: document.getElementById('clase').value,
        specialization: document.getElementById('especializacion').value
    };
}

/**
 * Helper: Validar datos de personaje
 * @param {Object} charData
 * @returns {string|null} Mensaje de error o null si es válido
 */
function validateCharacterData(charData) {
    if (!charData.name || !charData.class || !charData.specialization) {
        return 'Todos los campos son requeridos';
    }
    return null;
}

/**
 * Helper: Validar compatibilidad de item con clase
 * @param {Object} item
 * @param {string} className
 * @returns {boolean}
 */
function isItemCompatibleWithClass(item, className, characterSpec = null) {
    // Verificar si es un trinket con compatibilidad específica de especializaciones
    if (item.type === 'Trinket' && trinketSpecializationCompatibility[item.name] && characterSpec) {
        const specCompat = trinketSpecializationCompatibility[item.name];
        
        // Si la clase no tiene especializaciones definidas, usa compatibilidad a nivel de clase
        if (!specCompat[className]) {
            const compatList = trinketCompatibility[item.name] || [];
            return compatList.includes(className) || compatList.includes('Todas');
        }
        
        // Verificar si la especialización está en la lista de compatibles
        return specCompat[className].includes(characterSpec);
    }
    
    // Verificar si es un trinket con compatibilidad simple (solo clases)
    if (item.type === 'Trinket' && trinketCompatibility[item.name]) {
        const compatList = trinketCompatibility[item.name];
        return compatList.includes(className) || compatList.includes('Todas');
    }
    
    // Para otros tipos de items, usar la compatibilidad de armadura estándar
    const compatList = armorCompatibility[item.type] || [];
    return compatList.includes(className) || compatList.includes('Todas');
}

/**
 * Helper: Calcular iLvl final según dificultad
 * @param {number} baseLvl - ilvl base
 * @param {string} difficulty
 * @returns {number}
 */
function calculateILvl(baseLvl, difficulty) {
    const iLvlModifiers = { 'Heroic': 13, 'Mythic': 26 };
    return baseLvl + (iLvlModifiers[difficulty] || 0);
}

/**
 * Helper: Renderizar opción de select con formato
 */
function formatSelectOption(text, parentText) {
    return parentText ? `${text} (de ${parentText})` : text;
}

/**
 * Helper: Actualizar especialización según clase seleccionada
 * @param {string} className - Nombre de la clase
 */
function updateSpecializationsForClass(className) {
    const especSelect = document.getElementById('especializacion');
    especSelect.innerHTML = '';
    
    if (!className) {
        especSelect.appendChild(createOption('', 'Selecciona clase primero'));
        return;
    }
    
    const specs = classSpecializations[className] || [];
    if (specs.length === 0) {
        especSelect.appendChild(createOption('', 'No hay especializaciones'));
        return;
    }
    
    specs.forEach(spec => {
        especSelect.appendChild(createOption(spec, spec));
    });
}

// ===== FUNCIONES PRINCIPALES =====

function updateCharacterList() {
    const lista = document.getElementById('lista-personajes');
    lista.innerHTML = '';
    
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('updateCharacterList: characters is not an array, type:', typeof characters);
        characters = []; // Reset to empty array
        return;
    }
    
    characters.forEach((char, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${char.name} - ${char.class} (${char.specialization}) 
            <button class="btn-edit-char" data-index="${index}">Editar</button>
            <button class="btn-delete-char" data-index="${index}">Eliminar</button>`;
        lista.appendChild(li);
    });
    updateSelects();
    updateFilters();
}

function editCharacter(index) {
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('editCharacter: characters is not an array, type:', typeof characters);
        alert('Error: Los datos de personajes no están disponibles.');
        return;
    }
    
    const char = characters[index];
    if (!char) {
        console.error('editCharacter: Character not found at index:', index);
        return;
    }
    
    document.getElementById('nombre').value = char.name;
    document.getElementById('clase').value = char.class;
    
    // Actualizar especializaciones según clase y luego seleccionar la actual
    updateSpecializationsForClass(char.class);
    document.getElementById('especializacion').value = char.specialization;
    
    // Update button text to indicate edit mode
    document.getElementById('btn-submit-personaje').textContent = 'Guardar Cambios';
    
    document.getElementById('form-personaje').onsubmit = function(e) {
        e.preventDefault();
        const charData = getCharacterFormData();
        const error = validateCharacterData(charData);
        if (error) return alert(error);
        
        characters[index] = charData;
        saveData();
        invalidateTableCache();
        updateCharacterList();
        updateTable();
        this.onsubmit = addCharacter;
        this.reset();
        // Reset button text back to add mode
        document.getElementById('btn-submit-personaje').textContent = 'Añadir Personaje';
    };
}

function deleteCharacter(index) {
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('deleteCharacter: characters is not an array, type:', typeof characters);
        alert('Error: Los datos de personajes no están disponibles.');
        return;
    }
    
    // Validate that assignments is an array
    if (!Array.isArray(assignments)) {
        console.error('deleteCharacter: assignments is not an array, type:', typeof assignments);
        assignments = [];
    }
    
    const charName = characters[index]?.name;
    assignments = assignments.filter(a => a.character !== charName);
    characters.splice(index, 1);
    saveData();
    invalidateTableCache();
    updateCharacterList();
    updateTable();
}

function addCharacter(e) {
    e.preventDefault();
    const charData = getCharacterFormData();
    const error = validateCharacterData(charData);
    if (error) return alert(error);
    
    // Validate that characters is an array before using .some()
    if (!Array.isArray(characters)) {
        console.error('addCharacter: characters is not an array, type:', typeof characters);
        characters = [];
    }
    
    if (characters.some(c => c.name === charData.name)) {
        return alert('Nombre duplicado');
    }
    
    characters.push(charData);
    saveData();
    invalidateTableCache();
    updateCharacterList();
    
    // Resetear formulario y especialización
    this.reset();
    updateSpecializationsForClass(''); // Limpiar especialización
}

function updateBossSelect() {
    const select = document.getElementById('select-jefe');
    select.innerHTML = '';
    bosses.forEach(boss => {
        select.appendChild(createOption(boss.id, boss.name));
    });
}

function showLoot(bossId) {
    const lista = document.getElementById('lista-loot');
    lista.innerHTML = '';
    const filtroTipo = document.getElementById('filtro-tipo-loot').value;
    const items = (lootByBoss[bossId] || []).filter(item => !filtroTipo || item.type === filtroTipo);
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('tooltip');
        li.textContent = item.name;
        
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltiptext');
        tooltip.innerHTML = `
            <strong>Tipo:</strong> ${item.type}<br>
            <strong>Slot:</strong> ${item.slot}<br>
            <strong>ILVL Base:</strong> ${item.ilvlBase}<br>
            <strong>Rareza:</strong> ${item.rarity}<br>
            <strong>Descripción:</strong> ${item.description}<br>
            <a href="${item.wowheadLink}" target="_blank" style="color: var(--verde-epico);">Ver en Wowhead</a>
        `;
        li.appendChild(tooltip);
        lista.appendChild(li);
    });
}

function updateSelects() {
    const selectPersonaje = document.getElementById('select-personaje');
    const selectJefe = document.getElementById('select-jefe-asignacion');
    const selectItem = document.getElementById('select-item');
    
    // Llenar selects de personajes
    selectPersonaje.innerHTML = '<option value="">Selecciona Personaje</option>';
    
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('updateSelects: characters is not an array, type:', typeof characters);
        characters = []; // Reset to empty array
    }
    
    characters.forEach(char => {
        selectPersonaje.appendChild(createOption(char.name, char.name));
    });
    
    // Llenar selects de jefes
    selectJefe.innerHTML = '<option value="">Selecciona Jefe</option>';
    bosses.forEach(boss => {
        selectJefe.appendChild(createOption(boss.id, boss.name));
    });
    
    // Llenar selects de items (sin filtro inicialmente)
    selectItem.innerHTML = '<option value="">Selecciona Item</option>';
    selectItem.disabled = true;
    
    filterItemsByCharacter();
}

/**
 * Helper: Obtener tipos de items equipables (excluye cosméticos, materiales, etc)
 * @returns {Set} Conjunto de tipos de items que se pueden mostrar
 */
function getEquippableItemTypes() {
    return new Set([
        'Cloth Armor',
        'Leather Armor',
        'Mail Armor',
        'Plate Armor',
        'Shield',
        'One-Handed Sword',
        'One-Handed Axe',
        'One-Handed Mace',
        'Two-Handed Sword',
        'Two-Handed Axe',
        'Two-Handed Mace',
        'Polearm',
        'Dagger',
        'Staff',
        'Bow',
        'Crossbow',
        'Gun',
        'Wand',
        'Fist Weapon',
        'Ranged',
        'Trinket',
        'Accessories',
        'Tier Set'
    ]);
}

function filterItemsByCharacter() {
    const selectPersonaje = document.getElementById('select-personaje');
    const selectJefe = document.getElementById('select-jefe-asignacion');
    const selectItem = document.getElementById('select-item');
    const charName = selectPersonaje.value;
    const bossId = selectJefe.value;
    
    selectItem.innerHTML = '<option value="">Selecciona Item</option>';
    selectItem.disabled = false;
    
    // Si no hay personaje seleccionado, desactivar el select
    if (!charName) {
        selectItem.innerHTML = '<option value="">Primero selecciona un personaje</option>';
        selectItem.disabled = true;
        return;
    }
    
    // Si no hay jefe seleccionado, desactivar el select
    if (!bossId) {
        selectItem.innerHTML = '<option value="">Primero selecciona un jefe</option>';
        selectItem.disabled = true;
        return;
    }
    
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('filterItemsByCharacter: characters is not an array, type:', typeof characters);
        selectItem.innerHTML = '<option value="">Error: Datos no disponibles</option>';
        selectItem.disabled = true;
        return;
    }
    
    const char = characters.find(c => c.name === charName);
    if (!char) return;
    
    // Obtener tipos equipables
    const equippableTypes = getEquippableItemTypes();
    
    // Filtrar items compatibles con la clase del personaje Y del jefe seleccionado Y que sean equipables
    const bossItems = lootByBoss[bossId] || [];
    const compatibleItems = bossItems.filter(item => 
        equippableTypes.has(item.type) && 
        isItemCompatibleWithClass(item, char.class, char.specialization)
    );
    
    if (compatibleItems.length === 0) {
        selectItem.appendChild(createOption('', 'No hay ítems compatibles para esta clase en este jefe'));
        return;
    }
    
    compatibleItems.forEach(item => {
        const bossName = bossIndexById.get(item.bossId)?.name || 'Unknown';
        selectItem.appendChild(createOption(item.name, formatSelectOption(item.name, bossName)));
    });
}

function updateFilters() {
    const filtroClase = document.getElementById('filtro-clase');
    const filtroJefe = document.getElementById('filtro-jefe');
    
    // Resetear filtros
    filtroClase.innerHTML = '<option value="">Todas</option>';
    filtroJefe.innerHTML = '<option value="">Todos</option>';
    
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('updateFilters: characters is not an array, type:', typeof characters);
        characters = []; // Reset to empty array
    }
    
    // Agregar clases únicas
    const classes = [...new Set(characters.map(c => c.class))];
    classes.forEach(cl => {
        filtroClase.appendChild(createOption(cl, cl));
    });
    
    // Agregar bosses
    bosses.forEach(b => {
        filtroJefe.appendChild(createOption(b.id, b.name));
    });
}

function assignItem() {
    const charName = document.getElementById('select-personaje').value;
    const itemName = document.getElementById('select-item').value;
    const dificultad = document.getElementById('select-dificultad').value;
    
    // Validación
    if (!charName || !itemName || !dificultad) {
        return alert('Selecciona todos los campos');
    }
    
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('assignItem: characters is not an array, type:', typeof characters);
        alert('Error: Los datos de personajes no están disponibles.');
        return;
    }
    
    // Validate that assignments is an array
    if (!Array.isArray(assignments)) {
        console.error('assignItem: assignments is not an array, type:', typeof assignments);
        assignments = [];
    }
    
    const item = itemIndexByName.get(itemName);
    const char = characters.find(c => c.name === charName);
    
    // Validar que el personaje exista
    if (!char) {
        console.error('assignItem: Character not found in characters array');
        return alert('Error: Personaje no encontrado. Por favor intenta de nuevo.');
    }
    
    // Validar que el item exista
    if (!item) {
        console.error('assignItem: Item not found in itemIndexByName map');
        return alert('Error: Item no encontrado. Por favor intenta de nuevo.');
    }
    
    if (!isItemCompatibleWithClass(item, char.class, char.specialization)) {
        return alert('Este item no es compatible con la clase o especialización del personaje');
    }
    
    // Crear asignación con iLvl calculado
    const assignment = {
        character: charName,
        item: itemName,
        boss: item.bossId,
        dificultad,
        ilvl: calculateILvl(item.ilvlBase, dificultad),
        tipo: 'Necesidad',
        note: ''
    };
    
    assignments.push(assignment);
    saveData();
    invalidateTableCache();
    updateTable();
    
    // Resetear selects para nueva asignación limpia
    document.getElementById('select-personaje').value = '';
    document.getElementById('select-jefe-asignacion').value = '';
    document.getElementById('select-item').value = '';
    document.getElementById('select-dificultad').value = 'Normal';
    filterItemsByCharacter(); // Actualizar lista de items disponibles
}

// Caché para optimización de tabla
let tableCache = {
    lastFilters: null,
    lastCharacterCount: 0,
    lastAssignmentCount: 0,
    cachedRows: new Map() // key: charName, value: { html, timestamp }
};

/**
 * Helper: Resetear caché de tabla
 * Llamar cuando se añaden/eliminan personajes o asignaciones
 */
function invalidateTableCache() {
    tableCache.lastFilters = null;
    tableCache.lastCharacterCount = 0;
    tableCache.lastAssignmentCount = 0;
    tableCache.cachedRows.clear();
}

/**
 * Helper: Obtener key de filtro para caching
 * @returns {string} Key que representa el estado actual de filtros
 */
function getFilterKey() {
    return JSON.stringify({
        clase: document.getElementById('filtro-clase').value,
        jefe: document.getElementById('filtro-jefe').value,
        dificultad: document.getElementById('filtro-dificultad').value
    });
}

/**
 * Helper: Generar HTML de fila de personaje
 * @param {Object} char - Objeto de personaje
 * @param {Array} assigned - Asignaciones filtradas para este personaje
 * @returns {HTMLTableRowElement}
 */
function generateCharacterRow(char, assigned) {
    const row = document.createElement('tr');
    
    // Create a map of assignment to global index for O(1) lookups
    // This prevents O(n²) complexity from repeated findIndex calls
    const assignmentIndexMap = new Map();
    assigned.forEach(a => {
        const globalIndex = assignments.findIndex(assign => assign === a);
        assignmentIndexMap.set(a, globalIndex);
    });
    
    // Generar HTML de items asignados con caching de búsquedas
    const assignedHtml = assigned.map((a) => {
        const item = itemIndexByName.get(a.item);
        const bossName = bossIndexById.get(a.boss)?.name || 'Unknown';
        const description = item ? item.description : 'Item no encontrado';
        
        // Get the pre-calculated global index
        const globalIndex = assignmentIndexMap.get(a);
        
        // Validate that we found a valid index
        if (globalIndex === undefined || globalIndex === -1) {
            console.error(`generateCharacterRow: Could not find global index for assignment ${a.item} for ${char.name}`);
            return ''; // Skip this assignment if index not found
        }
        
        return `
            <span class="tooltip">
                ${a.item} (${a.dificultad}, ilvl ${a.ilvl})
                <span class="tooltiptext">${description}</span>
            </span> (de ${bossName})
            <button class="btn-delete-assign" data-index="${globalIndex}">Eliminar</button><br>
        `;
    }).join('');
    
    // Generar HTML de notas y tipo
    const notesHtml = assigned.map((a) => {
        // Get the pre-calculated global index
        const globalIndex = assignmentIndexMap.get(a);
        
        // Validate that we found a valid index
        if (globalIndex === undefined || globalIndex === -1) {
            console.error(`generateCharacterRow: Could not find global index for assignment ${a.item} for ${char.name}`);
            return ''; // Skip this assignment if index not found
        }
        
        return `
            <div style="margin-bottom: 8px;">
                <select class="tipo-select" data-index="${globalIndex}" style="padding: 4px; margin-right: 5px;">
                    <option value="Necesidad" ${a.tipo === 'Necesidad' ? 'selected' : ''}>Necesidad</option>
                    <option value="Codicia" ${a.tipo === 'Codicia' ? 'selected' : ''}>Codicia</option>
                </select>
                <input type="text" class="note-input" value="${a.note || ''}" placeholder="Nota adicional" data-index="${globalIndex}" maxlength="50" style="padding: 4px;">
            </div>
        `;
    }).join('');
    
    row.innerHTML = `
        <td>${char.name}</td>
        <td>${char.class} (${char.specialization})</td>
        <td>${assignedHtml || 'Ninguno'}</td>
        <td>${assigned.length > 0 ? 'Varios' : ''}</td>
        <td>${notesHtml || ''}</td>
    `;
    
    return row;
}

function updateTable() {
    const tbody = document.getElementById('tabla-asignaciones').querySelector('tbody');
    const currentFilterKey = getFilterKey();
    const filtroClase = document.getElementById('filtro-clase').value;
    const filtroJefe = document.getElementById('filtro-jefe').value;
    const filtroDificultad = document.getElementById('filtro-dificultad').value;
    
    // Validate that characters is an array
    if (!Array.isArray(characters)) {
        console.error('updateTable: characters is not an array, type:', typeof characters);
        characters = []; // Reset to empty array
        tbody.innerHTML = '';
        return;
    }
    
    // Verify assignments is also an array
    if (!Array.isArray(assignments)) {
        console.error('updateTable: assignments is not an array, type:', typeof assignments);
        assignments = []; // Reset to empty array
        tbody.innerHTML = '';
        return;
    }
    
    // Verificar si la tabla necesita reconstrucción
    const filterChanged = tableCache.lastFilters !== currentFilterKey;
    const dataChanged = 
        tableCache.lastCharacterCount !== characters.length ||
        tableCache.lastAssignmentCount !== assignments.length;
    
    // Si los datos base no cambiaron y solo cambiaron filtros, actualización parcial
    if (!dataChanged && filterChanged) {
        // Actualización parcial: mantener estructura, actualizar visibilidad
        tbody.innerHTML = '';
        
        const filteredCharacters = characters.filter(char => 
            !filtroClase || char.class === filtroClase
        );
        
        filteredCharacters.forEach((char) => {
            const assigned = assignments.filter(a => 
                a.character === char.name && 
                (!filtroJefe || a.boss == filtroJefe) && 
                (!filtroDificultad || a.dificultad === filtroDificultad)
            );
            
            // Solo mostrar si hay asignaciones o si no hay filtros aplicados
            if (assigned.length > 0 || (!filtroClase && !filtroJefe && !filtroDificultad)) {
                tbody.appendChild(generateCharacterRow(char, assigned));
            }
        });
    } else if (dataChanged || !tableCache.lastFilters) {
        // Reconstrucción completa solo si los datos cambiaron
        tbody.innerHTML = '';
        
        const filteredCharacters = characters.filter(char => 
            !filtroClase || char.class === filtroClase
        );
        
        filteredCharacters.forEach((char) => {
            const assigned = assignments.filter(a => 
                a.character === char.name && 
                (!filtroJefe || a.boss == filtroJefe) && 
                (!filtroDificultad || a.dificultad === filtroDificultad)
            );
            
            // Solo mostrar si hay asignaciones o si no hay filtros aplicados
            if (assigned.length > 0 || (!filtroClase && !filtroJefe && !filtroDificultad)) {
                tbody.appendChild(generateCharacterRow(char, assigned));
            }
        });
        
        // Actualizar caché
        tableCache.lastCharacterCount = characters.length;
        tableCache.lastAssignmentCount = assignments.length;
    }
    
    // Actualizar estado de filtros
    tableCache.lastFilters = currentFilterKey;
}

function updateNote(assignIndex, note) {
    // Validate that assignments is an array
    if (!Array.isArray(assignments)) {
        console.error('updateNote: assignments is not an array, type:', typeof assignments);
        return;
    }
    
    if (assignIndex >= 0 && assignIndex < assignments.length) {
        assignments[assignIndex].note = note;
        // Solo guardar datos sin recrear tabla (optimización: nota es solo visual, sin impacto en filtros)
        saveData();
    } else {
        console.error(`updateNote: Invalid index ${assignIndex}, assignments length: ${assignments.length}`);
    }
    // No llamar a updateTable() aquí - la nota ya se actualiza en tiempo real en el input
}

function updateTipo(assignIndex, tipo) {
    // Validate that assignments is an array
    if (!Array.isArray(assignments)) {
        console.error('updateTipo: assignments is not an array, type:', typeof assignments);
        return;
    }
    
    if (assignIndex >= 0 && assignIndex < assignments.length) {
        assignments[assignIndex].tipo = tipo;
        saveData();
    } else {
        console.error(`updateTipo: Invalid index ${assignIndex}, assignments length: ${assignments.length}`);
    }
    // No llamar a updateTable() aquí - el tipo ya se actualiza en tiempo real en el select
}

function deleteAssignment(index) {
    // Validate that assignments is an array
    if (!Array.isArray(assignments)) {
        console.error('deleteAssignment: assignments is not an array, type:', typeof assignments);
        alert('Error: Los datos de asignaciones no están disponibles.');
        return;
    }
    
    assignments.splice(index, 1);
    saveData();
    invalidateTableCache();
    updateTable();
}

function clearAllAssignments() {
    // Validate that assignments is an array
    if (!Array.isArray(assignments)) {
        console.error('clearAllAssignments: assignments is not an array, type:', typeof assignments);
        assignments = [];
        saveData();
        return;
    }
    
    if (assignments.length === 0) {
        alert('No hay asignaciones para limpiar');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar TODAS las asignaciones? Los personajes se mantendrán intactos.')) {
        assignments = [];
        saveData();
        invalidateTableCache();
        updateTable();
        alert('Todas las asignaciones han sido eliminadas. Los personajes siguen disponibles.');
    }
}

async function saveData() {
    // Save data to Firebase Firestore
    if (isFirebaseReady()) {
        try {
            // Run both writes in parallel for better performance
            await Promise.all([
                window.firestoreSetDoc(window.firestoreDoc(window.firestoreDB, "appData", "assignments"), { data: assignments }),
                window.firestoreSetDoc(window.firestoreDoc(window.firestoreDB, "appData", "characters"), { data: characters })
            ]);
        } catch (error) {
            console.error('Error saving data to Firestore:', error);
            alert('Error al guardar datos. Por favor, verifica tu conexión a internet e intenta de nuevo.');
        }
    } else {
        console.error('Firestore is not initialized yet');
        alert('Firestore no está inicializado. Por favor, recarga la página.');
    }
}

/**
 * Load initial data from Firebase Firestore
 */
async function loadDataFromFirebase() {
    try {
        if (isFirebaseReady()) {
            console.log('loadDataFromFirebase: Starting data load from Firestore...');
            
            // Run both reads in parallel for better performance
            const [assignmentsSnap, charactersSnap] = await Promise.all([
                window.firestoreGetDoc(window.firestoreDoc(window.firestoreDB, "appData", "assignments")),
                window.firestoreGetDoc(window.firestoreDoc(window.firestoreDB, "appData", "characters"))
            ]);

            console.log('loadDataFromFirebase: Document snapshots retrieved');
            console.log('  - Assignments exists:', assignmentsSnap.exists());
            console.log('  - Characters exists:', charactersSnap.exists());
            
            // Log metadata only (not sensitive data)
            if (assignmentsSnap.exists()) {
                const assignmentsData = assignmentsSnap.data();
                console.log('  - Assignments data structure:', {
                    hasDataField: 'data' in assignmentsData,
                    dataFieldType: typeof assignmentsData.data,
                    isArray: Array.isArray(assignmentsData.data),
                    length: Array.isArray(assignmentsData.data) ? assignmentsData.data.length : 'N/A'
                });
            }
            if (charactersSnap.exists()) {
                const charactersData = charactersSnap.data();
                console.log('  - Characters data structure:', {
                    hasDataField: 'data' in charactersData,
                    dataFieldType: typeof charactersData.data,
                    isArray: Array.isArray(charactersData.data),
                    length: Array.isArray(charactersData.data) ? charactersData.data.length : 'N/A'
                });
            }

            // Extract data arrays from document snapshots
            assignments = extractDataArray(assignmentsSnap);
            characters = extractDataArray(charactersSnap);
            
            console.log('loadDataFromFirebase: Data extracted successfully');
            console.log('  - Assignments count:', assignments.length);
            console.log('  - Characters count:', characters.length);

            if (!assignmentsSnap.exists()) {
                console.log('No assignments data available in Firestore, using empty array');
            }
            if (!charactersSnap.exists()) {
                console.log('No characters data available in Firestore, using empty array');
            }
        } else {
            console.error('Firestore is not initialized yet');
            throw new Error('Firestore not initialized');
        }
    } catch (error) {
        console.error('Error loading data from Firestore:', error);
        alert('Error al cargar datos desde Firestore. Usando datos vacíos.');
        throw error;
    }
}

/**
 * Set up real-time listener for Firebase Firestore data changes
 */
function setupFirebaseListener() {
    if (isFirebaseReady()) {
        // Store document references for reuse
        const assignmentsDocRef = window.firestoreDoc(window.firestoreDB, "appData", "assignments");
        const charactersDocRef = window.firestoreDoc(window.firestoreDB, "appData", "characters");

        console.log('setupFirebaseListener: Setting up real-time listeners...');

        // Listen for changes to assignments
        window.firestoreOnSnapshot(assignmentsDocRef, (docSnap) => {
            console.log('setupFirebaseListener: Assignments snapshot received');
            console.log('  - Document exists:', docSnap.exists());
            
            // Log metadata only (not sensitive data)
            if (docSnap.exists()) {
                const docData = docSnap.data();
                console.log('  - Data structure:', {
                    hasDataField: 'data' in docData,
                    dataFieldType: typeof docData.data,
                    isArray: Array.isArray(docData.data),
                    length: Array.isArray(docData.data) ? docData.data.length : 'N/A'
                });
            }
            
            // Update local data from Firestore
            assignments = extractDataArray(docSnap);
            
            console.log('  - Extracted assignments count:', assignments.length);
            
            // Update UI when data changes
            invalidateTableCache();
            updateTable();
        }, (error) => {
            console.error('Error in Firestore assignments listener:', error);
        });

        // Listen for changes to characters
        window.firestoreOnSnapshot(charactersDocRef, (docSnap) => {
            console.log('setupFirebaseListener: Characters snapshot received');
            console.log('  - Document exists:', docSnap.exists());
            
            // Log metadata only (not sensitive data)
            if (docSnap.exists()) {
                const docData = docSnap.data();
                console.log('  - Data structure:', {
                    hasDataField: 'data' in docData,
                    dataFieldType: typeof docData.data,
                    isArray: Array.isArray(docData.data),
                    length: Array.isArray(docData.data) ? docData.data.length : 'N/A'
                });
            }
            
            // Update local data from Firestore
            characters = extractDataArray(docSnap);
            
            console.log('  - Extracted characters count:', characters.length);
            
            // Update UI when data changes
            invalidateTableCache();
            updateCharacterList();
            updateTable();
        }, (error) => {
            console.error('Error in Firestore characters listener:', error);
        });
    } else {
        console.error('Firestore is not initialized yet');
    }
}

function exportToExcel() {
    // Validate that characters and assignments are arrays
    if (!Array.isArray(characters)) {
        console.error('exportToExcel: characters is not an array, type:', typeof characters);
        alert('Error: Los datos de personajes no están disponibles.');
        return;
    }
    
    if (!Array.isArray(assignments)) {
        console.error('exportToExcel: assignments is not an array, type:', typeof assignments);
        alert('Error: Los datos de asignaciones no están disponibles.');
        return;
    }
    
    // 1. Get current date for header and filename
    const currentDate = new Date();
    // Use robust date formatting for filename
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    
    // Display date in Spanish format
    const displayDate = currentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }); // Format: DD de MMMM de YYYY
    
    // 2. Get filtered data
    const filtroClase = document.getElementById('filtro-clase').value;
    const filtroJefe = document.getElementById('filtro-jefe').value;
    const filtroDificultad = document.getElementById('filtro-dificultad').value;

    const filteredAssignments = assignments.filter(a => {
        const char = characters.find(c => c.name === a.character);
        if (!char) return false;

        const bossMatch = !filtroJefe || a.boss == filtroJefe;
        const difficultyMatch = !filtroDificultad || a.dificultad === filtroDificultad;
        const classMatch = !filtroClase || char.class === filtroClase;
        
        return bossMatch && difficultyMatch && classMatch;
    });

    if (filteredAssignments.length === 0) {
        alert("No hay datos para exportar con los filtros actuales.");
        return;
    }

    // 3. Create data for Excel export (one row per assignment)
    const exportData = filteredAssignments.map(a => {
        const char = characters.find(c => c.name === a.character);
        const item = itemIndexByName.get(a.item);
        const boss = bossIndexById.get(a.boss);
        return {
            'Personaje': a.character,
            'Clase': char ? char.class : 'N/A',
            'Especialización': char ? char.specialization : 'N/A',
            'Objeto': a.item,
            'Dificultad': a.dificultad,
            'iLvl': a.ilvl,
            'Jefe': boss ? boss.name : 'N/A',
            'Tipo': a.tipo,
            'Nota': a.note
        };
    });

    // 4. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asignaciones");

    // 5. Insert header row with title and date
    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Shift all rows down by 2 to make room for the header
    XLSX.utils.sheet_add_aoa(worksheet, [[`RAID EQUINOX - ${displayDate}`]], { origin: 0 });
    XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: 1 }); // Empty row for spacing
    
    // Update the range to include new rows
    const newRange = XLSX.utils.decode_range(worksheet['!ref']);
    
    // 6. Apply styling to the worksheet
    
    // Define reusable border styles
    const thinBorder = { style: "thin" };
    const createBorder = (color) => ({
        top: { ...thinBorder, color: { rgb: color } },
        bottom: { ...thinBorder, color: { rgb: color } },
        left: { ...thinBorder, color: { rgb: color } },
        right: { ...thinBorder, color: { rgb: color } }
    });
    
    // Style the title header row (row 0)
    const titleCell = worksheet['A1'];
    if (titleCell) {
        titleCell.s = {
            font: { 
                bold: true, 
                sz: 16,
                color: { rgb: "FFFFFF" }
            },
            fill: { 
                fgColor: { rgb: "1F4E78" } // Dark blue background
            },
            alignment: { 
                horizontal: "center", 
                vertical: "center" 
            }
        };
    }
    
    // Merge cells for title header across all columns
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: newRange.e.c }
    });
    
    // Define column header row styling (row 2, after title and empty row)
    const headerStyle = {
        font: { 
            bold: true, 
            sz: 12,
            color: { rgb: "FFFFFF" }
        },
        fill: { 
            fgColor: { rgb: "4472C4" } // Blue background
        },
        alignment: { 
            horizontal: "center", 
            vertical: "center" 
        },
        border: createBorder("000000")
    };
    
    // Apply header styling to column headers (row 2)
    for (let col = newRange.s.c; col <= newRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
        const cell = worksheet[cellAddress];
        if (!cell) continue;
        cell.s = headerStyle;
    }
    
    // Apply zebra striping and other cell styling (data starts at row 3)
    for (let row = 3; row <= newRange.e.r; row++) {
        // Determine if this is an even row (for zebra striping)
        // Adjust for offset since data starts at row 3
        const isEvenRow = ((row - 3) % 2) === 0;
        
        for (let col = newRange.s.c; col <= newRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            if (!cell) continue;
            
            // Get column header to determine which column we're in (headers are now at row 2)
            const headerAddress = XLSX.utils.encode_cell({ r: 2, c: col });
            const headerValue = worksheet[headerAddress]?.v || '';
            
            // Base style for data cells
            const cellStyle = {
                font: {},
                alignment: {},
                border: createBorder("D0D0D0")
            };
            
            // Apply zebra striping (alternating gray for even rows)
            if (isEvenRow) {
                cellStyle.fill = { fgColor: { rgb: "F2F2F2" } };
            }
            
            // Apply bold to important columns (Personaje and Objeto)
            if (headerValue === 'Personaje' || headerValue === 'Objeto') {
                cellStyle.font.bold = true;
            }
            
            // Center align specific columns (Dificultad and iLvl)
            if (headerValue === 'Dificultad' || headerValue === 'iLvl') {
                cellStyle.alignment.horizontal = "center";
                cellStyle.alignment.vertical = "center";
            } else {
                cellStyle.alignment.vertical = "center";
            }
            
            cell.s = cellStyle;
        }
    }
    
    // 7. Auto-adjust column widths based on content
    const columnWidths = [];
    for (let col = newRange.s.c; col <= newRange.e.c; col++) {
        // Get header for this column (headers are now at row 2)
        const headerAddress = XLSX.utils.encode_cell({ r: 2, c: col });
        const headerCell = worksheet[headerAddress];
        const headerValue = headerCell?.v || '';
        
        // Calculate max width for this column
        let maxWidth = String(headerValue).length;
        
        // Check data rows (starting at row 3)
        for (let row = 3; row <= newRange.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            if (cell && cell.v) {
                const cellLength = String(cell.v).length;
                maxWidth = Math.max(maxWidth, cellLength);
            }
        }
        
        // Add some padding and cap at a reasonable maximum
        columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
    }
    
    worksheet['!cols'] = columnWidths;

    // 8. Download the file with date in filename
    XLSX.writeFile(workbook, `asignaciones_loot_${dateStr}.xlsx`);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to be ready, then load data and set up listeners
    const FIREBASE_INIT_TIMEOUT_MS = 5000; // 5 seconds timeout
    const RETRY_INTERVAL_MS = 100; // Check every 100ms
    const maxRetries = FIREBASE_INIT_TIMEOUT_MS / RETRY_INTERVAL_MS;
    let initRetries = 0;
    
    const initializeApp = async () => {
        if (isFirebaseReady()) {
            // Load initial data from Firestore
            try {
                await loadDataFromFirebase();
                
                // Initialize UI with loaded data
                updateBossSelect();
                updateCharacterList();
                updateTable();
                
                // Set up real-time listener for future changes
                setupFirebaseListener();
            } catch (error) {
                console.error('Failed to load initial data:', error);
                // Initialize with empty data if Firestore fails
                updateBossSelect();
                updateCharacterList();
                updateTable();
            }
        } else if (initRetries < maxRetries) {
            // Firestore not ready yet, wait a bit and try again
            initRetries++;
            setTimeout(initializeApp, RETRY_INTERVAL_MS);
        } else {
            // Firestore failed to load after max retries
            console.error('Firestore failed to initialize after maximum retries');
            alert('No se pudo conectar con Firestore. La aplicación funcionará sin sincronización en tiempo real.');
            // Initialize with empty data
            updateBossSelect();
            updateCharacterList();
            updateTable();
        }
    };
    
    // Registrar event listeners para elementos estáticos
    document.getElementById('form-personaje').onsubmit = addCharacter;
    document.getElementById('btn-asignar').onclick = assignItem;
    document.getElementById('filtro-clase').onchange = updateTable;
    document.getElementById('filtro-jefe').onchange = updateTable;
    document.getElementById('filtro-dificultad').onchange = updateTable;
    document.getElementById('select-jefe').onchange = (e) => showLoot(e.target.value);
    document.getElementById('select-personaje').onchange = filterItemsByCharacter;
    document.getElementById('select-jefe-asignacion').onchange = filterItemsByCharacter;
    document.getElementById('btn-exportar-excel').addEventListener('click', exportToExcel);
    
    // Event listener para actualizar especializaciones dinámicamente
    document.getElementById('clase').onchange = (e) => {
        updateSpecializationsForClass(e.target.value);
    };
    
    // Event Delegation para botones de personajes (editar/eliminar)
    document.getElementById('lista-personajes').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit-char')) {
            const index = parseInt(e.target.dataset.index);
            editCharacter(index);
        } else if (e.target.classList.contains('btn-delete-char')) {
            const index = parseInt(e.target.dataset.index);
            deleteCharacter(index);
        }
    });
    
    // Event Delegation para la tabla de asignaciones (eliminar asignación, actualizar nota)
    document.getElementById('tabla-asignaciones').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-assign')) {
            const index = parseInt(e.target.dataset.index);
            deleteAssignment(index);
        }
    });
    
    // Botón para limpiar todas las asignaciones
    document.getElementById('btn-limpiar-todo').addEventListener('click', clearAllAssignments);
    
    // Event Delegation para actualizar nota y tipo en campos
    document.getElementById('tabla-asignaciones').addEventListener('change', (e) => {
        if (e.target.classList.contains('note-input')) {
            const index = parseInt(e.target.dataset.index);
            updateNote(index, e.target.value);
        }
        if (e.target.classList.contains('tipo-select')) {
            const index = parseInt(e.target.dataset.index);
            updateTipo(index, e.target.value);
        }
    });
    
    // Inicializar interfaz
    initializeApp();
});
