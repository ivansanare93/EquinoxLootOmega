/**
 * themes.js — Gestión del tema visual
 */

const ThemesManager = (() => {
  const THEMES = ['wow', 'slime', 'dark', 'classic'];
  let current = 'wow';

  function apply(theme) {
    if (!THEMES.includes(theme)) theme = 'wow';
    current = theme;
    // Eliminar clases anteriores
    THEMES.forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${theme}`);
    // Actualizar dots activos
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === theme);
    });
    // Guardar en localStorage
    try { localStorage.setItem('ruleta_theme', theme); } catch (e) { /* noop */ }
  }

  function getCurrent() { return current; }

  function init() {
    let saved = 'wow';
    try { saved = localStorage.getItem('ruleta_theme') || 'wow'; } catch (e) { /* noop */ }
    // URL param override
    const params = new URLSearchParams(window.location.search);
    if (params.get('theme')) saved = params.get('theme');
    apply(saved);
  }

  return { apply, getCurrent, init, THEMES };
})();

window.ThemesManager = ThemesManager;
