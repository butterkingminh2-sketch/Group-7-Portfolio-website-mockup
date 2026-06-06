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
