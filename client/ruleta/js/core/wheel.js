/**
 * wheel.js — Motor de renderizado de la ruleta (Canvas-based)
 */

const WheelEngine = (() => {
  let canvas, ctx;
  let items = [];        // { label, color, icon, weight }
  let currentAngle = 0;  // ángulo actual (radianes)
  let targetAngle = 0;   // ángulo objetivo
  let spinning = false;
  let spinStartTime = 0;
  let spinDuration = 4000; // ms
  let onComplete = null;
  let raf = null;
  let resultIndex = -1;

  // Parámetros visuales
  const POINTER_OFFSET = Math.PI / 2; // puntero a la derecha → ángulo inicial 0 = derecha

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
  }

  function resize() {
    if (!canvas) return;
    const size = Math.min(canvas.parentElement.offsetWidth - 48, 520);
    canvas.width = size;
    canvas.height = size;
    draw();
  }

  /** Actualiza los ítems de la ruleta */
  function setItems(newItems) {
    items = newItems.map(item => ({
      label: item.label || item.name || '?',
      sublabel: item.sublabel || '',
      color: item.color || '#666',
      icon: item.icon || '⚔️',
      weight: item.weight || 1
    }));
    draw();
  }

  /** Dibuja la ruleta en su estado actual */
  function draw() {
    if (!ctx || !canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (items.length === 0) {
      drawEmpty(cx, cy, r);
      return;
    }

    const totalWeight = items.reduce((a, b) => a + b.weight, 0);
    let startAngle = currentAngle;

    items.forEach((item, i) => {
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
      drawSlice(cx, cy, r, startAngle, startAngle + sliceAngle, item, i);
      startAngle += sliceAngle;
    });

    // Sombra central
    drawCenter(cx, cy);

    // Decoración exterior
    drawOuterRing(cx, cy, r);
  }

  function drawSlice(cx, cy, r, startAngle, endAngle, item, index) {
    // Sección
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();

    // Color con degradado
    const midAngle = (startAngle + endAngle) / 2;
    const grd = ctx.createLinearGradient(
      cx + Math.cos(midAngle) * r * 0.1,
      cy + Math.sin(midAngle) * r * 0.1,
      cx + Math.cos(midAngle) * r * 0.9,
      cy + Math.sin(midAngle) * r * 0.9
    );
    const baseColor = item.color;
    grd.addColorStop(0, lightenColor(baseColor, 30));
    grd.addColorStop(1, darkenColor(baseColor, 20));
    ctx.fillStyle = grd;
    ctx.fill();

    // Borde separador
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto
    const labelAngle = (startAngle + endAngle) / 2;
    const sliceAngle = endAngle - startAngle;
    const textDist = r * 0.6;

    ctx.save();
    ctx.translate(
      cx + Math.cos(labelAngle) * textDist,
      cy + Math.sin(labelAngle) * textDist
    );
    ctx.rotate(labelAngle + Math.PI / 2);

    // Solo mostrar texto si la sección es suficientemente grande
    if (sliceAngle > 0.08) {
      // Icono
      const iconSize = Math.max(10, Math.min(22, r * 0.12));
      ctx.font = `${iconSize}px serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(item.icon, 0, -8);

      // Label
      if (sliceAngle > 0.18) {
        const fontSize = Math.max(8, Math.min(14, r * 0.055));
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        const maxWidth = r * 0.5;
        ctx.fillText(truncate(item.label, 12), 0, 8, maxWidth);
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();
  }

  function drawCenter(cx, cy) {
    // Círculo central
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    gradient.addColorStop(0, '#2a1a4e');
    gradient.addColorStop(1, '#1a0f2e');

    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(245,158,11,0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Símbolo central
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('🎲', cx, cy);
    ctx.textBaseline = 'alphabetic';
  }

  function drawOuterRing(cx, cy, r) {
    // Anillo exterior decorativo
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(245,158,11,0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(245,158,11,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawEmpty(cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(30,41,59,0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(245,158,11,0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '2rem serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(245,158,11,0.4)';
    ctx.fillText('⚠️', cx, cy - 20);

    ctx.font = '0.85rem Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('Sin opciones disponibles', cx, cy + 16);
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * Inicia el giro de la ruleta.
   * @param {number} targetIndexOverride - Índice forzado del resultado (opcional)
   * @param {Function} completeCb - Callback con el resultado
   * @param {number} durationMs - Duración del giro en ms
   */
  function spin(targetIndexOverride, completeCb, durationMs = 4000) {
    if (spinning || items.length === 0) return;

    spinning = true;
    onComplete = completeCb;
    spinDuration = durationMs;
    spinStartTime = performance.now();

    // Calcular ángulo objetivo
    const totalWeight = items.reduce((a, b) => a + b.weight, 0);
    let targetIdx = targetIndexOverride;

    if (targetIdx === undefined || targetIdx < 0) {
      // Selección aleatoria ponderada
      let rand = Math.random() * totalWeight;
      targetIdx = 0;
      for (let i = 0; i < items.length; i++) {
        rand -= items[i].weight;
        if (rand <= 0) { targetIdx = i; break; }
      }
    }
    resultIndex = targetIdx;

    // Calcular el ángulo central de la sección objetivo
    let angleToTarget = 0;
    let angleAcc = 0;
    for (let i = 0; i < items.length; i++) {
      const sliceAngle = (items[i].weight / totalWeight) * 2 * Math.PI;
      if (i === targetIdx) {
        angleToTarget = angleAcc + sliceAngle / 2;
        break;
      }
      angleAcc += sliceAngle;
    }

    // El puntero está a la derecha (ángulo 0)
    // Necesitamos que angleToTarget quede en ángulo 0 (derecha)
    // El canvas gira: el ángulo actual + desplazamiento = -angleToTarget
    const minSpins = 5;
    const extra = (Math.random() * 0.8 + 0.1); // algo de aleatoriedad
    const totalRotation = (minSpins + extra) * 2 * Math.PI;

    const startAngle = currentAngle;
    const endAngle = startAngle + totalRotation + (-angleToTarget - (startAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    targetAngle = endAngle;

    raf = requestAnimationFrame(animateFrame.bind(null, startAngle, endAngle));
  }

  function animateFrame(startAngle, endAngle, timestamp) {
    const elapsed = timestamp - spinStartTime;
    const t = Math.min(elapsed / spinDuration, 1);

    // Easing: desaceleración cúbica con tensión
    const eased = easeOutCubic(t);
    currentAngle = startAngle + (endAngle - startAngle) * eased;

    draw();

    if (t < 1) {
      raf = requestAnimationFrame(animateFrame.bind(null, startAngle, endAngle));
    } else {
      currentAngle = endAngle;
      spinning = false;
      draw();
      if (onComplete) onComplete(resultIndex);
    }
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function stopSpin() {
    if (raf) cancelAnimationFrame(raf);
    spinning = false;
  }

  function isSpinning() { return spinning; }
  function getResultIndex() { return resultIndex; }

  // Utilidades de color
  function lightenColor(hex, amount) {
    return adjustColor(hex, amount);
  }

  function darkenColor(hex, amount) {
    return adjustColor(hex, -amount);
  }

  function adjustColor(hex, amount) {
    try {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min(255, Math.max(0, (num >> 16) + amount));
      const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
      const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
      return `rgb(${r},${g},${b})`;
    } catch (e) {
      return hex;
    }
  }

  function truncate(str, maxLen) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
  }

  return {
    init,
    resize,
    setItems,
    draw,
    spin,
    stopSpin,
    isSpinning,
    getResultIndex
  };
})();

window.WheelEngine = WheelEngine;
