/**
 * filters.js — Sistema de filtros y construcción de opciones de ruleta
 */

const FiltersManager = (() => {
  // Estado de filtros
  let state = {
    roles: { tank: true, healer: true, dps: true },
    dpsType: { melee: true, ranged: true },
    classes: {},    // { classId: true/false }
    specs: {},      // { specId: true/false }
    banned: new Set(),
    recentlyShown: [] // para "memoria" de la ruleta
  };

  function init() {
    // Inicializar todos los filtros de clase/spec a true
    WOW_DATA.classes.forEach(cls => {
      state.classes[cls.id] = true;
      cls.specs.forEach(spec => {
        state.specs[spec.id] = true;
      });
    });
  }

  /** Devuelve las clases activas (no filtradas, no baneadas) */
  function getActiveClasses() {
    return WOW_DATA.classes.filter(cls => {
      if (!state.classes[cls.id]) return false;
      if (state.banned.has(`class:${cls.id}`)) return false;
      // Al menos una spec activa
      return cls.specs.some(spec => isSpecActive(spec, cls));
    });
  }

  /** Devuelve las specs activas según todos los filtros */
  function getActiveSpecs() {
    const result = [];
    WOW_DATA.classes.forEach(cls => {
      if (!state.classes[cls.id]) return;
      cls.specs.forEach(spec => {
        if (isSpecActive(spec, cls)) {
          result.push({ ...spec, classId: cls.id, className: cls.name, classColor: cls.color, classIcon: cls.icon });
        }
      });
    });
    return result;
  }

  function isSpecActive(spec, cls) {
    if (!state.specs[spec.id]) return false;
    if (state.banned.has(`spec:${spec.id}`)) return false;
    if (spec.role === 'tank' && !state.roles.tank) return false;
    if (spec.role === 'healer' && !state.roles.healer) return false;
    if (spec.role === 'dps' && !state.roles.dps) return false;
    if (spec.role === 'dps' && spec.dpsType === 'melee' && !state.dpsType.melee) return false;
    if (spec.role === 'dps' && spec.dpsType === 'ranged' && !state.dpsType.ranged) return false;
    return true;
  }

  /** Devuelve specs de una clase específica que están activas */
  function getActiveSpecsForClass(classId) {
    const cls = WOW_DATA.classes.find(c => c.id === classId);
    if (!cls) return [];
    return cls.specs.filter(spec => isSpecActive(spec, cls))
      .map(spec => ({ ...spec, classId: cls.id, className: cls.name, classColor: cls.color, classIcon: cls.icon }));
  }

  /** Banea una opción */
  function ban(type, id) {
    state.banned.add(`${type}:${id}`);
  }

  function unban(key) {
    state.banned.delete(key);
  }

  function getBanned() {
    return [...state.banned];
  }

  function clearBanned() {
    state.banned.clear();
  }

  /** Registra una tirada reciente (para memoria de ruleta) */
  function recordShown(specId) {
    state.recentlyShown.unshift(specId);
    if (state.recentlyShown.length > 10) state.recentlyShown.pop();
  }

  function getRecentlyShown() {
    return [...state.recentlyShown];
  }

  /** Selección aleatoria de N specs */
  function selectRandomN(n) {
    const all = WOW_DATA.classes.flatMap(c => c.specs.map(s => s.id));
    const shuffled = all.sort(() => Math.random() - 0.5);
    // Desactivar todas, activar solo las N primeras
    all.forEach(id => state.specs[id] = false);
    shuffled.slice(0, n).forEach(id => state.specs[id] = true);
  }

  function setAllSpecs(value) {
    WOW_DATA.classes.forEach(cls => {
      state.classes[cls.id] = value;
      cls.specs.forEach(spec => state.specs[spec.id] = value);
    });
  }

  function setByRole(role) {
    WOW_DATA.classes.forEach(cls => {
      cls.specs.forEach(spec => {
        state.specs[spec.id] = (spec.role === role);
      });
      state.classes[cls.id] = cls.specs.some(s => state.specs[s.id]);
    });
  }

  function getState() { return state; }
  function setState(newState) {
    state = { ...state, ...newState };
    if (newState.banned && Array.isArray(newState.banned)) {
      state.banned = new Set(newState.banned);
    }
  }

  function getSerializable() {
    return {
      roles: state.roles,
      dpsType: state.dpsType,
      classes: state.classes,
      specs: state.specs,
      banned: [...state.banned]
    };
  }

  return {
    init,
    getActiveClasses,
    getActiveSpecs,
    getActiveSpecsForClass,
    isSpecActive,
    ban,
    unban,
    getBanned,
    clearBanned,
    recordShown,
    getRecentlyShown,
    selectRandomN,
    setAllSpecs,
    setByRole,
    getState,
    setState,
    getSerializable
  };
})();

window.FiltersManager = FiltersManager;
