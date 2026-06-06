'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/types/team';

export interface SkewedProjectCardProps {
  project: Project;
  memberName: string;
}

export function SkewedProjectCard({ project, memberName }: SkewedProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cardRef.current) return;

    let gsap: typeof import('gsap').default | null = null;

    (async () => {
      gsap = (await import('gsap')).default;
    })();

    const card = cardRef.current;

    const onEnter = () => {
      if (!gsap) return;
      gsap.to(card, { y: -6, duration: 0.2, ease: 'power1.out' });
      const after = card.querySelector<HTMLElement>('.card-border-overlay');
      if (after) gsap.to(after, { opacity: 1, duration: 0.2 });
    };

    const onLeave = () => {
      if (!gsap) return;
      gsap.to(card, { y: 0, duration: 0.2, ease: 'power1.out' });
      const after = card.querySelector<HTMLElement>('.card-border-overlay');
      if (after) gsap.to(after, { opacity: 0, duration: 0.2 });
    };

    const onDown = () => gsap?.to(card, { scale: 0.97, duration: 0.1, ease: 'power1.in' });
    const onUp = () => gsap?.to(card, { scale: 1, duration: 0.1, ease: 'power1.out' });

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('mousedown', onDown);
    card.addEventListener('mouseup', onUp);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('mousedown', onDown);
      card.removeEventListener('mouseup', onUp);
    };
  }, []);

  const gradientAngle = project.card_gradient_angle ?? 135;

  return (
    <div
      ref={cardRef}
      className="project-card relative rounded-none"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Gradient border overlay (hover reveal) */}
      <div
        className="card-border-overlay pointer-events-none absolute inset-0 rounded-none"
        style={{
          opacity: 0,
          outline: `2px solid transparent`,
          background: `linear-gradient(${gradientAngle}deg, var(--color-accent-start), var(--color-accent-end)) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          border: '2px solid transparent',
        }}
      />

      {/* Card face */}
      <div
        className="relative overflow-visible pt-12 pb-8 px-6 rounded-none"
        style={{
          background: `linear-gradient(${gradientAngle}deg, var(--color-accent-start) 0%, var(--primitive-accent-mid) 50%, var(--color-accent-end) 100%)`,
          color: '#1a0a2e',
        }}
      >
        {/* Title — overflows top edge */}
        <h3
          className="font-heading absolute"
          style={{
            top: '-0.6em',
            left: '1.5rem',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'var(--color-text)',
          }}
        >
          {project.title}
        </h3>

        {/* Meta */}
        <p className="text-sm font-medium opacity-70 mb-1" style={{ color: '#1a0a2e' }}>
          {memberName} — {project.role}
        </p>
        <p className="text-sm opacity-60 mb-4" style={{ color: '#1a0a2e' }}>
          {project.year}
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#1a0a2e' }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: 'rgba(26,10,46,0.15)', color: '#1a0a2e' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Corner action button */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View project: ${project.title}`}
            className="absolute bottom-0 right-0 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            style={{
              width: '32px',
              height: '32px',
              background: 'var(--color-text)',
              color: '#0a1c12',
              transform: 'translateX(50%) translateY(50%)',
            }}
          >
            ↗
          </a>
        )}
      </div>
    </div>
  );
}
