'use client';

import { useEffect, useRef } from 'react';
import { ThreeDRose } from '@/components/ui/ThreeDRose';

const ABOUT_BODY =
  'Studio 7 is a group of seven business administration students at HSB University. Our shared space for project work, research, and professional growth — where data meets design.';

const BOTTOM_MOTIFS = [
  { type: 'line' },
  { type: 'text', value: 'Studio Seven' },
  { type: 'star' },
  { type: 'text', value: 'HSB University' },
  { type: 'star' },
  { type: 'text', value: '2025 — Present' },
  { type: 'line' },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const triggers   = useRef<import('gsap/ScrollTrigger').ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!sectionRef.current) return;

    let ctx: ReturnType<typeof import('gsap').default.context>;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const bodyEl    = bodyRef.current;
      const headingEl = headingRef.current;
      const displayEl = displayRef.current;

      ctx = gsap.context(() => {
        if (bodyEl) gsap.set(bodyEl, { opacity: 0, y: 24 });

        if (displayEl) {
          const flickerSt = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            onEnter:     () => displayEl.classList.add('neon-flicker'),
            onLeaveBack: () => displayEl.classList.remove('neon-flicker'),
          });
          triggers.current.push(flickerSt);
        }

        if (headingEl) {
          const text = headingEl.textContent ?? '';
          headingEl.textContent = '';
          const spans: HTMLSpanElement[] = [];
          Array.from(text).forEach((ch) => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.style.opacity = '0';
            headingEl.appendChild(span);
            spans.push(span);
          });

          const typeSt = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            once: true,
            onEnter: () => {
              gsap.to(spans, {
                opacity: 1,
                duration: 0.05,
                stagger: { amount: 4.5, from: 'start' },
                ease: 'none',
                onComplete: () => {
                  if (bodyEl) gsap.to(bodyEl, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
                },
              });
            },
          });
          triggers.current.push(typeSt);
        }

        gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
      }, sectionRef);
    })();

    return () => {
      ctx?.revert();
      triggers.current.forEach((t) => t.kill());
      triggers.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Studio 7"
      style={{
        height: '100vh',
        background: '#2a0d25',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        color: 'var(--primitive-cream)',
      }}
    >
      {/* ── 3D Flower — full-section background ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <ThreeDRose />
      </div>

      {/* Decorative asterisks — top-right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2.5rem',
          display: 'flex',
          gap: '0.5rem',
          fontSize: '1.5rem',
          color: 'var(--color-accent-start)',
          lineHeight: 1,
          letterSpacing: '0.1em',
          zIndex: 3,
        }}
      >
        <span>✳</span><span>✳</span><span>✳</span>
      </div>

      {/* ── Left side ── */}
      <div
        style={{
          width: '55%',
          padding: 'clamp(3rem, 6vw, 6rem) clamp(1.25rem, 5vw, 5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* STUDIO SEVEN */}
        <div
          ref={displayRef}
          style={{
            position: 'relative',
            userSelect: 'none',
            textShadow:
              '0 0 10px #f4a27a, 0 0 40px rgba(244,162,122,0.55), 0 0 100px rgba(244,162,122,0.2)',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(4.5rem, 11vw, 12rem)',
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--primitive-cream)',
            }}
          >
            <div>STUDIO</div>
            <div>SEVEN</div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '20%',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)',
              fontWeight: 700,
              color: '#7c5cbf',
              lineHeight: 1.2,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            for future<br />leaders
          </div>
        </div>

        {/* Caption boxes */}
        <div style={{ marginTop: '3.5rem', display: 'flex', gap: '2.5rem' }}>
          {[
            { label: 'Established', value: '2025 — Present' },
            { label: 'Team Size',   value: '10 Students' },
            { label: 'Program',     value: 'Business Admin.' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{ borderTop: '1px solid rgba(250,250,249,0.18)', paddingTop: '0.875rem' }}
            >
              <p
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--primitive-cream-muted)',
                  marginBottom: '5px',
                }}
              >
                {label}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--primitive-cream)', fontWeight: 500 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right side ── */}
      <div
        style={{
          width: '45%',
          padding: 'clamp(3rem, 6vw, 6rem) clamp(1.25rem, 4vw, 4rem) clamp(3rem, 6vw, 6rem) 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--primitive-cream-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <span style={{ fontSize: '0.45rem' }}>◀</span>
          About Us
          <span style={{ fontSize: '0.45rem' }}>▶</span>
        </p>

        <h2
          ref={headingRef}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 2.8vw, 2.75rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--primitive-cream)',
            marginBottom: '1.75rem',
          }}
        >
          We combine analytical rigour with creative communication to craft work that resonates.
        </h2>

        <p
          ref={bodyRef}
          style={{
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            lineHeight: 1.8,
            color: 'var(--primitive-cream-muted)',
            maxWidth: '400px',
          }}
        >
          {ABOUT_BODY}
        </p>
      </div>

      {/* ── Bottom motifs ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          zIndex: 3,
          padding: '0 clamp(1.25rem, 5vw, 5rem)',
        }}
      >
        {BOTTOM_MOTIFS.map((m, i) => {
          if (m.type === 'line') {
            return (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '3.5rem',
                  height: '1px',
                  background: 'rgba(250,250,249,0.18)',
                  flexShrink: 0,
                }}
              />
            );
          }
          if (m.type === 'star') {
            return (
              <span
                key={i}
                style={{ fontSize: '0.65rem', color: 'rgba(244,162,122,0.55)' }}
              >
                ✦
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                fontSize: '0.55rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(250,250,249,0.28)',
                whiteSpace: 'nowrap',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              {m.value}
            </span>
          );
        })}
      </div>
    </section>
  );
}
