'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/components/providers/LenisProvider';

export function ScrollSnapManager() {
  const lenis = useLenis();
  const isSnapping = useRef(false);
  const userHasScrolled = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!lenis) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = true;

    (async () => {
      const gsap = (await import('gsap')).default;
      if (!active) return;

      const getSnapPoints = (): number[] => {
        const works = document.getElementById('work');
        const about = document.getElementById('about');
        return works && about ? [0, works.offsetTop, about.offsetTop] : [0];
      };

      const trySnap = () => {
        if (isSnapping.current) return;
        const sy = window.scrollY;
        const vh = window.innerHeight;
        const threshold = vh * 0.38;
        const pts = getSnapPoints();

        let best: number | null = null;
        let bestDist = Infinity;

        for (const p of pts) {
          const d = Math.abs(sy - p);
          if (d < threshold && d < bestDist) {
            bestDist = d;
            best = p;
          }
        }

        if (best !== null && Math.abs(sy - best) > 5) {
          isSnapping.current = true;
          lenis.scrollTo(best, {
            duration: 1.2,
            onComplete: () => {
              isSnapping.current = false;
            },
          });
        }
      };

      let delayedCall: ReturnType<typeof gsap.delayedCall> | null = null;

      const onScroll = ({ velocity }: { velocity: number }) => {
        // Skip Lenis's synthetic init scroll (velocity === 0, no real user input yet)
        if (!userHasScrolled.current && Math.abs(velocity) < 0.1) return;
        userHasScrolled.current = true;
        delayedCall?.kill();
        delayedCall = gsap.delayedCall(0.18, trySnap);
      };

      lenis.on('scroll', onScroll);

      cleanupRef.current = () => {
        lenis.off('scroll', onScroll);
        delayedCall?.kill();
      };
    })();

    return () => {
      active = false;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [lenis]);

  return null;
}
