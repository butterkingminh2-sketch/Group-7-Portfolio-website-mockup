'use client';

import { useEffect, useRef } from 'react';

export interface CardRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function CardReveal({ children, className, delay = 0 }: CardRevealProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<import('gsap/ScrollTrigger').ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cardRef.current?.classList.add('motion-fade');
      return;
    }
    if (!cardRef.current) return;

    let ctx: ReturnType<typeof import('gsap').default.context>;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!cardRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay });
        tl.fromTo(
          cardRef.current,
          { rotateX: 22, y: 80, opacity: 0, transformPerspective: 1200 },
          { rotateX: 0, y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
        );

        const st = ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 80%',
          animation: tl,
          once: true,
        });

        triggers.current.push(st);
      }, cardRef);
    })();

    return () => {
      ctx?.revert();
      triggers.current.forEach((t) => t.kill());
      triggers.current = [];
    };
  }, [delay]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}
