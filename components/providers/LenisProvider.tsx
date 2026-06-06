'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type LenisType from 'lenis';

interface LenisContextValue {
  lenis: LenisType | null;
}

export const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis(): LenisType | null {
  return useContext(LenisContext).lenis;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<LenisType | null>(null);
  const gsapRef = useRef<typeof import('gsap').default | null>(null);
  const tickerFn = useRef<((time: number) => void) | null>(null);
  const lenisRef = useRef<LenisType | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = true;

    (async () => {
      const [lenisModule, gsapModule, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!active) return;

      const LenisClass = lenisModule.default;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const instance = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const ticker = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      // Sync Lenis scroll position → GSAP ScrollTrigger so pins work correctly
      instance.on('scroll', () => ScrollTrigger.update());

      lenisRef.current = instance;
      gsapRef.current = gsap;
      tickerFn.current = ticker;
      setLenis(instance);
    })();

    return () => {
      active = false;
      if (gsapRef.current && tickerFn.current) {
        gsapRef.current.ticker.remove(tickerFn.current);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
  );
}
