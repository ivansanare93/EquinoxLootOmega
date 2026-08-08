/**
 * panels.js — Paneles de filtros, configuración y personajes
 */

const PanelsUI = (() => {
  let filtersContainer = null;
  let configModal = null;

  function init() {
    filtersContainer = document.getElementById('filters-panel');
    configModal = document.getElementById('config-modal');
    renderFilters();
    renderConfig();
    bindCollapseToggle();
  }

  // ── Filtros ──

  function renderFilters() {
    if (!filtersContainer) return;
    const state = FiltersManager.getState();

    filtersContainer.innerHTML = `
      ${buildRoleSection(state)}
      ${buildDpsTypeSection(state)}
      ${buildClassSection()}
      ${buildSpecSection()}
      ${buildWeightsSection()}
    `;

    bindFilterEvents();
  }

  function buildRoleSection(state) {
    const roles = [
      { key: 'tank', label: '🛡️ Tanque' },
      { key: 'healer', label: '💚 Healer' },
      { key: 'dps', label: '⚔️ DPS' }
    ];
    const checks = roles.map(r => `
      <label class="filter-checkbox">
        <input type="checkbox" data-type="role" data-key="${r.key}" ${state.roles[r.key] ? 'checked' : ''}>
        ${r.label}
      </label>`).join('');
    return sectionHtml('🎭 Roles', checks, 'role-section');
  }

  function buildDpsTypeSection(state) {
    const types = [
      { key: 'melee', label: '⚔️ Cuerpo a cuerpo' },
      { key: 'ranged', label: '🏹 A distancia' }
    ];
    const checks = types.map(t => `
      <label class="filter-checkbox">
        <input type="checkbox" data-type="dpsType" data-key="${t.key}" ${state.dpsType[t.key] ? 'checked' : ''}>
        ${t.label}
      </label>`).join('');
    return sectionHtml('💥 Tipo DPS', checks, 'dpstype-section');
  }

  function buildClassSection() {
    const state = FiltersManager.getState();
    const tags = WOW_DATA.classes.map(cls => {
      const active = state.classes[cls.id];
      return `
        <div class="class-filter-tag ${active ? 'active' : 'inactive'}"
             data-type="class" data-key="${cls.id}"
             style="background:${active ? cls.color + '25' : 'transparent'};color:${cls.color};border-color:${active ? cls.color : 'transparent'}">
          ${cls.icon} ${cls.name}
        </div>`;
    }).join('');

    const bulks = `
      <div class="bulk-actions">
        <button class="bulk-btn" data-bulk="all-classes">✅ Todas</button>
        <button class="bulk-btn" data-bulk="none-classes">❌ Ninguna</button>
      </div>`;

    return sectionHtml('⚔️ Clases', bulks + `<div class="filter-group">${tags}</div>`, 'class-section');
  }

  function buildSpecSection() {
    const state = FiltersManager.getState();
    const groups = WOW_DATA.classes.map(cls => {
      const specs = cls.specs.map(spec => `
        <label class="filter-checkbox" style="width:100%">
          <input type="checkbox" data-type="spec" data-key="${spec.id}" ${state.specs[spec.id] ? 'checked' : ''}>
          ${spec.icon} ${spec.name} <span class="role-${spec.role}" style="font-size:0.7rem;margin-left:4px">[${roleShort(spec.role)}]</span>
        </label>`).join('');
      return `<div style="margin-bottom:10px">
        <div style="font-size:0.78rem;color:${cls.color};font-weight:700;margin-bottom:4px">${cls.icon} ${cls.name}</div>
        ${specs}
      </div>`;
    }).join('');

    const bulks = `
      <div class="bulk-actions" style="flex-wrap:wrap">
        <button class="bulk-btn" data-bulk="all-specs">✅ Todas</button>
        <button class="bulk-btn" data-bulk="none-specs">❌ Ninguna</button>
        <button class="bulk-btn" data-bulk="only-tanks">🛡️ Solo tanques</button>
        <button class="bulk-btn" data-bulk="only-healers">💚 Solo healers</button>
        <button class="bulk-btn" data-bulk="only-dps">⚔️ Solo DPS</button>
        <button class="bulk-btn" data-bulk="random-5">🎲 5 aleatorias</button>
        <button class="bulk-btn" data-bulk="random-10">🎲 10 aleatorias</button>
      </div>`;

    return sectionHtml('📋 Especializaciones', bulks + `<div id="spec-list" style="max-height:300px;overflow-y:auto;padding:4px">${groups}</div>`, 'spec-section');
  }

  function buildWeightsSection() {
    const rows = WOW_DATA.classes.flatMap(cls =>
      cls.specs.map(spec => {
        const w = WeightsManager.getWeight(spec.id);
        return `
          <div class="weight-row">
            <label title="${spec.name}">${spec.icon} ${spec.name}</label>
            <input type="range" min="1" max="10" value="${w}" data-spec="${spec.id}" class="weight-slider">
            <span class="weight-value" data-wval="${spec.id}">${w}</span>
          </div>`;
      })
    ).join('');

    const controls = `
      <div class="bulk-actions" style="margin-bottom:8px">
        <button class="bulk-btn" data-bulk="reset-weights">↩️ Reset</button>
        <label class="filter-checkbox">
          <input type="checkbox" id="memory-toggle" ${WeightsManager.isMemoryEnabled() ? 'checked' : ''}>
          🧠 Ruleta con memoria
        </label>
      </div>`;

    return sectionHtml('⚖️ Pesos', controls + `<div style="max-height:200px;overflow-y:auto">${rows}</div>`, 'weights-section', true /* collapsed by default */);
  }

  function sectionHtml(title, content, id, collapsed = false) {
    return `
      <div class="panel-section ${collapsed ? 'collapsed' : ''}" id="${id}">
        <div class="panel-section-title">
          ${title}
          <span class="toggle-icon">▼</span>
        </div>
        <div class="panel-section-content" style="max-height: ${collapsed ? '0' : '2000px'}">
          ${content}
        </div>
      </div>`;
  }

  function bindFilterEvents() {
    // Checkboxes de rol
    filtersContainer.querySelectorAll('[data-type="role"]').forEach(cb => {
      cb.addEventListener('change', () => {
        FiltersManager.getState().roles[cb.dataset.key] = cb.checked;
        if (window.App) App.refreshWheel();
      });
    });

    // Checkboxes de dpsType
    filtersContainer.querySelectorAll('[data-type="dpsType"]').forEach(cb => {
      cb.addEventListener('change', () => {
        FiltersManager.getState().dpsType[cb.dataset.key] = cb.checked;
        if (window.App) App.refreshWheel();
      });
    });

    // Tags de clase
    filtersContainer.querySelectorAll('[data-type="class"]').forEach(tag => {
      tag.addEventListener('click', () => {
        const st = FiltersManager.getState();
        st.classes[tag.dataset.key] = !st.classes[tag.dataset.key];
        renderFilters();
        if (window.App) App.refreshWheel();
      });
    });

    // Checkboxes de spec
    filtersContainer.querySelectorAll('[data-type="spec"]').forEach(cb => {
      cb.addEventListener('change', () => {
        FiltersManager.getState().specs[cb.dataset.key] = cb.checked;
        if (window.App) App.refreshWheel();
      });
    });

    // Bulk actions
    filtersContainer.querySelectorAll('[data-bulk]').forEach(btn => {
      btn.addEventListener('click', () => handleBulk(btn.dataset.bulk));
    });

    // Sliders de peso
    filtersContainer.querySelectorAll('.weight-slider').forEach(sl => {
      sl.addEventListener('input', () => {
        WeightsManager.setWeight(sl.dataset.spec, sl.value);
        const label = filtersContainer.querySelector(`[data-wval="${sl.dataset.spec}"]`);
        if (label) label.textContent = sl.value;
        if (window.App) App.refreshWheel();
      });
    });

    // Toggle memoria
    const memToggle = filtersContainer.querySelector('#memory-toggle');
    if (memToggle) {
      memToggle.addEventListener('change', () => {
        WeightsManager.setMemoryEnabled(memToggle.checked);
      });
    }
  }

  function handleBulk(action) {
    switch (action) {
      case 'all-classes':
        WOW_DATA.classes.forEach(c => FiltersManager.getState().classes[c.id] = true);
        break;
      case 'none-classes':
        WOW_DATA.classes.forEach(c => FiltersManager.getState().classes[c.id] = false);
        break;
      case 'all-specs':
        FiltersManager.setAllSpecs(true);
        break;
      case 'none-specs':
        FiltersManager.setAllSpecs(false);
        break;
      case 'only-tanks':
        FiltersManager.setByRole('tank');
        break;
      case 'only-healers':
        FiltersManager.setByRole('healer');
        break;
      case 'only-dps':
        FiltersManager.setByRole('dps');
        break;
      case 'random-5':
        FiltersManager.selectRandomN(5);
        break;
      case 'random-10':
        FiltersManager.selectRandomN(10);
        break;
      case 'reset-weights':
        WeightsManager.resetAll();
        break;
    }
    renderFilters();
    if (window.App) App.refreshWheel();
  }

  function bindCollapseToggle() {
    document.addEventListener('click', e => {
      const title = e.target.closest('.panel-section-title');
      if (!title) return;
      const section = title.parentElement;
      section.classList.toggle('collapsed');
      const content = section.querySelector('.panel-section-content');
      if (content) {
        content.style.maxHeight = section.classList.contains('collapsed') ? '0' : '2000px';
      }
    });
  }

  // ── Config modal ──

  function renderConfig() {
    if (!configModal) return;
    const cfg = ConfigManager.get();
    document.getElementById('config-modal-inner').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="font-family:var(--font-main);color:var(--color-primary);margin:0">⚙️ Configuración</h2>
        <button class="btn btn-icon" id="close-config">✕</button>
      </div>

      <div class="config-row">
        <label>🎵 Sonidos</label>
        <label class="toggle-switch">
          <input type="checkbox" id="cfg-sound" ${cfg.soundEnabled ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="config-row">
        <label>🔊 Volumen</label>
        <input type="range" min="0" max="1" step="0.05" value="${cfg.soundVolume}" id="cfg-volume" style="accent-color:var(--color-primary)">
      </div>
      <div class="config-row">
        <label>✨ Animaciones</label>
        <label class="toggle-switch">
          <input type="checkbox" id="cfg-anim" ${cfg.animationsEnabled ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="config-row">
        <label>⏱️ Duración del giro (ms)</label>
        <input class="input" type="number" id="cfg-duration" value="${cfg.spinDuration}" min="1000" max="12000" step="500" style="width:100px">
      </div>
      <div class="config-row">
        <label>🔁 Permitir repetición</label>
        <label class="toggle-switch">
          <input type="checkbox" id="cfg-repeat" ${cfg.allowRepeat ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="config-row">
        <label>📚 Historial máximo</label>
        <input class="input" type="number" id="cfg-maxhist" value="${cfg.maxHistory}" min="5" max="200" style="width:80px">
      </div>

      <div style="margin-top:20px">
        <div style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:10px">🎨 Tema visual</div>
        <div class="theme-selector">
          ${ThemesManager.THEMES.map(t => `
            <div class="theme-dot ${t === ThemesManager.getCurrent() ? 'active' : ''}" data-theme="${t}" title="${t}">
              <span class="theme-label">${t}</span>
            </div>`).join('')}
        </div>
      </div>

      <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:10px">
        <button class="btn btn-primary" id="cfg-save">💾 Guardar</button>
        <button class="btn" id="cfg-export">📤 Exportar</button>
        <label class="btn" style="cursor:pointer">
          📥 Importar
          <input type="file" id="cfg-import-file" accept=".json" style="display:none">
        </label>
        <button class="btn btn-danger" id="cfg-reset">🔄 Reset total</button>
      </div>

      <div style="margin-top:12px">
        <button class="btn btn-danger btn-sm" id="cfg-clear-history">🗑️ Borrar historial</button>
        <button class="btn btn-sm" id="cfg-clear-banned" style="margin-left:8px">♻️ Restaurar todos los baneados</button>
      </div>
    `;
    bindConfigEvents();
  }

  function bindConfigEvents() {
    document.getElementById('close-config')?.addEventListener('click', hideConfig);
    configModal?.addEventListener('click', e => { if (e.target === configModal) hideConfig(); });

    document.getElementById('cfg-save')?.addEventListener('click', () => {
      ConfigManager.set('soundEnabled', document.getElementById('cfg-sound').checked);
      ConfigManager.set('soundVolume', parseFloat(document.getElementById('cfg-volume').value));
      ConfigManager.set('animationsEnabled', document.getElementById('cfg-anim').checked);
      ConfigManager.set('spinDuration', parseInt(document.getElementById('cfg-duration').value));
      ConfigManager.set('allowRepeat', document.getElementById('cfg-repeat').checked);
      ConfigManager.set('maxHistory', parseInt(document.getElementById('cfg-maxhist').value));
      SoundsManager.setEnabled(ConfigManager.get('soundEnabled'));
      SoundsManager.setVolume(ConfigManager.get('soundVolume'));
      showToast('Configuración guardada ✅', 'success');
      hideConfig();
    });

    document.getElementById('cfg-export')?.addEventListener('click', () => {
      ConfigManager.exportConfig(FiltersManager.getSerializable(), WeightsManager.getAll());
    });

    document.getElementById('cfg-import-file')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const ok = ConfigManager.importConfig(ev.target.result, data => {
          if (data.filters) FiltersManager.setState(data.filters);
          if (data.weights) WeightsManager.setAll(data.weights);
          if (data.characters && window.SelectionManager) SelectionManager.setCustomCharacters(data.characters);
          renderFilters();
          if (window.App) App.refreshWheel();
        });
        if (ok) showToast('Configuración importada ✅', 'success');
        else showToast('Error al importar el archivo ❌', 'danger');
      };
      reader.readAsText(file);
    });

    document.getElementById('cfg-reset')?.addEventListener('click', () => {
      if (confirm('¿Resetear toda la configuración?')) {
        ConfigManager.reset();
        FiltersManager.init();
        WeightsManager.init();
        renderFilters();
        if (window.App) App.refreshWheel();
        showToast('Configuración reseteada 🔄', 'warning');
        hideConfig();
      }
    });

    document.getElementById('cfg-clear-history')?.addEventListener('click', () => {
      ConfigManager.clearHistory();
      HistoryUI.render();
      showToast('Historial borrado 🗑️', 'warning');
    });

    document.getElementById('cfg-clear-banned')?.addEventListener('click', () => {
      FiltersManager.clearBanned();
      HistoryUI.renderBanned();
      if (window.App) App.refreshWheel();
      showToast('Todos los baneados restaurados ♻️', 'success');
    });

    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        ThemesManager.apply(dot.dataset.theme);
        ConfigManager.set('theme', dot.dataset.theme);
        document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d === dot));
      });
    });
  }

  function showConfig() {
    if (!configModal) return;
    renderConfig();
    configModal.classList.add('visible');
  }

  function hideConfig() {
    configModal?.classList.remove('visible');
  }

  function roleShort(role) {
    return { tank: 'T', healer: 'H', dps: 'D' }[role] || role;
  }

  return { init, renderFilters, showConfig, hideConfig };
})();

window.PanelsUI = PanelsUI;
