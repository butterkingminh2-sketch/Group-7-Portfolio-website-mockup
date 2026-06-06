'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLenis } from '@/components/providers/LenisProvider';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Team', href: '#team' },
  { label: 'About', href: '#about' },
];

export function NavBar() {
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cleanups: (() => void)[] = [];

    (async () => {
      const gsap = (await import('gsap')).default;
      const links = navRef.current?.querySelectorAll<HTMLAnchorElement>('.nav-link');

      links?.forEach((link) => {
        const underline = link.querySelector<HTMLSpanElement>('.nav-underline');
        if (!underline) return;

        const enter = () => gsap.to(underline, { width: '100%', duration: 0.3, ease: 'power1.out' });
        const leave = () => gsap.to(underline, { width: '0%', duration: 0.3, ease: 'power1.out' });

        link.addEventListener('mouseenter', enter);
        link.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          link.removeEventListener('mouseenter', enter);
          link.removeEventListener('mouseleave', leave);
        });
      });
    })();

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(1.25rem,5vw,5rem)] py-6"
      style={{
        background: 'rgba(10, 28, 18, 0.72)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid rgba(250, 250, 249, 0.06)',
      }}
    >
      <Link
        href="/"
        className="font-display text-text-primary tracking-widest text-sm uppercase"
        style={{ letterSpacing: '0.1em' }}
      >
        Studio 7
      </Link>

      <nav ref={navRef} className="flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleNavClick(e, href)}
            className="nav-link relative font-body text-text-muted hover:text-text-primary transition-colors duration-200"
            style={{ fontSize: '0.875rem', letterSpacing: '0.04em', cursor: 'pointer' }}
          >
            <span className="uppercase">{label}</span>
            <span
              className="nav-underline absolute bottom-0 left-0 h-px bg-text-primary"
              style={{ width: '0%' }}
            />
          </a>
        ))}
      </nav>
    </header>
  );
}
