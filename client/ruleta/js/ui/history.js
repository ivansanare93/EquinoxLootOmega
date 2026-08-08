/**
 * history.js — Historial y sistema de baneados (UI)
 */

const HistoryUI = (() => {
  let container = null;
  let bannedContainer = null;

  function init(histEl, bannedEl) {
    container = histEl;
    bannedContainer = bannedEl;
    render();
    renderBanned();
  }

  function add(entry) {
    ConfigManager.addToHistory(entry);
    render();
  }

  function render() {
    if (!container) return;
    const history = ConfigManager.getHistory();
    if (!history.length) {
      container.innerHTML = '<p class="text-muted text-center" style="font-size:0.82rem;padding:12px">Sin tiradas aún.</p>';
      return;
    }
    container.innerHTML = history.map(h => {
      const icon = h.specIcon || h.classIcon || '🎲';
      const name = h.specName ? `${h.className} ${h.specName}` : (h.className || h.character || '?');
      const time = formatTime(h.timestamp);
      const role = h.role ? `<span class="role-${h.role}" style="font-size:0.7rem">[${roleLabel(h.role)}]</span>` : '';
      return `
        <div class="history-item">
          <span class="hist-icon">${icon}</span>
          <div class="hist-info">
            <div class="hist-name">${name} ${role}</div>
            <div class="hist-time">${time}</div>
          </div>
        </div>`;
    }).join('');
  }

  function renderBanned() {
    if (!bannedContainer) return;
    const banned = FiltersManager.getBanned();
    if (!banned.length) {
      bannedContainer.innerHTML = '<p class="text-muted text-center" style="font-size:0.82rem;padding:12px">Sin baneados.</p>';
      return;
    }
    bannedContainer.innerHTML = banned.map(key => {
      const [type, id] = key.split(':');
      let label = id;
      if (type === 'spec') {
        const s = WOWDataUtils.getSpecById(id);
        if (s) label = `${s.classIcon} ${s.className} — ${s.name}`;
      } else if (type === 'class') {
        const c = WOWDataUtils.getClassById(id);
        if (c) label = `${c.icon} ${c.name}`;
      }
      return `
        <div class="banned-item">
          <span style="flex:1;font-size:0.82rem">${label}</span>
          <button class="restore-btn" data-key="${key}" title="Restaurar">♻️</button>
        </div>`;
    }).join('');

    bannedContainer.querySelectorAll('.restore-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        FiltersManager.unban(btn.dataset.key);
        renderBanned();
        if (window.App) App.refreshWheel();
        showToast('Opción restaurada ✅', 'success');
      });
    });
  }

  function clearHistory() {
    ConfigManager.clearHistory();
    render();
  }

  function clearBanned() {
    FiltersManager.clearBanned();
    renderBanned();
  }

  function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Ahora mismo';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return d.toLocaleDateString('es-ES');
  }

  function roleLabel(role) {
    return { tank: 'Tanque', healer: 'Healer', dps: 'DPS' }[role] || role;
  }

  return { init, add, render, renderBanned, clearHistory, clearBanned };
})();

window.HistoryUI = HistoryUI;
