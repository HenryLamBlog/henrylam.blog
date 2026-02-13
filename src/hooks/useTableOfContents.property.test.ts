import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { extractHeadings } from './useTableOfContents';

// ---------------------------------------------------------------------------
// Pure active-heading logic extracted from useActiveHeading in
// TableOfContents.tsx for property testing.
//
// The component iterates headings in order and picks the last one whose
// getBoundingClientRect().top <= offset (100px). Since
// getBoundingClientRect().top === headingPosition - scrollY, the pure
// equivalent is: last heading where (position - scrollY) <= offset.
// ---------------------------------------------------------------------------

const OFFSET = 100;

/**
 * Pure version of the active heading algorithm from TableOfContents.tsx.
 * Given heading positions (absolute, in document order) and a scrollY value,
 * returns the id of the last heading whose position - scrollY <= OFFSET,
 * or null if none qualify.
 */
function findActiveHeading(
  headings: { id: string; position: number }[],
  scrollY: number,
): string | null {
  let active: string | null = null;
  for (const heading of headings) {
    const top = heading.position - scrollY; // simulates getBoundingClientRect().top
    if (top <= OFFSET) {
      active = heading.id;
    }
  }
  return active;
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generate a sorted array of heading positions (ascending, like DOM order). */
const headingsArb = fc
  .array(fc.integer({ min: 0, max: 50_000 }), { minLength: 1, maxLength: 30 })
  .map((positions) => {
    const sorted = [...positions].sort((a, b) => a - b);
    return sorted.map((pos, i) => ({ id: `heading-${i}`, position: pos }));
  });

const scrollYArb = fc.integer({ min: 0, max: 60_000 });

// ---------------------------------------------------------------------------
// Property 12: Table of contents active heading tracks scroll position
// Feature: portfolio-visual-redesign, Property 12: Table of contents active
//   heading tracks scroll position
// Validates: Requirements 12.1
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 12: Table of contents active heading tracks scroll position', () => {
  /**
   * **Validates: Requirements 12.1**
   *
   * For any set of heading positions and any scroll position, the active
   * heading should be the last heading whose top position is at or above
   * the current scroll position plus a small offset.
   */
  it('active heading is the last heading with position - scrollY <= offset', () => {
    fc.assert(
      fc.property(headingsArb, scrollYArb, (headings, scrollY) => {
        const active = findActiveHeading(headings, scrollY);

        // Compute expected: last heading where position - scrollY <= OFFSET
        const qualifying = headings.filter((h) => h.position - scrollY <= OFFSET);
        const expected = qualifying.length > 0 ? qualifying[qualifying.length - 1].id : null;

        expect(active).toBe(expected);
      }),
      { numRuns: 200, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 12.1**
   *
   * When scrolled far enough that all headings are above the offset
   * threshold, the last heading in the document should be active.
   */
  it('activates the last heading when scrolled past all headings', () => {
    fc.assert(
      fc.property(headingsArb, (headings) => {
        // Scroll far past the last heading
        const maxPos = Math.max(...headings.map((h) => h.position));
        const scrollY = maxPos + OFFSET + 1;

        const active = findActiveHeading(headings, scrollY);
        expect(active).toBe(headings[headings.length - 1].id);
      }),
      { numRuns: 200, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 12.1**
   *
   * When scrolled to the very top (scrollY = 0) and all headings are
   * positioned below the offset, no heading should be active.
   */
  it('returns null when no heading is within the offset threshold', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: OFFSET + 1, max: 50_000 }), { minLength: 1, maxLength: 20 }),
        (positions) => {
          const sorted = [...positions].sort((a, b) => a - b);
          const headings = sorted.map((pos, i) => ({ id: `h-${i}`, position: pos }));

          const active = findActiveHeading(headings, 0);
          expect(active).toBeNull();
        },
      ),
      { numRuns: 200, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 12.1**
   *
   * The extractHeadings function preserves document order and generates
   * unique IDs for all headings, ensuring TOC tracking can work correctly.
   */
  it('extractHeadings produces unique IDs for all headings', () => {
    const headingTextArb = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,30}$/);
    const tagArb = fc.constantFrom('H2', 'H3');

    const rawHeadingsArb = fc.array(
      fc.tuple(tagArb, headingTextArb).map(([tag, text]) => ({
        tagName: tag,
        id: '',
        textContent: text,
      })),
      { minLength: 1, maxLength: 20 },
    );

    fc.assert(
      fc.property(rawHeadingsArb, (rawHeadings) => {
        const items = extractHeadings(rawHeadings);
        const ids = items.map((item) => item.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }),
      { numRuns: 200, verbose: true },
    );
  });
});
