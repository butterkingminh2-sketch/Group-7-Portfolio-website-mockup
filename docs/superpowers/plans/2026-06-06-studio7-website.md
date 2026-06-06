# Studio 7 — Full Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Studio 7 group portfolio website from a bare git repo — Next.js 14 App Router, GSAP scroll animations, Lenis smooth scroll, Nuraform project cards, multi-member hero carousel, and custom crosshair cursor.

**Architecture:** React Server Components are the default; `'use client'` is added only to animation and interaction components. The data layer reads team YAML-frontmatter Markdown files at build time (no database, no CMS). GSAP and Lenis are dynamically imported inside `useEffect` to prevent SSR errors. All animations are gated behind `prefers-reduced-motion`.

**Tech Stack:** Next.js 14, TypeScript 5 strict, Tailwind CSS v3, GSAP v3 (free tier), Lenis v1, gray-matter (frontmatter parsing), Vitest + @testing-library/react, pnpm 8, Vercel.

---

## File Map

Every file this plan creates or modifies, with its single responsibility:

```
package.json                           project manifest, scripts, dependencies
tsconfig.json                          TypeScript strict config with @ alias
next.config.ts                         Next.js config (image domains, headers)
postcss.config.js                      PostCSS — required by Tailwind
tailwind.config.ts                     extend block: colors, fonts, maxWidth
.eslintrc.json                         ESLint: next/core-web-vitals
.prettierrc                            Prettier: single quotes, trailing commas
vitest.config.ts                       Vitest: jsdom env, globals, @ alias
vitest.setup.ts                        @testing-library/jest-dom matchers
.env.local.example                     env var template

app/
  layout.tsx                           root layout: fonts, metadata, providers, cursor
  page.tsx                             home page: server data fetch + section composition
  globals.css                          tokens, noise overlay, font @import, cursor base

types/
  team.ts                              TeamMember, Project, Education interfaces

lib/
  team.ts                              parseTeamMember(), getAllTeamMembers()

hooks/
  use-carousel-state.ts               getNextIndex(), getIndicatorState(), useCarouselState()

components/
  providers/
    LenisProvider.tsx                  single Lenis instance, GSAP ticker, context + useLenis()
  cursor/
    CrosshairCursor.tsx                crosshair lines, gsap.quickSetter tracking
  animation/
    TextCharReveal.tsx                 manual span-split text, GSAP char reveal on scroll
    CardReveal.tsx                     GSAP ScrollTrigger rotateX reveal wrapper
  ui/
    NavBar.tsx                         fixed nav with animated underlines
    HeroSlide.tsx                      watermark + cutout + bio overlay (one slide)
    CarouselIndicator.tsx              dots (≤10) or "X of Y" counter
    HeroCarousel.tsx                   slide state, keyboard + pointer + touch
    SkewedProjectCard.tsx              gradient card, overflowing title, corner button
    ProjectsGrid.tsx                   perspective wrapper + responsive card grid

__tests__/
  lib/team.test.ts                     parseTeamMember() unit tests
  hooks/use-carousel-state.test.ts     getNextIndex() and getIndicatorState() tests

__fixtures__/
  team/
    alex-nguyen.md                     complete fixture member used in tests
```

---

## Phase 1 — Project Bootstrap

### Task 1: Create project config files

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `.env.local.example`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "studio-7",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.3.2",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "vitest": "^1.6.0",
    "@vitejs/plugin-react": "^4.3.1",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/user-event": "^14.5.2",
    "jsdom": "^24.1.1"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Write `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Write `.env.local.example`**

```
# Copy to .env.local and fill in values
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 6: Install dependencies**

```bash
pnpm install
```

Expected: lockfile created, `node_modules` populated, zero errors.

- [ ] **Step 7: Verify Next.js is installed**

```bash
pnpm exec next --version
```

Expected output: `14.x.x`

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.js .env.local.example
git commit -m "chore: bootstrap Next.js 14 project with TypeScript and pnpm"
```

---

### Task 2: Tailwind config with design tokens

**Files:**
- Create: `tailwind.config.ts`

- [ ] **Step 1: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
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
        display: ['Anton', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Verify Tailwind can parse the config**

```bash
pnpm exec tailwindcss --help
```

Expected: Tailwind CLI help output, no config errors.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "chore: configure Tailwind v3 with design token extend block"
```

---

### Task 3: ESLint, Prettier, and Vitest setup

**Files:**
- Create: `.eslintrc.json`
- Create: `.prettierrc`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Write `.eslintrc.json`**

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-console": "warn",
    "import/no-default-export": "off"
  }
}
```

- [ ] **Step 2: Write `.prettierrc`**

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 4: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Run lint to confirm config is valid**

```bash
pnpm lint --no-ignore 2>&1 | head -20
```

Expected: No parse errors in eslint config.

- [ ] **Step 6: Commit**

```bash
git add .eslintrc.json .prettierrc vitest.config.ts vitest.setup.ts
git commit -m "chore: add ESLint, Prettier, and Vitest configuration"
```

---

## Phase 2 — Design Foundation

### Task 4: globals.css — tokens, fonts, noise overlay, cursor base

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Write `app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,600;1,700&family=DM+Sans:wght@400;500&family=JetBrains+Mono&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── Design Tokens ───────────────────────────────── */
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
  --color-bg:             var(--primitive-bg-deep);
  --color-surface:        var(--primitive-bg-surface);
  --color-surface-raised: var(--primitive-bg-overlay);
  --color-text:           var(--primitive-cream);
  --color-text-muted:     var(--primitive-cream-muted);
  --color-text-ghost:     var(--primitive-watermark);
  --color-accent-start:   var(--primitive-accent-start);
  --color-accent-end:     var(--primitive-accent-end);
  --color-border:         var(--primitive-border);
  --color-border-hover:   var(--primitive-border-hover);
  --color-focus:          var(--primitive-focus);
}

/* ─── Base ───────────────────────────────────────── */
html {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'DM Sans', system-ui, sans-serif;
}

body {
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* ─── Noise Overlay ──────────────────────────────── */
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

/* ─── Crosshair Cursor Base ──────────────────────── */
.cursor-h,
.cursor-v {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  background: var(--primitive-cream);
  opacity: 0.35;
  will-change: transform;
  transition: opacity 150ms ease, height 150ms ease, width 150ms ease;
}

.cursor-h {
  top: 0;
  left: 0;
  width: 100vw;
  height: 1px;
}

.cursor-v {
  top: 0;
  left: 0;
  width: 1px;
  height: 100vh;
}

.cursor-h.cursor-thick {
  height: 2px;
  opacity: 0.7;
}

.cursor-v.cursor-thick {
  width: 2px;
  opacity: 0.7;
}

/* ─── Reduced Motion Fallback ────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .cursor-h,
  .cursor-v {
    display: none;
  }

  .motion-fade {
    animation: fade-in 400ms ease forwards;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ─── Section Spacing ────────────────────────────── */
.section-padding {
  padding-block: clamp(6rem, 15vh, 12rem);
  padding-inline: clamp(1.25rem, 5vw, 5rem);
}

/* ─── Card Grid Perspective ──────────────────────── */
.card-grid {
  perspective: 1200px;
}

.project-card {
  transform: rotateX(12deg);
  transform-style: preserve-3d;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add globals.css with design tokens, noise overlay, cursor base"
```

---

## Phase 3 — Types & Data Layer

### Task 5: TypeScript types

**Files:**
- Create: `types/team.ts`

- [ ] **Step 1: Write `types/team.ts`**

```ts
export interface Education {
  degree: string;
  major: string;
  university: string;
  year: number;
}

export interface Project {
  title: string;
  role: string;
  year: number;
  description: string;
  tags: string[];
  link: string;
  card_gradient_angle: number;
}

export interface TeamMember {
  slug: string;
  name: string;
  display_name_bg: string;
  role: string;
  avatar: string;
  avatar_alt: string;
  linkedin: string;
  github: string;
  skills: string[];
  tools: string[];
  languages: string[];
  education: Education;
  bio_short: string;
  projects: Project[];
  order: number;
  body: string;
}
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: zero errors (only `app/` stubs missing — acceptable at this stage, will be created in Task 10).

- [ ] **Step 3: Commit**

```bash
git add types/team.ts
git commit -m "feat: add TeamMember, Project, and Education TypeScript types"
```

---

### Task 6: Team content parser with tests

**Files:**
- Create: `lib/team.ts`
- Create: `__fixtures__/team/alex-nguyen.md`
- Create: `__tests__/lib/team.test.ts`

- [ ] **Step 1: Write fixture member file `__fixtures__/team/alex-nguyen.md`**

```markdown
---
name: "Alex Nguyen"
display_name_bg: "NGUYEN"
role: "Data Analyst"
avatar: "/team/alex-nguyen-cutout.png"
avatar_alt: "Alex Nguyen standing in a white shirt, smiling with arms crossed."
linkedin: "https://www.linkedin.com/in/alexnguyen/"
github: "https://github.com/alexnguyen"
skills:
  - "Data Analysis"
  - "Financial Modelling"
  - "Business Strategy"
tools:
  - "Microsoft Excel"
  - "Python"
  - "Power BI"
languages:
  - "Vietnamese"
  - "English"
education:
  degree: "Bachelor of Business Administration"
  major: "Business Administration"
  university: "Ho Chi Minh City University"
  year: 2026
bio_short: >
  A data-driven strategist with a passion for turning numbers into insight.
  Building expertise in financial modelling at Ho Chi Minh City University.
projects:
  - title: "Supply Chain Optimisation"
    role: "Lead Analyst"
    year: 2025
    description: "Reduced logistics costs by 18% using an Excel route optimisation model."
    tags:
      - "Excel"
      - "Operations Research"
    link: ""
    card_gradient_angle: 135
order: 1
---

Alex is a third-year Business Administration student focused on data-driven decision making.

He has led quantitative analyses for three major academic projects, including a supply chain study that identified 18% cost savings through route optimisation.
```

- [ ] **Step 2: Write the failing tests `__tests__/lib/team.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseTeamMember, getAllTeamMembers } from '@/lib/team';

const fixtureContent = fs.readFileSync(
  path.join(process.cwd(), '__fixtures__/team/alex-nguyen.md'),
  'utf-8'
);

describe('parseTeamMember', () => {
  it('extracts name and role from frontmatter', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.name).toBe('Alex Nguyen');
    expect(member.role).toBe('Data Analyst');
  });

  it('attaches the slug', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.slug).toBe('alex-nguyen');
  });

  it('parses skills array', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.skills).toEqual(['Data Analysis', 'Financial Modelling', 'Business Strategy']);
  });

  it('parses education object', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.education.university).toBe('Ho Chi Minh City University');
    expect(member.education.year).toBe(2026);
  });

  it('parses projects array with card_gradient_angle', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.projects).toHaveLength(1);
    expect(member.projects[0].title).toBe('Supply Chain Optimisation');
    expect(member.projects[0].card_gradient_angle).toBe(135);
  });

  it('extracts markdown body text', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.body).toContain('third-year Business Administration student');
  });

  it('returns order as integer', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.order).toBe(1);
  });

  it('defaults github to empty string when missing', () => {
    const noGithub = fixtureContent.replace('github: "https://github.com/alexnguyen"', 'github: ""');
    const member = parseTeamMember('alex-nguyen', noGithub);
    expect(member.github).toBe('');
  });
});

describe('getAllTeamMembers', () => {
  it('returns members sorted by order field', async () => {
    const members = await getAllTeamMembers();
    for (let i = 1; i < members.length; i++) {
      expect(members[i].order).toBeGreaterThanOrEqual(members[i - 1].order);
    }
  });

  it('excludes template.md', async () => {
    const members = await getAllTeamMembers();
    const slugs = members.map((m) => m.slug);
    expect(slugs).not.toContain('template');
  });
});
```

- [ ] **Step 3: Run tests — confirm they fail**

```bash
pnpm test __tests__/lib/team.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/team'`

- [ ] **Step 4: Write `lib/team.ts`**

```ts
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

import type { TeamMember } from '@/types/team';

const TEAM_DIR = path.join(process.cwd(), 'content', 'team');

export function parseTeamMember(slug: string, fileContent: string): TeamMember {
  const { data, content } = matter(fileContent);
  return {
    slug,
    name: data.name as string,
    display_name_bg: data.display_name_bg as string,
    role: data.role as string,
    avatar: data.avatar as string,
    avatar_alt: data.avatar_alt as string,
    linkedin: (data.linkedin as string) || '',
    github: (data.github as string) || '',
    skills: (data.skills as string[]) || [],
    tools: (data.tools as string[]) || [],
    languages: (data.languages as string[]) || [],
    education: data.education as TeamMember['education'],
    bio_short: data.bio_short as string,
    projects: (data.projects as TeamMember['projects']) || [],
    order: data.order as number,
    body: content.trim(),
  };
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const files = fs
    .readdirSync(TEAM_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'template.md');

  const members = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(TEAM_DIR, file), 'utf-8');
    return parseTeamMember(slug, raw);
  });

  return members.sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
pnpm test __tests__/lib/team.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/team.ts __fixtures__/team/alex-nguyen.md __tests__/lib/team.test.ts
git commit -m "feat: add team content parser with tests"
```

---

### Task 7: Carousel state hook with tests

**Files:**
- Create: `hooks/use-carousel-state.ts`
- Create: `__tests__/hooks/use-carousel-state.test.ts`

- [ ] **Step 1: Write the failing tests `__tests__/hooks/use-carousel-state.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { getNextIndex, getIndicatorState } from '@/hooks/use-carousel-state';

describe('getNextIndex', () => {
  it('advances to next slide', () => {
    expect(getNextIndex(0, 5, 'next')).toBe(1);
    expect(getNextIndex(3, 5, 'next')).toBe(4);
  });

  it('wraps from last to first on next', () => {
    expect(getNextIndex(4, 5, 'next')).toBe(0);
  });

  it('goes to prev slide', () => {
    expect(getNextIndex(3, 5, 'prev')).toBe(2);
    expect(getNextIndex(1, 5, 'prev')).toBe(0);
  });

  it('wraps from first to last on prev', () => {
    expect(getNextIndex(0, 5, 'prev')).toBe(4);
  });

  it('returns 0 when total is 0', () => {
    expect(getNextIndex(0, 0, 'next')).toBe(0);
  });
});

describe('getIndicatorState', () => {
  it('uses dots when total <= maxDots', () => {
    const state = getIndicatorState(2, 5, 10);
    expect(state.type).toBe('dots');
    expect(state.visibleDots).toBe(5);
    expect(state.activeDotIndex).toBe(2);
    expect(state.counter).toBeNull();
  });

  it('uses counter when total > maxDots', () => {
    const state = getIndicatorState(2, 12, 10);
    expect(state.type).toBe('counter');
    expect(state.counter).toEqual({ current: 3, total: 12 });
    expect(state.visibleDots).toBe(0);
  });

  it('counter current is 1-indexed', () => {
    const state = getIndicatorState(0, 12, 10);
    expect(state.counter?.current).toBe(1);
  });

  it('defaults maxDots to 10 when omitted', () => {
    const underTen = getIndicatorState(0, 9);
    expect(underTen.type).toBe('dots');
    const overTen = getIndicatorState(0, 11);
    expect(overTen.type).toBe('counter');
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
pnpm test __tests__/hooks/use-carousel-state.test.ts
```

Expected: FAIL — `Cannot find module '@/hooks/use-carousel-state'`

- [ ] **Step 3: Write `hooks/use-carousel-state.ts`**

```ts
import { useState, useCallback } from 'react';

export function getNextIndex(
  current: number,
  total: number,
  direction: 'prev' | 'next'
): number {
  if (total === 0) return 0;
  if (direction === 'next') return (current + 1) % total;
  return (current - 1 + total) % total;
}

export interface IndicatorState {
  type: 'dots' | 'counter';
  activeDotIndex: number;
  visibleDots: number;
  counter: { current: number; total: number } | null;
}

export function getIndicatorState(
  current: number,
  total: number,
  maxDots = 10
): IndicatorState {
  if (total <= maxDots) {
    return { type: 'dots', activeDotIndex: current, visibleDots: total, counter: null };
  }
  return {
    type: 'counter',
    activeDotIndex: -1,
    visibleDots: 0,
    counter: { current: current + 1, total },
  };
}

export interface CarouselState {
  currentIndex: number;
  direction: 'prev' | 'next';
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

export function useCarouselState(total: number): CarouselState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'prev' | 'next'>('next');

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1));
      setDirection(clamped >= currentIndex ? 'next' : 'prev');
      setCurrentIndex(clamped);
    },
    [currentIndex, total]
  );

  const goNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((i) => getNextIndex(i, total, 'next'));
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((i) => getNextIndex(i, total, 'prev'));
  }, [total]);

  return { currentIndex, direction, goTo, goNext, goPrev };
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
pnpm test __tests__/hooks/use-carousel-state.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Run all tests**

```bash
pnpm test
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add hooks/use-carousel-state.ts __tests__/hooks/use-carousel-state.test.ts
git commit -m "feat: add carousel state hook with getNextIndex and getIndicatorState"
```

---

## Phase 4 — Infrastructure

### Task 8: LenisProvider with useLenis hook

**Files:**
- Create: `components/providers/LenisProvider.tsx`

- [ ] **Step 1: Write `components/providers/LenisProvider.tsx`**

```tsx
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
      const [lenisModule, gsapModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
      ]);
      if (!active) return;

      const LenisClass = lenisModule.default;
      const gsap = gsapModule.default;

      const instance = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const ticker = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

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
```

- [ ] **Step 2: Commit**

```bash
git add components/providers/LenisProvider.tsx
git commit -m "feat: add LenisProvider with GSAP ticker integration and useLenis hook"
```

---

### Task 9: Root layout and placeholder home page

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx` (stub — full version in Task 19)

- [ ] **Step 1: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { CrosshairCursor } from '@/components/cursor/CrosshairCursor';
import { LenisProvider } from '@/components/providers/LenisProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Studio 7 — Group Portfolio',
  description:
    'An immersive group portfolio showcasing business administration projects and data analysis research.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-deep text-text-primary font-body antialiased">
        <LenisProvider>
          <CrosshairCursor />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write stub `app/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <div className="section-padding">
      <h1 className="font-heading text-text-primary" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, fontStyle: 'italic' }}>
        Studio 7
      </h1>
      <p className="text-text-muted mt-4">Coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 3: Run dev server and verify it starts**

```bash
pnpm dev
```

Expected: Server starts on port 3000, no compilation errors. Open `http://localhost:3000` — page shows "Studio 7 / Coming soon."

- [ ] **Step 4: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 5: Stop dev server and commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: add root layout with LenisProvider and CrosshairCursor slots"
```

---

## Phase 5 — Cursor

### Task 10: CrosshairCursor component

**Files:**
- Create: `components/cursor/CrosshairCursor.tsx`

- [ ] **Step 1: Write `components/cursor/CrosshairCursor.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function CrosshairCursor() {
  const hRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!hRef.current || !vRef.current) return;

    let setY: ReturnType<typeof import('gsap').default.quickSetter> | null = null;
    let setX: ReturnType<typeof import('gsap').default.quickSetter> | null = null;
    let loaded = false;

    (async () => {
      const gsap = (await import('gsap')).default;
      if (!hRef.current || !vRef.current) return;
      setY = gsap.quickSetter(hRef.current, 'y', 'px');
      setX = gsap.quickSetter(vRef.current, 'x', 'px');
      loaded = true;
    })();

    const onMove = (e: MouseEvent) => {
      if (!loaded) return;
      setY?.(e.clientY);
      setX?.(e.clientX);
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
      <div ref={hRef} className="cursor-h" />
      <div ref={vRef} className="cursor-v" />
    </div>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 3: Start dev server, move mouse, verify crosshair lines follow cursor**

```bash
pnpm dev
```

Verify at `http://localhost:3000` on a screen ≥1024px: two cream lines track mouse position. On hover over links/buttons, lines become 2px thick.

- [ ] **Step 4: Commit**

```bash
git add components/cursor/CrosshairCursor.tsx
git commit -m "feat: add CrosshairCursor with gsap.quickSetter tracking"
```

---

## Phase 6 — Navigation

### Task 11: NavBar component

**Files:**
- Create: `components/ui/NavBar.tsx`

- [ ] **Step 1: Write `components/ui/NavBar.tsx`**

```tsx
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
```

- [ ] **Step 2: Add NavBar to `app/layout.tsx`** — modify the existing file

```tsx
import type { Metadata } from 'next';
import { CrosshairCursor } from '@/components/cursor/CrosshairCursor';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { NavBar } from '@/components/ui/NavBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Studio 7 — Group Portfolio',
  description:
    'An immersive group portfolio showcasing business administration projects and data analysis research.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-deep text-text-primary font-body antialiased">
        <LenisProvider>
          <CrosshairCursor />
          <NavBar />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/NavBar.tsx app/layout.tsx
git commit -m "feat: add NavBar with animated underline on hover"
```

---

## Phase 7 — Hero Carousel

### Task 12: HeroSlide and CarouselIndicator

**Files:**
- Create: `components/ui/HeroSlide.tsx`
- Create: `components/ui/CarouselIndicator.tsx`

- [ ] **Step 1: Write `components/ui/HeroSlide.tsx`**

```tsx
import Image from 'next/image';
import type { TeamMember } from '@/types/team';

export interface HeroSlideProps {
  member: TeamMember;
  isActive: boolean;
}

export function HeroSlide({ member, isActive }: HeroSlideProps) {
  return (
    <div
      className="absolute inset-0 flex items-end"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 700ms cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      aria-hidden={!isActive}
    >
      {/* Watermark — z-index 0 */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <span
          className="font-display text-text-ghost uppercase leading-none"
          style={{
            fontSize: 'clamp(5rem, 18vw, 16rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            color: 'var(--color-text-ghost)',
          }}
        >
          {member.display_name_bg}
        </span>
      </div>

      {/* PNG Cutout — z-index 1 */}
      <div
        className="absolute inset-0 flex items-end justify-center"
        style={{ zIndex: 1 }}
      >
        <div style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.6))' }}>
          <Image
            src={member.avatar}
            alt={member.avatar_alt}
            width={480}
            height={640}
            loading="lazy"
            className="object-contain max-h-[75vh] w-auto"
          />
        </div>
      </div>

      {/* Bio Overlay — z-index 2 */}
      <div
        className="relative w-full px-[clamp(1.25rem,5vw,5rem)] pb-16"
        style={{ zIndex: 2 }}
      >
        <p
          className="font-body text-text-muted mb-1 uppercase"
          style={{ fontSize: '0.875rem', letterSpacing: '0.04em' }}
        >
          {member.role}
        </p>
        <h2
          className="font-heading text-text-primary"
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {member.name}
        </h2>
        <p
          className="text-text-muted mt-2 max-w-sm"
          style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)', lineHeight: 1.65 }}
        >
          {member.bio_short}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/ui/CarouselIndicator.tsx`**

```tsx
export interface CarouselIndicatorProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function CarouselIndicator({ total, current, onDotClick }: CarouselIndicatorProps) {
  const MAX_DOTS = 10;

  if (total <= MAX_DOTS) {
    return (
      <div className="flex items-center gap-2" role="tablist" aria-label="Carousel navigation">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onDotClick(i)}
            className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? 'var(--color-text)' : 'var(--color-border-hover)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <p
      className="font-body text-text-muted tabular-nums"
      style={{ fontSize: '0.875rem', letterSpacing: '0.04em' }}
      aria-live="polite"
      aria-atomic="true"
    >
      {current + 1} <span className="text-text-ghost">of</span> {total}
    </p>
  );
}
```

- [ ] **Step 3: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/HeroSlide.tsx components/ui/CarouselIndicator.tsx
git commit -m "feat: add HeroSlide and CarouselIndicator components"
```

---

### Task 13: HeroCarousel — state, keyboard, pointer, touch

**Files:**
- Create: `components/ui/HeroCarousel.tsx`

- [ ] **Step 1: Write `components/ui/HeroCarousel.tsx`**

```tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { HeroSlide } from '@/components/ui/HeroSlide';
import { CarouselIndicator } from '@/components/ui/CarouselIndicator';
import { useCarouselState } from '@/hooks/use-carousel-state';
import type { TeamMember } from '@/types/team';

export interface HeroCarouselProps {
  members: TeamMember[];
}

export function HeroCarousel({ members }: HeroCarouselProps) {
  const { currentIndex, goNext, goPrev, goTo } = useCarouselState(members.length);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const DRAG_THRESHOLD = 50;

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Pointer drag (desktop) + touch swipe (mobile)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStart.current === null) return;
      const delta = e.clientX - dragStart.current;
      if (Math.abs(delta) > DRAG_THRESHOLD) {
        delta < 0 ? goNext() : goPrev();
      }
      dragStart.current = null;
    },
    [goNext, goPrev]
  );

  if (members.length === 0) return null;

  return (
    <section
      id="team"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh' }}
      aria-label="Team members carousel"
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div
        ref={trackRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-live="polite"
      >
        {members.map((member, i) => (
          <HeroSlide key={member.slug} member={member} isActive={i === currentIndex} />
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-[clamp(1.25rem,5vw,5rem)] right-[clamp(1.25rem,5vw,5rem)] flex items-center justify-between z-10">
        <CarouselIndicator
          total={members.length}
          current={currentIndex}
          onDotClick={goTo}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            aria-label="Previous team member"
            className="rounded-full border border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ←
          </button>
          <button
            onClick={goNext}
            aria-label="Next team member"
            className="rounded-full border border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add parallax delta tracking to `HeroCarousel.tsx`**

Inside the `HeroCarousel` component, add a `useEffect` that watches `currentIndex` and applies the 0.8× parallax offset to each slide's cutout image. Add this after the keyboard effect:

```tsx
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // On each index change, animate watermark at 1× and cutout at 0.8×
    // The CSS transition on the slide handles the 700ms opacity.
    // Parallax is a translateX offset applied to the cutout's parent div.
    const slides = trackRef.current?.querySelectorAll<HTMLElement>('[data-slide]');
    slides?.forEach((slide, i) => {
      const cutoutWrap = slide.querySelector<HTMLElement>('[data-cutout]');
      const watermark = slide.querySelector<HTMLElement>('[data-watermark]');
      if (!cutoutWrap || !watermark) return;
      const delta = (i - currentIndex) * 60; // px offset per position
      cutoutWrap.style.transform = `translateX(${delta * 0.8}px)`;
      watermark.style.transform = `translateX(${delta}px)`;
    });
    prevIndex.current = currentIndex;
  }, [currentIndex]);
```

Also add `data-slide`, `data-cutout`, and `data-watermark` attributes to the corresponding elements in `HeroSlide.tsx`:
- Outer wrapper div: add `data-slide="true"`
- Cutout wrapper div: add `data-cutout="true"`
- Watermark span wrapper: add `data-watermark="true"`

- [ ] **Step 3: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/HeroCarousel.tsx components/ui/HeroSlide.tsx
git commit -m "animation: add hero carousel with slide transitions and 0.8x cutout parallax"
```

---

## Phase 8 — Animation Components

### Task 14: TextCharReveal — scroll-triggered character animation

**Files:**
- Create: `components/animation/TextCharReveal.tsx`

- [ ] **Step 1: Write `components/animation/TextCharReveal.tsx`**

```tsx
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

    let ctx: import('gsap').default['context'] extends (...args: unknown[]) => infer R ? R : never;

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

  const setRef = (el: HTMLElement | null) => { containerRef.current = el; };

  return (
    // @ts-expect-error — dynamic tag with callback ref
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
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors. The `@ts-expect-error` suppresses only the callback-ref assignment on the dynamic Tag element; all other types are strict.

- [ ] **Step 3: Commit**

```bash
git add components/animation/TextCharReveal.tsx
git commit -m "animation: add TextCharReveal with GSAP ScrollTrigger character reveal"
```

---

### Task 15: CardReveal — Nuraform ScrollTrigger wrapper

**Files:**
- Create: `components/animation/CardReveal.tsx`

- [ ] **Step 1: Write `components/animation/CardReveal.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export interface CardRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function CardReveal({ children, className, delay = 0 }: CardRevealProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<import('gsap/ScrollTrigger').ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cardRef.current?.classList.add('motion-fade');
      return;
    }
    if (!cardRef.current) return;

    let ctx: ReturnType<typeof import('gsap').default.context>;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!cardRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay });
        tl.fromTo(
          cardRef.current,
          { rotateX: 22, y: 80, opacity: 0, transformPerspective: 1200 },
          { rotateX: 0, y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
        );

        const st = ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 80%',
          animation: tl,
          once: true,
        });

        triggers.current.push(st);
      }, cardRef);
    })();

    return () => {
      ctx?.revert();
      triggers.current.forEach((t) => t.kill());
      triggers.current = [];
    };
  }, [delay]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/animation/CardReveal.tsx
git commit -m "animation: add CardReveal with Nuraform rotateX ScrollTrigger reveal"
```

---

## Phase 9 — Project Cards

### Task 16: SkewedProjectCard

**Files:**
- Create: `components/ui/SkewedProjectCard.tsx`

- [ ] **Step 1: Write `components/ui/SkewedProjectCard.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/types/team';

export interface SkewedProjectCardProps {
  project: Project;
  memberName: string;
}

export function SkewedProjectCard({ project, memberName }: SkewedProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cardRef.current) return;

    let gsap: typeof import('gsap').default | null = null;

    (async () => {
      gsap = (await import('gsap')).default;
    })();

    const card = cardRef.current;

    const onEnter = () => {
      if (!gsap) return;
      gsap.to(card, { y: -6, duration: 0.2, ease: 'power1.out' });
      const after = card.querySelector<HTMLElement>('.card-border-overlay');
      if (after) gsap.to(after, { opacity: 1, duration: 0.2 });
    };

    const onLeave = () => {
      if (!gsap) return;
      gsap.to(card, { y: 0, duration: 0.2, ease: 'power1.out' });
      const after = card.querySelector<HTMLElement>('.card-border-overlay');
      if (after) gsap.to(after, { opacity: 0, duration: 0.2 });
    };

    const onDown = () => gsap?.to(card, { scale: 0.97, duration: 0.1, ease: 'power1.in' });
    const onUp = () => gsap?.to(card, { scale: 1, duration: 0.1, ease: 'power1.out' });

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('mousedown', onDown);
    card.addEventListener('mouseup', onUp);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('mousedown', onDown);
      card.removeEventListener('mouseup', onUp);
    };
  }, []);

  const gradientAngle = project.card_gradient_angle ?? 135;

  return (
    <div
      ref={cardRef}
      className="project-card relative rounded-none"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Gradient border overlay (hover reveal) */}
      <div
        className="card-border-overlay pointer-events-none absolute inset-0 rounded-none"
        style={{
          opacity: 0,
          outline: `2px solid transparent`,
          background: `linear-gradient(${gradientAngle}deg, var(--color-accent-start), var(--color-accent-end)) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          border: '2px solid transparent',
        }}
      />

      {/* Card face */}
      <div
        className="relative overflow-visible pt-12 pb-8 px-6 rounded-none"
        style={{
          background: `linear-gradient(${gradientAngle}deg, var(--color-accent-start) 0%, var(--primitive-accent-mid) 50%, var(--color-accent-end) 100%)`,
          color: '#1a0a2e',
        }}
      >
        {/* Title — overflows top edge */}
        <h3
          className="font-heading absolute"
          style={{
            top: '-0.6em',
            left: '1.5rem',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'var(--color-text)',
          }}
        >
          {project.title}
        </h3>

        {/* Meta */}
        <p className="text-sm font-medium opacity-70 mb-1" style={{ color: '#1a0a2e' }}>
          {memberName} — {project.role}
        </p>
        <p className="text-sm opacity-60 mb-4" style={{ color: '#1a0a2e' }}>
          {project.year}
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#1a0a2e' }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: 'rgba(26,10,46,0.15)', color: '#1a0a2e' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Corner action button */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View project: ${project.title}`}
            className="absolute bottom-0 right-0 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            style={{
              width: '32px',
              height: '32px',
              background: 'var(--color-text)',
              color: '#0a1c12',
              transform: 'translateX(50%) translateY(50%)',
            }}
          >
            ↗
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SkewedProjectCard.tsx
git commit -m "feat: add SkewedProjectCard with gradient face, overflowing title, corner button"
```

---

### Task 17: ProjectsGrid — perspective wrapper

**Files:**
- Create: `components/ui/ProjectsGrid.tsx`

- [ ] **Step 1: Write `components/ui/ProjectsGrid.tsx`**

```tsx
import { CardReveal } from '@/components/animation/CardReveal';
import { SkewedProjectCard } from '@/components/ui/SkewedProjectCard';
import { TextCharReveal } from '@/components/animation/TextCharReveal';
import type { TeamMember } from '@/types/team';

export interface ProjectsGridProps {
  members: TeamMember[];
}

interface ProjectEntry {
  project: TeamMember['projects'][number];
  memberName: string;
}

export function ProjectsGrid({ members }: ProjectsGridProps) {
  const allProjects: ProjectEntry[] = members.flatMap((m) =>
    m.projects.map((p) => ({ project: p, memberName: m.name }))
  );

  return (
    <section id="work" className="section-padding">
      <div className="max-w-content mx-auto">
        {/* Section heading with char reveal */}
        <div className="mb-16 overflow-hidden">
          <TextCharReveal
            text="WORKS"
            as="h2"
            className="font-display uppercase"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              lineHeight: 1.2,
            }}
          />
        </div>

        {/* Card grid with perspective */}
        <div
          className="card-grid grid gap-16"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          }}
        >
          {allProjects.map(({ project, memberName }, i) => (
            <CardReveal key={`${memberName}-${project.title}`} delay={i * 0.15}>
              <SkewedProjectCard project={project} memberName={memberName} />
            </CardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/ProjectsGrid.tsx
git commit -m "feat: add ProjectsGrid with perspective wrapper and CardReveal stagger"
```

---

## Phase 10 — Page Assembly

### Task 18: Placeholder team member file

**Files:**
- Create: `content/team/alex-nguyen.md`

- [ ] **Step 1: Write `content/team/alex-nguyen.md`**

Copy the fixture file content with a full extended bio:

```markdown
---
name: "Alex Nguyen"
display_name_bg: "NGUYEN"
role: "Data Analyst"
avatar: "/team/alex-nguyen-cutout.png"
avatar_alt: "Alex Nguyen standing in a white shirt against a transparent background, smiling with arms crossed."
linkedin: "https://www.linkedin.com/in/alexnguyen/"
github: ""
skills:
  - "Data Analysis"
  - "Financial Modelling"
  - "Business Strategy"
  - "Operations Research"
  - "Data Visualisation"
tools:
  - "Microsoft Excel"
  - "Python"
  - "Power BI"
  - "Figma"
  - "Google Sheets"
languages:
  - "Vietnamese"
  - "English"
education:
  degree: "Bachelor of Business Administration"
  major: "Business Administration"
  university: "Ho Chi Minh City University"
  year: 2026
bio_short: >
  A data-driven strategist with a passion for turning raw numbers into actionable insight.
  Currently building expertise in financial modelling and operations research at Ho Chi Minh City University.
projects:
  - title: "Supply Chain Optimisation"
    role: "Lead Analyst"
    year: 2025
    description: "Reduced logistics costs by 18% using an Excel route optimisation model for a regional FMCG distributor."
    tags:
      - "Excel"
      - "Operations Research"
      - "Cost Analysis"
    link: ""
    card_gradient_angle: 135
  - title: "Market Entry Analysis"
    role: "Research Lead"
    year: 2024
    description: "Evaluated three Southeast Asian markets for a consumer electronics brand using Porter's Five Forces and TAM sizing."
    tags:
      - "Market Research"
      - "Python"
      - "Business Strategy"
    link: ""
    card_gradient_angle: 135
order: 1
---

Data has always felt like a language to me — one that, once you learn to read it fluently, changes how you see every business problem. I am a third-year Business Administration student at Ho Chi Minh City University, concentrating on quantitative methods and strategic analysis. My interest in data science began when I realised that most organisational decisions were made on instinct rather than evidence, and I wanted to build the tools to change that.

Over the past two years, I have led quantitative analyses for three major academic projects. The most significant was a supply chain study for a regional FMCG distributor, where my team identified an 18% reduction in logistics costs through a route optimisation model built entirely in Excel. The project required gathering primary data from 12 distribution centres, cleaning inconsistencies across four different record-keeping formats, and presenting findings to a panel of industry practitioners who subsequently adopted two of our recommendations.

Currently, I am deepening my Python proficiency to move beyond Excel-scale analyses. I am building a personal project that scrapes and analyses product pricing data across major Vietnamese e-commerce platforms to identify category-level margin trends. It has taught me as much about data pipeline design as it has about the retail market itself.

Outside of coursework, I serve as a mentor for first-year students in our faculty's peer-tutoring programme. Teaching introductory statistics has forced me to explain concepts I thought I understood — and in doing so, understand them far more deeply. I find that the discipline required to simplify complexity is exactly the same discipline that good analysis demands.
```

- [ ] **Step 2: Add a placeholder PNG to `public/team/`**

Create a 1×1 transparent PNG placeholder so Next.js Image doesn't error:

```bash
mkdir -p public/team
# Create a minimal valid PNG (1x1 transparent) using Node
node -e "const {writeFileSync}=require('fs');writeFileSync('public/team/alex-nguyen-cutout.png',Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64'))"
```

- [ ] **Step 3: Commit**

```bash
git add content/team/alex-nguyen.md public/team/alex-nguyen-cutout.png
git commit -m "feat: add placeholder team member content and avatar"
```

---

### Task 19: Home page — final assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `app/page.tsx`** (replaces the stub from Task 9)

```tsx
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { ProjectsGrid } from '@/components/ui/ProjectsGrid';
import { getAllTeamMembers } from '@/lib/team';

export default async function HomePage() {
  const members = await getAllTeamMembers();

  return (
    <>
      {/* Hero — full-viewport carousel */}
      <HeroCarousel members={members} />

      {/* Projects grid */}
      <ProjectsGrid members={members} />

      {/* About section */}
      <section id="about" className="section-padding">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2
            className="font-heading text-text-primary mb-6"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 600, lineHeight: 1.2 }}
          >
            About Studio 7
          </h2>
          <p
            className="text-text-muted"
            style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)', lineHeight: 1.65 }}
          >
            We are a group of business administration students combining analytical rigour with
            creative communication. Studio 7 is our shared space for project work, research, and
            professional growth.
          </p>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero errors.

- [ ] **Step 3: Run dev server and verify the full page renders**

```bash
pnpm dev
```

Open `http://localhost:3000`. Verify:
- NavBar is fixed at top
- Hero carousel fills viewport, shows Alex Nguyen's watermark + slide
- Arrow buttons and keyboard arrows advance slides
- Projects section shows Supply Chain and Market Entry cards with gradient backgrounds
- About section renders below
- Crosshair lines track mouse on desktop (≥1024px)
- Noise grain overlay visible on dark background

- [ ] **Step 4: Test reduced motion**

In Chrome DevTools → More Tools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce`.

Verify:
- Cursor lines hidden
- Cards appear with `fade-in` CSS animation (not GSAP)
- Page remains fully readable and navigable

- [ ] **Step 5: Run full test suite**

```bash
pnpm test
```

Expected: All tests PASS.

- [ ] **Step 6: Run build**

```bash
pnpm build
```

Expected: Build completes with zero errors. No missing module warnings.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble home page with HeroCarousel, ProjectsGrid, and About section"
```

---

## Phase 11 — Deploy Prep

### Task 20: Vercel deploy configuration

**Files:**
- Create: `vercel.json`
- Create: `.gitignore` (if not already present)

- [ ] **Step 1: Write `vercel.json`**

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Verify `.gitignore` covers build artifacts**

Ensure `.gitignore` contains at minimum:

```
node_modules/
.next/
.env.local
*.tsbuildinfo
```

If `.gitignore` does not exist, create it with the above content.

- [ ] **Step 3: Final type-check and test**

```bash
pnpm type-check && pnpm test && pnpm build
```

Expected: All three commands complete with zero errors.

- [ ] **Step 4: Commit**

```bash
git add vercel.json .gitignore
git commit -m "chore: add Vercel deployment config and gitignore"
```

- [ ] **Step 5: Push to remote and trigger Vercel deploy**

```bash
git push origin main
```

Connect the repository to Vercel (vercel.com → New Project → import repo). Set environment variable `NEXT_PUBLIC_SITE_URL` to the Vercel-assigned URL. Deploy.

---

## Post-Implementation Checklist

After completing all tasks, verify these cross-cutting concerns:

- [ ] `pnpm lint` — zero ESLint errors
- [ ] `pnpm type-check` — zero TypeScript errors
- [ ] `pnpm test` — all tests pass
- [ ] `pnpm build` — production build succeeds
- [ ] Reduced motion: all animations disabled, content fully accessible
- [ ] Keyboard: Tab navigates all interactive elements, Enter/Space activates buttons
- [ ] Mobile (< 768px): cursor hidden, carousel responds to touch swipe
- [ ] All `aria-label` attributes present on icon-only buttons
- [ ] No `box-shadow` used anywhere (grep: `box-shadow`)
- [ ] No GSAP/Lenis imports at file top level outside `'use client'` files

---

## Adding More Team Members

For each new team member:

1. Copy `content/team/template.md` → `content/team/[firstname-lastname].md`
2. Fill all YAML frontmatter fields (set `order` to the desired carousel position)
3. Add background-removed PNG cutout to `public/team/[firstname-lastname]-cutout.png`
4. Set `avatar: "/team/[firstname-lastname]-cutout.png"` in the frontmatter
5. Write the extended bio body (200–280 words, 3–4 paragraphs)
6. Run `pnpm build` — new member appears automatically

No code changes needed to add members.
