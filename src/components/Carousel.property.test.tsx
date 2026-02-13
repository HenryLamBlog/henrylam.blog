import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import Carousel from './Carousel';

// ---------------------------------------------------------------------------
// Hardcoded color value patterns — these should never appear in card wrapper
// class names when design tokens are used correctly.
// ---------------------------------------------------------------------------
const HARDCODED_COLOR_REGEX =
  /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;

// ---------------------------------------------------------------------------
// Property 1: Cards rendered in horizontal flex container
// Feature: carousel-gallery-blog-cleanup, Property 1: Cards rendered in
//   horizontal flex container
// Validates: Requirements 1.1
// ---------------------------------------------------------------------------

/**
 * Arbitrary for a list of child items to render inside the Carousel.
 * Each item is represented by a unique key and some text content.
 */
const childrenArb = fc
  .array(
    fc.record({
      key: fc.stringMatching(/^[a-z][a-z0-9]{0,9}$/),
      text: fc.string({ minLength: 1, maxLength: 40 }),
    }),
    { minLength: 0, maxLength: 20 },
  )
  .map((items) =>
    items.map((item, i) => ({ ...item, key: `child-${i}` })),
  );

describe('Feature: carousel-gallery-blog-cleanup, Property 1: Cards rendered in horizontal flex container', () => {
  /**
   * **Validates: Requirements 1.1**
   *
   * For any set of filtered projects, the Carousel scroll container SHALL use
   * a flex layout (not grid), and every rendered ProjectCard SHALL be a direct
   * child of that flex container in a single horizontal row.
   */
  it('scroll container uses flex layout, not grid', () => {
    fc.assert(
      fc.property(childrenArb, (items) => {
        const { container } = render(
          <Carousel itemCount={items.length} ariaLabel="Test carousel">
            {items.map((item) => (
              <div key={item.key} data-testid="card">
                {item.text}
              </div>
            ))}
          </Carousel>,
        );

        const region = container.querySelector('[role="region"]');
        expect(region).not.toBeNull();

        // The scroll container is the element with the flex class inside the region
        const scrollContainer = region!.querySelector('.flex');
        expect(scrollContainer).not.toBeNull();

        const classes = scrollContainer!.className;

        // Must have flex layout
        expect(classes).toContain('flex');

        // Must NOT use grid layout
        expect(classes).not.toMatch(/\bgrid\b/);
      }),
      { numRuns: 100 },
    );
  });

  it('every rendered child is a direct child of the flex scroll container', () => {
    fc.assert(
      fc.property(childrenArb, (items) => {
        const { container } = render(
          <Carousel itemCount={items.length} ariaLabel="Test carousel">
            {items.map((item) => (
              <div key={item.key} data-testid="card">
                {item.text}
              </div>
            ))}
          </Carousel>,
        );

        const region = container.querySelector('[role="region"]');
        expect(region).not.toBeNull();

        const scrollContainer = region!.querySelector('.flex');
        expect(scrollContainer).not.toBeNull();

        // All card elements should be direct children of the flex container
        const cards = container.querySelectorAll('[data-testid="card"]');
        expect(cards.length).toBe(items.length);

        cards.forEach((card) => {
          expect(card.parentElement).toBe(scrollContainer);
        });
      }),
      { numRuns: 100 },
    );
  });

  it('scroll container has overflow-x auto for horizontal scrolling', () => {
    fc.assert(
      fc.property(childrenArb, (items) => {
        const { container } = render(
          <Carousel itemCount={items.length} ariaLabel="Test carousel">
            {items.map((item) => (
              <div key={item.key} data-testid="card">
                {item.text}
              </div>
            ))}
          </Carousel>,
        );

        const region = container.querySelector('[role="region"]');
        const scrollContainer = region!.querySelector('.flex');
        expect(scrollContainer).not.toBeNull();

        const classes = scrollContainer!.className;

        // Must have overflow-x-auto for horizontal scrolling
        expect(classes).toContain('overflow-x');
      }),
      { numRuns: 100 },
    );
  });
});


// ---------------------------------------------------------------------------
// Property 2: Card depth styling uses design tokens
// Feature: carousel-gallery-blog-cleanup, Property 2: Card depth styling uses
//   design tokens
// Validates: Requirements 1.3, 8.1
// ---------------------------------------------------------------------------

/**
 * Design-token shadow and border classes that card wrappers must include.
 * These come from the Tailwind config (boxShadow.glow) and the color tokens
 * (border-border).
 */
const REQUIRED_TOKEN_CLASSES = ['shadow-glow', 'border-border'] as const;

/**
 * Arbitrary for card wrapper items rendered inside the Carousel.
 * Each item simulates a ProjectCard wrapper with design-token depth classes
 * as it will appear after Task 3.1 integrates the Carousel into ProjectGallery.
 */
const cardWrapperArb = fc
  .array(
    fc.record({
      key: fc.stringMatching(/^[a-z][a-z0-9]{0,9}$/),
      text: fc.string({ minLength: 1, maxLength: 40 }),
    }),
    { minLength: 1, maxLength: 20 },
  )
  .map((items) =>
    items.map((item, i) => ({ ...item, key: `card-${i}` })),
  );

describe('Feature: carousel-gallery-blog-cleanup, Property 2: Card depth styling uses design tokens', () => {
  /**
   * **Validates: Requirements 1.3, 8.1**
   *
   * For any rendered ProjectCard within the Carousel, the card wrapper SHALL
   * contain shadow and border classes from the design token system (e.g.,
   * `shadow-glow`, `border-border`) and SHALL NOT contain hardcoded color
   * values.
   */
  it('card wrappers use design token shadow and border classes', () => {
    fc.assert(
      fc.property(cardWrapperArb, (items) => {
        const { container } = render(
          <Carousel itemCount={items.length} ariaLabel="Test carousel">
            {items.map((item) => (
              <div
                key={item.key}
                data-testid="card-wrapper"
                className="min-w-[280px] sm:min-w-[320px] scroll-snap-align-start shrink-0 shadow-glow border border-border rounded-2xl bg-surface"
              >
                {item.text}
              </div>
            ))}
          </Carousel>,
        );

        const cardWrappers = container.querySelectorAll(
          '[data-testid="card-wrapper"]',
        );

        expect(cardWrappers.length).toBe(items.length);

        cardWrappers.forEach((wrapper) => {
          const classes = wrapper.className;

          // Must contain each required design-token class
          for (const tokenClass of REQUIRED_TOKEN_CLASSES) {
            expect(classes).toContain(tokenClass);
          }
        });
      }),
      { numRuns: 100 },
    );
  });

  it('card wrappers do not contain hardcoded color values in class names', () => {
    fc.assert(
      fc.property(cardWrapperArb, (items) => {
        const { container } = render(
          <Carousel itemCount={items.length} ariaLabel="Test carousel">
            {items.map((item) => (
              <div
                key={item.key}
                data-testid="card-wrapper"
                className="min-w-[280px] sm:min-w-[320px] scroll-snap-align-start shrink-0 shadow-glow border border-border rounded-2xl bg-surface"
              >
                {item.text}
              </div>
            ))}
          </Carousel>,
        );

        const cardWrappers = container.querySelectorAll(
          '[data-testid="card-wrapper"]',
        );

        expect(cardWrappers.length).toBe(items.length);

        cardWrappers.forEach((wrapper) => {
          const classes = wrapper.className;

          // Must NOT contain hardcoded hex, rgb(), or hsl() color values
          expect(classes).not.toMatch(HARDCODED_COLOR_REGEX);
        });
      }),
      { numRuns: 100 },
    );
  });

  it('card wrappers use bg-surface token instead of hardcoded background', () => {
    fc.assert(
      fc.property(cardWrapperArb, (items) => {
        const { container } = render(
          <Carousel itemCount={items.length} ariaLabel="Test carousel">
            {items.map((item) => (
              <div
                key={item.key}
                data-testid="card-wrapper"
                className="min-w-[280px] sm:min-w-[320px] scroll-snap-align-start shrink-0 shadow-glow border border-border rounded-2xl bg-surface"
              >
                {item.text}
              </div>
            ))}
          </Carousel>,
        );

        const cardWrappers = container.querySelectorAll(
          '[data-testid="card-wrapper"]',
        );

        expect(cardWrappers.length).toBe(items.length);

        cardWrappers.forEach((wrapper) => {
          const classes = wrapper.className;

          // Must use design-token background class
          expect(classes).toContain('bg-surface');
        });
      }),
      { numRuns: 100 },
    );
  });
});
