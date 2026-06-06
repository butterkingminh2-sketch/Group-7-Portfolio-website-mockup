'use client';

import { useEffect, useRef } from 'react';

export function Abstract3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    const cur = { x: 0.5, y: 0.5 };
    let t = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      cur.x += (mouseRef.current.x - cur.x) * 0.04;
      cur.y += (mouseRef.current.y - cur.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const cx = w * cur.x;
      const cy = h * cur.y;
      const base = Math.min(w, h);

      const layers = [
        {
          r: base * 0.55,
          ox: 0,
          oy: 0,
          c: 'rgba(244,162,122,0.10)',
        },
        {
          r: base * 0.42,
          ox: Math.sin(t * 0.65) * base * 0.08,
          oy: Math.cos(t * 0.9) * base * 0.06,
          c: 'rgba(232,121,160,0.07)',
        },
        {
          r: base * 0.32,
          ox: Math.cos(t * 1.1) * base * 0.1,
          oy: Math.sin(t * 0.75) * base * 0.08,
          c: 'rgba(177,151,252,0.09)',
        },
        {
          r: base * 0.22,
          ox: Math.sin(t * 1.4 + 1) * base * 0.07,
          oy: Math.cos(t * 1.2 + 2) * base * 0.06,
          c: 'rgba(244,162,122,0.07)',
        },
        {
          r: base * 0.14,
          ox: Math.cos(t * 1.8 + 3) * base * 0.05,
          oy: Math.sin(t * 1.5 + 1) * base * 0.05,
          c: 'rgba(177,151,252,0.12)',
        },
      ];

      layers.forEach(({ r, ox, oy, c }) => {
        const bx = cx + ox;
        const by = cy + oy;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0, c);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.ellipse(bx, by, r, r * (0.82 + Math.sin(t * 0.5) * 0.1), t * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      t += 0.006;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
