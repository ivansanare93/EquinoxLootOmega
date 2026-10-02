/**
 * sounds.js — Sistema de sonidos con Web Audio API (sin archivos externos)
 */

const SoundsManager = (() => {
  let ctx = null;
  let enabled = true;
  let volume = 0.5;
  let spinOscillator = null;
  let spinGain = null;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        enabled = false;
      }
    }
    return ctx;
  }

  function resume() {
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume();
  }

  /** Tono de spin — sube de frecuencia al comenzar */
  function startSpin() {
    if (!enabled) return;
    resume();
    const c = getCtx();
    if (!c) return;

    stopSpin();

    spinGain = c.createGain();
    spinGain.gain.setValueAtTime(0.08 * volume, c.currentTime);
    spinGain.connect(c.destination);

    spinOscillator = c.createOscillator();
    spinOscillator.type = 'sawtooth';
    spinOscillator.frequency.setValueAtTime(80, c.currentTime);
    spinOscillator.frequency.linearRampToValueAtTime(300, c.currentTime + 1.5);
    spinOscillator.connect(spinGain);
    spinOscillator.start();
  }

  /** Desaceleración al frenar */
  function slowdownSpin() {
    if (!enabled || !spinOscillator) return;
    const c = getCtx();
    if (!c) return;
    spinOscillator.frequency.linearRampToValueAtTime(60, c.currentTime + 2);
    if (spinGain) spinGain.gain.linearRampToValueAtTime(0.02 * volume, c.currentTime + 2);
  }

  function stopSpin() {
    if (spinOscillator) {
      try { spinOscillator.stop(); } catch (e) { /* ya parado */ }
      spinOscillator = null;
    }
    spinGain = null;
  }

  /** Fanfarria de victoria */
  function playVictory() {
    if (!enabled) return;
    resume();
    const c = getCtx();
    if (!c) return;

    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    const durations = [0.15, 0.15, 0.15, 0.4];

    let t = now;
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25 * volume, t + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + durations[i]);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + durations[i] + 0.1);
      t += durations[i] * 0.8;
    });
  }

  /** Clic de tick en la ruleta */
  function playTick() {
    if (!enabled) return;
    resume();
    const c = getCtx();
    if (!c) return;

    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 800 + Math.random() * 200;
    gain.gain.setValueAtTime(0.06 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /** Sonido de error / sin opciones */
  function playError() {
    if (!enabled) return;
    resume();
    const c = getCtx();
    if (!c) return;

    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.4);
    gain.gain.setValueAtTime(0.2 * volume, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /** Sonido de maldición / modo caos */
  function playChaos() {
    if (!enabled) return;
    resume();
    const c = getCtx();
    if (!c) return;

    const now = c.currentTime;
    [1, 1.5, 0.8].forEach((mult, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 150 * mult;
      const t = now + i * 0.15;
      gain.gain.setValueAtTime(0.1 * volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  function setEnabled(v) { enabled = v; }
  function isEnabled() { return enabled; }
  function setVolume(v) { volume = Math.max(0, Math.min(1, v)); }
  function getVolume() { return volume; }

  return {
    startSpin,
    slowdownSpin,
    stopSpin,
    playVictory,
    playTick,
    playError,
    playChaos,
    setEnabled,
    isEnabled,
    setVolume,
    getVolume
  };
})();

window.SoundsManager = SoundsManager;
