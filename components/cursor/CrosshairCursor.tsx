'use client';

import { useEffect, useRef } from 'react';

export function CrosshairCursor() {
  const hRef      = useRef<HTMLDivElement>(null);
  const vRef      = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!hRef.current || !vRef.current || !centerRef.current) return;

    let setY:       ReturnType<typeof import('gsap').default.quickSetter> | null = null;
    let setX:       ReturnType<typeof import('gsap').default.quickSetter> | null = null;
    let setCenterX: ReturnType<typeof import('gsap').default.quickSetter> | null = null;
    let setCenterY: ReturnType<typeof import('gsap').default.quickSetter> | null = null;
    let loaded = false;

    (async () => {
      const gsap = (await import('gsap')).default;
      if (!hRef.current || !vRef.current || !centerRef.current) return;
      setY       = gsap.quickSetter(hRef.current,      'y', 'px');
      setX       = gsap.quickSetter(vRef.current,      'x', 'px');
      setCenterX = gsap.quickSetter(centerRef.current, 'x', 'px');
      setCenterY = gsap.quickSetter(centerRef.current, 'y', 'px');
      loaded = true;
    })();

    const onMove = (e: MouseEvent) => {
      if (!loaded) return;
      setY?.(e.clientY);
      setX?.(e.clientX);
      setCenterX?.(e.clientX);
      setCenterY?.(e.clientY);
    };

    const thicken = () => {
      hRef.current?.classList.add('cursor-thick');
      vRef.current?.classList.add('cursor-thick');
    };

    const thin = () => {
      hRef.current?.classList.remove('cursor-thick');
      vRef.current?.classList.remove('cursor-thick');
    };

    window.addEventListener('mousemove', onMove);

    const clickables = document.querySelectorAll<Element>('a, button, [role="button"]');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', thicken);
      el.addEventListener('mouseleave', thin);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      clickables.forEach((el) => {
        el.removeEventListener('mouseenter', thicken);
        el.removeEventListener('mouseleave', thin);
      });
    };
  }, []);

  return (
    <div className="hidden lg:block" aria-hidden="true">
      <div ref={hRef}      className="cursor-h" />
      <div ref={vRef}      className="cursor-v" />
      <div ref={centerRef} className="cursor-center" />
    </div>
  );
}
