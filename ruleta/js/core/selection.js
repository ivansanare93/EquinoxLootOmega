/**
 * selection.js — Lógica de selección según el modo activo
 */

const SelectionManager = (() => {
  const MODES = {
    CLASS: 'class',
    SPEC: 'spec',
    CLASS_SPEC: 'class_spec',
    CHARACTER: 'character',
    CHAOS: 'chaos',
    DESTINY: 'destiny',
    BEST_OF_3: 'best_of_3',
    CURSE: 'curse',
    CHALLENGE: 'challenge'
  };

  let currentMode = MODES.CLASS_SPEC;
  let customCharacters = []; // Para modo personaje
  let curseRestrictions = []; // Para modo maldición

  // Selección aleatoria uniforme de un array
  function randomFrom(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Selecciona un resultado según el modo actual.
   * @returns {{ type, class, spec, character, message, candidates }} 
   */
  function select() {
    switch (currentMode) {
      case MODES.CLASS:      return selectClass();
      case MODES.SPEC:       return selectSpec();
      case MODES.CLASS_SPEC: return selectClassSpec();
      case MODES.CHARACTER:  return selectCharacter();
      case MODES.CHAOS:      return selectChaos();
      case MODES.CHALLENGE:  return selectChallenge();
      case MODES.BEST_OF_3:  return selectBestOf3();
      case MODES.CURSE:      return selectCurse();
      default:               return selectClassSpec();
    }
  }

  function selectClass() {
    const classes = FiltersManager.getActiveClasses();
    if (!classes.length) return { error: 'sin_opciones' };
    const recent = FiltersManager.getRecentlyShown();
    // Para modo clase, usar el id como "spec" para pesos
    const cls = WeightsManager.weightedRandom(
      classes.map(c => ({ ...c, id: c.id })), recent
    );
    return { type: 'class', class: cls };
  }

  function selectSpec() {
    const specs = FiltersManager.getActiveSpecs();
    if (!specs.length) return { error: 'sin_opciones' };
    const recent = FiltersManager.getRecentlyShown();
    const spec = WeightsManager.weightedRandom(specs, recent);
    if (!spec) return { error: 'sin_opciones' };
    FiltersManager.recordShown(spec.id);
    return { type: 'spec', spec };
  }

  function selectClassSpec() {
    // Primero clase, luego spec de esa clase
    const classes = FiltersManager.getActiveClasses();
    if (!classes.length) return { error: 'sin_opciones' };
    const recent = FiltersManager.getRecentlyShown();
    const cls = WeightsManager.weightedRandom(
      classes.map(c => ({ ...c, id: c.id })), recent
    );
    if (!cls) return { error: 'sin_opciones' };
    const specs = FiltersManager.getActiveSpecsForClass(cls.id);
    if (!specs.length) return { error: 'sin_opciones' };
    const spec = WeightsManager.weightedRandom(specs, recent);
    if (!spec) return { error: 'sin_opciones' };
    FiltersManager.recordShown(spec.id);
    return { type: 'class_spec', class: cls, spec };
  }

  function selectCharacter() {
    if (!customCharacters.length) return { error: 'sin_personajes' };
    const char = randomFrom(customCharacters);
    return { type: 'character', character: char };
  }

  function selectChaos() {
    const options = ['class', 'spec', 'class_spec', 'role', 'race', 'faction'];
    const chosen = randomFrom(options);
    switch (chosen) {
      case 'class':
        return { ...selectClass(), chaosType: 'class' };
      case 'spec':
        return { ...selectSpec(), chaosType: 'spec' };
      case 'class_spec':
        return { ...selectClassSpec(), chaosType: 'class_spec' };
      case 'role': {
        const roles = ['tank', 'healer', 'dps'].filter(r => FiltersManager.getState().roles[r]);
        const role = randomFrom(roles);
        return { type: 'chaos', chaosType: 'role', role };
      }
      case 'race': {
        const faction = randomFrom(['alliance', 'horde']);
        const races = WOW_DATA.races.filter(r => r.faction === faction);
        const race = randomFrom(races);
        return { type: 'chaos', chaosType: 'race', race, faction };
      }
      case 'faction': {
        const faction = randomFrom(WOW_DATA.factions);
        return { type: 'chaos', chaosType: 'faction', faction };
      }
      default:
        return selectClassSpec();
    }
  }

  function selectChallenge() {
    const challenges = [
      { text: "🛡️ Juega tanque esta vez.", filter: 'tank' },
      { text: "💚 El healer serás tú. Sí, tú.", filter: 'healer' },
      { text: "⚔️ Solo puedes usar clases cuerpo a cuerpo.", filter: 'melee' },
      { text: "🏹 Solo clases a distancia. Nada de acercarte.", filter: 'ranged' },
      { text: "🎲 Cualquier cosa es válida. ¡Al caos!", filter: null },
      { text: "💀 Juega la especialización con más dificultad.", filter: null },
      { text: "🌿 Solo clases que puedan ser healers.", filter: 'can_heal' }
    ];
    const challenge = randomFrom(challenges);
    return { type: 'challenge', challenge };
  }

  function selectBestOf3() {
    const specs = FiltersManager.getActiveSpecs();
    if (specs.length < 3) return selectClassSpec();
    const shuffled = [...specs].sort(() => Math.random() - 0.5);
    const candidates = shuffled.slice(0, 3).map(spec => {
      const cls = WOW_DATA.classes.find(c => c.id === spec.classId);
      return { spec, class: cls };
    });
    return { type: 'best_of_3', candidates };
  }

  function selectCurse() {
    const result = selectClassSpec();
    if (result.error) return result;
    // Añadir restricción para la próxima tirada
    const restrictions = [
      "No puedes usar DPS la próxima vez.",
      "Debes jugar un rol diferente.",
      "No puedes repetir clase.",
      "Solo puedes usar specs que no hayas jugado.",
      "Debes jugar la clase opuesta a tu preferida."
    ];
    const newRestriction = randomFrom(restrictions);
    curseRestrictions.push(newRestriction);
    if (curseRestrictions.length > 3) curseRestrictions.shift(); // máximo 3
    return { ...result, curseRestrictions: [...curseRestrictions] };
  }

  function setMode(mode) { currentMode = mode; }
  function getMode() { return currentMode; }
  function getModes() { return MODES; }
  function setCustomCharacters(chars) { customCharacters = chars; }
  function getCustomCharacters() { return customCharacters; }
  function clearCurse() { curseRestrictions = []; }

  return {
    select,
    setMode,
    getMode,
    getModes,
    setCustomCharacters,
    getCustomCharacters,
    clearCurse,
    MODES
  };
})();

window.SelectionManager = SelectionManager;
