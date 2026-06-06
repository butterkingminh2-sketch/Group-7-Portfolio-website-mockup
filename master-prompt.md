# Master Prompt — Group Portfolio Website Setup
## PROMPT

```
Role: You are an expert System Architect, Technical Writer, and Web Developer.

---

## Project Overview

My team is building a group portfolio website. We are using Claude Code as our AI coding agent. Your job is to generate the complete foundation of configuration and content files so Claude Code can operate efficiently, follow our design system, and understand our team data from day one.

---

## Project Variables

- **Project Name:** Studio 7
- **Project Goal:** A professional group portfolio highlighting our business administration projects, data analysis research, and individual capabilities.
- **Live URL (if known):** TBD

### Tech Stack
- **Framework:** React 19 (Vite / Single Page Application setup)
- **Styling:** Custom Shaders (GLSL) + Tailwind CSS (for 2D layouts)
- **Content Layer:** Web Audio API (procedural audio) + 3JS Custom Geometry (procedural math-based elements, no external media assets)
- **Package Manager:** npm
- **Deployment:** Vercel

### Team Members (expected 10 members to be added)
List each member with the following details:
- **Member 1:** [Full name], [Role e.g., Lead Developer], [Key skills e.g., Python, Excel, Data Analysis]

### Design System
- **Style Direction:** [e.g., Minimalist, corporate-clean]
- **Color Palette:**
  - Primary: [e.g., #2563EB — blue]
  - Accent: [e.g., #F59E0B — amber]
  - Neutral: [e.g., #111827 text, #F9FAFB background, #E5E7EB borders]
- **Typography:**
  - Display/Headings: [e.g., Sora — bold, geometric]
  - Body: [e.g., DM Sans — clean, readable]
  - Monospace: [e.g., JetBrains Mono — for code snippets]
  - Base size: [e.g., 16px]
- **Animation & Motion:**
  - Page transitions: [e.g., 300ms fade, ease-in-out]
  - Scroll reveals: [e.g., subtle fade-up on enter, staggered 100ms delay per card]
  - Hover states: [e.g., 150ms scale(1.02) on cards, underline slide on links]
  - Rule: [e.g., No bounce, no spin, no decorative loops — motion is functional only]
- **Spacing Scale:** [e.g., 4px base unit, follow Tailwind defaults]
- **Border Radius:** [e.g., rounded-xl for cards, rounded-full for tags/badges]
- **Shadows:** [e.g., Soft single-layer shadow only: shadow-sm on cards, none on buttons]

### Development Rules
- **Module System:** [e.g., ES6 modules only, no CommonJS require()]
- **Component Naming:** [e.g., PascalCase for components, kebab-case for files]
- **CSS Approach:** [e.g., Tailwind utility-first, no inline styles, no CSS modules]
- **Git Commits:** [e.g., Conventional commits: feat:, fix:, chore:, docs:]
- **Responsive Strategy:** [e.g., Mobile-first, breakpoints: sm/md/lg/xl]
- **Accessibility:** [e.g., All images need alt text, semantic HTML required, WCAG AA minimum]
- **Linting/Formatting:** [e.g., ESLint + Prettier, run before every commit]

---

## Task

Generate the exact, copy-pasteable content for all files listed below. Output each file sequentially using a Markdown code block with the filename on the line immediately above it.

---

## Files to Generate

### 1. `CLAUDE.md`
The master blueprint for Claude Code. Include:
- One-paragraph project summary
- Full tech stack list
- Terminal commands: dev server, production build, linter, formatter, type-check (if applicable)
- Instruction to read `.claude/rules/` for all style and design specifics
- A "Project structure" section listing the key directories and what lives in each
- Format as strict, numbered rules and short bullet lists — no conversational prose

### 2. `.claude/rules/code-style.md`
Code formatting and architecture rules. Include:
- Component structure conventions (file naming, folder structure, export style)
- Import ordering rules
- Tailwind class ordering convention (or reference Prettier plugin)
- Rules for when to create a new component vs. inline code
- TypeScript rules if applicable (strict mode, type-only imports, no `any`)
- Forbidden patterns (e.g., no inline styles, no default exports from page files)
- Format: strict numbered rules, no explanations — commands only

### 3. `.claude/rules/design-system.md`
The single source of truth for all visual decisions. Include:
- Full color tokens (variable names mapped to hex values)
- Typography scale (font families, sizes, weights, line heights for h1–h4, body, caption, code)
- Spacing and layout rules (max container width, section padding, grid columns)
- Animation rules (exact durations, easing functions, what triggers animation)
- Component-specific rules: cards, buttons, navigation, tags/badges, hero section
- Dark mode handling if applicable
- Format: structured reference tables where possible, strict rules elsewhere

### 4. `content/team/template.md`
A YAML frontmatter + Markdown template for team member profiles. Include these frontmatter fields:
- `name`, `role`, `avatar` (image path), `linkedin`, `github` (optional)
- `skills` (array)
- `tools` (array — software they use: Excel, Figma, Python, etc.)
- `languages` (array — spoken languages)
- `projects` (array of objects: `title`, `role`, `description`, `link`)
- `education` (object: `degree`, `major`, `university`, `year`)
- `bio` (short string, 2–3 sentences)
- Below the frontmatter, include a Markdown section for an extended written bio with placeholder copy showing expected length and tone

### 5. `README.md`
Human-readable project documentation. Include:
- Project name and one-line description
- Live URL (or "coming soon" placeholder)
- Tech stack badges (use shields.io format)
- Prerequisites (Node version, package manager)
- Step-by-step setup: clone → install → env variables → dev server
- Folder structure overview (top-level only)
- Contribution guide: branch naming, commit format, PR checklist
- Team credits section with names and roles
- License line

---

## Constraints

1. Files intended for Claude Code (`CLAUDE.md` and all `.claude/rules/` files) must be written as strict, direct rules — no conversational tone, no explanations, no "you should" phrasing. Use imperatives: "Use", "Never", "Always", "Prefix".
2. All color and spacing values must use the exact hex codes and numbers specified in the Design System above — no approximations.
3. The team template frontmatter must be valid YAML. Test mentally before outputting.
4. README badges must use real shields.io URL format.
5. After generating all five files, output a short "Assumptions Log" — a bullet list of any placeholder values you interpreted, inferred, or defaulted because they were left unfilled.
```
