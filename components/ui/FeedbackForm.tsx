'use client';

import { useState } from 'react';

export function FeedbackForm() {
  const [name, setName]       = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || rating === 0) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, rating }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        style={{
          padding: '2rem',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '0.875rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Thank you — feedback received.
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Star rating */}
      <div style={{ display: 'flex', gap: '0.4rem' }} role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              fontSize: '1.5rem',
              color: star <= (hover || rating)
                ? 'var(--color-accent-start)'
                : 'var(--color-border-hover)',
              transition: 'color 120ms ease',
            }}
          >
            ★
          </button>
        ))}
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      {/* Message */}
      <textarea
        placeholder="Your feedback *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={4}
        style={{ ...inputStyle, resize: 'vertical' }}
      />

      <button
        type="submit"
        disabled={status === 'sending' || !message.trim() || rating === 0}
        style={{
          alignSelf: 'flex-start',
          padding: '0.75rem 2rem',
          background: 'var(--color-text)',
          color: 'var(--color-bg)',
          border: 'none',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          opacity: !message.trim() || rating === 0 ? 0.4 : 1,
          transition: 'opacity 150ms ease',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Submit'}
      </button>

      {status === 'error' && (
        <p style={{ color: 'var(--primitive-accent-mid)', fontSize: '0.8rem' }}>
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--color-border)',
  borderRadius: 0,
  padding: '0.75rem 1rem',
  color: 'var(--color-text)',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 150ms ease',
};
