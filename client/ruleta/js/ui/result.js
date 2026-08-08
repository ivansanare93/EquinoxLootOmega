/**
 * result.js — Pantalla de resultado espectacular + confeti + frases
 */

const ResultUI = (() => {
  let overlay = null;
  let onBan = null;
  let onSpin = null;
  let lastResult = null;

  function init(overlayEl, banCb, spinCb) {
    overlay = overlayEl;
    onBan = banCb;
    onSpin = spinCb;
  }

  /**
   * Muestra el resultado de forma espectacular.
   * @param {object} result - Resultado de SelectionManager.select()
   */
  function show(result) {
    if (!overlay) return;
    lastResult = result;
    const html = buildHTML(result);
    overlay.innerHTML = html;
    overlay.classList.add('visible');

    // Bind botones
    overlay.querySelector('#btn-spin-again')?.addEventListener('click', () => {
      hide();
      if (onSpin) onSpin();
    });

    overlay.querySelector('#btn-ban-result')?.addEventListener('click', () => {
      banCurrentResult();
    });

    overlay.querySelector('#btn-close-result')?.addEventListener('click', hide);

    overlay.querySelector('#btn-mark-favorite')?.addEventListener('click', () => {
      const id = getResultId(result);
      if (id) {
        StreaksManager.markFavorite(id);
        showToast('Marcado como favorito ⭐', 'success');
      }
    });

    overlay.querySelector('#btn-mark-bad')?.addEventListener('click', () => {
      const id = getResultId(result);
      if (id) {
        StreaksManager.markBad(id);
        showToast('Marcado como malo 💀', 'warning');
      }
    });

    // Confeti y efectos
    spawnConfetti(result);
    spawnEmojiFloat(result);
  }

  function hide() {
    if (!overlay) return;
    overlay.classList.remove('visible');
  }

  function buildHTML(result) {
    const isError = result.error;
    if (isError) {
      return `
        <div id="result-card">
          <div class="result-label">⚠️ Sin opciones disponibles</div>
          <p class="text-muted" style="margin:16px 0">Activa más clases o especializaciones en los filtros.</p>
          <div class="result-actions">
            <button class="result-btn primary" id="btn-close-result">Cerrar</button>
          </div>
        </div>`;
    }

    if (result.type === 'best_of_3') {
      return buildBestOf3HTML(result);
    }

    if (result.type === 'challenge') {
      return buildChallengeHTML(result);
    }

    if (result.type === 'chaos' && result.chaosType === 'faction') {
      return buildFactionHTML(result);
    }

    if (result.type === 'chaos' && result.chaosType === 'race') {
      return buildRaceHTML(result);
    }

    if (result.type === 'chaos' && result.chaosType === 'role') {
      return buildRoleHTML(result);
    }

    if (result.type === 'character') {
      return buildCharacterHTML(result);
    }

    if (result.type === 'class') {
      return buildClassHTML(result);
    }

    // class_spec o spec
    return buildClassSpecHTML(result);
  }

  function buildClassSpecHTML(result) {
    const cls = result.class || (result.spec ? { name: result.spec.className, color: result.spec.classColor, icon: result.spec.classIcon, id: result.spec.classId } : null);
    const spec = result.spec;
    if (!cls || !spec) return buildClassHTML(result);

    const isFav = StreaksManager.isFavorite(spec.id);
    const isBad = StreaksManager.isBad(spec.id);
    const message = WOWDataUtils.getResultMessage(spec, isFav, isBad);
    const roleCls = `badge-${spec.role}`;
    const roleStr = { tank: '🛡️ Tanque', healer: '💚 Sanador', dps: '⚔️ DPS' }[spec.role] || spec.role;

    let curseHtml = '';
    if (result.curseRestrictions && result.curseRestrictions.length) {
      curseHtml = `
        <div style="background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.4);border-radius:8px;padding:10px;margin-top:12px;text-align:left">
          <div style="font-size:0.75rem;color:#ef4444;font-weight:700;margin-bottom:6px">🔮 MALDICIONES ACTIVAS:</div>
          ${result.curseRestrictions.map(r => `<div style="font-size:0.78rem;color:#fca5a5;padding:2px 0">• ${r}</div>`).join('')}
        </div>`;
    }

    return `
      <div id="result-card" style="border-color:${cls.color}20">
        <div class="result-divider">━━━━━━━━━━━━━━━━━━━━</div>
        <div class="result-label">🎉 ¡TU DESTINO ESTÁ DECIDIDO! 🎉</div>
        <div class="result-divider">━━━━━━━━━━━━━━━━━━━━</div>

        <span class="result-class-icon class-icon-reveal">${cls.icon}</span>
        <div class="result-class-name" style="color:${cls.color}">${cls.name}</div>
        <div class="result-spec-name" style="color:${spec.color || cls.color}">${spec.icon} ${spec.name}</div>

        <span class="result-role-badge ${roleCls}">${roleStr}</span>
        <div class="result-description">${spec.description || ''}</div>
        <div class="result-message">"${message}"</div>

        ${curseHtml}

        <div class="result-divider">━━━━━━━━━━━━━━━━━━━━</div>

        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 ¡VOLVER A GIRAR!</button>
          <button class="result-btn danger" id="btn-ban-result" title="Nunca más">❌ Eliminar</button>
          <button class="result-btn" id="btn-mark-favorite" title="Favorito">⭐ Favorito</button>
          <button class="result-btn" id="btn-mark-bad" title="Mala opción">💀 Malo</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function buildClassHTML(result) {
    const cls = result.class;
    if (!cls) return '<div id="result-card"><p>Error</p></div>';
    return `
      <div id="result-card" style="border-color:${cls.color}40">
        <div class="result-label">🎲 CLASE SELECCIONADA</div>
        <span class="result-class-icon class-icon-reveal">${cls.icon}</span>
        <div class="result-class-name" style="color:${cls.color}">${cls.name}</div>
        <div class="result-description">${cls.description || ''}</div>
        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 Volver a girar</button>
          <button class="result-btn danger" id="btn-ban-result">❌ Eliminar</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function buildBestOf3HTML(result) {
    const cards = (result.candidates || []).map((c, i) => `
      <div class="candidate-card" data-idx="${i}" style="border-color:${c.class.color}40">
        <span class="cand-icon">${c.class.icon}</span>
        <div class="cand-name" style="color:${c.class.color}">${c.class.name}</div>
        <div class="cand-spec">${c.spec.icon} ${c.spec.name}</div>
      </div>`).join('');

    return `
      <div id="result-card">
        <div class="result-label">🏆 BEST OF 3 — Elige tu destino</div>
        <div class="candidates-grid" style="margin:20px 0">${cards}</div>
        <div class="result-actions">
          <button class="result-btn" id="btn-spin-again">🎲 Re-generar</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function buildChallengeHTML(result) {
    const ch = result.challenge;
    return `
      <div id="result-card">
        <div class="result-label">🏹 DESAFÍO</div>
        <div style="font-size:1.5rem;margin:20px 0;color:var(--color-primary);font-family:var(--font-main)">${ch.text}</div>
        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 Otro desafío</button>
          <button class="result-btn" id="btn-close-result">✕ Aceptar</button>
        </div>
      </div>`;
  }

  function buildFactionHTML(result) {
    const f = result.faction;
    return `
      <div id="result-card">
        <div class="result-label">⚔️ FACCIÓN DECIDIDA</div>
        <div style="font-size:4rem;margin:16px 0">${f.icon}</div>
        <div class="result-class-name" style="color:${f.color}">${f.name}</div>
        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 Re-girar</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function buildRaceHTML(result) {
    const r = result.race;
    return `
      <div id="result-card">
        <div class="result-label">🧬 RAZA SELECCIONADA</div>
        <div style="font-size:4rem;margin:16px 0">${r.icon}</div>
        <div class="result-class-name">${r.name}</div>
        <div style="font-size:0.85rem;color:var(--color-text-muted);margin-top:8px">${r.faction === 'alliance' ? '🔵 Alianza' : '🔴 Horda'}</div>
        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 Re-girar</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function buildRoleHTML(result) {
    const icons = { tank: '🛡️', healer: '💚', dps: '⚔️' };
    const names = { tank: 'TANQUE', healer: 'SANADOR', dps: 'DPS' };
    const r = result.role;
    return `
      <div id="result-card">
        <div class="result-label">🎭 ROL SELECCIONADO</div>
        <div style="font-size:5rem;margin:16px 0">${icons[r] || '🎲'}</div>
        <div class="result-class-name role-${r}">${names[r] || r}</div>
        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 Re-girar</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function buildCharacterHTML(result) {
    return `
      <div id="result-card">
        <div class="result-label">👤 PERSONAJE SELECCIONADO</div>
        <div style="font-size:4rem;margin:16px 0">🎮</div>
        <div class="result-class-name">${result.character || '?'}</div>
        <div class="result-actions">
          <button class="result-btn primary" id="btn-spin-again">🎲 Re-girar</button>
          <button class="result-btn" id="btn-close-result">✕ Cerrar</button>
        </div>
      </div>`;
  }

  function banCurrentResult() {
    if (!lastResult) return;
    const spec = lastResult.spec;
    const cls = lastResult.class;
    if (spec) {
      FiltersManager.ban('spec', spec.id);
      showToast(`${spec.name} eliminado de la ruleta ❌`, 'danger');
    } else if (cls) {
      FiltersManager.ban('class', cls.id);
      showToast(`${cls.name} eliminado de la ruleta ❌`, 'danger');
    }
    HistoryUI.renderBanned();
    hide();
    if (window.App) App.refreshWheel();
  }

  function getResultId(result) {
    if (result.spec) return result.spec.id;
    if (result.class) return result.class.id;
    return null;
  }

  /** Confeti de colores */
  function spawnConfetti(result) {
    const colors = result.class ? [result.class.color, '#f59e0b', '#8b5cf6', '#ffffff'] : ['#f59e0b', '#8b5cf6'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.cssText = `
        left: ${40 + Math.random() * 20}%;
        top: ${30 + Math.random() * 20}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --dx: ${(Math.random() - 0.5) * 600}px;
        --dy: ${100 + Math.random() * 400}px;
        --rot: ${Math.random() * 720 - 360}deg;
        --duration: ${1.5 + Math.random() * 1}s;
        --delay: ${Math.random() * 0.5}s;
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  }

  function spawnEmojiFloat(result) {
    const emojis = ['🎉', '✨', '⭐', '🔥', '💥'];
    const icon = result.class?.icon || '🎲';
    [icon, ...emojis.slice(0, 2)].forEach((emoji, i) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'emoji-float';
        el.style.cssText = `left: ${40 + i * 10}%; top: 60%;`;
        el.textContent = emoji;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
      }, i * 300);
    });
  }

  return { init, show, hide };
})();

window.ResultUI = ResultUI;
