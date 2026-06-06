# CLAUDE.md — Studio 7 Portfolio

## Project Summary

Studio 7 is an animation-heavy, scroll-driven Next.js 14 App Router application (TypeScript) delivering an immersive group portfolio experience. The visual layer uses Lenis v1 for smooth dampened scrolling passed to a GSAP ticker, GSAP v3 + ScrollTrigger for perspective-transformed project cards (Nuraform-style keystone reveal), scroll-triggered character text reveals, and a multi-member hero carousel with oversized Anton watermark typography and PNG cutout parallax — all styled with Tailwind CSS v3, a dark brutalism design system with noise grain overlay, and a custom crosshair cursor; every animation is gated behind `prefers-reduced-motion`.

---

## Tech Stack

| Tool | Version | Role |
|------|---------|------|
| Next.js | 14.x (App Router) | Framework |
| TypeScript | 5.x strict | Language |
| Tailwind CSS | 3.x | Layout & spacing utilities |
| Lenis | 1.x | Smooth scroll engine |
| GSAP | 3.x (free tier) | Animations + ScrollTrigger |
| pnpm | 8.x+ | Package manager |
| Vercel | — | Deployment |

---

## Terminal Commands

- `pnpm dev` — start development server (port 3000)
- `pnpm build` — production build
- `pnpm lint` — run ESLint
- `pnpm format` — run Prettier
- `pnpm type-check` — run `tsc --noEmit`

---

## Rules

1. Read ALL files in `.claude/rules/` before writing any component, animation, or style.
2. Use ES6 modules only. Never use CommonJS `require()`.
3. Default to React Server Components. Add `'use client'` only for triggers listed in `.claude/rules/code-style.md`.
4. Import GSAP and Lenis via `next/dynamic` or dynamic `import()` — never at the top level of a server-rendered file.
5. Use `next/image` for all member photos (`/public/team/*.png`).
6. Kill every GSAP `Timeline` and `ScrollTrigger` instance inside the `useEffect` cleanup return.
7. Destroy every `Lenis` instance inside the `useEffect` cleanup return.
8. Gate every GSAP/Lenis animation block behind: `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`.
9. Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `animation:`, `style:`.
10. Use `pnpm` — never `npm` or `yarn`.
11. Never use CSS Modules. Never use `@apply` for animation styles.
12. Use named exports everywhere except `app/**/page.tsx` and `app/**/layout.tsx`.

---

## Directory Map

```
/app                         Next.js App Router — pages, layouts, route segments
/components/animation        GSAP wrappers — ScrollTrigger reveals, card animations, text splits
/components/cursor           CrosshairCursor ('use client', mounted in root layout)
/components/providers        LenisProvider — single Lenis instance, GSAP ticker integration
/components/ui               Generic UI — buttons, project cards, nav, carousel dots, indicators
/content/team                One .md file per member — YAML frontmatter + extended bio body
/content/projects            Optional project MDX/Markdown files
/public/team                 Background-removed PNG cutouts — naming: [slug]-cutout.png
```

---

## Critical Warnings

### When to Add `'use client'`
Add ONLY if the file directly uses:
- `gsap.*` or `ScrollTrigger.*`
- Lenis constructor or Lenis context consumer
- `mousemove`, `mouseenter`, `mouseleave`, `pointerdown`, `pointerup` listeners
- `useEffect`, `useRef`, `useState` that touch DOM APIs
- `window.*` or `document.*` outside of a `useEffect`

### GSAP Cleanup — Required Pattern
```ts
const triggers = useRef<ScrollTrigger[]>([]);
// inside useEffect:
const tl = gsap.timeline({ ... });
const st = ScrollTrigger.create({ ... });
triggers.current.push(st);
// cleanup:
return () => {
  tl.kill();
  triggers.current.forEach((t) => t.kill());
};
```

### Lenis Init — `LenisProvider` Only
```ts
// /components/providers/LenisProvider.tsx
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
// cleanup: lenis.destroy()
```
Never instantiate Lenis in leaf components. Consume via context only.

### Dynamic Imports — Always for GSAP/Lenis
```ts
const gsapModule = await import('gsap');
const gsap = gsapModule.default;
const { ScrollTrigger } = await import('gsap/ScrollTrigger');
gsap.registerPlugin(ScrollTrigger);
```

### Noise Overlay — Location
Lives in `globals.css` as `body::after`. Never inline in components. See `.claude/rules/design-system.md` for the full data URI.
