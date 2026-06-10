'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/dashboard/login');
  };

  return (
    <button
      onClick={logout}
      style={{
        background: 'none',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        transition: 'border-color 150ms ease, color 150ms ease',
      }}
    >
      Sign out
    </button>
  );
}
