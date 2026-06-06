# Master Prompt — Group Portfolio Website Setup
## PROMPT

```
Role: You are an expert System Architect, Technical Writer, and Web Developer
specializing in animation-heavy, scroll-driven Next.js applications with GSAP and Lenis.

---

## Project Overview

My team is building a group portfolio website with an immersive, scroll-driven
experience inspired by abhishekjha.me and the Nuraform card aesthetic. We are
using Claude Code as our AI coding agent. Your job is to generate the complete
foundation of configuration and content files so Claude Code can operate
efficiently, follow our design system, and understand our team data from day one.

---

## Project Variables

- **Project Name:** Studio 7
- **Project Goal:** A professional group portfolio highlighting our business
  administration projects, data analysis research, and individual capabilities —
  delivered through an immersive, scroll-driven visual experience.
- **Live URL (if known):** TBD

### Tech Stack
- **Framework:** Next.js 14 App Router (TypeScript)
- **Styling:** Tailwind CSS v3 + Global CSS (cursor lines + noise overlay only)
- **Scroll Engine:** Lenis v1 (smooth dampened scrolling — replaces GSAP ScrollSmoother)
- **Animation:** GSAP v3 + ScrollTrigger plugin (card skew/tilt, text reveals)
- **Content Layer:** [e.g., Contentlayer + MDX / plain Markdown]
- **Package Manager:** [e.g., pnpm]
- **Deployment:** Vercel

### Team Members
- 10+ members, details TBD. Generate the template and rules to accommodate this scale.
- Each member has: full name, role, key skills, a background-removed PNG cutout photo,
  and a display watermark name (all-caps version used as oversized background text).
- The hero carousel must support pagination/indicators for 10+ slides without
  overwhelming the UI.

### Design System

**Style Direction:**
Immersive, scroll-driven storytelling. Dark-mode brutalism meets refined editorial
typography. Inspired by abhishekjha.me: layered depth via oversized watermark type
behind foreground elements, noise grain on every surface, perspective-transformed
cards, and high-contrast serif/sans pairings.

**Color Palette — Contemporary UI/UX Dark Scheme:**

These tokens follow the Vercel/Linear semantic token pattern: primitive first,
semantic second. Desaturated mid-tones for surfaces, high-contrast cream for text,
reserved accent color for interactive moments only.

Primitive tokens (raw values):
- `--primitive-bg-deep`:      #0a1c12   (deep dark green — base canvas)
- `--primitive-bg-surface`:   #0f2318   (slightly lighter green — cards, panels)
- `--primitive-bg-overlay`:   #162d1e   (hover/raised surface)
- `--primitive-cream`:        #fafaf9   (off-white — primary text)
- `--primitive-cream-muted`:  #a8a89e   (muted text, captions)
- `--primitive-watermark`:    rgba(250,250,249,0.05)  (oversized bg label text)
- `--primitive-accent-start`: #f4a27a   (warm coral — gradient start)
- `--primitive-accent-end`:   #b197fc   (soft violet — gradient end)
- `--primitive-accent-mid`:   #e879a0   (deep rose — midpoint, optional 3-stop)
- `--primitive-border`:       rgba(250,250,249,0.08)  (subtle dividers)
- `--primitive-border-hover`: rgba(250,250,249,0.18)  (hover state borders)
- `--primitive-focus`:        #7c6af5   (keyboard focus ring — violet, WCAG AA)

Semantic tokens (mapped to primitives, used in components):
- `--color-bg`:           var(--primitive-bg-deep)
- `--color-surface`:      var(--primitive-bg-surface)
- `--color-surface-raised`: var(--primitive-bg-overlay)
- `--color-text`:         var(--primitive-cream)
- `--color-text-muted`:   var(--primitive-cream-muted)
- `--color-text-ghost`:   var(--primitive-watermark)
- `--color-accent-start`: var(--primitive-accent-start)
- `--color-accent-end`:   var(--primitive-accent-end)
- `--color-border`:       var(--primitive-border)
- `--color-border-hover`: var(--primitive-border-hover)
- `--color-focus`:        var(--primitive-focus)

Card gradient (applied to card face — this IS the card background, not just border):
`linear-gradient(135deg, var(--color-accent-start) 0%, var(--primitive-accent-mid) 50%, var(--color-accent-end) 100%)`

Text on gradient card face: `#1a0a2e` (deep violet-black — passes WCAG AA on the gradient)

**Typography:**

- Watermark / Display (background layer only): **Anton** — 900 weight, uppercase,
  used purely as visual texture behind foreground elements. Never used for readable
  content. Size: `clamp(5rem, 18vw, 16rem)`, `letter-spacing: -0.02em`, `line-height: 0.9`
- Headings h1–h3: **Playfair Display** — 700 italic for h1 hero titles,
  600 for h2/h3. High contrast serif against the geometric Anton background.
  h1: `clamp(2.5rem, 6vw, 5rem)` / h2: `clamp(1.75rem, 4vw, 3rem)` / h3: `clamp(1.25rem, 2.5vw, 2rem)`
- Body / UI / Nav: **DM Sans** — 400 regular, 500 medium.
  Body: `clamp(0.9375rem, 1.5vw, 1.0625rem)`, `line-height: 1.65`
  Labels / nav: `0.875rem`, `letter-spacing: 0.04em`, uppercase for nav items only
- Monospace (code snippets only): **JetBrains Mono** — 400, `0.875rem`
- All fluid scaling via CSS `clamp()`. Never fixed px for typographic sizes.

**Animation & Motion:**

- **Scroll Engine:** Lenis v1. Init once in a `'use client'` root layout component
  `<LenisProvider>`. Pass Lenis instance to GSAP ticker via
  `gsap.ticker.add((time) => lenis.raf(time * 1000))`. Destroy on unmount.
  Options: `{ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }`

- **Hero Carousel (Team Members):**
  - Horizontal layout. 10+ slides. Navigation: left/right arrow buttons +
    dot/line indicators (max 10 visible dots; overflow collapses to "3 of 12" counter).
  - Each slide: oversized Anton watermark name at z-index 0, member PNG cutout at
    z-index 1 with `drop-shadow(0 32px 64px rgba(0,0,0,0.6))`.
  - Parallax: on slide transition, cutout translates at 0.8x the speed of the
    watermark name (CSS `transform` driven by JS scroll delta, not GSAP).
  - Slide transition: 700ms `cubic-bezier(0.76, 0, 0.24, 1)` (strong ease-in-out).
  - Touch/drag enabled via pointer events (no third-party carousel library).

- **Project Cards — Nuraform-style Perspective Trapezoid:**
  - Card shape: CSS `perspective: 1200px` on parent + `rotateX(12deg)` on card by
    default → creates the top-narrower-than-bottom keystone shape seen in the reference.
  - On scroll into viewport (GSAP ScrollTrigger): card enters at
    `rotateX(22deg) translateY(80px) opacity(0)`, morphs to
    `rotateX(0deg) translateY(0) opacity(1)` as it reaches the scroll midpoint.
  - Timeline: duration `0.9s`, ease `power3.out`. Stagger between cards: `0.15s`.
  - The heading (Playfair Display, h2 size) overflows the top card edge intentionally —
    use `overflow: visible` on the card and `position: absolute; top: -0.6em` on the title.
  - Card face is the full gradient background. Text on card: `#1a0a2e`.
  - Bottom-right action button: `32px` circle, `rounded-full`, cream bg, dark icon,
    `transform: translateX(50%) translateY(50%)` to sit on the corner.

- **Scroll Text Reveals:**
  - Large editorial words (e.g., "WORKS", section titles): split by character using
    GSAP SplitText (or manual span wrapping if avoiding Club plugins). Each char
    animates from `translateY(110%) opacity(0)` to `translateY(0) opacity(1)`,
    stagger `0.03s`, triggered when parent enters viewport at `start: "top 75%"`.

- **Custom Cursor:**
  - Two `<div>` elements: `.cursor-h` (width: 100vw, height: 1px) and `.cursor-v`
    (width: 1px, height: 100vh). Both `position: fixed`, `pointer-events: none`,
    `z-index: 9999`, `background: var(--primitive-cream)`, `opacity: 0.35`,
    `will-change: transform`.
  - Track mouse via `mousemove`. Use `gsap.quickSetter` for performance (not `style.transform`).
  - Horizontal line: `transform: translateY(${y}px)`
  - Vertical line: `transform: translateX(${x}px)`
  - Crosshair center gap: add `8px` dead zone using `clip-path` or two halves per line.
  - Hidden below `lg` breakpoint (`1024px`) via `display: none`.
  - Implemented in `<CrosshairCursor />` — single `'use client'` component, mounted
    in root layout, outside `<main>`.
  - On clickable elements: cursor lines thicken to `2px` and opacity goes to `0.7`
    via CSS class swap on `mouseenter`.

- **Hover States:**
  - Cards: `translateY(-6px)` at `200ms ease`. Gradient border overlay intensifies
    from `opacity: 0` to `opacity: 1` (a `2px` gradient border via `::after` pseudo).
  - Nav links: underline slides in from left (`width: 0 → 100%`) at `300ms ease`.
  - Buttons: `scale(0.97)` on `mousedown`, release on `mouseup`.

- **Reduced Motion:**
  - Gate ALL GSAP animations: `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`
  - If reduced motion: disable Lenis (use native scroll), skip ScrollTrigger skew,
    replace with `opacity` fade-in at `400ms`. Cursor lines hidden.
  - This check must live in every `useEffect` that initialises GSAP.

**Spacing Scale:**
- Micro (component internals): 4px base unit → 4, 8, 12, 16, 24, 32px
- Macro (between sections): `clamp(6rem, 15vh, 12rem)` vertical padding per section
- Content max-width: `1440px`, centered
- Horizontal padding: `clamp(1.25rem, 5vw, 5rem)`

**Border Radius:**
- Project cards: `rounded-none` (0px — sharp brutalist edges)
- Action buttons / pills / dots: `rounded-full`
- All other elements: `rounded-none` by default

**Shadows:**
- Member PNG cutouts: `filter: drop-shadow(0 32px 64px rgba(0,0,0,0.6))` only
- No `box-shadow` anywhere else — not on cards, nav, buttons

**Visual Effects:**
- Noise overlay: SVG `feTurbulence` filter. In `globals.css`, add `body::after`
  with `content: ''`, `position: fixed`, `inset: 0`, `pointer-events: none`,
  `z-index: 1000`, `opacity: 0.055`, `mix-blend-mode: overlay`,
  `background-image: url("data:image/svg+xml,...")` (inline SVG noise filter).
  Provide the full inline SVG data URI in the design-system.md file.
- No glassmorphism, no blur filters on any element except the noise overlay itself.

### Development Rules

- **Module System:** ES6 modules only. No CommonJS `require()`. Default to React
  Server Components. Add `'use client'` ONLY when the file uses: GSAP, Lenis,
  cursor listeners, `useEffect`/`useRef`/`useState` with DOM APIs, or `window`/`document`.
- **Component Naming:** PascalCase for components (`HeroCarousel.tsx`,
  `SkewedProjectCard.tsx`, `CrosshairCursor.tsx`, `LenisProvider.tsx`).
  kebab-case for hooks/utilities (`use-lenis.ts`, `gsap-utils.ts`).
- **Folder structure for animation components:** All GSAP wrappers live in
  `/components/animation/`. Cursor in `/components/cursor/`. Lenis in `/components/providers/`.
- **CSS Approach:** Tailwind CSS v3 for layout, spacing, typography. Global CSS
  (`globals.css`) strictly for: (1) CSS custom property tokens, (2) noise overlay
  `body::after`, (3) crosshair cursor line base styles, (4) `@font-face` or Google
  Fonts `@import`. No Tailwind `@apply` for animation styles.
- **Git Commits:** Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`,
  `animation:` (for any GSAP/Lenis change), `style:`.
- **Responsive Strategy:** Mobile-first. Gate crosshair cursor and GSAP scroll-skew
  behind `lg` (1024px). Below `lg`: hide cursor, disable ScrollTrigger skew, use
  CSS `@keyframes` fade-in instead. Carousel switches from draggable desktop mode
  to touch-swipe mobile mode at `md` (768px).
- **Accessibility:** All PNG cutouts need descriptive `alt` text. All GSAP motion
  gated behind `prefers-reduced-motion` check. Keyboard nav must work with
  animations off. Focus rings use `--color-focus` (#7c6af5).
- **Linting/Formatting:** ESLint + Prettier. Strict Hook dependency arrays.
  Every `useEffect` that creates a GSAP timeline, ScrollTrigger, or Lenis instance
  MUST return a cleanup function that calls `.kill()` / `.destroy()` respectively.
  Failing this causes memory leaks on Next.js client-side navigation.
- **Performance:** Lazy-load all PNG cutout images with `loading="lazy"` and provide
  explicit `width`/`height`. Use `next/image` for all member photos. GSAP and Lenis
  must be dynamically imported (`next/dynamic` or `import()`) to avoid SSR errors.

---

## Task

Generate the exact, copy-pasteable content for all files listed below. Output
each file sequentially using a Markdown code block with the filename on the
line immediately above it.

---

## Files to Generate

### 1. `CLAUDE.md`
The master blueprint for Claude Code. Include:
- One-paragraph project summary covering the animation-heavy scroll-driven architecture
- Full tech stack with version constraints (Next.js 14, Lenis v1, GSAP v3, Tailwind v3)
- Terminal commands: dev, build, lint, format, type-check
- Rule: "Read ALL files in `.claude/rules/` before writing any component, animation, or style"
- Project directory map covering: `/app`, `/components/animation`, `/components/cursor`,
  `/components/providers`, `/components/ui`, `/content/team`, `/content/projects`, `/public/team`
- Critical warnings block: when to add `'use client'`, GSAP cleanup requirement,
  Lenis init pattern, noise overlay location, `next/dynamic` for GSAP/Lenis
- Format: strict numbered rules + short bullets only. No prose.

### 2. `.claude/rules/code-style.md`
Code formatting and architecture rules. Include:
- Component structure: file naming, folder placement, named exports only (no default
  exports except `page.tsx` and `layout.tsx`)
- Import order: React → Next.js → GSAP/Lenis → other third-party → internal
  components → hooks → types → styles
- `'use client'` trigger list (exhaustive)
- TypeScript: strict mode, no `any`, type GSAP refs as `gsap.core.Timeline | null`,
  type Lenis ref as `Lenis | null`
- Forbidden: inline `style={}` except on GSAP `.set()` targets, `document.querySelector`
  outside `useEffect`, CSS Modules, `@apply` for animation styles
- GSAP rule: store all ScrollTrigger instances in a `useRef<ScrollTrigger[]>([])`,
  kill all in cleanup with `triggers.current.forEach(t => t.kill())`
- Lenis rule: single instance per page, passed via context, never instantiated in
  leaf components
- Format: strict numbered rules only

### 3. `.claude/rules/design-system.md`
Single source of truth for all visual decisions. Include:
- Full CSS custom property token table (all primitive + semantic tokens with hex values)
- Complete `tailwind.config.ts` `extend` block with custom color names mapped to
  CSS variables (e.g., `'bg-deep': 'var(--color-bg)'`)
- Typography scale table: element, font family, clamp() value, weight, line-height,
  letter-spacing
- Animation spec table: component, trigger, from-state (GSAP fromVars), to-state
  (GSAP toVars), duration, ease, stagger, ScrollTrigger `start` value
- Component rules:
  - Project card: gradient spec, `perspective` value, `rotateX` entry/exit values,
    title overflow behavior, corner button positioning
  - Hero slide: watermark z-index stack, cutout z-index, parallax speed ratio (0.8x),
    transition curve
  - Cursor lines: dimensions, opacity, `will-change`, gap/dead-zone technique
  - Noise overlay: complete inline SVG data URI for `body::after`
- Format: tables for tokens/scales/animation specs; strict rules for behavior

### 4. `content/team/template.md`
YAML frontmatter + Markdown body template for one team member. Frontmatter fields:
- `name` (display name)
- `display_name_bg` (all-caps Anton watermark version, can be nickname or last name)
- `role` (their team role, e.g., "Data Analyst")
- `avatar` (path: `/team/[slug]-cutout.png` — background-removed PNG)
- `avatar_alt` (descriptive alt text for the PNG cutout)
- `linkedin` (URL or empty string)
- `github` (URL or empty string, optional)
- `skills` (array of strings)
- `tools` (array: software — Excel, Python, Figma, etc.)
- `languages` (array: spoken languages)
- `education` (object: `degree`, `major`, `university`, `year`)
- `bio_short` (2–3 sentences — rendered in hero carousel overlay)
- `projects` (array of objects, each with: `title`, `role`, `year`, `description`,
  `tags` array, `link`, `card_gradient_angle` — overrides default 135deg if needed)
- `order` (integer — controls carousel position, 1-indexed)
Body section: Extended bio in Markdown with placeholder copy (3–4 paragraphs,
showing expected word count and tone — professional but personal, undergraduate-level).

### 5. `README.md`
Human-readable project documentation. Include:
- Project name + one-line description
- Live URL or "coming soon"
- Tech stack badges (shields.io format): Next.js, TypeScript, Tailwind CSS,
  GSAP, Lenis, Vercel
- Prerequisites: Node ≥18, pnpm, note that GSAP is standard free tier
  (no Club GreenSock required — SplitText workaround documented in code-style.md)
- Setup: clone → install → `.env.local` variables (list any needed) → dev server
- Top-level folder structure (call out `/components/animation` and `/components/cursor`)
- Contribution guide: branch naming (`feat/`, `fix/`, `animation/`), commit types
  including `animation:`, PR checklist (lint, type-check, reduced-motion test)
- Performance note: warn that new GSAP instances require cleanup in `useEffect`
  return; link to `.claude/rules/code-style.md`
- Team credits: 10+ member slots with name + role (fill TBD for now)
- License

---

## Constraints

1. `CLAUDE.md` and all `.claude/rules/` files: imperatives only. "Use", "Never",
   "Always", "Wrap", "Kill", "Import". No "you should", no explanations.
2. All color values must be the exact hex and rgba codes from the Design System.
   No approximations. No substituting with Tailwind named colors.
3. All `clamp()` values must be written out in full — no prose descriptions.
4. The animation spec table in `design-system.md` must include the Nuraform-style
   card: `perspective(1200px) rotateX(22deg) translateY(80px) opacity(0)` →
   `rotateX(0deg) translateY(0) opacity(1)`.
5. `content/team/template.md` frontmatter must be valid YAML. Include `order` field.
6. README must list `animation:` as a valid commit type and include the
   `prefers-reduced-motion` test in the PR checklist.
7. After all five files, output an **Assumptions Log** — bullet list of every
   placeholder value interpreted, inferred, or defaulted.
```
