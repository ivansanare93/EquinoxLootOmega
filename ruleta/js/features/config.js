/**
 * config.js — Configuración, localStorage, import/export
 */

const ConfigManager = (() => {
  const STORAGE_KEY = 'ruleta_config';
  const HISTORY_KEY = 'ruleta_history';

  const defaults = {
    spinDuration: 4000,
    soundEnabled: true,
    soundVolume: 0.5,
    animationsEnabled: true,
    memoryEnabled: false,
    maxHistory: 50,
    allowRepeat: true,
    wheelSize: 480,
    showWeightsIndicator: true,
    obsMode: false,
    transparentBg: false,
    theme: 'wow'
  };

  let config = { ...defaults };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) config = { ...defaults, ...saved };
    } catch (e) { /* usar defaults */ }

    // URL params override
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'obs') config.obsMode = true;
    if (params.get('transparent') === 'true') config.transparentBg = true;
    if (params.get('theme')) config.theme = params.get('theme');
    if (params.get('duration')) config.spinDuration = parseInt(params.get('duration')) || 4000;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) { /* quota exceeded */ }
  }

  function get(key) { return key ? config[key] : { ...config }; }

  function set(key, value) {
    config[key] = value;
    save();
  }

  function reset() {
    config = { ...defaults };
    save();
  }

  // ── Historial ──

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) { return []; }
  }

  function addToHistory(entry) {
    const history = getHistory();
    history.unshift({ ...entry, timestamp: Date.now() });
    const maxH = config.maxHistory || 50;
    if (history.length > maxH) history.splice(maxH);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) { /* noop */ }
  }

  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) { /* noop */ }
  }

  // ── Export / Import ──

  function exportConfig(filtersState, weightsData) {
    const data = {
      version: '1.0',
      exported: new Date().toISOString(),
      config,
      filters: filtersState,
      weights: weightsData,
      characters: window.SelectionManager ? SelectionManager.getCustomCharacters() : []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WoW_Ruleta_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importConfig(jsonString, onImport) {
    try {
      const data = JSON.parse(jsonString);
      if (data.config) config = { ...defaults, ...data.config };
      save();
      if (onImport) onImport(data);
      return true;
    } catch (e) {
      return false;
    }
  }

  return {
    load, save, get, set, reset,
    getHistory, addToHistory, clearHistory,
    exportConfig, importConfig,
    defaults
  };
})();

window.ConfigManager = ConfigManager;
