import React, { useRef, useEffect } from 'react';

/* ─── 3D maths helpers ─────────────────────────────────────── */
function rotX(x: number, y: number, z: number, a: number) {
  return { x, y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
}
function rotY(x: number, y: number, z: number, a: number) {
  return { x: x * Math.cos(a) + z * Math.sin(a), y, z: -x * Math.sin(a) + z * Math.cos(a) };
}
function rotZ(x: number, y: number, z: number, a: number) {
  return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a), z };
}
function project(x: number, y: number, z: number, cx: number, cy: number, fov = 380) {
  const s = fov / (fov + z);
  return { px: cx + x * s, py: cy + y * s, scale: s };
}

/* ─── Orbit definitions (tilt around X then Z) ────────────── */
const ORBITS = [
  { tiltX: 1.15, tiltZ: 0,                     speed: 0.026,  phase: 0,    trailLen: 28 },
  { tiltX: 1.15, tiltZ: (Math.PI * 2) / 3,     speed: -0.019, phase: 2.09, trailLen: 22 },
  { tiltX: 1.15, tiltZ: (Math.PI * 4) / 3,     speed: 0.022,  phase: 4.19, trailLen: 25 },
];
const ORBIT_RADIUS = 95;
const TRAIL_STEPS  = 40; // points sampled per trail

export const CreativeLogoShowcase: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    /* per-orbit phase angles */
    const phases = ORBITS.map(o => o.phase);
    let globalY = 0;   // slow global Y-rotation for the 3D feel
    let raf: number;

    /* ── Map a circle point in orbit's local plane → world 3D → screen ── */
    function orbitPoint(orbit: typeof ORBITS[0], angle: number, gy: number) {
      const lx = Math.cos(angle) * ORBIT_RADIUS;
      const ly = Math.sin(angle) * ORBIT_RADIUS;
      const lz = 0;
      // tilt in orbit's plane
      let p = rotX(lx, ly, lz, orbit.tiltX);
      p = rotZ(p.x, p.y, p.z, orbit.tiltZ);
      // global slow Y spin
      p = rotY(p.x, p.y, p.z, gy);
      return { ...project(p.x, p.y, p.z, cx, cy), worldZ: p.z };
    }

    /* ── Draw one elliptical orbit ring ── */
    function drawRing(orbit: typeof ORBITS[0], gy: number) {
      const segments = 120;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const { px, py } = orbitPoint(orbit, a, gy);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(250,204,21,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* ── Draw electron + comet trail ── */
    function drawElectron(orbit: typeof ORBITS[0], phase: number, gy: number) {
      const { px, py, worldZ } = orbitPoint(orbit, phase, gy);

      // depth factor: 0 (far behind) → 1 (full front)
      const depth = (worldZ + ORBIT_RADIUS) / (ORBIT_RADIUS * 2);
      const alpha  = 0.35 + depth * 0.65;
      const radius = 2.5 + depth * 3.5;

      /* Comet trail: sample backward along orbit */
      const trailCount = orbit.trailLen;
      for (let i = trailCount; i >= 1; i--) {
        const trailAngle = phase - (i / trailCount) * 1.4; // arc length of trail
        const t = orbitPoint(orbit, trailAngle, gy);
        const tDepth = (t.worldZ + ORBIT_RADIUS) / (ORBIT_RADIUS * 2);
        const tAlpha = ((trailCount - i) / trailCount) * 0.55 * (0.3 + tDepth * 0.7);
        const tRadius = 1 + ((trailCount - i) / trailCount) * 3;

        ctx.beginPath();
        ctx.arc(t.px, t.py, Math.max(0.4, tRadius * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250,204,21,${tAlpha.toFixed(3)})`;
        ctx.fill();
      }

      /* Electron glow */
      const grad = ctx.createRadialGradient(px, py, 0, px, py, radius * 3.5);
      grad.addColorStop(0,   `rgba(255,255,220,${alpha.toFixed(2)})`);
      grad.addColorStop(0.3, `rgba(250,204,21,${(alpha * 0.9).toFixed(2)})`);
      grad.addColorStop(1,   'rgba(202,138,4,0)');
      ctx.beginPath();
      ctx.arc(px, py, radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      /* Electron solid core */
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,200,${alpha.toFixed(2)})`;
      ctx.fill();

      return { worldZ };
    }

    /* ── Draw nucleus ── */
    function drawNucleus(t: number) {
      const pulse = 1 + Math.sin(t * 0.04) * 0.12;

      /* outer corona */
      const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, 52 * pulse);
      corona.addColorStop(0,   'rgba(250,204,21,0.35)');
      corona.addColorStop(0.5, 'rgba(202,138,4,0.12)');
      corona.addColorStop(1,   'rgba(120,53,15,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 52 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      /* middle glow */
      const mid = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26 * pulse);
      mid.addColorStop(0,   'rgba(255,255,200,1)');
      mid.addColorStop(0.3, 'rgba(250,204,21,0.95)');
      mid.addColorStop(0.7, 'rgba(202,138,4,0.7)');
      mid.addColorStop(1,   'rgba(120,53,15,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 26 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = mid;
      ctx.fill();

      /* solid core */
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 11);
      core.addColorStop(0,   '#ffffff');
      core.addColorStop(0.5, '#facc15');
      core.addColorStop(1,   '#ca8a04');
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    }

    /* ── Main animation loop ── */
    let frame = 0;
    function tick() {
      frame++;
      globalY += 0.006; // slow global rotation

      ctx.clearRect(0, 0, W, H);

      /* Draw all three rings first */
      ORBITS.forEach(o => drawRing(o, globalY));

      /* Advance phases */
      ORBITS.forEach((o, i) => { phases[i] += o.speed; });

      /* Collect electrons with their worldZ for depth sort */
      const electrons = ORBITS.map((o, i) => ({ orbit: o, phase: phases[i] }));

      /* Sort by worldZ ascending (draw far-behind ones first) */
      const zData = electrons.map(e => {
        const { worldZ } = orbitPoint(e.orbit, e.phase, globalY);
        return { ...e, worldZ };
      });
      zData.sort((a, b) => a.worldZ - b.worldZ);

      /* Draw electrons behind nucleus first, nucleus, then front electrons */
      const behind = zData.filter(e => e.worldZ < 0);
      const front  = zData.filter(e => e.worldZ >= 0);

      behind.forEach(e => drawElectron(e.orbit, e.phase, globalY));
      drawNucleus(frame);
      front.forEach(e => drawElectron(e.orbit, e.phase, globalY));

      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none"
      style={{ width: 360, height: 360 }}>
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        style={{ display: 'block' }}
      />
    </div>
  );
};
