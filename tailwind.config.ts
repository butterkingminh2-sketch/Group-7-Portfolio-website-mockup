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
        content: 'min(100%, 88vw)',
      },
    },
  },
  plugins: [],
};

export default config;
