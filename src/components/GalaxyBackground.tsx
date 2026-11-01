"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Rgb = readonly [number, number, number];

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  glow: boolean;
  twinkleSpeed: number;
  twinkleOffset: number;
};

type Sparkle = {
  x: number;
  y: number;
  size: number;
  sprite: HTMLCanvasElement;
  twinkleSpeed: number;
  twinkleOffset: number;
};

type Nebula = {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  size: number;
  opacity: number;
  drift: number;
  breathSpeed: number;
  breathOffset: number;
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
};

type Mover = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

type Satellite = Mover & { blinkOffset: number };
type Comet = Mover & { tail: number; bend: number };
type SkyEvent = "satellite" | "shower" | "comet";

// Star tints by rough temperature: mostly white and blue-white, a few warm.
const STAR_COLORS: [Rgb, number][] = [
  [[255, 255, 255], 0.42],
  [[208, 220, 255], 0.3],
  [[255, 242, 224], 0.14],
  [[255, 216, 170], 0.1],
  [[255, 184, 160], 0.04],
];

const NEBULA_PALETTE: Rgb[] = [
  [99, 102, 241],
  [168, 85, 247],
  [236, 72, 153],
  [59, 130, 246],
  [139, 92, 246],
];

// Three depth layers. Far stars barely react to scroll and the mouse; near
// stars move the most, which is what reads as depth.
const LAYERS = [
  { perPx: 8000, cap: 240, size: [0.25, 0.7], alpha: [0.08, 0.38], scroll: 0.03, mouse: 4 },
  { perPx: 18000, cap: 90, size: [0.6, 1.15], alpha: [0.15, 0.5], scroll: 0.08, mouse: 10 },
  { perPx: 40000, cap: 40, size: [1.0, 1.6], alpha: [0.3, 0.65], scroll: 0.16, mouse: 18 },
] as const;

// Extra room around the viewport so the Milky Way can slide without showing an edge.
const MILKY_MARGIN = 140;
// Nebulae are soft, so they are pre-rendered at half resolution.
const NEBULA_SCALE = 0.5;
const FRAME_MS = 1000 / 60;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
// Roughly bell-shaped values in [-1, 1].
const gaussian = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
const mod = (n: number, m: number) => ((n % m) + m) % m;
const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

function pickStarColor(): Rgb {
  let r = Math.random();
  for (const [rgb, weight] of STAR_COLORS) {
    r -= weight;
    if (r <= 0) return rgb;
  }
  return STAR_COLORS[0][0];
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

function makeGlowSprite() {
  const size = 32;
  const c = makeCanvas(size, size);
  const x = c.getContext("2d");
  if (!x) return c;
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(200, 210, 255, 0.9)");
  g.addColorStop(0.4, "rgba(200, 210, 255, 0.2)");
  g.addColorStop(1, "rgba(200, 210, 255, 0)");
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  return c;
}

// A bright star with soft four-point diffraction spikes.
function makeSparkleSprite(rgb: Rgb) {
  const size = 64;
  const mid = size / 2;
  const c = makeCanvas(size, size);
  const x = c.getContext("2d");
  if (!x) return c;

  const glow = x.createRadialGradient(mid, mid, 0, mid, mid, mid * 0.5);
  glow.addColorStop(0, rgba(rgb, 0.95));
  glow.addColorStop(0.25, rgba(rgb, 0.35));
  glow.addColorStop(1, rgba(rgb, 0));
  x.fillStyle = glow;
  x.fillRect(0, 0, size, size);

  const spike = (len: number, thick: number, alpha: number, angle: number) => {
    x.save();
    x.translate(mid, mid);
    x.rotate(angle);
    const g = x.createLinearGradient(-len, 0, len, 0);
    g.addColorStop(0, rgba(rgb, 0));
    g.addColorStop(0.5, rgba(rgb, alpha));
    g.addColorStop(1, rgba(rgb, 0));
    x.fillStyle = g;
    x.fillRect(-len, -thick / 2, len * 2, thick);
    x.restore();
  };
  spike(mid, 1.2, 0.85, 0);
  spike(mid, 1.2, 0.85, Math.PI / 2);
  spike(mid * 0.45, 0.8, 0.35, Math.PI / 4);
  spike(mid * 0.45, 0.8, 0.35, -Math.PI / 4);
  return c;
}

// A wispy gas cloud: a random walk of soft blobs, so it reads as an uneven
// cloud instead of a round glow.
function makeNebula(radius: number) {
  const size = radius * 2 * NEBULA_SCALE;
  const mid = size / 2;
  const c = makeCanvas(size, size);
  const x = c.getContext("2d");
  if (!x) return c;

  const c1 = pick(NEBULA_PALETTE);
  const c2 = pick(NEBULA_PALETTE);
  x.globalCompositeOperation = "lighter";

  let px = mid;
  let py = mid;
  let heading = rand(0, Math.PI * 2);
  const blobs = Math.round(rand(16, 24));
  for (let i = 0; i < blobs; i++) {
    heading += rand(-0.9, 0.9);
    px += Math.cos(heading) * mid * rand(0.08, 0.2);
    py += Math.sin(heading) * mid * rand(0.08, 0.2);
    const dx = px - mid;
    const dy = py - mid;
    if (Math.hypot(dx, dy) > mid * 0.45) {
      heading = Math.atan2(-dy, -dx) + rand(-0.5, 0.5);
      px = mid + dx * 0.8;
      py = mid + dy * 0.8;
    }
    const r = mid * rand(0.18, 0.42);
    const col = mix(c1, c2, Math.random());
    const a = rand(0.025, 0.06);
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, rgba(col, a));
    g.addColorStop(0.6, rgba(col, a * 0.35));
    g.addColorStop(1, rgba(col, 0));
    x.fillStyle = g;
    x.fillRect(px - r, py - r, r * 2, r * 2);
  }

  // A few brighter knots inside the cloud.
  const knots = Math.round(rand(2, 5));
  for (let i = 0; i < knots; i++) {
    const kx = mid + gaussian() * mid * 0.35;
    const ky = mid + gaussian() * mid * 0.35;
    const r = mid * rand(0.04, 0.09);
    const col = mix(mix(c1, c2, Math.random()), [255, 255, 255], 0.35);
    const g = x.createRadialGradient(kx, ky, 0, kx, ky, r);
    g.addColorStop(0, rgba(col, 0.04));
    g.addColorStop(1, rgba(col, 0));
    x.fillStyle = g;
    x.fillRect(kx - r, ky - r, r * 2, r * 2);
  }

  // Fade the edges so the square canvas never shows.
  x.globalCompositeOperation = "destination-in";
  const mask = x.createRadialGradient(mid, mid, 0, mid, mid, mid);
  mask.addColorStop(0, "rgba(0, 0, 0, 1)");
  mask.addColorStop(0.65, "rgba(0, 0, 0, 1)");
  mask.addColorStop(1, "rgba(0, 0, 0, 0)");
  x.fillStyle = mask;
  x.fillRect(0, 0, size, size);
  return c;
}

// A faint Milky Way band running corner to corner: a soft glow, thousands of
// tiny stars packed along its center, and darker dust lanes.
function makeMilkyWay(w: number, h: number, scale: number) {
  const cw = w + MILKY_MARGIN * 2;
  const ch = h + MILKY_MARGIN * 2;
  const c = makeCanvas(cw * scale, ch * scale);
  const x = c.getContext("2d");
  if (!x) return c;
  x.scale(scale, scale);

  const x0 = -0.1 * cw;
  const y0 = 0.82 * ch;
  const x1 = 1.1 * cw;
  const y1 = 0.18 * ch;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const dx = (x1 - x0) / len;
  const dy = (y1 - y0) / len;
  const bandW = Math.min(cw, ch) * 0.2;
  const along = (t: number, off: number) =>
    [x0 + dx * len * t - dy * off, y0 + dy * len * t + dx * off] as const;

  x.globalCompositeOperation = "lighter";
  for (let i = 0; i < 46; i++) {
    const [px, py] = along(Math.random(), gaussian() * bandW * 0.35);
    const r = bandW * rand(0.45, 1);
    const col = mix([120, 110, 220], [200, 190, 255], Math.random());
    const a = rand(0.008, 0.016);
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, rgba(col, a));
    g.addColorStop(1, rgba(col, 0));
    x.fillStyle = g;
    x.fillRect(px - r, py - r, r * 2, r * 2);
  }

  x.globalCompositeOperation = "source-over";
  const count = Math.min(2600, Math.floor((cw * ch) / 650));
  const sigma = bandW * 0.3;
  for (let i = 0; i < count; i++) {
    const off = gaussian() * bandW * 0.55;
    const [px, py] = along(Math.random(), off);
    const falloff = Math.exp(-(off * off) / (2 * sigma * sigma));
    x.fillStyle = rgba(pickStarColor(), rand(0.05, 0.4) * (0.25 + 0.75 * falloff));
    const s = rand(0.3, 0.8);
    x.fillRect(px, py, s, s);
  }

  x.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 14; i++) {
    const [px, py] = along(rand(0.1, 0.9), gaussian() * bandW * 0.12);
    const r = bandW * rand(0.12, 0.3);
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, "rgba(0, 0, 0, 0.35)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    x.fillStyle = g;
    x.fillRect(px - r, py - r, r * 2, r * 2);
  }
  return c;
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const hidden = pathname?.startsWith("/demos/") ?? false;

  useEffect(() => {
    if (hidden) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const glowSprite = makeGlowSprite();
    const sparkleSprites = [makeSparkleSprite([235, 240, 255]), makeSparkleSprite([255, 232, 200])];

    let W = 0;
    let H = 0;
    let fieldW = 0;
    let fieldH = 0;
    let layers: Star[][] = [];
    let sparkles: Sparkle[] = [];
    let nebulae: Nebula[] = [];
    let milkyWay: HTMLCanvasElement | null = null;
    const shootingStars: ShootingStar[] = [];
    let satellite: Satellite | null = null;
    let comet: Comet | null = null;
    const showerQueue: { at: number; x: number; y: number; angle: number }[] = [];

    // Scroll and mouse targets; the smoothed values ease toward them.
    let scrollTarget = window.scrollY;
    let scrollSmooth = scrollTarget;
    let maxScroll = 1;
    const mouseTarget = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    let sim = 0;
    let last = performance.now();
    let animationId = 0;
    let resizeTimer = 0;
    let nextEventAt = rand(20000, 40000);

    function readScroll() {
      scrollTarget = window.scrollY;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }

    // Wrap a position into [-pad, extent + pad) so a sprite fully leaves one
    // edge before it reappears at the other, instead of popping across.
    const wrap = (v: number, extent: number, pad: number) =>
      mod(v + pad, extent + 2 * pad) - pad;

    function initField() {
      fieldW = W;
      fieldH = H;
      const area = W * H;

      layers = LAYERS.map((layer) => {
        const count = Math.min(layer.cap, Math.floor(area / layer.perPx));
        return Array.from({ length: count }, () => {
          const size = rand(layer.size[0], layer.size[1]);
          const [r, g, b] = pickStarColor();
          return {
            x: Math.random() * W,
            y: Math.random() * H,
            size,
            opacity: rand(layer.alpha[0], layer.alpha[1]),
            color: `rgb(${r}, ${g}, ${b})`,
            glow: size > 1.1,
            twinkleSpeed: rand(0.003, 0.013),
            twinkleOffset: rand(0, Math.PI * 2),
          };
        });
      });

      const sparkleCount = Math.max(3, Math.min(7, Math.round(area / 220000)));
      sparkles = Array.from({ length: sparkleCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: rand(18, 30),
        sprite: Math.random() < 0.7 ? sparkleSprites[0] : sparkleSprites[1],
        twinkleSpeed: rand(0.004, 0.009),
        twinkleOffset: rand(0, Math.PI * 2),
      }));

      // Spread the clouds down a tall strip so scrolling the page slowly passes them.
      const travel = H * 0.6;
      const nebulaCount = 4;
      nebulae = Array.from({ length: nebulaCount }, (_, i) => {
        const radius = rand(260, 440) * (W < 700 ? 0.7 : 1);
        return {
          canvas: makeNebula(radius),
          x: Math.random() * W,
          y: ((i + Math.random()) / nebulaCount) * (H + travel),
          size: radius * 2,
          opacity: rand(0.4, 0.6),
          drift: (Math.random() - 0.5) * 0.08,
          breathSpeed: rand(0.004, 0.008),
          breathOffset: rand(0, Math.PI * 2),
        };
      });

      milkyWay = makeMilkyWay(W, H, Math.min(dpr, 1.5));
    }

    function triggerEvent(kind?: SkyEvent) {
      if (!kind) {
        const r = Math.random();
        kind = r < 0.45 ? "satellite" : r < 0.75 ? "shower" : "comet";
      }
      if (kind === "satellite" && satellite) kind = "shower";
      if (kind === "comet" && comet) kind = "shower";

      if (kind === "satellite") {
        const fromLeft = Math.random() < 0.5;
        const y0 = rand(0.1, 0.6) * H;
        const y1 = y0 + rand(-0.3, 0.3) * H;
        const x0 = fromLeft ? -10 : W + 10;
        const x1 = fromLeft ? W + 10 : -10;
        const duration = rand(28000, 45000);
        satellite = {
          x: x0,
          y: y0,
          vx: (x1 - x0) / duration,
          vy: (y1 - y0) / duration,
          life: 0,
          maxLife: duration,
          blinkOffset: rand(0, 1700),
        };
      } else if (kind === "comet") {
        const fromLeft = Math.random() < 0.5;
        const angle = fromLeft ? rand(0.15, 0.45) : Math.PI - rand(0.15, 0.45);
        const duration = rand(16000, 24000);
        const distance = rand(0.5, 0.8) * Math.hypot(W, H);
        comet = {
          x: fromLeft ? rand(-0.1, 0.3) * W : rand(0.7, 1.1) * W,
          y: rand(-0.05, 0.25) * H,
          vx: (Math.cos(angle) * distance) / duration,
          vy: (Math.sin(angle) * distance) / duration,
          life: 0,
          maxLife: duration,
          tail: rand(170, 280) * (W < 700 ? 0.6 : 1),
          bend: rand(0.06, 0.14) * (Math.random() < 0.5 ? -1 : 1),
        };
      } else {
        // Meteor shower: a few shooting stars from one point in quick succession.
        const angle = Math.PI / 4 + rand(-0.2, 0.2);
        const rx = rand(0.15, 0.75) * W;
        const ry = rand(0, 0.25) * H;
        let at = sim + 200;
        const count = Math.round(rand(3, 5));
        for (let i = 0; i < count; i++) {
          showerQueue.push({
            at,
            x: rx + rand(-80, 80),
            y: ry + rand(-40, 40),
            angle: angle + rand(-0.1, 0.1),
          });
          at += rand(220, 650);
        }
      }
    }

    function spawnShootingStar() {
      if (shootingStars.length > 1) return;
      if (Math.random() > 0.0015) return;

      shootingStars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }

    function step(dt: number) {
      const k = dt / FRAME_MS;
      const ease = (rate: number) => 1 - Math.pow(1 - rate, k);
      scrollSmooth += (scrollTarget - scrollSmooth) * ease(0.12);
      mouse.x += (mouseTarget.x - mouse.x) * ease(0.05);
      mouse.y += (mouseTarget.y - mouse.y) * ease(0.05);

      for (const n of nebulae) {
        n.x += n.drift * k;
        const half = n.size / 2;
        if (n.x < -half) n.x = W + half;
        if (n.x > W + half) n.x = -half;
      }

      for (const mover of [satellite, comet]) {
        if (!mover) continue;
        mover.x += mover.vx * dt;
        mover.y += mover.vy * dt;
        mover.life += dt;
      }
      if (satellite && satellite.life >= satellite.maxLife) satellite = null;
      if (comet && comet.life >= comet.maxLife) comet = null;

      while (showerQueue.length && showerQueue[0].at <= sim) {
        const m = showerQueue.shift()!;
        shootingStars.push({
          x: m.x,
          y: m.y,
          length: rand(50, 110),
          speed: rand(7, 13),
          angle: m.angle,
          opacity: 1,
          life: 0,
          maxLife: 50 + Math.random() * 40,
        });
      }

      if (sim >= nextEventAt) {
        triggerEvent();
        nextEventAt = sim + rand(45000, 90000);
      }
    }

    function drawStar(star: Star, x: number, y: number, alpha: number) {
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = star.color;
      ctx!.beginPath();
      ctx!.arc(x, y, star.size, 0, Math.PI * 2);
      ctx!.fill();

      if (star.glow) {
        const r = star.size * 3;
        ctx!.globalAlpha = alpha * 0.6;
        ctx!.drawImage(glowSprite, x - r, y - r, r * 2, r * 2);
      }
    }

    // Stars are laid out over the field size from the last re-init. Wrapping by
    // that size (not the live viewport) keeps density even when the viewport
    // grows a little without a re-init; a second copy fills any extra height.
    function drawStars(stars: Star[], offX: number, offY: number, t: number) {
      for (const star of stars) {
        const pad = star.glow ? star.size * 3 : star.size;
        const x = wrap(star.x + offX, fieldW, pad);
        const y = wrap(star.y + offY, fieldH, pad);
        const alpha =
          star.opacity * (Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7);
        drawStar(star, x, y, alpha);
        const period = fieldH + 2 * pad;
        if (y + period < H + pad) drawStar(star, x, y + period, alpha);
      }
    }

    function drawSatellite(s: Satellite) {
      const f = s.life / s.maxLife;
      const fade = Math.max(0, Math.min(1, f / 0.08, (1 - f) / 0.08));
      const x = s.x - mouse.x * 4;
      const y = s.y - mouse.y * 4;
      const flash = (s.life + s.blinkOffset) % 1700 < 110;

      ctx!.globalAlpha = fade * (flash ? 1 : 0.55);
      ctx!.fillStyle = "rgb(235, 240, 255)";
      ctx!.beginPath();
      ctx!.arc(x, y, flash ? 1.3 : 1, 0, Math.PI * 2);
      ctx!.fill();
      if (flash) {
        ctx!.globalAlpha = fade * 0.8;
        ctx!.drawImage(glowSprite, x - 5, y - 5, 10, 10);
      }
    }

    function drawComet(c: Comet) {
      const f = c.life / c.maxLife;
      const fade = Math.max(0, Math.min(1, f / 0.12, (1 - f) / 0.12));
      const hx = c.x - mouse.x * 10;
      const hy = c.y - mouse.y * 10;
      const speed = Math.hypot(c.vx, c.vy) || 1;
      const ux = c.vx / speed;
      const uy = c.vy / speed;
      const tx = hx - ux * c.tail;
      const ty = hy - uy * c.tail;
      // The dust tail curves slightly to one side; the ion tail stays straight.
      const bx = (hx + tx) / 2 - uy * c.tail * c.bend;
      const by = (hy + ty) / 2 + ux * c.tail * c.bend;

      ctx!.globalAlpha = fade;
      ctx!.lineCap = "round";

      let g = ctx!.createLinearGradient(hx, hy, tx, ty);
      g.addColorStop(0, "rgba(175, 165, 255, 0.16)");
      g.addColorStop(1, "rgba(175, 165, 255, 0)");
      ctx!.strokeStyle = g;
      ctx!.lineWidth = 7;
      ctx!.beginPath();
      ctx!.moveTo(hx, hy);
      ctx!.quadraticCurveTo(bx, by, tx, ty);
      ctx!.stroke();

      const ix = hx - ux * c.tail * 0.85;
      const iy = hy - uy * c.tail * 0.85;
      g = ctx!.createLinearGradient(hx, hy, ix, iy);
      g.addColorStop(0, "rgba(225, 232, 255, 0.8)");
      g.addColorStop(1, "rgba(225, 232, 255, 0)");
      ctx!.strokeStyle = g;
      ctx!.lineWidth = 1.4;
      ctx!.beginPath();
      ctx!.moveTo(hx, hy);
      ctx!.lineTo(ix, iy);
      ctx!.stroke();

      ctx!.drawImage(glowSprite, hx - 10, hy - 10, 20, 20);
      ctx!.fillStyle = "rgb(255, 255, 255)";
      ctx!.beginPath();
      ctx!.arc(hx, hy, 1.6, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.lineCap = "butt";
    }

    // Shooting stars run per frame exactly as before.
    function updateShootingStars() {
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx!.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(ss.x, ss.y);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        ctx!.globalAlpha = ss.opacity;
        ctx!.drawImage(glowSprite, ss.x - 6, ss.y - 6, 12, 12);
        ctx!.globalAlpha = 1;
      }
    }

    function render(t: number, animate: boolean) {
      ctx!.clearRect(0, 0, W, H);

      // The Milky Way and nebulae slide over the whole page length, but never
      // faster than the far star layer, so short pages keep the depth order.
      if (milkyWay) {
        const mwRate = Math.min((MILKY_MARGIN * 1.6) / maxScroll, 0.02);
        ctx!.globalAlpha = 1;
        ctx!.drawImage(
          milkyWay,
          -MILKY_MARGIN - mouse.x * 3,
          -MILKY_MARGIN + MILKY_MARGIN * 0.8 - scrollSmooth * mwRate - mouse.y * 3,
          fieldW + MILKY_MARGIN * 2,
          fieldH + MILKY_MARGIN * 2
        );
      }

      ctx!.globalCompositeOperation = "lighter";
      const nebulaOffset = scrollSmooth * Math.min((fieldH * 0.6) / maxScroll, 0.025);
      for (const n of nebulae) {
        const sx = n.x - n.size / 2 - mouse.x * 6;
        const sy = n.y - nebulaOffset - n.size / 2 - mouse.y * 6;
        if (sy > H || sy + n.size < 0) continue;
        const breath = 0.72 + 0.28 * Math.sin(t * n.breathSpeed + n.breathOffset);
        ctx!.globalAlpha = n.opacity * breath;
        ctx!.drawImage(n.canvas, sx, sy, n.size, n.size);
      }
      ctx!.globalCompositeOperation = "source-over";

      for (let i = 0; i < layers.length; i++) {
        const layer = LAYERS[i];
        drawStars(
          layers[i],
          -mouse.x * layer.mouse,
          -scrollSmooth * layer.scroll - mouse.y * layer.mouse,
          t
        );
        if (i === 0 && satellite) drawSatellite(satellite);
        if (i === 1 && comet) drawComet(comet);
      }

      const near = LAYERS[LAYERS.length - 1];
      const nearX = -mouse.x * near.mouse;
      const nearY = -scrollSmooth * near.scroll - mouse.y * near.mouse;
      for (const sp of sparkles) {
        const tw = Math.sin(t * sp.twinkleSpeed + sp.twinkleOffset);
        const size = sp.size * (0.85 + 0.15 * tw);
        // Pad by the base size (constant per sparkle) so the wrap never jitters.
        const pad = sp.size / 2;
        const cx = wrap(sp.x + nearX, fieldW, pad);
        const cy = wrap(sp.y + nearY, fieldH, pad);
        ctx!.globalAlpha = Math.max(0, 0.45 + 0.4 * tw);
        ctx!.drawImage(sp.sprite, cx - size / 2, cy - size / 2, size, size);
        const period = fieldH + 2 * pad;
        if (cy + period < H + pad) {
          ctx!.drawImage(sp.sprite, cx - size / 2, cy + period - size / 2, size, size);
        }
      }
      ctx!.globalAlpha = 1;

      if (animate) updateShootingStars();
    }

    function frame(now: number) {
      const dt = Math.min(Math.max(now - last, 0), 50);
      last = now;
      sim += dt;
      step(dt);
      render(sim / FRAME_MS, true);
      animationId = requestAnimationFrame(frame);
    }

    // clientWidth excludes the vertical scrollbar; innerWidth would make the
    // canvas a few px wider than the page and add a horizontal scrollbar.
    const viewportSize = () => ({
      w: document.documentElement.clientWidth || window.innerWidth,
      h: window.innerHeight,
    });

    function sizeBox() {
      const { w, h } = viewportSize();
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
    }

    function resize() {
      const { w, h } = viewportSize();
      W = w;
      H = h;
      sizeBox();
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile browsers resize the viewport as the address bar slides in and
      // out; keep the same sky for small height changes instead of reshuffling.
      if (!layers.length || Math.abs(W - fieldW) > 1 || Math.abs(H - fieldH) > 100) {
        initField();
      }
      // With reduced motion the scroll values stay frozen at their mount-time
      // values, so every redraw shows the same still sky.
      if (!reduceMotion) readScroll();
      else render(0, false);
    }

    const onResize = () => {
      // Resize the on-screen box right away (the last frame stretches to fill
      // it) and only rebuild the bitmap once resizing settles.
      sizeBox();
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };
    const onScroll = () => readScroll();
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !W || !H) return;
      mouseTarget.x = (e.clientX / W) * 2 - 1;
      mouseTarget.y = (e.clientY / H) * 2 - 1;
    };
    const onPointerLeave = () => {
      mouseTarget.x = 0;
      mouseTarget.y = 0;
    };

    readScroll();
    scrollSmooth = scrollTarget;
    resize();
    window.addEventListener("resize", onResize);

    const devWindow = window as unknown as { __galaxy?: { trigger: (kind?: SkyEvent) => void } };
    if (!reduceMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      animationId = requestAnimationFrame(frame);
      // Dev-only hook for previewing rare events: __galaxy.trigger("comet").
      if (process.env.NODE_ENV !== "production") devWindow.__galaxy = { trigger: triggerEvent };
    }
    // With reduced motion the sky is drawn once (and again on resize) and stays still.

    return () => {
      cancelAnimationFrame(animationId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      delete devWindow.__galaxy;
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
