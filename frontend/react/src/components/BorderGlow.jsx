import { useRef, useCallback, useEffect } from 'react';
import './BorderGlow.css';

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 38, s: 90, l: 65 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity = 1.0) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  // Silky, refined luxury opacities that never blow out into harsh neon wire strokes
  const opacities = [75, 50, 38, 28, 18, 12, 6];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    const alpha = Math.min(opacities[i] * intensity, 100);
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${alpha}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function isLightColor(color) {
  if (!color || typeof color !== 'string') return false;
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 28,
  glowColor = '199 95 62',
  backgroundColor = 'rgba(8, 12, 22, 0.92)',
  borderRadius = 28,
  glowRadius = 38,
  glowIntensity = 1.0,
  coneSpread = 28,
  animated = false,
  colors = ['#38bdf8', '#818cf8', '#0284c7'],
  fillOpacity = 0.45,
  style = {},
  innerStyle = {},
  innerClassName = '',
  ...restProps
}) => {
  const cardRef = useRef(null);
  const animFrameRef = useRef(null);
  const isHoveredRef = useRef(false);

  // Inertial physics values
  const currentValues = useRef({
    angle: 45,
    proximity: 0,
    x: 100,
    y: 100
  });

  const targetValues = useRef({
    angle: 45,
    proximity: 0,
    x: 100,
    y: 100
  });

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const startAnimationLoop = useCallback(() => {
    if (animFrameRef.current) return;

    const tick = () => {
      const card = cardRef.current;
      if (!card) {
        animFrameRef.current = null;
        return;
      }

      const cur = currentValues.current;
      const tgt = targetValues.current;
      const factor = 0.14; // Buttery smooth physical inertia

      // Shortest arc angular interpolation
      let angleDiff = (tgt.angle - cur.angle + 540) % 360 - 180;
      cur.angle = (cur.angle + angleDiff * factor + 360) % 360;

      // Proximity easing
      cur.proximity += (tgt.proximity - cur.proximity) * factor;

      // Position easing
      cur.x += (tgt.x - cur.x) * factor;
      cur.y += (tgt.y - cur.y) * factor;

      card.style.setProperty('--edge-proximity', `${cur.proximity.toFixed(2)}`);
      card.style.setProperty('--cursor-angle', `${cur.angle.toFixed(2)}deg`);
      card.style.setProperty('--cursor-x', `${cur.x.toFixed(1)}px`);
      card.style.setProperty('--cursor-y', `${cur.y.toFixed(1)}px`);

      const hasMovement =
        Math.abs(angleDiff) > 0.05 ||
        Math.abs(tgt.proximity - cur.proximity) > 0.08 ||
        Math.abs(tgt.x - cur.x) > 0.4 ||
        Math.abs(tgt.y - cur.y) > 0.4;

      if (hasMovement || isHoveredRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    isHoveredRef.current = true;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    targetValues.current.angle = angle;
    targetValues.current.proximity = edge * 100;
    targetValues.current.x = x;
    targetValues.current.y = y;

    startAnimationLoop();
  }, [getEdgeProximity, getCursorAngle, startAnimationLoop]);

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    targetValues.current.proximity = 0;
    startAnimationLoop();
  }, [startAnimationLoop]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => card.style.setProperty('--edge-proximity', v),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const lightSurface = isLightColor(backgroundColor);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card${lightSurface ? ' border-glow-card--light' : ''} ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...buildGradientVars(colors),
        ...style
      }}
      {...restProps}
    >
      <span className="edge-light" />
      <div className={`border-glow-inner ${innerClassName}`} style={innerStyle}>
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
