/**
 * app.js — Punto de entrada principal de Destino de Azeroth
 * Orquesta todos los módulos y gestiona el flujo principal.
 */

const App = (() => {
  let isSpinning = false;
  let obsMode = false;

  // ── Inicialización ──

  function init() {
    ConfigManager.load();

    // Detectar modo OBS
    const params = new URLSearchParams(window.location.search);
    obsMode = ConfigManager.get('obsMode') || params.get('mode') === 'obs';
    if (obsMode) {
      document.body.classList.add('obs-mode');
    }
    if (ConfigManager.get('transparentBg') || params.get('transparent') === 'true') {
      document.body.classList.add('transparent-bg');
    }

    // Tema
    ThemesManager.init();

    // Módulos de datos
    FiltersManager.init();
    WeightsManager.init();

    // Motor de ruleta
    const canvas = document.getElementById('wheel-canvas');
    WheelEngine.init(canvas);

    // UI
    ResultUI.init(
      document.getElementById('result-overlay'),
      null,
      () => spin()
    );

    HistoryUI.init(
      document.getElementById('history-list'),
      document.getElementById('banned-list')
    );

    StreaksManager.updateStatsBar();

    if (!obsMode) {
      PanelsUI.init();
    }

    // Botón girar
    document.getElementById('btn-spin').addEventListener('click', spin);

    // Botón configuración
    document.getElementById('btn-config')?.addEventListener('click', () => PanelsUI.showConfig());

    // Botón modo streamer toggle
    document.getElementById('btn-streamer')?.addEventListener('click', toggleStreamer);

    // Botón panel izquierdo toggle
    document.getElementById('btn-toggle-left')?.addEventListener('click', () => {
      document.getElementById('panel-left').classList.toggle('collapsed');
    });

    // Botón panel derecho toggle
    document.getElementById('btn-toggle-right')?.addEventListener('click', () => {
      document.getElementById('panel-right').classList.toggle('collapsed');
    });

    // Selector de modo
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SelectionManager.setMode(btn.dataset.mode);
        refreshWheel();
        // Mostrar/ocultar panel de personajes
        const charPanel = document.getElementById('character-panel');
        if (charPanel) {
          charPanel.classList.toggle('hidden', btn.dataset.mode !== 'character');
        }
        // Mostrar panel de modos especiales si aplica
        updateSpecialModePanel(btn.dataset.mode);
      });
    });

    // Gestión de personajes personalizados
    document.getElementById('btn-add-character')?.addEventListener('click', addCharacterRow);
    document.getElementById('btn-clear-history')?.addEventListener('click', () => {
      HistoryUI.clearHistory();
      showToast('Historial borrado 🗑️', 'warning');
    });

    // Botón borrar baneados
    document.getElementById('btn-clear-banned')?.addEventListener('click', () => {
      HistoryUI.clearBanned();
      if (window.App) App.refreshWheel();
      showToast('Baneados restaurados ♻️', 'success');
    });

    // Sonido
    SoundsManager.setEnabled(ConfigManager.get('soundEnabled'));
    SoundsManager.setVolume(ConfigManager.get('soundVolume'));

    // Resize del canvas
    window.addEventListener('resize', () => WheelEngine.resize());

    // Carga inicial de la ruleta
    refreshWheel();

    // Spin con teclado (Space)
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && !isSpinning && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        spin();
      }
      if (e.code === 'Escape') {
        ResultUI.hide();
        document.getElementById('config-modal')?.classList.remove('visible');
      }
    });

    console.log('🎲 Destino de Azeroth — Iniciado');
  }

  // ── Construcción de ítems para la ruleta según el modo ──

  function buildWheelItems() {
    const mode = SelectionManager.getMode();
    const MODES = SelectionManager.MODES;

    if (mode === MODES.CHARACTER) {
      const chars = SelectionManager.getCustomCharacters();
      return chars.map(name => ({
        label: name,
        color: randomColor(),
        icon: '👤',
        weight: 1
      }));
    }

    if (mode === MODES.CLASS || mode === MODES.CLASS_SPEC) {
      return FiltersManager.getActiveClasses().map(cls => ({
        label: cls.name,
        color: cls.color,
        icon: cls.icon,
        id: cls.id,
        weight: 1
      }));
    }

    if (mode === MODES.SPEC) {
      return FiltersManager.getActiveSpecs().map(spec => ({
        label: spec.name,
        sublabel: spec.className,
        color: spec.classColor,
        icon: spec.icon,
        id: spec.id,
        weight: WeightsManager.getWeight(spec.id)
      }));
    }

    if (mode === MODES.CHAOS) {
      // Mezcla de clases y specs
      const classes = FiltersManager.getActiveClasses().map(cls => ({
        label: cls.name, color: cls.color, icon: cls.icon, id: cls.id, weight: 1
      }));
      return classes.length ? classes : [{ label: 'Caos', color: '#8b5cf6', icon: '🌀', weight: 1 }];
    }

    // Para modos especiales (destiny, best_of_3, curse, challenge) mostrar clases
    return FiltersManager.getActiveClasses().map(cls => ({
      label: cls.name, color: cls.color, icon: cls.icon, id: cls.id, weight: 1
    }));
  }

  function refreshWheel() {
    const items = buildWheelItems();
    WheelEngine.setItems(items);

    // Indicador de pesos activos
    const weightsIndicator = document.getElementById('weights-indicator');
    if (weightsIndicator) {
      weightsIndicator.classList.toggle('hidden', WeightsManager.isUniform());
    }

    // Indicador de baneados
    const bannedCount = FiltersManager.getBanned().length;
    const bannedIndicator = document.getElementById('banned-indicator');
    if (bannedIndicator) {
      bannedIndicator.classList.toggle('hidden', bannedCount === 0);
      bannedIndicator.textContent = `❌ ${bannedCount} baneados`;
    }
  }

  // ── Spin principal ──

  function spin() {
    if (isSpinning) return;
    const mode = SelectionManager.getMode();
    const MODES = SelectionManager.MODES;

    // Modo especiales con lógica propia
    if (mode === MODES.BEST_OF_3) {
      runBestOf3();
      return;
    }
    if (mode === MODES.CHALLENGE) {
      runChallenge();
      return;
    }
    if (mode === MODES.DESTINY) {
      runDestiny();
      return;
    }

    const items = buildWheelItems();
    if (!items.length) {
      WheelEngine.draw();
      showToast('Sin opciones disponibles. Activa más filtros.', 'danger');
      SoundsManager.playError();
      const canvas = document.getElementById('wheel-canvas');
      canvas?.classList.add('shake');
      setTimeout(() => canvas?.classList.remove('shake'), 500);
      return;
    }

    isSpinning = true;
    document.getElementById('btn-spin').disabled = true;
    document.getElementById('spin-phrase').textContent = WOWDataUtils.getRandomSpinPhrase();

    SoundsManager.startSpin();

    const duration = ConfigManager.get('spinDuration') || 4000;

    // Para clase+spec: primero la clase, luego la spec
    if (mode === MODES.CLASS_SPEC) {
      // Seleccionar resultado completo primero
      const fullResult = SelectionManager.select();
      if (fullResult.error) {
        isSpinning = false;
        document.getElementById('btn-spin').disabled = false;
        showToast('Sin opciones disponibles.', 'danger');
        return;
      }

      // Encontrar el índice de la clase en la ruleta
      const activeClasses = FiltersManager.getActiveClasses();
      const targetIdx = activeClasses.findIndex(c => c.id === fullResult.class.id);

      // Fase 1: girar a la clase
      setTimeout(() => SoundsManager.slowdownSpin(), duration * 0.65);
      WheelEngine.spin(targetIdx, (idx) => {
        SoundsManager.stopSpin();
        SoundsManager.playVictory();

        // Pequeña pausa, luego mostrar resultado completo
        setTimeout(() => {
          document.getElementById('wheel-canvas').classList.add('wheel-flash');
          setTimeout(() => document.getElementById('wheel-canvas').classList.remove('wheel-flash'), 1000);
          finishSpin(fullResult);
        }, 600);
      }, duration);
      return;
    }

    // Modo clase, spec, caos, personaje, maldición
    const result = SelectionManager.select();
    if (result.error) {
      isSpinning = false;
      document.getElementById('btn-spin').disabled = false;
      showToast('Sin opciones disponibles.', 'danger');
      return;
    }

    // Calcular índice objetivo en los ítems de la ruleta
    let targetIdx = -1;
    if (result.spec) {
      targetIdx = items.findIndex(it => it.id === result.spec.id);
    } else if (result.class) {
      targetIdx = items.findIndex(it => it.id === result.class.id);
    } else if (result.character) {
      const chars = SelectionManager.getCustomCharacters();
      targetIdx = chars.indexOf(result.character);
    }

    setTimeout(() => SoundsManager.slowdownSpin(), duration * 0.65);

    WheelEngine.spin(targetIdx, () => {
      SoundsManager.stopSpin();
      SoundsManager.playVictory();
      document.getElementById('wheel-canvas').classList.add('wheel-flash');
      setTimeout(() => document.getElementById('wheel-canvas').classList.remove('wheel-flash'), 1000);
      setTimeout(() => finishSpin(result), 400);
    }, duration);
  }

  function finishSpin(result) {
    isSpinning = false;
    document.getElementById('btn-spin').disabled = false;
    document.getElementById('spin-phrase').textContent = '';

    // Historial
    const histEntry = {
      className: result.class?.name || result.character || '?',
      classIcon: result.class?.icon || '🎲',
      specName: result.spec?.name,
      specIcon: result.spec?.icon,
      role: result.spec?.role,
      character: result.character
    };
    HistoryUI.add(histEntry);

    // Rachas
    const streak = StreaksManager.recordResult(result);
    if (streak) {
      showStreakBanner(streak.message);
    }

    // Final Boss
    if (StreaksManager.isFinalBoss()) {
      const msg = WOWDataUtils.getRandomMessage('finalboss');
      setTimeout(() => showStreakBanner(msg), 1500);
    }

    // Modo caos — sonido especial
    if (result.type === 'chaos' || SelectionManager.getMode() === SelectionManager.MODES.CHAOS) {
      SoundsManager.playChaos();
    }

    ResultUI.show(result);
  }

  // ── Modos especiales ──

  function runBestOf3() {
    isSpinning = true;
    document.getElementById('btn-spin').disabled = true;
    document.getElementById('spin-phrase').textContent = '🏆 Generando 3 candidatos...';
    const result = SelectionManager.select();
    setTimeout(() => {
      isSpinning = false;
      document.getElementById('btn-spin').disabled = false;
      document.getElementById('spin-phrase').textContent = '';
      SoundsManager.playVictory();
      ResultUI.show(result);
    }, 600);
  }

  function runChallenge() {
    isSpinning = true;
    document.getElementById('btn-spin').disabled = true;
    document.getElementById('spin-phrase').textContent = '🏹 El universo lanza un desafío...';
    const result = SelectionManager.select();
    setTimeout(() => {
      isSpinning = false;
      document.getElementById('btn-spin').disabled = false;
      document.getElementById('spin-phrase').textContent = '';
      SoundsManager.playVictory();
      ResultUI.show(result);
    }, 800);
  }

  function runDestiny() {
    const constraints = buildDestinyConstraints();
    document.getElementById('spin-phrase').textContent = '⚡ DESTINO ABSOLUTO EN PROCESO...';
    isSpinning = true;
    document.getElementById('btn-spin').disabled = true;

    // Giros automáticos encadenados
    let step = 0;
    const maxSteps = constraints.maxSteps || 3;
    const usedClasses = new Set();
    const usedRoles = new Set();

    function nextStep() {
      if (step >= maxSteps) {
        const finalResult = SelectionManager.select();
        isSpinning = false;
        document.getElementById('btn-spin').disabled = false;
        document.getElementById('spin-phrase').textContent = '';
        SoundsManager.playVictory();
        ResultUI.show({ ...finalResult, destinySteps: step });
        return;
      }

      const r = SelectionManager.select();
      step++;
      SoundsManager.playTick();
      document.getElementById('spin-phrase').textContent = `⚡ Paso ${step}/${maxSteps}: ${r.class?.name || '?'}...`;
      setTimeout(nextStep, 600);
    }

    setTimeout(nextStep, 500);
  }

  function buildDestinyConstraints() {
    return { maxSteps: 3 };
  }

  // ── Personajes personalizados ──

  function addCharacterRow() {
    const list = document.getElementById('character-entries');
    if (!list) return;
    const idx = list.children.length;
    const div = document.createElement('div');
    div.className = 'character-entry';
    div.innerHTML = `
      <input class="input" placeholder="Nombre del personaje" style="flex:1" data-char-idx="${idx}">
      <button class="remove-btn" title="Eliminar">✕</button>`;
    div.querySelector('.remove-btn').addEventListener('click', () => {
      div.remove();
      syncCharacters();
    });
    div.querySelector('input').addEventListener('input', syncCharacters);
    list.appendChild(div);
  }

  function syncCharacters() {
    const inputs = document.querySelectorAll('#character-entries input');
    const chars = [...inputs].map(i => i.value.trim()).filter(Boolean);
    SelectionManager.setCustomCharacters(chars);
    refreshWheel();
  }

  // ── UI helpers ──

  function toggleStreamer() {
    obsMode = !obsMode;
    document.body.classList.toggle('obs-mode', obsMode);
    const btn = document.getElementById('btn-streamer');
    if (btn) btn.textContent = obsMode ? '🎥 Modo Normal' : '🎥 Modo Stream';
    WheelEngine.resize();
  }

  function updateSpecialModePanel(mode) {
    const panel = document.getElementById('special-mode-panel');
    if (!panel) return;
    const MODES = SelectionManager.MODES;
    const specialModes = [MODES.DESTINY, MODES.BEST_OF_3, MODES.CURSE, MODES.CHALLENGE];
    panel.classList.toggle('hidden', !specialModes.includes(mode));

    if (mode === MODES.DESTINY) {
      panel.innerHTML = `
        <h3>⚡ DESTINO ABSOLUTO</h3>
        <p style="font-size:0.85rem;color:var(--color-text-muted)">La ruleta realizará 3 giros automáticos y decidirá tu destino final.</p>`;
    } else if (mode === MODES.BEST_OF_3) {
      panel.innerHTML = `
        <h3>🏆 BEST OF 3</h3>
        <p style="font-size:0.85rem;color:var(--color-text-muted)">Se generarán 3 candidatos. ¡Elige el que quieras!</p>`;
    } else if (mode === MODES.CURSE) {
      panel.innerHTML = `
        <h3>🔮 MODO MALDICIÓN</h3>
        <p style="font-size:0.85rem;color:var(--color-text-muted)">Cada tirada añade una restricción. El destino es inevitable.</p>
        <button class="btn btn-sm" onclick="SelectionManager.clearCurse();showToast('Maldición eliminada ✅','success')">✨ Limpiar maldición</button>`;
    } else if (mode === MODES.CHALLENGE) {
      panel.innerHTML = `
        <h3>🏹 MODO DESAFÍO</h3>
        <p style="font-size:0.85rem;color:var(--color-text-muted)">El universo te lanza un desafío. ¿Tienes agallas?</p>`;
    }
  }

  function randomColor() {
    const colors = ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899', '#f97316'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return { init, refreshWheel, spin };
})();

// ── Toast global ──
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Streak banner global ──
function showStreakBanner(message) {
  const banner = document.getElementById('streak-banner');
  if (!banner) return;
  banner.textContent = message;
  banner.classList.add('visible');
  setTimeout(() => banner.classList.remove('visible'), 4000);
}

// ── Arranque ──
window.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
window.showToast = showToast;
window.showStreakBanner = showStreakBanner;
