import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getScrollBounds } from './useCarousel';

// ---------------------------------------------------------------------------
// Property 3: Arrow visibility matches scroll bounds
// Feature: carousel-gallery-blog-cleanup, Property 3: Arrow visibility
//   matches scroll bounds
// Validates: Requirements 2.4, 2.5
// ---------------------------------------------------------------------------

/**
 * Helper to create a mock container with the given scroll dimensions.
 * We only need scrollLeft, scrollWidth, and clientWidth since getScrollBounds
 * reads those three properties from the container element.
 */
function mockContainer(scrollLeft: number, scrollWidth: number, clientWidth: number) {
  return {
    scrollLeft,
    scrollWidth,
    clientWidth,
  } as unknown as HTMLDivElement;
}

describe('Feature: carousel-gallery-blog-cleanup, Property 3: Arrow visibility matches scroll bounds', () => {
  /**
   * **Validates: Requirements 2.4, 2.5**
   *
   * For any scroll position within the Carousel, the left Navigation_Arrow
   * SHALL be hidden when scrollLeft <= 0, and the right Navigation_Arrow
   * SHALL be hidden when scrollLeft + clientWidth >= scrollWidth.
   * Conversely, each arrow SHALL be visible when its scroll direction has
   * remaining content.
   */
  it('left arrow is hidden when scrollLeft <= 0 and visible otherwise', () => {
    fc.assert(
      fc.property(
        // scrollWidth: total scrollable width (at least 1px)
        fc.integer({ min: 1, max: 100_000 }),
        // clientWidth: visible width (1..scrollWidth)
        fc.integer({ min: 1, max: 100_000 }),
        // scrollLeft: current scroll offset (0..scrollWidth - clientWidth)
        fc.integer({ min: 0, max: 100_000 }),
        (scrollWidth, clientWidthRaw, scrollLeftRaw) => {
          // Constrain clientWidth to be at most scrollWidth
          const clientWidth = Math.min(clientWidthRaw, scrollWidth);
          // Constrain scrollLeft to valid range [0, scrollWidth - clientWidth]
          const maxScroll = scrollWidth - clientWidth;
          const scrollLeft = Math.min(scrollLeftRaw, maxScroll);

          const container = mockContainer(scrollLeft, scrollWidth, clientWidth);
          const { canScrollLeft } = getScrollBounds(container);

          if (scrollLeft <= 0) {
            expect(canScrollLeft).toBe(false);
          } else {
            expect(canScrollLeft).toBe(true);
          }
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  it('right arrow is hidden when scrollLeft + clientWidth >= scrollWidth and visible otherwise', () => {
    fc.assert(
      fc.property(
        // scrollWidth: total scrollable width (at least 1px)
        fc.integer({ min: 1, max: 100_000 }),
        // clientWidth: visible width (1..scrollWidth)
        fc.integer({ min: 1, max: 100_000 }),
        // scrollLeft: current scroll offset (0..scrollWidth - clientWidth)
        fc.integer({ min: 0, max: 100_000 }),
        (scrollWidth, clientWidthRaw, scrollLeftRaw) => {
          const clientWidth = Math.min(clientWidthRaw, scrollWidth);
          const maxScroll = scrollWidth - clientWidth;
          const scrollLeft = Math.min(scrollLeftRaw, maxScroll);

          const container = mockContainer(scrollLeft, scrollWidth, clientWidth);
          const { canScrollRight } = getScrollBounds(container);

          if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
            expect(canScrollRight).toBe(false);
          } else {
            expect(canScrollRight).toBe(true);
          }
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  it('both arrows are hidden when all content fits in the viewport (scrollWidth <= clientWidth)', () => {
    fc.assert(
      fc.property(
        // clientWidth >= scrollWidth means everything fits
        fc.integer({ min: 1, max: 100_000 }),
        fc.integer({ min: 0, max: 100_000 }),
        (clientWidth, extraWidth) => {
          // scrollWidth is at most clientWidth (content fits)
          const scrollWidth = Math.max(1, clientWidth - extraWidth);
          const container = mockContainer(0, scrollWidth, clientWidth);
          const { canScrollLeft, canScrollRight } = getScrollBounds(container);

          expect(canScrollLeft).toBe(false);
          expect(canScrollRight).toBe(false);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  it('left and right arrow visibility are consistent for any valid scroll state', () => {
    fc.assert(
      fc.property(
        // scrollWidth: total scrollable width
        fc.integer({ min: 1, max: 100_000 }),
        // clientWidth: visible width
        fc.integer({ min: 1, max: 100_000 }),
        // scrollFraction: position as a fraction [0, 1] of max scroll
        fc.double({ min: 0, max: 1, noNaN: true }),
        (scrollWidth, clientWidthRaw, scrollFraction) => {
          const clientWidth = Math.min(clientWidthRaw, scrollWidth);
          const maxScroll = scrollWidth - clientWidth;
          const scrollLeft = Math.floor(scrollFraction * maxScroll);

          const container = mockContainer(scrollLeft, scrollWidth, clientWidth);
          const { canScrollLeft, canScrollRight } = getScrollBounds(container);

          // Left arrow: visible iff there's content to the left
          expect(canScrollLeft).toBe(scrollLeft > 0);

          // Right arrow: visible iff there's content to the right
          expect(canScrollRight).toBe(
            Math.ceil(scrollLeft + clientWidth) < scrollWidth,
          );
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Auto-scroll disabled when items fit viewport
// Feature: carousel-gallery-blog-cleanup, Property 4: Auto-scroll disabled
//   when items fit viewport
// Validates: Requirements 3.4
// ---------------------------------------------------------------------------

import { shouldAutoScroll } from './useCarousel';

describe('Feature: carousel-gallery-blog-cleanup, Property 4: Auto-scroll disabled when items fit viewport', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * For any Carousel where scrollWidth <= clientWidth (all items fit without
   * scrolling), auto-scroll SHALL be disabled. Equivalently, for any item
   * count that fits within the visible area, the auto-scroll interval SHALL
   * not be active.
   */
  it('auto-scroll is disabled when scrollWidth <= clientWidth', () => {
    fc.assert(
      fc.property(
        // clientWidth: visible viewport width (at least 1px)
        fc.integer({ min: 1, max: 100_000 }),
        // scrollWidth: total content width, constrained to be <= clientWidth
        fc.integer({ min: 1, max: 100_000 }),
        // autoScrollInterval: a positive interval (auto-scroll would be enabled)
        fc.integer({ min: 1, max: 60_000 }),
        (clientWidth, scrollWidthRaw, autoScrollInterval) => {
          // Ensure scrollWidth <= clientWidth (items fit in viewport)
          const scrollWidth = Math.min(scrollWidthRaw, clientWidth);

          const container = mockContainer(0, scrollWidth, clientWidth);
          const result = shouldAutoScroll(container, autoScrollInterval);

          expect(result).toBe(false);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  it('auto-scroll is enabled when scrollWidth > clientWidth and interval > 0', () => {
    fc.assert(
      fc.property(
        // clientWidth: visible viewport width
        fc.integer({ min: 1, max: 99_999 }),
        // extra: how much wider the content is than the viewport (at least 1px)
        fc.integer({ min: 1, max: 100_000 }),
        // autoScrollInterval: a positive interval
        fc.integer({ min: 1, max: 60_000 }),
        (clientWidth, extra, autoScrollInterval) => {
          const scrollWidth = clientWidth + extra;

          const container = mockContainer(0, scrollWidth, clientWidth);
          const result = shouldAutoScroll(container, autoScrollInterval);

          expect(result).toBe(true);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  it('auto-scroll is always disabled when interval is 0 regardless of dimensions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100_000 }),
        fc.integer({ min: 1, max: 100_000 }),
        (scrollWidth, clientWidth) => {
          const container = mockContainer(0, scrollWidth, clientWidth);
          const result = shouldAutoScroll(container, 0);

          expect(result).toBe(false);
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  it('auto-scroll decision is consistent: fits viewport implies disabled', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100_000 }),
        fc.integer({ min: 1, max: 100_000 }),
        fc.integer({ min: 0, max: 60_000 }),
        (scrollWidth, clientWidth, autoScrollInterval) => {
          const container = mockContainer(0, scrollWidth, clientWidth);
          const result = shouldAutoScroll(container, autoScrollInterval);

          const fitsViewport = scrollWidth <= clientWidth;
          const intervalDisabled = autoScrollInterval <= 0;

          if (fitsViewport || intervalDisabled) {
            expect(result).toBe(false);
          } else {
            expect(result).toBe(true);
          }
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });
});
