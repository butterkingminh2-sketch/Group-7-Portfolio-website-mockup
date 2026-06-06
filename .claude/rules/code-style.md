# Code Style Rules

## 1. File Naming & Folder Placement

1. Name component files in PascalCase: `HeroCarousel.tsx`, `SkewedProjectCard.tsx`, `CrosshairCursor.tsx`, `LenisProvider.tsx`.
2. Name hook and utility files in kebab-case: `use-lenis.ts`, `gsap-utils.ts`, `use-scroll-trigger.ts`.
3. Place all GSAP wrapper components in `/components/animation/`.
4. Place `CrosshairCursor.tsx` in `/components/cursor/`.
5. Place `LenisProvider.tsx` in `/components/providers/`.
6. Place generic UI components (buttons, cards, nav, indicators) in `/components/ui/`.
7. Use named exports for every component, hook, and utility — no default exports except `app/**/page.tsx` and `app/**/layout.tsx`.

---

## 2. Import Order

Enforce this order in every file (ESLint `import/order` rule):

1. React (`react`, `react-dom`)
2. Next.js (`next/*`, `next/image`, `next/dynamic`, `next/navigation`)
3. GSAP and Lenis (`gsap`, `gsap/ScrollTrigger`, `lenis`)
4. Other third-party packages (alphabetical within group)
5. Internal components (`@/components/…`)
6. Internal hooks (`@/hooks/…`)
7. Internal types (`@/types/…`)
8. Styles (`@/styles/…`, `*.css`)

Separate each group with a blank line.

---

## 3. `'use client'` — Exhaustive Trigger List

Add `'use client'` to a file if and only if it directly uses any of the following:

- `gsap` (any `gsap.*` call)
- `ScrollTrigger` (any `ScrollTrigger.*` call)
- `Lenis` constructor or Lenis context consumer
- `useEffect`, `useRef`, `useState`, `useReducer`, `useCallback`, `useMemo` that access DOM APIs
- `window.*` or `document.*` outside a `useEffect` guard
- `mousemove`, `mouseenter`, `mouseleave`, `pointerdown`, `pointerup`, `click` event listeners attached to `window` or `document`
- `requestAnimationFrame` or `cancelAnimationFrame`
- React context providers that expose mutable DOM state

Never add `'use client'` to a file that only renders static markup or fetches data.

---

## 4. TypeScript

1. Enable strict mode in `tsconfig.json`. Never disable it.
2. Never use `any`. Use `unknown` with type narrowing where the type is genuinely unknown.
3. Type GSAP timeline refs as: `useRef<gsap.core.Timeline | null>(null)`.
4. Type ScrollTrigger ref arrays as: `useRef<ScrollTrigger[]>([])`.
5. Type Lenis ref as: `useRef<Lenis | null>(null)`.
6. Type GSAP `quickSetter` return as: `ReturnType<typeof gsap.quickSetter>`.
7. Export all prop types as named interfaces: `interface HeroCarouselProps { … }`.
8. Never use non-null assertion (`!`) except on React refs inside `useEffect` where null-check is implicit.

---

## 5. Forbidden Patterns

1. Never use inline `style={{}}` except on elements that GSAP `.set()` or `.to()` will control.
2. Never call `document.querySelector` or `document.getElementById` outside a `useEffect`.
3. Never use CSS Modules (`*.module.css`).
4. Never use Tailwind `@apply` for animation styles — write animation properties in plain CSS or drive them with GSAP.
5. Never import GSAP or Lenis at the top level of a file that is not explicitly `'use client'`.
6. Never instantiate `Lenis` outside `LenisProvider`.
7. Never create a `ScrollTrigger` without storing it in `triggers.current` for cleanup.
8. Never use `setTimeout` or `setInterval` for animation timing — use GSAP `delay` or `onComplete` callbacks.
9. Never use third-party carousel libraries — implement drag/touch via native pointer events.
10. Never use `box-shadow` on any element (cards, nav, buttons) — shadows are `filter: drop-shadow` on PNG cutouts only.

---

## 6. GSAP Cleanup Pattern

Every `useEffect` that initialises a GSAP timeline or ScrollTrigger MUST follow this pattern exactly:

```ts
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline();
    // … configure tl …
    const st = ScrollTrigger.create({ animation: tl, … });
    triggers.current.push(st);
  }, containerRef);

  return () => {
    ctx.revert();
    triggers.current.forEach((t) => t.kill());
    triggers.current = [];
  };
}, []);
```

Store ALL ScrollTrigger instances in `const triggers = useRef<ScrollTrigger[]>([])` declared at component scope.
Kill ALL triggers in the cleanup function.
Never omit the cleanup return — omission causes memory leaks on Next.js client-side navigation.

---

## 7. Lenis Rules

1. Instantiate Lenis exactly once, inside `LenisProvider` (`/components/providers/LenisProvider.tsx`).
2. Pass the Lenis instance to GSAP via: `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
3. Set `gsap.ticker.lagSmoothing(0)` immediately after.
4. Expose the Lenis instance via React context only — never prop-drill.
5. Call `lenis.destroy()` and remove the GSAP ticker callback in `LenisProvider`'s `useEffect` cleanup.
6. If `prefers-reduced-motion: reduce` is active, skip Lenis initialisation and use native scroll.

---

## 8. Responsive Rules

1. Write mobile-first CSS — base styles target mobile, use `md:` and `lg:` prefixes to add desktop enhancements.
2. Hide `CrosshairCursor` below `lg` (1024px) with `hidden lg:block` on its wrapper.
3. Disable GSAP ScrollTrigger skew animations below `lg` — use CSS `@keyframes` fade-in at `400ms` instead.
4. Switch hero carousel from pointer-drag (desktop) to touch-swipe (mobile) at `md` (768px).

---

## 9. Accessibility

1. Provide descriptive `alt` text for every PNG cutout via the `avatar_alt` frontmatter field.
2. Gate ALL GSAP motion behind `prefers-reduced-motion` check in every `useEffect`.
3. Ensure keyboard navigation functions with all animations disabled.
4. Use `--color-focus` (`#7c6af5`) for all focus rings — apply via Tailwind `focus-visible:ring-[var(--color-focus)]`.
5. Add `aria-label` to all icon-only buttons (carousel arrows, action corner buttons).

---

## 10. Performance

1. Add `loading="lazy"` to all PNG cutout `<img>` elements (use `next/image` with `loading="lazy"`).
2. Provide explicit `width` and `height` on every `next/image` instance to prevent layout shift.
3. Use `will-change: transform` only on elements actively animated: cursor lines, carousel slides.
4. Remove `will-change` after animation completes via GSAP `onComplete` callback.
