# Studio 7

> An immersive, scroll-driven group portfolio showcasing business administration projects, data analysis research, and individual capabilities — built with Next.js 14, GSAP, and Lenis.

**Live URL:** Coming soon

---

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-1.x-000000?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PC9zdmc+&logoColor=white)](https://lenis.darkroom.engineering/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel&logoColor=white)](https://vercel.com/)

---

## Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x (`npm install -g pnpm`)
- **GSAP** free tier — no Club GreenSock license required. `SplitText` is a Club plugin; this project uses manual `<span>` wrapping for character text reveals instead. See `.claude/rules/code-style.md` for the exact pattern.

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/studio-7.git
cd studio-7

# 2. Install dependencies
pnpm install

# 3. Create environment variables
cp .env.local.example .env.local
# Fill in values — see "Environment Variables" below

# 4. Start the development server
pnpm dev
# Open http://localhost:3000
```

### Environment Variables

Create `.env.local` from the example file and populate:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL of the deployed site (e.g. `https://studio7.vercel.app`) |

---

## Folder Structure

```
studio-7/
├── app/                          Next.js App Router — pages, layouts, route segments
│   ├── layout.tsx                Root layout: mounts LenisProvider + CrosshairCursor
│   └── page.tsx                  Home — hero carousel, project grid, about section
├── components/
│   ├── animation/                GSAP wrappers (scroll reveals, card animations, text splits)
│   │   ├── CardReveal.tsx
│   │   ├── TextCharReveal.tsx
│   │   └── ParallaxLayer.tsx
│   ├── cursor/                   Custom crosshair cursor ('use client')
│   │   └── CrosshairCursor.tsx
│   ├── providers/                Lenis smooth scroll + GSAP ticker
│   │   └── LenisProvider.tsx
│   └── ui/                       Generic UI: buttons, cards, nav, carousel dots
├── content/
│   ├── team/                     One .md file per member (YAML frontmatter + extended bio)
│   │   └── template.md           Copy this file when adding a new member
│   └── projects/                 Optional standalone project MDX files
├── public/
│   └── team/                     Background-removed PNG cutouts: [slug]-cutout.png
├── styles/
│   └── globals.css               CSS tokens, noise overlay body::after, font imports
├── .claude/
│   ├── rules/
│   │   ├── code-style.md         Architecture, naming, GSAP/Lenis rules
│   │   └── design-system.md      Color tokens, typography, animation specs
│   └── CLAUDE.md                 (symlinked from root — do not edit .claude copy)
├── CLAUDE.md                     Claude Code blueprint — read before any task
└── tailwind.config.ts
```

---

## Contributing

### Branch Naming

| Prefix | Use for |
|--------|---------|
| `feat/` | New features or pages |
| `fix/` | Bug fixes |
| `animation/` | GSAP / Lenis animation work |
| `style/` | Visual/design-only changes |
| `chore/` | Tooling, config, dependency updates |
| `docs/` | Documentation only |

Example: `animation/hero-carousel-parallax`, `feat/project-card-grid`

### Commit Types (Conventional Commits)

```
feat:       New feature
fix:        Bug fix
animation:  Any GSAP or Lenis change (timelines, ScrollTrigger, Lenis options)
style:      Visual / CSS / design changes (no logic change)
chore:      Tooling, config, deps, CI
docs:       Documentation only
refactor:   Code restructure (no feature or bug change)
```

### PR Checklist

Before opening a pull request, verify all of the following:

- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm type-check` passes with zero TypeScript errors
- [ ] `pnpm build` completes without errors
- [ ] All new GSAP timelines and ScrollTrigger instances are cleaned up in `useEffect` return
- [ ] All `'use client'` additions are justified by the trigger list in `.claude/rules/code-style.md`
- [ ] **`prefers-reduced-motion` test:** open DevTools → Rendering → Emulate CSS media feature → set `prefers-reduced-motion: reduce` → verify the page is fully usable with no broken layout or invisible content
- [ ] New member PNG cutouts include descriptive `alt` text in their `.md` frontmatter
- [ ] No inline `box-shadow` added to cards, buttons, or nav elements

---

## Performance Note

Every `useEffect` that creates a GSAP `Timeline`, `ScrollTrigger`, or `Lenis` instance **must** return a cleanup function. Failing to kill animations on unmount causes memory leaks across Next.js client-side navigation.

See the required cleanup pattern in [`.claude/rules/code-style.md`](.claude/rules/code-style.md) — Section 6, GSAP Cleanup Pattern.

---

## Team

| # | Name | Number |
|---|------|------|
| 1 | Giàng Lê Quang Tùng | 23080090 |
| 2 | Đào Ngọc Anh Duy | 23080024 |
| 3 | Nguyễn Quang Minh | 23080064 |
| 4 | Phạm Việt Anh | 23080011 |
| 5 | Hà Văn Thái Bảo | 23080106 |
| 6 | Đỗ Mỹ Ngọc | 23080153 |
| 7 | Nguyễn Bảo Châu | 23080111 |
| 8 | Trương Minh Ngọc | 23080158 |
| 9 | Nguyễn Thanh Hà | 23080122 |
| 10 | Nguyễn Thanh Hiền | 23080124 |

---

## License

[MIT](LICENSE)
