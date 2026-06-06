'use client';

import { useEffect, useRef, useState } from 'react';
import type { TeamMember } from '@/types/team';

interface ProjectEntry {
  project: TeamMember['projects'][number];
  memberName: string;
}

export interface ProjectsScrollSectionProps {
  members: TeamMember[];
}

const CARD_HEIGHT = 240;
const GAP = 24;
const STEP = CARD_HEIGHT + GAP;

export function ProjectsScrollSection({ members }: ProjectsScrollSectionProps) {
  const items: ProjectEntry[] = members.flatMap((m) =>
    m.projects.map((p) => ({ project: p, memberName: m.name }))
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollInSection = window.scrollY - sectionTop;
      const scrollableRange = sectionHeight - window.innerHeight;
      if (scrollableRange <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollInSection / scrollableRange));
      const newIndex = Math.min(Math.floor(progress * items.length), items.length - 1);
      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  if (items.length === 0) return null;

  const active = items[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{ height: `${(items.length + 1) * 100}vh`, background: '#f8f8f8' }}
    >
      <div className="sticky top-0 flex overflow-hidden" style={{ height: '100vh' }}>

        {/* ── Left: vertical scroll carousel ── */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ width: '50%' }}
        >
          {/* "Works" label */}
          <p
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 'clamp(1.5rem, 4vh, 3rem)',
              left: 'clamp(1.25rem, 5vw, 4rem)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#aaa',
            }}
          >
            Works
          </p>

          {/* Center-line indicator */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              width: 'clamp(1.25rem, 5vw, 4rem)',
              height: '1px',
              background: '#d0d0d0',
            }}
          />

          {/* Item track */}
          <div
            style={{
              transform: `translateY(calc(50vh - ${CARD_HEIGHT / 2}px - ${activeIndex * STEP}px))`,
              transition: 'transform 700ms cubic-bezier(0.76, 0, 0.24, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: `${GAP}px`,
              position: 'absolute',
              width: 'clamp(240px, 38%, 340px)',
            }}
          >
            {items.map(({ project, memberName }, i) => {
              const dist = Math.abs(i - activeIndex);
              const scale = i === activeIndex ? 1 : Math.max(0.72, 1 - dist * 0.14);
              const opacity = i === activeIndex ? 1 : Math.max(0.35, 1 - dist * 0.3);

              return (
                <div
                  key={`${memberName}-${project.title}`}
                  style={{
                    height: `${CARD_HEIGHT}px`,
                    flexShrink: 0,
                    background: `linear-gradient(${project.card_gradient_angle}deg, var(--color-accent-start) 0%, var(--primitive-accent-mid) 50%, var(--color-accent-end) 100%)`,
                    padding: '20px 24px',
                    transform: `scale(${scale})`,
                    opacity,
                    transition: 'transform 500ms ease, opacity 500ms ease',
                    color: '#1a0a2e',
                  }}
                >
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65, marginBottom: '10px' }}>
                    {memberName} · {project.year}
                  </p>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(1rem, 1.4vw, 1.35rem)', fontWeight: 600, lineHeight: 1.2 }}>
                    {project.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} style={{ fontSize: '0.6rem', background: 'rgba(26,10,46,0.12)', padding: '2px 8px', letterSpacing: '0.04em' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll indicator */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transformOrigin: 'center',
            }}
          >
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#bbb', writingMode: 'horizontal-tb' }}>
              scroll
            </span>
            <div style={{ width: '40px', height: '1px', background: '#ccc' }} />
          </div>
        </div>

        {/* ── Right: fixed text ── */}
        <div
          style={{
            width: '50%',
            padding: 'clamp(2rem, 5vw, 5rem)',
            borderLeft: '1px solid #e8e8e8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div key={activeIndex} style={{ animation: 'fade-in 400ms ease' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: '1.5rem' }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>

            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, lineHeight: 1.1, color: '#111', marginBottom: '1.25rem' }}>
              {active.project.title}
            </h2>

            <p style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', marginBottom: '1.25rem' }}>
              {active.memberName} — {active.project.role}
            </p>

            <p style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.8, color: '#555', maxWidth: '420px' }}>
              {active.project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.75rem' }}>
              {active.project.tags.map((tag) => (
                <span key={tag} style={{ padding: '4px 14px', border: '1px solid #e0e0e0', fontSize: '0.65rem', color: '#777', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
