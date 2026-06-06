'use client';

import { useEffect, useRef, useCallback } from 'react';
import { HeroSlide } from '@/components/ui/HeroSlide';
import { CarouselIndicator } from '@/components/ui/CarouselIndicator';
import { useCarouselState } from '@/hooks/use-carousel-state';
import type { TeamMember } from '@/types/team';

export interface HeroCarouselProps {
  members: TeamMember[];
}

export function HeroCarousel({ members }: HeroCarouselProps) {
  const { currentIndex, goNext, goPrev, goTo } = useCarouselState(members.length);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const prevIndex = useRef(currentIndex);
  const DRAG_THRESHOLD = 50;

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Parallax on index change
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const slides = trackRef.current?.querySelectorAll<HTMLElement>('[data-slide]');
    slides?.forEach((slide, i) => {
      const cutoutWrap = slide.querySelector<HTMLElement>('[data-cutout]');
      const watermark = slide.querySelector<HTMLElement>('[data-watermark]');
      if (!cutoutWrap || !watermark) return;
      const delta = (i - currentIndex) * 60;
      cutoutWrap.style.transform = `translateX(${delta * 0.8}px)`;
      watermark.style.transform = `translateX(${delta}px)`;
    });
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  // Pointer drag (desktop) + touch swipe (mobile)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
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
    },
    [goNext, goPrev]
  );

  if (members.length === 0) return null;

  return (
    <section
      id="team"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', background: '#0a1c12' }}
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

      {/* Controls */}
      <div className="absolute bottom-8 left-[clamp(1.25rem,5vw,5rem)] right-[clamp(1.25rem,5vw,5rem)] flex items-center justify-between z-10">
        <CarouselIndicator
          total={members.length}
          current={currentIndex}
          onDotClick={goTo}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            aria-label="Previous team member"
            className="rounded-full border border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ←
          </button>
          <button
            onClick={goNext}
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
