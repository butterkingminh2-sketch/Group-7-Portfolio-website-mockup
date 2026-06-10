import { db } from '@/lib/firebase-admin';
import type { FeedbackEntry } from '@/types/feedback';

export const dynamic = 'force-dynamic';

async function getFeedback(): Promise<FeedbackEntry[]> {
  const snap = await db
    .collection('feedback')
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FeedbackEntry, 'id'>),
  }));
}

export default async function DashboardPage() {
  const entries = await getFeedback();

  const avg =
    entries.length > 0
      ? (entries.reduce((s, e) => s + e.rating, 0) / entries.length).toFixed(1)
      : '—';

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 5rem)',
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Studio 7
        </p>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Feedback
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total responses', value: String(entries.length) },
          { label: 'Average rating', value: avg === '—' ? '—' : `${avg} / 5` },
        ].map(({ label, value }) => (
          <div key={label} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', minWidth: '10rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
              {label}
            </p>
            <p style={{ fontSize: '1.75rem', fontFamily: 'Anton, sans-serif', letterSpacing: '-0.01em' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No feedback yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-border)' }}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: 'var(--color-bg)',
                padding: '1.5rem 2rem',
                display: 'grid',
                gridTemplateColumns: '8rem 1fr 6rem',
                alignItems: 'start',
                gap: '2rem',
              }}
            >
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>{entry.name}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                  {new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                {entry.message}
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--color-accent-start)', letterSpacing: '0.05em' }}>
                {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
