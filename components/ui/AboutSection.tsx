'use client';

import { useEffect, useRef } from 'react';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggers = useRef<import('gsap/ScrollTrigger').ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!sectionRef.current) return;

    let ctx: ReturnType<typeof import('gsap').default.context>;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
        triggers.current.push(st);
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
      {/* Decorative asterisks — top right */}
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
        }}
      >
        <span>✳</span>
        <span>✳</span>
        <span>✳</span>
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
        }}
      >
        {/* Giant display type */}
        <div style={{ position: 'relative', userSelect: 'none' }} aria-hidden="true">
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

          {/* Italic overlay */}
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: '22%',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-accent-start)',
              lineHeight: 1.2,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            for future
            <br />
            leaders
          </div>
        </div>

        {/* Caption boxes */}
        <div
          style={{
            marginTop: 'clamp(2.5rem, 6vh, 6rem)',
            display: 'flex',
            gap: '2.5rem',
          }}
        >
          <div style={{ borderTop: '1px solid rgba(250,250,249,0.18)', paddingTop: '0.875rem' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primitive-cream-muted)', marginBottom: '5px' }}>
              Established
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--primitive-cream)', fontWeight: 500 }}>
              2025 — Present
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(250,250,249,0.18)', paddingTop: '0.875rem' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primitive-cream-muted)', marginBottom: '5px' }}>
              Team Size
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--primitive-cream)', fontWeight: 500 }}>
              7 Students
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(250,250,249,0.18)', paddingTop: '0.875rem' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primitive-cream-muted)', marginBottom: '5px' }}>
              Program
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--primitive-cream)', fontWeight: 500 }}>
              Business Admin.
            </p>
          </div>
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
        }}
      >
        {/* Label */}
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

        {/* Main heading */}
        <h2
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

        {/* Body */}
        <p
          style={{
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            lineHeight: 1.8,
            color: 'var(--primitive-cream-muted)',
            maxWidth: '400px',
          }}
        >
          Studio 7 is a group of seven business administration students at HSB University.
          Our shared space for project work, research, and professional growth — where
          data meets design.
        </p>

        {/* Circular accent button */}
        <button
          aria-label="My philosophy"
          style={{
            marginTop: '3rem',
            width: '80px',
            height: '80px',
            borderRadius: '9999px',
            border: '1px solid rgba(250,250,249,0.25)',
            background: 'transparent',
            color: 'var(--primitive-cream)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'border-color 0.2s ease, background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent-start)';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,162,122,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(250,250,249,0.25)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Studio
          </span>
          <span style={{ fontSize: '1rem' }}>↓</span>
        </button>
      </div>
    </section>
  );
}
