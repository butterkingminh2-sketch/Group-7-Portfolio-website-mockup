'use client';

import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';

export interface TextCharRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  triggerStart?: string;
}

export function TextCharReveal({
  text,
  as: Tag = 'span',
  className,
  style,
  triggerStart = 'top 75%',
}: TextCharRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const triggers = useRef<import('gsap/ScrollTrigger').ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!containerRef.current) return;

    let ctx: ReturnType<typeof import('gsap').default.context>;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      const chars = containerRef.current.querySelectorAll<HTMLSpanElement>('.char');

      ctx = gsap.context(() => {
        const tl = gsap.fromTo(
          chars,
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.03,
          }
        );

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: triggerStart,
          animation: tl,
          once: true,
        });

        triggers.current.push(st);
      }, containerRef);
    })();

    return () => {
      ctx?.revert();
      triggers.current.forEach((t) => t.kill());
      triggers.current = [];
    };
  }, [text, triggerStart]);

  const setRef = (el: HTMLElement | null) => {
    containerRef.current = el;
  };

  return (
    <Tag ref={setRef} className={className} style={style} aria-label={text}>
      <span aria-hidden="true" style={{ overflow: 'hidden', display: 'inline-block' }}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="char"
            style={{ display: 'inline-block', willChange: 'transform' }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </Tag>
  );
}
