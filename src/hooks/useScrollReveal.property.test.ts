import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mocks — control Framer Motion hooks so we can simulate viewport behavior
// ---------------------------------------------------------------------------

let mockUseInViewReturn = false;
let capturedUseInViewOptions: Record<string, unknown> | undefined;

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useInView: (_ref: unknown, options?: Record<string, unknown>) => {
      capturedUseInViewOptions = options;
      return mockUseInViewReturn;
    },
    useReducedMotion: () => false,
  };
});

import { useScrollReveal } from './useScrollReveal';

// ---------------------------------------------------------------------------
// Property 6: Scroll-triggered animations fire only once
// Feature: portfolio-visual-redesign, Property 6: Scroll-triggered animations
//   fire only once
// Validates: Requirements 4.3
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 6: Scroll-triggered animations fire only once', () => {
  beforeEach(() => {
    mockUseInViewReturn = false;
    capturedUseInViewOptions = undefined;
  });

  /**
   * **Validates: Requirements 4.3**
   *
   * For any element observed by useScrollReveal with once: true (the default),
   * the hook must forward once: true to Framer Motion's useInView. This
   * guarantees that after isInView becomes true, it remains true — useInView
   * with once: true never reverts to false.
   */
  it('passes once: true to useInView by default for any amount value', () => {
    // Generate arbitrary valid amount thresholds
    const amountArb = fc.double({ min: 0, max: 1, noNaN: true });

    fc.assert(
      fc.property(amountArb, (amount) => {
        mockUseInViewReturn = false;

        renderHook(() => useScrollReveal({ amount }));

        expect(capturedUseInViewOptions).toBeDefined();
        expect(capturedUseInViewOptions!.once).toBe(true);
      }),
      { numRuns: 100, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 4.3**
   *
   * For any explicit once: true option combined with any valid amount,
   * the hook must forward once: true to useInView, ensuring the animation
   * fires only once.
   */
  it('forwards once: true to useInView when explicitly set', () => {
    const amountArb = fc.double({ min: 0, max: 1, noNaN: true });

    fc.assert(
      fc.property(amountArb, (amount) => {
        mockUseInViewReturn = false;

        renderHook(() => useScrollReveal({ once: true, amount }));

        expect(capturedUseInViewOptions).toBeDefined();
        expect(capturedUseInViewOptions!.once).toBe(true);
      }),
      { numRuns: 100, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 4.3**
   *
   * When useInView reports the element is in view (true) and once is true,
   * the hook's isInView must be true. Combined with the once: true option
   * forwarded to useInView, this means the value will never revert — the
   * animation fires only once.
   */
  it('isInView stays true once useInView returns true with once: true', () => {
    const amountArb = fc.double({ min: 0, max: 1, noNaN: true });

    fc.assert(
      fc.property(amountArb, (amount) => {
        // Simulate element entering viewport
        mockUseInViewReturn = true;

        const { result } = renderHook(() =>
          useScrollReveal({ once: true, amount }),
        );

        // isInView must be true
        expect(result.current.isInView).toBe(true);
        // once: true must be forwarded so useInView locks the value
        expect(capturedUseInViewOptions!.once).toBe(true);
      }),
      { numRuns: 100, verbose: true },
    );
  });
});
