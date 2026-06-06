# Design System — Studio 7

## 1. CSS Custom Property Tokens

Paste the full token block at the top of `globals.css` inside `:root`.

### Primitive Tokens (raw values — never reference directly in components)

| Token | Value | Use |
|-------|-------|-----|
| `--primitive-bg-deep` | `#0a1c12` | Base canvas |
| `--primitive-bg-surface` | `#0f2318` | Cards, panels |
| `--primitive-bg-overlay` | `#162d1e` | Hover / raised surface |
| `--primitive-cream` | `#fafaf9` | Primary text |
| `--primitive-cream-muted` | `#a8a89e` | Muted text, captions |
| `--primitive-watermark` | `rgba(250,250,249,0.05)` | Oversized bg label text |
| `--primitive-accent-start` | `#f4a27a` | Gradient start (warm coral) |
| `--primitive-accent-end` | `#b197fc` | Gradient end (soft violet) |
| `--primitive-accent-mid` | `#e879a0` | Gradient midpoint (deep rose) |
| `--primitive-border` | `rgba(250,250,249,0.08)` | Subtle dividers |
| `--primitive-border-hover` | `rgba(250,250,249,0.18)` | Hover state borders |
| `--primitive-focus` | `#7c6af5` | Keyboard focus ring (WCAG AA) |

### Semantic Tokens (reference these in all components and Tailwind config)

| Token | Maps to | Meaning |
|-------|---------|---------|
| `--color-bg` | `var(--primitive-bg-deep)` | Page background |
| `--color-surface` | `var(--primitive-bg-surface)` | Card / panel background |
| `--color-surface-raised` | `var(--primitive-bg-overlay)` | Hover-elevated surface |
| `--color-text` | `var(--primitive-cream)` | Primary readable text |
| `--color-text-muted` | `var(--primitive-cream-muted)` | Secondary / caption text |
| `--color-text-ghost` | `var(--primitive-watermark)` | Watermark / background label |
| `--color-accent-start` | `var(--primitive-accent-start)` | Gradient start |
| `--color-accent-end` | `var(--primitive-accent-end)` | Gradient end |
| `--color-border` | `var(--primitive-border)` | Default border |
| `--color-border-hover` | `var(--primitive-border-hover)` | Hovered border |
| `--color-focus` | `var(--primitive-focus)` | Focus ring |

### `globals.css` Token Block

```css
:root {
  /* Primitives */
  --primitive-bg-deep:      #0a1c12;
  --primitive-bg-surface:   #0f2318;
  --primitive-bg-overlay:   #162d1e;
  --primitive-cream:        #fafaf9;
  --primitive-cream-muted:  #a8a89e;
  --primitive-watermark:    rgba(250, 250, 249, 0.05);
  --primitive-accent-start: #f4a27a;
  --primitive-accent-end:   #b197fc;
  --primitive-accent-mid:   #e879a0;
  --primitive-border:       rgba(250, 250, 249, 0.08);
  --primitive-border-hover: rgba(250, 250, 249, 0.18);
  --primitive-focus:        #7c6af5;

  /* Semantic */
  --color-bg:            var(--primitive-bg-deep);
  --color-surface:       var(--primitive-bg-surface);
  --color-surface-raised:var(--primitive-bg-overlay);
  --color-text:          var(--primitive-cream);
  --color-text-muted:    var(--primitive-cream-muted);
  --color-text-ghost:    var(--primitive-watermark);
  --color-accent-start:  var(--primitive-accent-start);
  --color-accent-end:    var(--primitive-accent-end);
  --color-border:        var(--primitive-border);
  --color-border-hover:  var(--primitive-border-hover);
  --color-focus:         var(--primitive-focus);
}
```

---

## 2. Card Gradient

Apply as `background` (not border) on project card face:

```css
background: linear-gradient(
  135deg,
  var(--color-accent-start)      0%,
  var(--primitive-accent-mid)   50%,
  var(--color-accent-end)       100%
);
```

Text color on gradient card face: `#1a0a2e` (deep violet-black — passes WCAG AA on this gradient).

---

## 3. `tailwind.config.ts` — `extend` Block

```ts
extend: {
  colors: {
    'bg-deep':        'var(--color-bg)',
    'surface':        'var(--color-surface)',
    'surface-raised': 'var(--color-surface-raised)',
    'text-primary':   'var(--color-text)',
    'text-muted':     'var(--color-text-muted)',
    'text-ghost':     'var(--color-text-ghost)',
    'accent-start':   'var(--color-accent-start)',
    'accent-end':     'var(--color-accent-end)',
    'border-subtle':  'var(--color-border)',
    'border-hover':   'var(--color-border-hover)',
    'focus-ring':     'var(--color-focus)',
  },
  fontFamily: {
    display:  ['Anton', 'sans-serif'],
    heading:  ['"Playfair Display"', 'Georgia', 'serif'],
    body:     ['"DM Sans"', 'system-ui', 'sans-serif'],
    mono:     ['"JetBrains Mono"', 'monospace'],
  },
  maxWidth: {
    content: '1440px',
  },
},
```

---

## 4. Typography Scale

| Element | Font | `clamp()` value | Weight | Line Height | Letter Spacing |
|---------|------|-----------------|--------|-------------|----------------|
| Watermark / display | Anton | `clamp(5rem, 18vw, 16rem)` | 900 | 0.9 | -0.02em |
| `h1` hero | Playfair Display | `clamp(2.5rem, 6vw, 5rem)` | 700 italic | 1.1 | 0 |
| `h2` | Playfair Display | `clamp(1.75rem, 4vw, 3rem)` | 600 | 1.2 | 0 |
| `h3` | Playfair Display | `clamp(1.25rem, 2.5vw, 2rem)` | 600 | 1.3 | 0 |
| Body | DM Sans | `clamp(0.9375rem, 1.5vw, 1.0625rem)` | 400 | 1.65 | 0 |
| Label / nav | DM Sans | `0.875rem` (fixed) | 500 | 1.4 | 0.04em |
| Nav items | DM Sans | `0.875rem` (fixed) | 500 | 1.4 | 0.04em + uppercase |
| Code | JetBrains Mono | `0.875rem` (fixed) | 400 | 1.6 | 0 |

Rules:
- Never use fixed `px` for typographic sizes — use `clamp()` or `rem`.
- Watermark (Anton) is visual texture only. Never apply it to readable content.
- Nav items: `text-transform: uppercase`, `letter-spacing: 0.04em`.

---

## 5. Animation Spec Table

| Component | Trigger | GSAP `fromVars` | GSAP `toVars` | Duration | Ease | Stagger | ScrollTrigger `start` |
|-----------|---------|-----------------|---------------|----------|------|---------|----------------------|
| Project Card (Nuraform reveal) | ScrollTrigger enter | `{ rotateX: 22, translateY: 80, opacity: 0, transformPerspective: 1200 }` | `{ rotateX: 0, translateY: 0, opacity: 1 }` | `0.9s` | `power3.out` | `0.15s` | `"top 80%"` |
| Text char reveal (editorial words) | ScrollTrigger enter | `{ translateY: '110%', opacity: 0 }` | `{ translateY: '0%', opacity: 1 }` | `0.7s` | `power2.out` | `0.03s` | `"top 75%"` |
| Hero carousel slide transition | Arrow / dot click | `{ x: '100%', opacity: 0 }` (incoming) | `{ x: '0%', opacity: 1 }` | `0.7s` | `cubic-bezier(0.76, 0, 0.24, 1)` | — | Manual trigger |
| Hero carousel cutout parallax | Slide delta | CSS `transform: translateX(${delta * 0.8}px)` on cutout | — | — | — | — | Pointer delta |
| Card hover lift | `mouseenter` | — | `{ translateY: -6, duration: 0.2, ease: 'power1.out' }` | `0.2s` | `power1.out` | — | CSS hover |
| Card `::after` gradient border | `mouseenter` | `{ opacity: 0 }` | `{ opacity: 1, duration: 0.2 }` | `0.2s` | `power1.out` | — | CSS hover |
| Nav link underline | `mouseenter` | `{ width: '0%' }` | `{ width: '100%', duration: 0.3, ease: 'power1.out' }` | `0.3s` | `power1.out` | — | CSS hover |
| Button press | `mousedown` | — | `{ scale: 0.97, duration: 0.1 }` | `0.1s` | `power1.in` | — | `mousedown` |

### Nuraform Card — CSS Perspective Setup

```css
/* Parent wrapper */
.card-grid {
  perspective: 1200px;
}

/* Card default state (subtle persistent tilt) */
.project-card {
  transform: rotateX(12deg);
  transform-style: preserve-3d;
}
```

GSAP scroll animation overrides `rotateX` from `22deg` (entry) → `0deg` (midpoint scroll position).

---

## 6. Component Rules

### Project Card

- Shape: `rounded-none` (0 border-radius). Sharp brutalist edges.
- Background: card gradient (Section 2). No `box-shadow`.
- `overflow: visible` on card — title overflows top edge intentionally.
- Title positioning: `position: absolute; top: -0.6em` — uses Playfair Display at h2 size.
- Title color on card: inherits from page (NOT `#1a0a2e` — title sits above the card, not on it).
- Text inside card body: `#1a0a2e`.
- Corner action button: `32px` circle, `rounded-full`, background `var(--color-text)`, dark icon color, `transform: translateX(50%) translateY(50%)` — positions to sit exactly on bottom-right corner.
- `::after` pseudo: `2px` gradient border (`linear-gradient(135deg, var(--color-accent-start), var(--color-accent-end))`), `opacity: 0` default, `opacity: 1` on hover.

### Hero Slide

- Z-index stack per slide:
  - `z-index: 0` — Anton watermark name (`color: var(--color-text-ghost)`)
  - `z-index: 1` — Member PNG cutout (`filter: drop-shadow(0 32px 64px rgba(0,0,0,0.6))`)
  - `z-index: 2` — Bio overlay text (Playfair Display h3 + DM Sans body)
- Parallax on slide transition: cutout moves at `0.8×` speed of watermark. Drive via JS `transform` on `transitionend` or `requestAnimationFrame` — not GSAP.
- Slide transition: `700ms cubic-bezier(0.76, 0, 0.24, 1)`.
- Pagination indicator: max 10 visible dots. When total > 10 slides, collapse to `"3 of 12"` counter text.
- Touch/drag: native pointer events only. No third-party carousel library.

### Crosshair Cursor

- Two `<div>` elements inside `<CrosshairCursor>` (`'use client'`):
  - `.cursor-h`: `width: 100vw; height: 1px; position: fixed; top: 0; left: 0; transform: translateY(${y}px)`
  - `.cursor-v`: `width: 1px; height: 100vh; position: fixed; top: 0; left: 0; transform: translateX(${x}px)`
- Both: `pointer-events: none; z-index: 9999; background: var(--primitive-cream); opacity: 0.35; will-change: transform`.
- Crosshair center gap: 8px dead zone via `clip-path: inset(calc(50% - 4px) 0 calc(50% - 4px) 0)` on `.cursor-h` and mirrored on `.cursor-v`.
- Track via `mousemove` on `window`. Use `gsap.quickSetter` — NOT `style.transform` directly.
- Hidden below `lg` (1024px): wrap in `<div className="hidden lg:block">`.
- On clickable elements (`a`, `button`): add class that sets `height: 2px` (`.cursor-h`) / `width: 2px` (`.cursor-v`) and `opacity: 0.7`. Apply via `mouseenter` on all interactive elements.
- Mount `<CrosshairCursor>` in root `layout.tsx`, outside `<main>`.

### Noise Overlay

Add to `globals.css` as `body::after`. Never in a component.

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.055;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
```

---

## 7. Spacing Scale

### Micro (component internals)
4px base unit: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`. Map to Tailwind `p-1` through `p-8`.

### Macro (between sections)
```css
padding-block: clamp(6rem, 15vh, 12rem);
```

### Layout
- Content max-width: `1440px` (`max-w-content` via Tailwind config)
- Horizontal padding: `clamp(1.25rem, 5vw, 5rem)` (apply via a `px-content` utility in `globals.css` or Tailwind `paddingX` extend)

---

## 8. Border Radius

| Element | Value |
|---------|-------|
| Project cards | `0px` (`rounded-none`) |
| Action buttons, pills, carousel dots | `9999px` (`rounded-full`) |
| All other elements | `0px` (`rounded-none`) by default |

---

## 9. Shadows

- Member PNG cutouts ONLY: `filter: drop-shadow(0 32px 64px rgba(0, 0, 0, 0.6))`
- Never use `box-shadow` on any element.
- No `backdrop-filter: blur()` on any element except the noise overlay `mix-blend-mode`.

---

## 10. Reduced Motion Fallback

When `prefers-reduced-motion: reduce` matches:
- Skip Lenis — use native scroll.
- Skip all GSAP ScrollTrigger animations.
- Apply `opacity: 0 → 1` fade-in via CSS `@keyframes` at `400ms` ease.
- Hide cursor lines.
- Keep all content readable and accessible.

Each `useEffect` that initialises GSAP MUST begin with:
```ts
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```
