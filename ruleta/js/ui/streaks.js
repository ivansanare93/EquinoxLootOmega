/**
 * streaks.js — Sistema de rachas y gamificación
 */

const StreaksManager = (() => {
  let stats = {
    totalSpins: 0,
    classesUsed: new Set(),
    rolesCount: { tank: 0, healer: 0, dps: 0 },
    lastRoles: [], // últimos 5 roles
    lastResults: [], // últimos 5 resultados
    favoriteIds: new Set(), // IDs marcados como favoritos
    badIds: new Set()       // IDs marcados como malos
  };

  const STREAK_THRESHOLD = 3; // tiradas seguidas para activar mensaje de racha

  function recordResult(result) {
    stats.totalSpins++;

    const role = result.spec ? result.spec.role : null;
    if (role) {
      stats.rolesCount[role] = (stats.rolesCount[role] || 0) + 1;
      stats.lastRoles.unshift(role);
      if (stats.lastRoles.length > 5) stats.lastRoles.pop();
    }

    const classId = result.class ? result.class.id : null;
    if (classId) stats.classesUsed.add(classId);

    const resultId = result.spec ? result.spec.id : (result.class ? result.class.id : null);
    stats.lastResults.unshift(resultId);
    if (stats.lastResults.length > 5) stats.lastResults.pop();

    updateStatsBar();
    return checkStreak();
  }

  function checkStreak() {
    const lastRoles = stats.lastRoles.slice(0, STREAK_THRESHOLD);
    if (lastRoles.length < STREAK_THRESHOLD) return null;

    const allSame = lastRoles.every(r => r === lastRoles[0]);

    if (allSame) {
      const role = lastRoles[0];
      const isBad = stats.badIds.has(stats.lastResults[0]);
      const isGood = stats.favoriteIds.has(stats.lastResults[0]);

      if (isBad || stats.lastResults.slice(0, STREAK_THRESHOLD).every(id => stats.badIds.has(id))) {
        return { type: 'bad', message: WOWDataUtils.getRandomMessage('streak_bad') };
      }
      if (isGood || stats.lastResults.slice(0, STREAK_THRESHOLD).every(id => stats.favoriteIds.has(id))) {
        return { type: 'good', message: WOWDataUtils.getRandomMessage('streak_good') };
      }
    }
    return null;
  }

  function isFinalBoss() {
    return stats.totalSpins > 0 && stats.totalSpins % 10 === 0;
  }

  function markFavorite(id) { stats.favoriteIds.add(id); }
  function markBad(id) { stats.badIds.add(id); }
  function isFavorite(id) { return stats.favoriteIds.has(id); }
  function isBad(id) { return stats.badIds.has(id); }

  function updateStatsBar() {
    const bar = document.getElementById('stats-bar');
    if (!bar) return;
    bar.innerHTML = `
      <div class="stat-chip">🎲 Tiradas: <span>${stats.totalSpins}</span></div>
      <div class="stat-chip">⚔️ Clases: <span>${stats.classesUsed.size}</span></div>
      <div class="stat-chip">🛡️ Tanque: <span>${stats.rolesCount.tank || 0}</span></div>
      <div class="stat-chip">💚 Healer: <span>${stats.rolesCount.healer || 0}</span></div>
      <div class="stat-chip">🗡️ DPS: <span>${stats.rolesCount.dps || 0}</span></div>
    `;
  }

  function reset() {
    stats = {
      totalSpins: 0,
      classesUsed: new Set(),
      rolesCount: { tank: 0, healer: 0, dps: 0 },
      lastRoles: [],
      lastResults: [],
      favoriteIds: new Set(),
      badIds: new Set()
    };
    updateStatsBar();
  }

  function getStats() { return stats; }

  return {
    recordResult,
    checkStreak,
    isFinalBoss,
    markFavorite,
    markBad,
    isFavorite,
    isBad,
    updateStatsBar,
    reset,
    getStats
  };
})();

window.StreaksManager = StreaksManager;
