import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as animations from './animation';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

interface TransitionWithEase {
  variantName: string;
  stateName: string;
  ease: unknown;
}

/**
 * Recursively extract all transition objects that contain an `ease` property
 * from the exported animation variants. Returns a flat list with provenance
 * labels so failures are easy to trace.
 *
 * Intentional exclusions:
 * - `pageTransition.exit` uses `ease: 'easeIn'` (exit animation, by design)
 */
function collectTransitionsWithEase(): TransitionWithEase[] {
  const results: TransitionWithEase[] = [];

  for (const [name, value] of Object.entries(animations)) {
    if (name === 'EASE_OUT_EXPO') continue; // skip the constant itself

    if (value && typeof value === 'object') {
      // Could be a Variants object (keyed by state name) or a plain object
      // like hoverScale / tapScale.
      const states = hasNestedStates(value)
        ? Object.entries(value)
        : [['(root)', value] as const];

      for (const [stateName, stateValue] of states) {
        if (!stateValue || typeof stateValue !== 'object') continue;
        const sv = stateValue as Record<string, unknown>;

        // Check the state-level transition
        if (sv.transition && typeof sv.transition === 'object') {
          const t = sv.transition as Record<string, unknown>;
          if ('ease' in t) {
            // Skip the intentional exception
            if (name === 'pageTransition' && stateName === 'exit') continue;
            results.push({ variantName: name, stateName, ease: t.ease });
          }
        }
      }

      // Also handle top-level transition (e.g. defaultTransition, hoverScale)
      const v = value as Record<string, unknown>;
      if (v.ease !== undefined && !hasNestedStates(value)) {
        results.push({ variantName: name, stateName: '(top-level)', ease: v.ease });
      }
    }
  }

  return results;
}

/**
 * Heuristic: a value is a Variants-style object if it has string keys whose
 * values are objects (state definitions). Plain transition/motion objects like
 * `hoverScale` also have object values, but their keys are motion properties
 * (scale, transition, etc.) rather than state names.
 */
function hasNestedStates(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj as Record<string, unknown>);
  // Variants objects use state names like hidden/visible, initial/animate/exit,
  // rest/hover. If any key maps to an object with `opacity`, `transition`,
  // `scale`, `x`, `y`, etc., it's likely a variant state.
  const stateIndicators = [
    'hidden', 'visible', 'initial', 'animate', 'exit', 'rest', 'hover',
  ];
  return keys.some((k) => stateIndicators.includes(k));
}

const transitionsWithEase = collectTransitionsWithEase();

// ---------------------------------------------------------------------------
// Property 9: Consistent easing curve across all animation variants
// Feature: portfolio-visual-redesign, Property 9: Consistent easing curve
//   across all animation variants
// Validates: Requirements 8.3
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 9: Consistent easing curve across all animation variants', () => {
  /**
   * **Validates: Requirements 8.3**
   *
   * For any Framer Motion variant exported from animation.ts that defines a
   * transition with an `ease` property, the ease value should be the
   * EASE_OUT_EXPO constant [0.16, 1, 0.3, 1].
   *
   * Excluded: pageTransition.exit (intentionally uses 'easeIn'),
   * tapScale (no ease), staggerContainer (no ease).
   */
  it('every transition ease value equals EASE_OUT_EXPO [0.16, 1, 0.3, 1]', () => {
    // Sanity: we should have transitions to test
    expect(transitionsWithEase.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.constantFrom(...transitionsWithEase),
        (entry: TransitionWithEase) => {
          expect(
            entry.ease,
            `${entry.variantName}.${entry.stateName} ease should be EASE_OUT_EXPO`,
          ).toEqual(EASE_OUT_EXPO);
        },
      ),
      {
        numRuns: 100,
        verbose: true,
      },
    );
  });
});
