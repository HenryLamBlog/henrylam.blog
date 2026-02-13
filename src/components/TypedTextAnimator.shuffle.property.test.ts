import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { fisherYatesShuffle } from './TypedTextAnimator';

/**
 * Property 2: Shuffle preserves all elements
 *
 * For any array of descriptor strings, shuffling the array should produce a
 * result that contains exactly the same elements as the original (same length,
 * same multiset of values), just in a potentially different order.
 *
 * **Validates: Requirements 3.4**
 */

describe('Property 2: Shuffle preserves all elements', () => {
  it('shuffled array has the same length as the original', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 30 }), { minLength: 0, maxLength: 20 }),
        (arr) => {
          const shuffled = fisherYatesShuffle(arr);
          expect(shuffled.length).toBe(arr.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('shuffled array contains exactly the same multiset of elements', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 30 }), { minLength: 0, maxLength: 20 }),
        (arr) => {
          const shuffled = fisherYatesShuffle(arr);
          expect([...shuffled].sort()).toEqual([...arr].sort());
        },
      ),
      { numRuns: 100 },
    );
  });

  it('does not mutate the original array', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 30 }), { minLength: 1, maxLength: 20 }),
        (arr) => {
          const original = [...arr];
          fisherYatesShuffle(arr);
          expect(arr).toEqual(original);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('handles arrays with duplicate elements correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('a', 'b', 'c'), { minLength: 0, maxLength: 20 }),
        (arr) => {
          const shuffled = fisherYatesShuffle(arr);
          expect(shuffled.length).toBe(arr.length);
          expect([...shuffled].sort()).toEqual([...arr].sort());
        },
      ),
      { numRuns: 100 },
    );
  });
});
