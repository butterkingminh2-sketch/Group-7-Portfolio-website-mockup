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
