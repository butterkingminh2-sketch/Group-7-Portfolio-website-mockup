'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Team', href: '#team' },
  { label: 'About', href: '#about' },
];

export function NavBar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let gsap: typeof import('gsap').default | null = null;

    (async () => {
      gsap = (await import('gsap')).default;
    })();

    const links = navRef.current?.querySelectorAll<HTMLAnchorElement>('.nav-link');

    links?.forEach((link) => {
      const underline = link.querySelector<HTMLSpanElement>('.nav-underline');
      if (!underline || !gsap) return;

      const enter = () => gsap!.to(underline, { width: '100%', duration: 0.3, ease: 'power1.out' });
      const leave = () => gsap!.to(underline, { width: '0%', duration: 0.3, ease: 'power1.out' });

      link.addEventListener('mouseenter', enter);
      link.addEventListener('mouseleave', leave);

      return () => {
        link.removeEventListener('mouseenter', enter);
        link.removeEventListener('mouseleave', leave);
      };
    });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(1.25rem,5vw,5rem)] py-6">
      <Link
        href="/"
        className="font-display text-text-primary tracking-widest text-sm uppercase"
        style={{ letterSpacing: '0.1em' }}
      >
        Studio 7
      </Link>

      <nav ref={navRef} className="flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="nav-link relative font-body text-text-muted hover:text-text-primary transition-colors duration-200"
            style={{ fontSize: '0.875rem', letterSpacing: '0.04em' }}
          >
            <span className="uppercase">{label}</span>
            <span
              className="nav-underline absolute bottom-0 left-0 h-px bg-text-primary"
              style={{ width: '0%' }}
            />
          </Link>
        ))}
      </nav>
    </header>
  );
}
