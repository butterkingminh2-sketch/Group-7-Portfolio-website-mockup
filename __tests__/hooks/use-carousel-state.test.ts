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
