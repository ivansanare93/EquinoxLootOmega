(() => {
  const storageKey = 'equinox.gameVersion';
  const allowedVersions = new Set(['retail', 'forever']);

  function getSelectedVersion() {
    try {
      const version = localStorage.getItem(storageKey);
      return allowedVersions.has(version) ? version : null;
    } catch (error) {
      return null;
    }
  }

  function setSelectedVersion(version) {
    if (!allowedVersions.has(version)) return false;

    try {
      localStorage.setItem(storageKey, version);
      return true;
    } catch (error) {
      return false;
    }
  }

  function updateLastSelection(selectedVersion) {
    document.querySelectorAll('[data-last-version]').forEach((element) => {
      element.hidden = element.dataset.lastVersion !== selectedVersion;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const selectedVersion = getSelectedVersion();
    updateLastSelection(selectedVersion);

    document.querySelectorAll('[data-game-version]').forEach((element) => {
      element.addEventListener('click', () => {
        setSelectedVersion(element.dataset.gameVersion);
      });
    });
  });

  window.EquinoxGameVersion = {
    getSelectedVersion,
    setSelectedVersion
  };
})();
