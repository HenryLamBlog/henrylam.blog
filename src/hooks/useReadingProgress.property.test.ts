import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateReadingProgress } from './useReadingProgress';

// ---------------------------------------------------------------------------
// Property 10: Reading progress reaches 100% at document end
// Feature: portfolio-visual-redesign, Property 10: Reading progress reaches
//   100% at document end
// Validates: Requirements 10.4
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 10: Reading progress reaches 100% at document end', () => {
  /**
   * **Validates: Requirements 10.4**
   *
   * For any document height and viewport height, when the scroll position
   * reaches the bottom (scrollY >= documentHeight - viewportHeight), the
   * reading progress should be 100.
   */
  it('returns 100 when scrollY reaches the bottom of the document', () => {
    fc.assert(
      fc.property(
        // documentHeight: at least 1px
        fc.integer({ min: 1, max: 100_000 }),
        // viewportHeight: at least 1px, at most documentHeight
        fc.integer({ min: 1, max: 100_000 }),
        (documentHeight, viewportHeight) => {
          // scrollY at the very bottom
          const maxScroll = documentHeight - viewportHeight;
          if (maxScroll <= 0) {
            // Content fits in viewport — should be 100 regardless of scrollY
            const progress = calculateReadingProgress(0, documentHeight, viewportHeight);
            expect(progress).toBe(100);
          } else {
            const progress = calculateReadingProgress(maxScroll, documentHeight, viewportHeight);
            expect(progress).toBe(100);
          }
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 10.4**
   *
   * For any document where scrollY + viewportHeight >= documentHeight
   * (i.e. scrolled past the end), progress should be 100.
   */
  it('returns 100 when scrollY + viewportHeight >= documentHeight', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50_000 }),
        fc.integer({ min: 1, max: 50_000 }),
        fc.integer({ min: 0, max: 10_000 }),
        (documentHeight, viewportHeight, overshoot) => {
          // scrollY that puts us at or past the end
          const scrollY = Math.max(0, documentHeight - viewportHeight) + overshoot;
          const progress = calculateReadingProgress(scrollY, documentHeight, viewportHeight);
          expect(progress).toBe(100);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 10.4**
   *
   * Progress is always clamped to [0, 100] for any non-negative inputs.
   */
  it('progress is always between 0 and 100 for any non-negative inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100_000 }),
        fc.integer({ min: 1, max: 100_000 }),
        fc.integer({ min: 1, max: 100_000 }),
        (scrollY, documentHeight, viewportHeight) => {
          const progress = calculateReadingProgress(scrollY, documentHeight, viewportHeight);
          expect(progress).toBeGreaterThanOrEqual(0);
          expect(progress).toBeLessThanOrEqual(100);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 10.4**
   *
   * When scrollY is 0 and the document is taller than the viewport,
   * progress should be 0.
   */
  it('returns 0 at the top of a scrollable document', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 100_000 }),
        (documentHeight) => {
          // viewportHeight strictly less than documentHeight so it's scrollable
          const viewportHeight = Math.max(1, Math.floor(documentHeight / 2));
          const progress = calculateReadingProgress(0, documentHeight, viewportHeight);
          expect(progress).toBe(0);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });
});
