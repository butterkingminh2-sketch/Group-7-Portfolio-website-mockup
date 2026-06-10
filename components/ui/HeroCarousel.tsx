'use client';

import { useEffect, useRef, useCallback } from 'react';
import { HeroSlide } from '@/components/ui/HeroSlide';
import { CarouselIndicator } from '@/components/ui/CarouselIndicator';
import { useCarouselState } from '@/hooks/use-carousel-state';
import type { TeamMember } from '@/types/team';

export interface HeroCarouselProps {
  members: TeamMember[];
}

const AUTOPLAY_MS = 5000;
const DEFAULT_BG  = '#0a1c12';

export function HeroCarousel({ members }: HeroCarouselProps) {
  const { currentIndex, goNext, goPrev, goTo } = useCarouselState(members.length);
  const trackRef    = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const dragStart   = useRef<number | null>(null);
  const prevIndex   = useRef(currentIndex);
  const isPaused    = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DRAG_THRESHOLD = 50;

  // ── Autoplay ──────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPaused.current) goNext();
    }, AUTOPLAY_MS);
  }, [goNext]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [startAutoplay]);

  // ── Keyboard navigation ────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { goNext(); startAutoplay(); }
      if (e.key === 'ArrowLeft')  { goPrev(); startAutoplay(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, startAutoplay]);

  // ── Background colour transition ───────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.style.background =
      members[currentIndex]?.hero_bg ?? DEFAULT_BG;
  }, [currentIndex, members]);

  // ── Parallax on index change ───────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const slides = trackRef.current?.querySelectorAll<HTMLElement>('[data-slide]');
    slides?.forEach((slide, i) => {
      const cutoutWrap = slide.querySelector<HTMLElement>('[data-cutout]');
      const watermark  = slide.querySelector<HTMLElement>('[data-watermark]');
      if (!cutoutWrap || !watermark) return;
      const delta = (i - currentIndex) * 60;
      cutoutWrap.style.transform = `translateX(${delta * 0.8}px)`;
      watermark.style.transform  = `translateX(${delta}px)`;
    });
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  // ── Pointer drag (desktop) + touch swipe (mobile) ─────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isPaused.current = true;
    dragStart.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStart.current === null) return;
      const delta = e.clientX - dragStart.current;
      if (Math.abs(delta) > DRAG_THRESHOLD) {
        delta < 0 ? goNext() : goPrev();
      }
      dragStart.current = null;
      isPaused.current = false;
      startAutoplay();
    },
    [goNext, goPrev, startAutoplay]
  );

  if (members.length === 0) return null;

  const bgColor = members[currentIndex]?.hero_bg ?? DEFAULT_BG;

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative w-full overflow-hidden"
      style={{
        height: '100svh',
        background: bgColor,
        transition: 'background 700ms cubic-bezier(0.76, 0, 0.24, 1)',
      }}
      aria-label="Team members carousel"
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div
        ref={trackRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-live="polite"
      >
        {members.map((member, i) => (
          <HeroSlide key={member.slug} member={member} isActive={i === currentIndex} />
        ))}
      </div>

      {/* Left hero content — label, heading, sub, CTA */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(5rem, 10vh, 7rem)',
          left: 'clamp(1.25rem, 5vw, 5rem)',
          width: 'clamp(260px, 36vw, 480px)',
          zIndex: 1010,
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '20px',
              height: '1px',
              background: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          Meet the team
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 3.8vw, 3.25rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: 'var(--color-text)',
            marginTop: '1rem',
            pointerEvents: 'none',
          }}
        >
          Analytical thinking,<br />creative delivery.
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 'clamp(0.8rem, 1.15vw, 0.95rem)',
            fontWeight: 400,
            lineHeight: 1.75,
            color: 'var(--color-text-muted)',
            marginTop: '1rem',
            pointerEvents: 'none',
          }}
        >
          Ten business administration students at HSB University — building strategy, research, and communication that makes an impact.
        </p>

        {/* CTA */}
        <a
          href="#works"
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.7rem',
            marginTop: '1.75rem',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '28px',
              height: '1px',
              background: 'var(--color-accent-start)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          Explore Our Work
        </a>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-[clamp(1.25rem,5vw,5rem)] right-[clamp(1.25rem,5vw,5rem)] flex items-center justify-between z-[1010]">
        <CarouselIndicator
          total={members.length}
          current={currentIndex}
          onDotClick={(i) => { goTo(i); startAutoplay(); }}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => { goPrev(); startAutoplay(); }}
            aria-label="Previous team member"
            className="rounded-full border border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ←
          </button>
          <button
            onClick={() => { goNext(); startAutoplay(); }}
            aria-label="Next team member"
            className="rounded-full border border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
