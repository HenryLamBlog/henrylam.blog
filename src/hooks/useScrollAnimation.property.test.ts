import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { processAnimationEntries, applyAnimation } from './useScrollAnimation';

/**
 * Property 6: Scroll animation applies correct effect class with stagger
 *
 * For any group of N sibling elements with configured animation effects
 * (fadeIn, fadeInLeft, fadeInRight, fadeInUp), when the intersection callback
 * fires, element at index k should receive its configured animation CSS class
 * after a delay of k × 100ms.
 *
 * **Validates: Requirements 8.2, 8.3**
 */

const VALID_EFFECTS = ['fadeIn', 'fadeInLeft', 'fadeInRight', 'fadeInUp'] as const;
const STAGGER_DELAY = 100;

/** Arbitrary that generates a valid animation effect name */
const effectArb = fc.constantFrom(...VALID_EFFECTS);

/** Arbitrary that generates a DOM element with a random animation effect */
const elementWithEffectArb = effectArb.map((effect) => {
  const el = document.createElement('div');
  el.setAttribute('data-animate-effect', effect);
  return { el, effect };
});

/**
 * Arbitrary that generates a non-empty array of intersecting entries,
 * each with a random animation effect.
 */
const intersectingEntriesArb = fc
  .array(elementWithEffectArb, { minLength: 1, maxLength: 50 })
  .map((items) => ({
    items,
    entries: items.map(({ el }) => ({ isIntersecting: true, target: el })),
  }));

describe('Property 6: Scroll animation applies correct effect class with stagger', () => {
  it('each intersecting element receives its configured effect and delay = index × staggerDelay', () => {
    fc.assert(
      fc.property(intersectingEntriesArb, ({ items, entries }) => {
        const results = processAnimationEntries(entries, STAGGER_DELAY);

        // All intersecting elements should produce results
        expect(results).toHaveLength(items.length);

        for (let k = 0; k < results.length; k++) {
          // Correct element reference
          expect(results[k].element).toBe(items[k].el);
          // Correct effect from data-animate-effect attribute
          expect(results[k].effect).toBe(items[k].effect);
          // Stagger delay = index × 100ms
          expect(results[k].delay).toBe(k * STAGGER_DELAY);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('non-intersecting elements are skipped and do not affect stagger indexing', () => {
    /** Arbitrary for an entry that may or may not be intersecting */
    const mixedEntryArb = fc.tuple(elementWithEffectArb, fc.boolean()).map(
      ([{ el, effect }, isIntersecting]) => ({ el, effect, isIntersecting }),
    );

    fc.assert(
      fc.property(
        fc.array(mixedEntryArb, { minLength: 1, maxLength: 50 }).filter(
          (arr) => arr.some((e) => e.isIntersecting),
        ),
        (mixedItems) => {
          const entries = mixedItems.map(({ el, isIntersecting }) => ({
            isIntersecting,
            target: el,
          }));

          const results = processAnimationEntries(entries, STAGGER_DELAY);

          // Only intersecting items should appear in results
          const intersecting = mixedItems.filter((m) => m.isIntersecting);
          expect(results).toHaveLength(intersecting.length);

          // Stagger index is based on position among intersecting elements only
          for (let k = 0; k < results.length; k++) {
            expect(results[k].element).toBe(intersecting[k].el);
            expect(results[k].effect).toBe(intersecting[k].effect);
            expect(results[k].delay).toBe(k * STAGGER_DELAY);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('effect is always one of the valid animation classes when configured', () => {
    fc.assert(
      fc.property(intersectingEntriesArb, ({ entries }) => {
        const results = processAnimationEntries(entries, STAGGER_DELAY);

        for (const result of results) {
          expect(VALID_EFFECTS).toContain(result.effect);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('stagger delays form a strictly increasing arithmetic sequence', () => {
    fc.assert(
      fc.property(
        intersectingEntriesArb.filter(({ items }) => items.length >= 2),
        ({ entries }) => {
          const results = processAnimationEntries(entries, STAGGER_DELAY);

          for (let i = 1; i < results.length; i++) {
            const diff = results[i].delay - results[i - 1].delay;
            expect(diff).toBe(STAGGER_DELAY);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 7: Scroll animation is idempotent
 *
 * For any element that has already been animated, triggering the intersection
 * callback again should not re-add or re-trigger the animation class. The
 * element should retain its `scroll-animated` sentinel class and not be
 * processed again.
 *
 * **Validates: Requirements 8.4**
 */

/** Tailwind final-state classes per effect */
const EFFECT_FINAL_CLASSES: Record<string, string[]> = {
  fadeIn: ['opacity-100'],
  fadeInLeft: ['opacity-100', 'translate-x-0'],
  fadeInRight: ['opacity-100', 'translate-x-0'],
  fadeInUp: ['opacity-100', 'translate-y-0'],
};

describe('Property 7: Scroll animation is idempotent', () => {
  it('already-animated elements are excluded from processAnimationEntries results', () => {
    fc.assert(
      fc.property(
        fc.array(effectArb, { minLength: 1, maxLength: 50 }),
        (effects) => {
          // Create elements and animate them (first pass)
          const elements = effects.map((effect) => {
            const el = document.createElement('div');
            el.setAttribute('data-animate-effect', effect);
            return { el, effect };
          });

          const entries = elements.map(({ el }) => ({
            isIntersecting: true,
            target: el,
          }));

          // First call — all elements should be returned
          const firstResults = processAnimationEntries(entries, STAGGER_DELAY);
          expect(firstResults).toHaveLength(elements.length);

          // Apply animation to each element (simulates what the hook does)
          for (const r of firstResults) {
            applyAnimation(r.element, r.effect);
          }

          // Second call with the same entries — no elements should be returned
          const secondResults = processAnimationEntries(entries, STAGGER_DELAY);
          expect(secondResults).toHaveLength(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('animated elements retain their Tailwind classes after repeated processing', () => {
    fc.assert(
      fc.property(
        effectArb,
        fc.integer({ min: 2, max: 10 }),
        (effect, repeatCount) => {
          const el = document.createElement('div');
          el.setAttribute('data-animate-effect', effect);

          // Animate the element
          applyAnimation(el, effect);

          // Sentinel class applied
          expect(el.classList.contains('scroll-animated')).toBe(true);
          // Final-state Tailwind classes applied
          const finalClasses = EFFECT_FINAL_CLASSES[effect];
          for (const cls of finalClasses) {
            expect(el.classList.contains(cls)).toBe(true);
          }

          // Trigger processAnimationEntries multiple times
          for (let i = 0; i < repeatCount; i++) {
            const results = processAnimationEntries(
              [{ isIntersecting: true, target: el }],
              STAGGER_DELAY,
            );
            expect(results).toHaveLength(0);
          }

          // Element still has exactly the same classes
          expect(el.classList.contains('scroll-animated')).toBe(true);
          for (const cls of finalClasses) {
            expect(el.classList.contains(cls)).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('mix of animated and non-animated elements: only non-animated are processed', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(effectArb, fc.boolean()), { minLength: 1, maxLength: 50 }),
        (pairs) => {
          const elements = pairs.map(([effect, preAnimated]) => {
            const el = document.createElement('div');
            el.setAttribute('data-animate-effect', effect);
            if (preAnimated) {
              applyAnimation(el, effect);
            }
            return { el, effect, preAnimated };
          });

          const entries = elements.map(({ el }) => ({
            isIntersecting: true,
            target: el,
          }));

          const results = processAnimationEntries(entries, STAGGER_DELAY);

          const notYetAnimated = elements.filter((e) => !e.preAnimated);
          expect(results).toHaveLength(notYetAnimated.length);

          // Each result corresponds to a non-animated element in order
          for (let k = 0; k < results.length; k++) {
            expect(results[k].element).toBe(notYetAnimated[k].el);
            expect(results[k].effect).toBe(notYetAnimated[k].effect);
            expect(results[k].delay).toBe(k * STAGGER_DELAY);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
