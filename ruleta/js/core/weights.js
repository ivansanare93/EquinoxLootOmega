/**
 * weights.js — Sistema de pesos para la ruleta
 * Cada spec puede tener un peso (1-10). La selección usa probabilidad ponderada.
 */

const WeightsManager = (() => {
  let weights = {}; // { specId: number }
  let memoryEnabled = false; // "Ruleta con memoria"
  let memoryDecay = 0.5;    // Multiplicador por aparición reciente

  function init() {
    WOW_DATA.classes.forEach(cls => {
      cls.specs.forEach(spec => {
        weights[spec.id] = WOW_DATA.defaultWeight;
      });
    });
  }

  function setWeight(specId, value) {
    weights[specId] = Math.max(1, Math.min(10, Number(value)));
  }

  function getWeight(specId) {
    return weights[specId] ?? WOW_DATA.defaultWeight;
  }

  function resetAll() {
    Object.keys(weights).forEach(id => weights[id] = WOW_DATA.defaultWeight);
  }

  /** ¿Están todos los pesos en 1? (modo uniforme) */
  function isUniform() {
    return Object.values(weights).every(w => w === 1);
  }

  /**
   * Selecciona aleatoriamente un ítem de una lista respetando pesos.
   * @param {Array} items - Cada item debe tener { id }
   * @param {string[]} recentlyShown - IDs vistos recientemente (para memoria)
   */
  function weightedRandom(items, recentlyShown = []) {
    if (!items || items.length === 0) return null;

    const effectiveWeights = items.map(item => {
      let w = getWeight(item.id);
      if (memoryEnabled) {
        const recentIndex = recentlyShown.indexOf(item.id);
        if (recentIndex >= 0) {
          // Reducir peso según cuán reciente fue
          const factor = Math.pow(memoryDecay, recentIndex + 1);
          w = Math.max(0.1, w * factor);
        }
      }
      return w;
    });

    const totalWeight = effectiveWeights.reduce((a, b) => a + b, 0);
    if (totalWeight <= 0) return items[Math.floor(Math.random() * items.length)];

    let rand = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      rand -= effectiveWeights[i];
      if (rand <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  /**
   * Retorna los ángulos (en radianes) que le corresponde a cada sección
   * de la ruleta según sus pesos.
   */
  function getSectionAngles(items) {
    const w = items.map(item => getWeight(item.id));
    const total = w.reduce((a, b) => a + b, 0);
    return w.map(v => (v / total) * 2 * Math.PI);
  }

  function setMemoryEnabled(v) { memoryEnabled = v; }
  function isMemoryEnabled() { return memoryEnabled; }

  function getAll() { return { ...weights }; }
  function setAll(obj) { weights = { ...weights, ...obj }; }

  return {
    init,
    setWeight,
    getWeight,
    resetAll,
    isUniform,
    weightedRandom,
    getSectionAngles,
    setMemoryEnabled,
    isMemoryEnabled,
    getAll,
    setAll
  };
})();

window.WeightsManager = WeightsManager;
