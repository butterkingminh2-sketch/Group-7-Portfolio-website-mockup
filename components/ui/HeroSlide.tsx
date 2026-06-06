import Image from 'next/image';
import type { TeamMember } from '@/types/team';

export interface HeroSlideProps {
  member: TeamMember;
  isActive: boolean;
}

export function HeroSlide({ member, isActive }: HeroSlideProps) {
  return (
    <div
      data-slide="true"
      className="absolute inset-0 flex items-end"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 700ms cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      aria-hidden={!isActive}
    >
      {/* Watermark — larger, anchored above the member's head */}
      <div
        data-watermark="true"
        className="absolute inset-0 flex items-start justify-center overflow-hidden select-none"
        style={{ zIndex: 0, paddingTop: '6vh' }}
        aria-hidden="true"
      >
        <span
          className="font-display uppercase leading-none"
          style={{
            fontSize: 'clamp(8rem, 26vw, 26rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            color: 'var(--color-text-ghost)',
            display: 'block',
            textShadow: isActive
              ? '0 0 120px rgba(244,162,122,0.14), 0 0 260px rgba(177,151,252,0.09)'
              : 'none',
            animation: isActive
              ? 'slide-up 900ms cubic-bezier(0.76, 0, 0.24, 1) forwards'
              : 'none',
            transform: isActive ? undefined : 'translateY(50px)',
            opacity: isActive ? undefined : 0,
          }}
        >
          {member.display_name_bg}
        </span>
      </div>

      {/* PNG Cutout — face centred at ~50vh */}
      <div
        data-cutout="true"
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      >
        {/* Positioning wrapper: image top at 33vh → face (~22% down portrait) lands at ~50vh */}
        <div
          style={{
            position: 'absolute',
            top: '33vh',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              filter: isActive
                ? 'drop-shadow(0 32px 64px rgba(0,0,0,0.6)) drop-shadow(0 0 60px rgba(244,162,122,0.13))'
                : 'drop-shadow(0 32px 64px rgba(0,0,0,0.6))',
              transition: 'filter 800ms ease',
              animation: isActive
                ? 'slide-up 900ms cubic-bezier(0.76, 0, 0.24, 1) 80ms forwards'
                : 'none',
              transform: isActive ? undefined : 'translateY(70px)',
              opacity: isActive ? undefined : 0,
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
      </div>

      {/* Bio Overlay — slide from left with 200ms delay */}
      <div
        className="relative w-full px-[clamp(1.25rem,5vw,5rem)] pb-16"
        style={{
          zIndex: 2,
          animation: isActive
            ? 'slide-from-left 700ms cubic-bezier(0.76, 0, 0.24, 1) 200ms forwards'
            : 'none',
          transform: isActive ? undefined : 'translateX(-36px)',
          opacity: isActive ? undefined : 0,
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
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', fontWeight: 600, lineHeight: 1.3 }}
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
