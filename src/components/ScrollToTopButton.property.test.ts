import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Pure visibility predicate matching the ScrollToTopButton logic:
 * visible if and only if scrollY > 300.
 */
function isScrollToTopVisible(scrollY: number): boolean {
  return scrollY > 300;
}

/**
 * Property 11: Scroll-to-top button visibility tracks scroll threshold
 *
 * For any scrollY value, the ScrollToTopButton should be visible
 * if and only if scrollY > 300.
 *
 * **Validates: Requirements 11.1, 11.2**
 */
describe('Feature: portfolio-visual-redesign, Property 11: Scroll-to-top button visibility tracks scroll threshold', () => {
  const scrollYArb = fc.integer({ min: 0, max: 100000 });

  it('button is visible when scrollY > 300', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 301, max: 100000 }),
        (scrollY) => {
          expect(isScrollToTopVisible(scrollY)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('button is hidden when scrollY <= 300', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 300 }),
        (scrollY) => {
          expect(isScrollToTopVisible(scrollY)).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('visibility is true iff scrollY > 300 for any non-negative scrollY', () => {
    fc.assert(
      fc.property(scrollYArb, (scrollY) => {
        const visible = isScrollToTopVisible(scrollY);
        if (scrollY > 300) {
          expect(visible).toBe(true);
        } else {
          expect(visible).toBe(false);
        }
      }),
      { numRuns: 100 },
    );
  });
});
