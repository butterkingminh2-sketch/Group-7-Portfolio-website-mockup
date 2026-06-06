import Image from 'next/image';
import type { TeamMember } from '@/types/team';

export interface HeroSlideProps {
  member: TeamMember;
  isActive: boolean;
}

const SLIDE_EASE = '700ms cubic-bezier(0.76, 0, 0.24, 1)';
const SLIDE_EASE_SLOW = '900ms cubic-bezier(0.76, 0, 0.24, 1)';

export function HeroSlide({ member, isActive }: HeroSlideProps) {
  return (
    <div
      data-slide="true"
      className="absolute inset-0 flex items-end"
      style={{
        opacity: isActive ? 1 : 0,
        transition: `opacity ${SLIDE_EASE}`,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      aria-hidden={!isActive}
    >
      {/* Watermark — z-index 0, slide-up + glow */}
      <div
        data-watermark="true"
        className="absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <span
          className="font-display uppercase leading-none"
          style={{
            fontSize: 'clamp(5rem, 18vw, 16rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            color: 'var(--color-text-ghost)',
            display: 'block',
            transform: isActive ? 'translateY(0)' : 'translateY(50px)',
            transition: `transform ${SLIDE_EASE_SLOW}, text-shadow ${SLIDE_EASE_SLOW}`,
            textShadow: isActive
              ? '0 0 120px rgba(244,162,122,0.12), 0 0 240px rgba(177,151,252,0.08)'
              : 'none',
          }}
        >
          {member.display_name_bg}
        </span>
      </div>

      {/* PNG Cutout — z-index 1, slide-up */}
      <div
        data-cutout="true"
        className="absolute inset-0 flex items-end justify-center"
        style={{ zIndex: 1 }}
      >
        {/* inner wrapper carries the slide-up; outer carries parallax translateX */}
        <div
          style={{
            filter: isActive
              ? 'drop-shadow(0 32px 64px rgba(0,0,0,0.6)) drop-shadow(0 0 60px rgba(244,162,122,0.12))'
              : 'drop-shadow(0 32px 64px rgba(0,0,0,0.6))',
            transform: isActive ? 'translateY(0)' : 'translateY(70px)',
            transition: `transform ${SLIDE_EASE_SLOW} 80ms, filter ${SLIDE_EASE_SLOW} 80ms`,
          }}
        >
          <Image
            src={member.avatar}
            alt={member.avatar_alt}
            width={480}
            height={640}
            loading="lazy"
            className="object-contain max-h-[75vh] w-auto"
          />
        </div>
      </div>

      {/* Bio Overlay — z-index 2, slide from left */}
      <div
        className="relative w-full px-[clamp(1.25rem,5vw,5rem)] pb-16"
        style={{
          zIndex: 2,
          transform: isActive ? 'translateX(0)' : 'translateX(-36px)',
          opacity: isActive ? 1 : 0,
          transition: `transform ${SLIDE_EASE} 180ms, opacity ${SLIDE_EASE} 180ms`,
        }}
      >
        <p
          className="font-body text-text-muted mb-1 uppercase"
          style={{ fontSize: '0.875rem', letterSpacing: '0.04em' }}
        >
          {member.role}
        </p>
        <h2
          className="font-heading text-text-primary"
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {member.name}
        </h2>
        <p
          className="text-text-muted mt-2 max-w-sm"
          style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)', lineHeight: 1.65 }}
        >
          {member.bio_short}
        </p>
      </div>
    </div>
  );
}
