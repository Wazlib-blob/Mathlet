'use client'
import { useEffect } from 'react'
import Script from 'next/script'

export default function HomePage() {
  useEffect(() => {
    // ── BACKGROUND CANVAS ─────────────────────────────────────────────────────────
    const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W: number, H: number;
    let bgRaf: number;

    function resizeBg() { W = canvas!.width = window.innerWidth; H = canvas!.height = window.innerHeight; }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    const fish = Array.from({ length: 5 }, () => ({
      x: Math.random() * 1800, y: 80 + Math.random() * (window.innerHeight * 0.6),
      speed: 0.3 + Math.random() * 0.45, size: 5 + Math.random() * 7,
      alpha: 0.07 + Math.random() * 0.07, wave: Math.random() * Math.PI * 2,
    }));

    const bubbles = Array.from({ length: 14 }, () => ({
      x: Math.random() * 1800, y: Math.random() * window.innerHeight,
      vy: 0.2 + Math.random() * 0.3, r: 1.5 + Math.random() * 2,
      alpha: 0.025 + Math.random() * 0.04,
    }));

    function animateBg(ts: number) {
      const t = ts / 1000;
      ctx.clearRect(0, 0, W, H);

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#14456015'); g.addColorStop(1, '#021020');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Caustic rays
      ctx.save(); ctx.globalAlpha = 0.018;
      for (let i = 0; i < 5; i++) {
        const x = ((i / 5 + t * 0.012) % 1) * W;
        const r = ctx.createLinearGradient(x, 0, x + 40, H * 0.5);
        r.addColorStop(0, '#7ae8ff'); r.addColorStop(1, 'transparent');
        ctx.fillStyle = r;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 22, H * 0.5); ctx.lineTo(x + 44, 0); ctx.fill();
      }
      ctx.restore();

      fish.forEach(f => {
        f.x += f.speed;
        if (f.x > W + 60) f.x = -60;
        const wy = Math.sin(t * 0.7 + f.wave) * 5;
        ctx.save(); ctx.globalAlpha = f.alpha;
        ctx.translate(f.x % W, f.y + wy); ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.ellipse(0, 0, f.size, f.size * 0.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-f.size, 0); ctx.lineTo(-f.size * 1.5, -f.size * 0.4); ctx.lineTo(-f.size * 1.5, f.size * 0.4); ctx.fill();
        ctx.restore();
      });

      bubbles.forEach(b => {
        b.y -= b.vy;
        if (b.y < -8) { b.y = H + 8; b.x = Math.random() * W; }
        ctx.globalAlpha = b.alpha;
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // Dot grid
      ctx.fillStyle = 'rgba(56,189,248,0.025)';
      for (let x = 0; x < W; x += 72)
        for (let y = 0; y < H; y += 72) {
          ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill();
        }

      bgRaf = requestAnimationFrame(animateBg);
    }
    bgRaf = requestAnimationFrame(animateBg);

    // ── MINI OCEAN CANVAS (inside featured card) ───────────────────────────────
    const mc = document.getElementById('mini-ocean') as HTMLCanvasElement | null;
    let miniRaf: number;
    if (mc) {
      const mx = mc.getContext('2d')!;

      function resizeMini() {
        const rect = mc!.parentElement!.getBoundingClientRect();
        mc!.width = rect.width; mc!.height = rect.height;
      }
      resizeMini();
      window.addEventListener('resize', resizeMini);

      let sharkT = 0;
      const LINE_START = { x: 0.12, y: 0.82 };
      const LINE_END   = { x: 0.90, y: 0.16 };

      function lerpPath(t: number) {
        return {
          x: LINE_START.x + (LINE_END.x - LINE_START.x) * t,
          y: LINE_START.y + (LINE_END.y - LINE_START.y) * t,
        };
      }

      function drawMiniGraph() {
        const mw = mc!.width, mh = mc!.height;
        mx.beginPath();
        mx.strokeStyle = 'rgba(255,215,0,0.55)';
        mx.lineWidth = 1.5;
        mx.setLineDash([6, 5]);
        mx.moveTo(LINE_START.x * mw, LINE_START.y * mh);
        mx.lineTo(LINE_END.x   * mw, LINE_END.y   * mh);
        mx.stroke();
        mx.setLineDash([]);
      }

      const miniSeaweed = Array.from({ length: 7 }, (_, i) => ({
        x: 0.06 + (i / 6) * 0.9 + (Math.random() - 0.5) * 0.06,
        h: 0.15 + Math.random() * 0.18,
        wave: Math.random() * Math.PI * 2,
        w: 3 + Math.random() * 3,
      }));

      function drawMiniSeaweed(sw: {x:number,h:number,wave:number,w:number}, t: number) {
        const mw = mc!.width, mh = mc!.height;
        const bx = sw.x * mw;
        const by = mh;
        const segsN = 8;
        const totalH = sw.h * mh;
        const swayAmp = totalH * 0.25;

        const left: {x:number,y:number}[] = [], right: {x:number,y:number}[] = [];
        for (let i = 0; i <= segsN; i++) {
          const k = i / segsN;
          const sway = Math.sin(t * 0.8 + sw.wave + k * 2.1) * swayAmp * k;
          const x = bx + sway;
          const y = by - k * totalH;
          const width = sw.w * (1 - k * 0.75) + 1;
          const notch = Math.sin(k * 3.2 + t * 0.5) * width * 0.2;
          left.push({ x: x - width - notch, y });
          right.push({ x: x + width + notch, y });
        }

        const grad = mx.createLinearGradient(bx, by, bx, by - totalH);
        grad.addColorStop(0, '#0a1410');
        grad.addColorStop(0.5, '#173320');
        grad.addColorStop(1, '#1f4528');

        mx.beginPath();
        mx.moveTo(left[0].x, left[0].y);
        for (let i = 1; i < left.length; i++) {
          const prev = left[i - 1];
          const curr = left[i];
          const cpx = (prev.x + curr.x) / 2;
          const cpy = (prev.y + curr.y) / 2;
          mx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
        }
        const tip = left[left.length - 1];
        const rtip = right[right.length - 1];
        mx.lineTo((tip.x + rtip.x) / 2, tip.y);
        for (let i = right.length - 1; i >= 1; i--) {
          const prev = right[i];
          const curr = right[i - 1];
          const cpx = (prev.x + curr.x) / 2;
          const cpy = (prev.y + curr.y) / 2;
          mx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
        }
        mx.closePath();
        mx.fillStyle = grad;
        mx.fill();
        mx.strokeStyle = 'rgba(4,9,6,0.9)';
        mx.lineWidth = 0.8;
        mx.stroke();
      }

      function drawMiniShark(x: number, y: number, dx: number, mw: number, mh: number) {
        const s = Math.min(mw, mh) * 0.07;
        const facing = dx >= 0 ? 1 : -1;
        mx.save();
        mx.translate(x, y);
        mx.scale(facing, 1);

        mx.beginPath();
        mx.ellipse(0, 0, s * 1.7, s * 0.55, 0, 0, Math.PI * 2);
        mx.fillStyle = '#4a9bb5';
        mx.fill();

        mx.beginPath();
        mx.ellipse(s * 0.2, s * 0.1, s * 1.2, s * 0.28, 0, 0, Math.PI * 2);
        mx.fillStyle = '#c8e8f0';
        mx.fill();

        mx.beginPath();
        mx.moveTo(-s * 1.5, 0);
        mx.lineTo(-s * 2.2, -s * 0.7);
        mx.lineTo(-s * 2.2, s * 0.7);
        mx.closePath();
        mx.fillStyle = '#3a8aa0';
        mx.fill();

        mx.beginPath();
        mx.moveTo(0, -s * 0.55);
        mx.lineTo(s * 0.5, -s * 1.1);
        mx.lineTo(s * 0.9, -s * 0.55);
        mx.closePath();
        mx.fillStyle = '#3a8aa0';
        mx.fill();

        mx.beginPath();
        mx.arc(s * 1.1, -s * 0.05, s * 0.12, 0, Math.PI * 2);
        mx.fillStyle = '#04080f';
        mx.fill();

        mx.restore();
      }

      function drawMiniAxes() {
        const mw = mc!.width, mh = mc!.height;
        const ox = LINE_START.x * mw;
        const oy = LINE_START.y * mh;
        mx.strokeStyle = 'rgba(56,189,248,0.18)';
        mx.lineWidth = 1;
        mx.beginPath(); mx.moveTo(0, oy); mx.lineTo(mw, oy); mx.stroke();
        mx.beginPath(); mx.moveTo(ox, 0); mx.lineTo(ox, mh); mx.stroke();
      }

      let prevShark = { x: 0, y: 0 };

      function animateMini(ts: number) {
        const t = ts / 1000;
        const mw = mc!.width, mh = mc!.height;
        mx.clearRect(0, 0, mw, mh);

        const g = mx.createLinearGradient(0, 0, 0, mh);
        g.addColorStop(0, '#0e2d4a'); g.addColorStop(1, '#061220');
        mx.fillStyle = g; mx.fillRect(0, 0, mw, mh);

        drawMiniAxes();
        miniSeaweed.forEach(sw => drawMiniSeaweed(sw, t));
        drawMiniGraph();

        sharkT = (t * 0.065) % 1;
        const pos = lerpPath(sharkT);
        const px = pos.x * mw, py = pos.y * mh;
        const dx = px - prevShark.x;
        drawMiniShark(px, py, dx, mw, mh);
        prevShark = { x: px, y: py };

        mx.font = '700 11px "JetBrains Mono", monospace';
        mx.fillStyle = 'rgba(255,215,0,0.6)';
        mx.fillText('y = x', mw * 0.55, mh * 0.22);

        miniRaf = requestAnimationFrame(animateMini);
      }

      miniRaf = requestAnimationFrame(animateMini);
    }

    // ── HERO UNDERWATER WORLD ──────────────────────────────────────────────────
    const heroCanvas = document.getElementById('hero-ocean') as HTMLCanvasElement | null;
    let heroRaf: number;
    let heroRo: ResizeObserver | null = null;

    if (heroCanvas) {
      const hCtx = heroCanvas.getContext('2d')!;
      let hW = 0, hH = 0, dpr = 1;

      function resizeHero() {
        dpr = window.devicePixelRatio || 1;
        const cs = getComputedStyle(heroCanvas!);
        hW = parseFloat(cs.width)  || heroCanvas!.parentElement!.getBoundingClientRect().width;
        hH = parseFloat(cs.height) || heroCanvas!.parentElement!.getBoundingClientRect().height;
        heroCanvas!.width  = Math.round(hW * dpr);
        heroCanvas!.height = Math.round(hH * dpr);
      }

      class Seaweed {
        x: number; phase: number; h: number; segs: number; hue: number; w: number;
        constructor(x: number) {
          this.x = x; this.phase = Math.random() * Math.PI * 2;
          this.h = 45 + Math.random() * 40; this.segs = 5 + Math.floor(Math.random() * 4);
          this.hue = 140 + Math.random() * 40; this.w = 2 + Math.random() * 1.5;
        }
        draw(t: number) {
          const sh = this.h / this.segs;
          hCtx.lineWidth = this.w; hCtx.lineCap = 'round';
          hCtx.strokeStyle = `hsla(${this.hue},30%,16%,0.85)`;
          hCtx.beginPath();
          let px = this.x, py = hH;
          hCtx.moveTo(px, py);
          for (let i = 0; i < this.segs; i++) {
            const sway = Math.sin(t * 1.1 + this.phase + i * 0.6) * (3 + i * 2.5);
            px += sway; py -= sh;
            hCtx.lineTo(px, py);
          }
          hCtx.stroke();
        }
      }

      class Bubble {
        x: number; r: number; y: number; vy: number; phase: number; op: number;
        constructor(init: boolean) { this.x=0; this.r=0; this.y=0; this.vy=0; this.phase=0; this.op=0; this.reset(init); }
        reset(init: boolean) {
          this.x = Math.random() * hW; this.r = 1.2 + Math.random() * 2.8;
          this.y = init ? Math.random() * hH : hH + 10;
          this.vy = 0.3 + Math.random() * 0.5; this.phase = Math.random() * Math.PI * 2;
          this.op = 0.035 + Math.random() * 0.06;
        }
        update() {
          this.y -= this.vy; this.phase += 0.04;
          this.x += Math.sin(this.phase) * 0.35;
          if (this.y < -10) this.reset(false);
        }
        draw() {
          hCtx.beginPath(); hCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          hCtx.strokeStyle = `rgba(100,180,220,${this.op})`; hCtx.lineWidth = 0.8; hCtx.stroke();
          hCtx.beginPath(); hCtx.arc(this.x - this.r * 0.3, this.y - this.r * 0.35, this.r * 0.28, 0, Math.PI * 2);
          hCtx.fillStyle = `rgba(160,210,240,${this.op * 0.7})`; hCtx.fill();
        }
      }

      const FISH_COLORS = [
        'hsla(200,40%,32%,0.45)','hsla(185,35%,28%,0.45)','hsla(220,38%,30%,0.45)',
        'hsla(210,32%,36%,0.42)','hsla(195,30%,28%,0.45)','hsla(240,28%,30%,0.42)','hsla(170,32%,26%,0.43)'
      ];
      class Fish {
        color: string; s: number; phase: number; tailP: number; bobP: number;
        dir: number; vx: number; y: number; x: number;
        constructor(init: boolean) {
          this.color = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
          this.s = 9 + Math.random() * 14; this.phase = Math.random() * Math.PI * 2;
          this.tailP = Math.random() * Math.PI * 2; this.bobP = Math.random() * Math.PI * 2;
          this.dir = 1; this.vx = 0; this.y = 0; this.x = 0;
          this.reset(init);
        }
        reset(init: boolean) {
          this.dir = Math.random() > 0.5 ? 1 : -1;
          this.vx = (0.6 + Math.random() * 1.2) * this.dir;
          this.y = 50 + Math.random() * (hH - 130);
          this.x = init ? Math.random() * hW : (this.dir === 1 ? -40 : hW + 40);
        }
        update() {
          this.x += this.vx; this.tailP += 0.18;
          this.y += Math.sin(this.tailP * 0.5 + this.bobP) * 0.25;
          if (this.x > hW + 60 || this.x < -60) this.reset(false);
        }
        draw() {
          const s = this.s, d = this.dir, tw = Math.sin(this.tailP) * 0.45;
          hCtx.save(); hCtx.translate(this.x, this.y);
          if (d === -1) hCtx.scale(-1, 1);
          hCtx.beginPath(); hCtx.moveTo(-s * 0.55, 0);
          hCtx.lineTo(-s, -s * 0.5 + tw * s); hCtx.lineTo(-s, s * 0.5 + tw * s);
          hCtx.closePath(); hCtx.fillStyle = this.color; hCtx.fill();
          hCtx.beginPath(); hCtx.ellipse(0, 0, s * 0.72, s * 0.36, 0, 0, Math.PI * 2);
          hCtx.fillStyle = this.color; hCtx.fill();
          hCtx.beginPath(); hCtx.ellipse(s * 0.08, s * 0.07, s * 0.45, s * 0.19, 0, 0, Math.PI * 2);
          hCtx.fillStyle = 'rgba(180,220,255,0.1)'; hCtx.fill();
          hCtx.beginPath(); hCtx.arc(s * 0.44, -s * 0.07, s * 0.13, 0, Math.PI * 2);
          hCtx.fillStyle = 'rgba(200,230,255,0.7)'; hCtx.fill();
          hCtx.beginPath(); hCtx.arc(s * 0.46, -s * 0.07, s * 0.08, 0, Math.PI * 2);
          hCtx.fillStyle = '#0b1726'; hCtx.fill();
          hCtx.restore();
        }
      }

      class Jellyfish {
        hue: number; pulseP: number; wobbleP: number; s: number; x: number; y: number; vy: number;
        constructor(init: boolean) {
          this.hue = 190 + Math.random() * 60; this.pulseP = Math.random() * Math.PI * 2;
          this.wobbleP = Math.random() * Math.PI * 2; this.s = 16 + Math.random() * 18;
          this.x = 40 + Math.random() * (hW - 80);
          this.y = init ? Math.random() * hH : hH + 60;
          this.vy = 0.25 + Math.random() * 0.35;
        }
        update() {
          this.y -= this.vy; this.pulseP += 0.048; this.wobbleP += 0.018;
          this.x += Math.sin(this.wobbleP) * 0.38;
          if (this.y < -80) { this.x = 40 + Math.random() * (hW - 80); this.y = hH + 60; }
        }
        draw(t: number) {
          const pulse = 1 + Math.sin(this.pulseP) * 0.13;
          const s = this.s * pulse;
          const g = hCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 2.2);
          g.addColorStop(0, `hsla(${this.hue},40%,45%,0.035)`);
          g.addColorStop(1, `hsla(${this.hue},40%,45%,0)`);
          hCtx.beginPath(); hCtx.arc(this.x, this.y, s * 2.2, 0, Math.PI * 2);
          hCtx.fillStyle = g; hCtx.fill();
          hCtx.beginPath(); hCtx.arc(this.x, this.y, s, Math.PI, 0);
          hCtx.closePath();
          hCtx.fillStyle = `hsla(${this.hue},30%,35%,0.09)`;
          hCtx.fill();
          hCtx.strokeStyle = `hsla(${this.hue},40%,55%,0.17)`;
          hCtx.lineWidth = 1; hCtx.stroke();
          for (let i = 1; i <= 3; i++) {
            hCtx.beginPath(); hCtx.arc(this.x, this.y, s * (i / 4), Math.PI, 0);
            hCtx.strokeStyle = `hsla(${this.hue},35%,60%,0.035)`; hCtx.lineWidth = 0.8; hCtx.stroke();
          }
          for (let i = 0; i < 7; i++) {
            const tx = this.x - s * 0.75 + (i / 6) * s * 1.5;
            const len = s * (1.0 + Math.sin(t * 1.4 + i * 0.9) * 0.28);
            hCtx.beginPath(); hCtx.moveTo(tx, this.y);
            hCtx.quadraticCurveTo(
              tx + Math.sin(t * 0.9 + i) * 6, this.y + len * 0.5,
              tx + Math.sin(t * 0.7 + i * 1.3) * 10, this.y + len
            );
            hCtx.strokeStyle = `hsla(${this.hue},35%,50%,0.08)`;
            hCtx.lineWidth = 1.2; hCtx.stroke();
          }
        }
      }

      const MATH_SYMS = ['y = x²', 'f(x)', '∫ dx', 'Δx', 'y = mx+c', '∞', 'π', 'y = x³', 'sin(x)', 'dy/dx'];
      class MathSym {
        sym: string; x: number; y: number; vx: number; op: number; target: number; sz: number;
        constructor(init: boolean) { this.sym=''; this.x=0; this.y=0; this.vx=0; this.op=0; this.target=0; this.sz=0; this.reset(init); }
        reset(init: boolean) {
          this.sym = MATH_SYMS[Math.floor(Math.random() * MATH_SYMS.length)];
          this.x = -60; this.y = 40 + Math.random() * (hH - 90);
          this.vx = 0.35 + Math.random() * 0.45; this.op = 0;
          this.target = 0.05 + Math.random() * 0.06; this.sz = 9 + Math.random() * 3;
          if (init) this.x = Math.random() * hW;
        }
        update() {
          this.x += this.vx;
          if (this.x < 80) this.op = Math.min(this.target, this.op + 0.008);
          if (this.x > hW - 60) this.op = Math.max(0, this.op - 0.012);
          if (this.x > hW + 70) this.reset(false);
        }
        draw() {
          hCtx.font = `600 ${this.sz}px "JetBrains Mono",monospace`;
          hCtx.fillStyle = `rgba(56,189,248,${this.op})`;
          hCtx.fillText(this.sym, this.x, this.y);
        }
      }

      class HeroShark {
        dir: number; s: number; x: number; y: number; vx: number; tailP: number;
        constructor() { this.dir=1; this.s=0; this.x=0; this.y=0; this.vx=0; this.tailP=0; this.reset(true); }
        reset(init: boolean) {
          this.dir = 1; this.s = Math.min(hW, hH) * 0.1;
          this.x = init ? hW * 0.35 : -80;
          this.y = hH * 0.32 + Math.random() * hH * 0.22;
          this.vx = 0.7 + Math.random() * 0.4;
        }
        update() {
          this.x += this.vx * this.dir; this.tailP += 0.075;
          if (this.x > hW + 90) { this.dir = -1; this.x = hW + 90; this.y = hH * 0.28 + Math.random() * hH * 0.28; }
          if (this.x < -90) { this.dir = 1; this.x = -90; this.y = hH * 0.28 + Math.random() * hH * 0.28; }
        }
        draw() {
          const s = this.s, tw = Math.sin(this.tailP) * 0.28;
          hCtx.save(); hCtx.translate(this.x, this.y);
          if (this.dir === -1) hCtx.scale(-1, 1);
          hCtx.beginPath(); hCtx.moveTo(-s * 0.68, 0);
          hCtx.lineTo(-s * 1.18, -s * 0.44 + tw * s); hCtx.lineTo(-s * 1.18, s * 0.44 + tw * s);
          hCtx.closePath(); hCtx.fillStyle = 'rgba(120,98,0,0.6)'; hCtx.fill();
          hCtx.beginPath(); hCtx.ellipse(0, 0, s * 0.88, s * 0.43, 0, 0, Math.PI * 2);
          hCtx.fillStyle = 'rgba(148,120,0,0.65)'; hCtx.fill();
          hCtx.beginPath(); hCtx.ellipse(s * 0.1, s * 0.1, s * 0.55, s * 0.22, 0, 0, Math.PI * 2);
          hCtx.fillStyle = 'rgba(200,180,80,0.15)'; hCtx.fill();
          hCtx.beginPath(); hCtx.moveTo(-s * 0.08, -s * 0.43); hCtx.lineTo(s * 0.28, -s * 0.9); hCtx.lineTo(s * 0.52, -s * 0.43);
          hCtx.closePath(); hCtx.fillStyle = 'rgba(120,98,0,0.6)'; hCtx.fill();
          hCtx.beginPath(); hCtx.moveTo(s * 0.12, s * 0.3); hCtx.lineTo(-s * 0.14, s * 0.76); hCtx.lineTo(s * 0.42, s * 0.44);
          hCtx.closePath(); hCtx.fillStyle = 'rgba(120,98,0,0.6)'; hCtx.fill();
          hCtx.beginPath(); hCtx.arc(s * 0.55, -s * 0.1, s * 0.19, 0, Math.PI * 2);
          hCtx.fillStyle = 'rgba(200,220,255,0.7)'; hCtx.fill();
          hCtx.beginPath(); hCtx.arc(s * 0.58, -s * 0.1, s * 0.11, 0, Math.PI * 2);
          hCtx.fillStyle = '#0b1726'; hCtx.fill();
          hCtx.beginPath(); hCtx.arc(s * 0.62, -s * 0.14, s * 0.05, 0, Math.PI * 2);
          hCtx.fillStyle = '#fff'; hCtx.fill();
          hCtx.strokeStyle = '#0b1726'; hCtx.lineWidth = s * 0.065;
          hCtx.beginPath(); hCtx.rect(s * 0.37, -s * 0.29, s * 0.36, s * 0.29); hCtx.stroke();
          hCtx.beginPath(); hCtx.moveTo(s * 0.73, -s * 0.17); hCtx.lineTo(s * 0.9, -s * 0.23); hCtx.stroke();
          hCtx.beginPath(); hCtx.arc(s * 0.58, s * 0.05, s * 0.24, 0.12, Math.PI - 0.12);
          hCtx.strokeStyle = '#0b1726'; hCtx.lineWidth = s * 0.055; hCtx.stroke();
          const tw2 = s * 0.3, tx0 = s * 0.58 - tw2 * 0.5;
          for (let i = 0; i < 4; i++) {
            const tx = tx0 + i * (tw2 / 4);
            hCtx.beginPath(); hCtx.moveTo(tx, s * 0.05);
            hCtx.lineTo(tx + tw2 / 8, s * 0.13); hCtx.lineTo(tx + tw2 / 4, s * 0.05);
            hCtx.strokeStyle = '#0b1726'; hCtx.lineWidth = s * 0.04; hCtx.stroke();
          }
          hCtx.restore();
        }
      }

      let seaweeds: Seaweed[] = [], heroBubbles: Bubble[] = [], heroFish: Fish[] = [],
          jellies: Jellyfish[] = [], mathSyms: MathSym[] = [], heroShark: HeroShark;

      function heroInit() {
        const density = Math.max(1, hW / 480);
        const sw = Math.round(22 * density);
        seaweeds  = Array.from({length: sw}, (_, i) => new Seaweed(10 + (i / (sw - 1)) * (hW - 20)));
        heroBubbles   = Array.from({length: Math.round(38 * density)}, () => new Bubble(true));
        heroFish      = Array.from({length: Math.round(18 * density)}, () => new Fish(true));
        jellies   = Array.from({length: Math.round(5 * density)},  () => new Jellyfish(true));
        mathSyms  = Array.from({length: Math.round(7 * density)},  () => new MathSym(true));
        heroShark = new HeroShark();
      }

      function drawHeroBg(t: number) {
        const bg = hCtx.createLinearGradient(0, 0, 0, hH);
        bg.addColorStop(0, '#0e4a7e'); bg.addColorStop(0.55, '#0a3460'); bg.addColorStop(1, '#062040');
        hCtx.fillStyle = bg; hCtx.fillRect(0, 0, hW, hH);
        for (let i = 0; i < 6; i++) {
          const cx = hW * (0.08 + i * 0.18) + Math.sin(t * 0.28 + i * 1.1) * 18;
          const cy = hH * 0.12 + Math.sin(t * 0.44 + i * 1.5) * 9;
          const g = hCtx.createRadialGradient(cx, cy, 0, cx, cy, hW * 0.14);
          g.addColorStop(0, 'rgba(56,189,248,0.045)'); g.addColorStop(1, 'rgba(56,189,248,0)');
          hCtx.beginPath(); hCtx.arc(cx, cy, hW * 0.14, 0, Math.PI * 2); hCtx.fillStyle = g; hCtx.fill();
        }
        const floor = hCtx.createLinearGradient(0, hH - 22, 0, hH);
        floor.addColorStop(0, 'rgba(55,85,70,0.12)'); floor.addColorStop(1, 'rgba(40,65,52,0.22)');
        hCtx.fillStyle = floor; hCtx.fillRect(0, hH - 22, hW, 22);
      }

      function heroLoop(ts: number) {
        const t = ts * 0.001;
        hCtx.save(); hCtx.scale(dpr, dpr);
        drawHeroBg(t);
        seaweeds.forEach(s => s.draw(t));
        mathSyms.forEach(m => { m.update(); m.draw(); });
        heroFish.forEach(f => { f.update(); f.draw(); });
        jellies.forEach(j => { j.update(); j.draw(t); });
        heroShark.update(); heroShark.draw();
        heroBubbles.forEach(b => { b.update(); b.draw(); });
        const vig = hCtx.createRadialGradient(hW*0.5, hH*0.38, hW*0.2, hW*0.5, hH*0.38, hW*0.75);
        vig.addColorStop(0, 'rgba(3,8,15,0)');
        vig.addColorStop(1, 'rgba(3,8,15,0.25)');
        hCtx.fillStyle = vig; hCtx.fillRect(0, 0, hW, hH);
        hCtx.restore();
        heroRaf = requestAnimationFrame(heroLoop);
      }

      resizeHero(); heroInit();
      heroRaf = requestAnimationFrame(heroLoop);

      heroRo = new ResizeObserver(() => { resizeHero(); heroInit(); });
      heroRo.observe(heroCanvas.parentElement!);
    }

    // ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt((e.target as HTMLElement).dataset.delay || '0');
          setTimeout(() => {
            e.target.classList.add('visible');
          }, delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.game-card').forEach(el => obs.observe(el));

    // ── GAMEPLAY CARD TYPEWRITER ── ───────────────────────────────────────────────
    const eqs = ['x²', '2x + 1', 'x³ − 3x', '−x² + 4', '0.5x²', 'x + 3'];
    const gpEl = document.getElementById('gp-eq');
    if (gpEl) {
      const gpElRef = gpEl;
      const cursor = '<span class="gameplay-cursor"></span>';
      let ei = 0, ci = eqs[0].length, typing = false, pause = 30;

      function tick() {
        const eq = eqs[ei];
        if (pause > 0) { pause--; setTimeout(tick, 80); return; }
        if (typing) {
          ci++;
          gpElRef.innerHTML = eq.slice(0, ci) + cursor;
          if (ci >= eq.length) { typing = false; pause = 28; }
          setTimeout(tick, 90);
        } else {
          ci--;
          gpElRef.innerHTML = eq.slice(0, ci) + cursor;
          if (ci <= 0) {
            ei = (ei + 1) % eqs.length;
            typing = true; pause = 10;
          }
          setTimeout(tick, 48);
        }
      }
      gpElRef.innerHTML = eqs[0] + cursor;
      setTimeout(tick, 2200);
    }

    return () => {
      cancelAnimationFrame(bgRaf);
      if (miniRaf) cancelAnimationFrame(miniRaf);
      if (heroRaf) cancelAnimationFrame(heroRaf);
      if (heroRo) heroRo.disconnect();
      obs.disconnect();
      window.removeEventListener('resize', resizeBg);
    };
  }, []);

  return (
    <>
      <canvas id="bg-canvas"></canvas>

      <nav>
        <a className="nav-logo" href="#">
          <svg className="shark-icon" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="23" y="3" width="12" height="3" rx="0.8" fill="#1a2e4a"/>
            <polygon points="26,3 29,0 32,3" fill="#1a2e4a"/>
            <line x1="34" y1="4" x2="36" y2="7" stroke="#FFD700" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="36" cy="7.5" r="1.2" fill="#FFD700"/>
            <path d="M8 20 L2 13 L2 27 Z" fill="#FFD700"/>
            <path d="M9 20 C9 12 15 8 25 8 C36 8 44 13 44 20 C44 27 36 32 25 32 C15 32 9 28 9 20Z" fill="#FFD700"/>
            <path d="M16 24 C16 21 20 19 26 19 C32 19 38 21 38 24 C38 27 32 29 26 29 C20 29 16 27 16 24Z" fill="#FFF3B0" opacity="0.65"/>
            <path d="M21 8 L27 8 L25 4 Z" fill="#E6C200"/>
            <path d="M18 29 L14 36 L23 31 Z" fill="#E6C200"/>
            <circle cx="35" cy="17" r="5.5" fill="white"/>
            <circle cx="36" cy="17" r="2.8" fill="#0b1726"/>
            <circle cx="37.2" cy="15.5" r="1.1" fill="white"/>
            <rect x="30" y="12" width="10" height="9" rx="3" fill="none" stroke="#0b1726" strokeWidth="2"/>
            <line x1="40" y1="15.5" x2="44" y2="14.5" stroke="#0b1726" strokeWidth="2" strokeLinecap="round"/>
            <path d="M29 25 Q33 29 39 25" fill="none" stroke="#0b1726" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M30.5 25 L31.5 27 L32.5 25 L33.5 27 L34.5 25 L35.5 27 L36.5 25 L37.5 27 L38 25" fill="none" stroke="#0b1726" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nerdly
        </a>
      </nav>

      <section id="hero">
        <canvas id="hero-ocean"></canvas>
        <div className="hero-ocean-fade"></div>

        <div className="hero-content-row">
          <div className="hero-left">
            <p className="hero-eyebrow">FREE &middot; NO SIGN-UP</p>
            <h1 className="hero-h1">A new way to<br />revise <span className="accent">maths.</span></h1>
            <p className="hero-sub">Games for Singaporean Secondary School students.</p>
            <a className="hero-cta" href="/game">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
              Play now
            </a>
          </div>

          <div className="hero-right">
            <div className="gameplay-card">
              <svg className="gameplay-graph" viewBox="0 0 380 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="380" height="200" fill="rgba(5,12,25,0.95)"/>
                <line x1="0" y1="105" x2="380" y2="105" stroke="rgba(56,189,248,0.055)" strokeWidth="1"/>
                <line x1="0" y1="145" x2="380" y2="145" stroke="rgba(56,189,248,0.055)" strokeWidth="1"/>
                <line x1="135" y1="0" x2="135" y2="200" stroke="rgba(56,189,248,0.055)" strokeWidth="1"/>
                <line x1="245" y1="0" x2="245" y2="200" stroke="rgba(56,189,248,0.055)" strokeWidth="1"/>
                <line x1="10" y1="185" x2="368" y2="185" stroke="rgba(56,189,248,0.22)" strokeWidth="1"/>
                <line x1="190" y1="10" x2="190" y2="195" stroke="rgba(56,189,248,0.22)" strokeWidth="1"/>
                <path d="M364 181 L368 185 L364 189" stroke="rgba(56,189,248,0.22)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M186 14 L190 10 L194 14" stroke="rgba(56,189,248,0.22)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <text x="354" y="178" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(56,189,248,0.38)">x</text>
                <text x="196" y="23" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(56,189,248,0.38)">y</text>
                <path id="gp-parabola" d="M 25 95 Q 190 275 355 95" stroke="rgba(255,215,0,0.6)" strokeWidth="1.5" strokeDasharray="5 4" fill="none"/>
                <text x="234" y="115" fontFamily="JetBrains Mono,monospace" fontSize="10" fontWeight="700" fill="rgba(255,215,0,0.45)">y = x²</text>
                <g>
                  <ellipse cx="0" cy="0" rx="10" ry="4.5" fill="rgba(190,150,0,0.85)"/>
                  <polygon points="-10,0 -15.5,-5 -15.5,5" fill="rgba(150,115,0,0.85)"/>
                  <polygon points="0,-4.5 2.5,-8.5 5.5,-4.5" fill="rgba(150,115,0,0.85)"/>
                  <ellipse cx="5" cy="1" rx="4.5" ry="2" fill="rgba(240,220,140,0.18)"/>
                  <circle cx="6.5" cy="-1.5" r="1.8" fill="rgba(200,225,255,0.72)"/>
                  <circle cx="6.8" cy="-1.5" r="1" fill="#0b1726"/>
                  <circle cx="7.2" cy="-2.1" r="0.45" fill="rgba(255,255,255,0.85)"/>
                  <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#gp-parabola"/>
                  </animateMotion>
                </g>
              </svg>
              <div className="gameplay-footer">
                <span className="gameplay-eq-prefix">y =</span>
                <span className="gameplay-eq-input" id="gp-eq">x²<span className="gameplay-cursor"></span></span>
                <span className="gameplay-status">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        <a className="hero-scroll" href="#games" aria-label="Scroll to games">
          <svg className="hero-scroll-chevron" width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L10 10L19 1" stroke="rgba(148,180,220,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      <section id="games">
        <div className="games-inner">
          <h2 className="games-title">Pick a game</h2>
          <div className="games-grid">

            <div className="game-card featured" data-delay="0">
              <div className="card-preview">
                <canvas id="mini-ocean"></canvas>
              </div>
              <div className="card-tag">
                <span className="tag-live"></span>
                Playable now
              </div>
              <p className="card-name">Shark Equation</p>
              <p className="card-desc">Type an equation. Watch it plot. The shark follows the curve — guide it through every hoop across 21 levels of linear, quadratic, power and exponential functions.</p>
              <div className="card-worlds">
                <span className="world-pip">Linear</span>
                <span className="world-pip">Quadratic</span>
                <span className="world-pip">Factored</span>
                <span className="world-pip">Power</span>
                <span className="world-pip">Exponential</span>
              </div>
              <a className="btn-card btn-primary" href="/game">Play now &rarr;</a>
            </div>

            <div className="game-card side coming" data-delay="80">
              <div className="card-preview">
                <span className="preview-icon">&#8532;</span>
                <span className="preview-coming" style={{position:'absolute',bottom:'12px',right:'14px'}}>coming soon</span>
              </div>
              <div className="card-tag" style={{color:'var(--dim)'}}>Coming soon</div>
              <p className="card-name">Fraction Frenzy</p>
              <p className="card-desc">Race to simplify before the clock hits zero. Fractions, equivalents, mixed numbers — fast.</p>
            </div>

            <div className="game-card side coming" data-delay="140">
              <div className="card-preview">
                <span className="preview-icon">&#8734;</span>
                <span className="preview-coming" style={{position:'absolute',bottom:'12px',right:'14px'}}>coming soon</span>
              </div>
              <div className="card-tag" style={{color:'var(--dim)'}}>Coming soon</div>
              <p className="card-name">Prime Climber</p>
              <p className="card-desc">Spot the primes. Factor the rest. Each correct answer takes you higher — how far can you get?</p>
            </div>

          </div>
        </div>
      </section>

      <section id="feedback" style={{position:'relative',zIndex:1,padding:'0 52px 60px',maxWidth:'1200px',width:'100%',margin:'0 auto'}}>
        <div style={{borderTop:'1px solid var(--border)',paddingTop:'40px'}}>
          <h2 style={{fontFamily:"'Nunito',sans-serif",fontSize:'28px',fontWeight:900,letterSpacing:'-0.5px',color:'var(--text)',marginBottom:'24px'}}>Share your thoughts</h2>
          <div style={{width:'100%',height:'500px'}} data-fillout-id="3W1GJdv1s2us" data-fillout-embed-type="standard" data-fillout-inherit-parameters data-fillout-dynamic-resize></div>
        </div>
      </section>

      <footer>
        <p>© 2025 Nerdly · Free browser maths games · No sign-up required</p>
        <p style={{color:'var(--dim)'}}>More games dropping soon.</p>
      </footer>

      <Script src="https://server.fillout.com/embed/v1/" strategy="lazyOnload" />
    </>
  )
}
