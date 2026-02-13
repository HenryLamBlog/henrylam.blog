import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { stepTypedState } from './TypedTextAnimator';
import type { TypedState } from './TypedTextAnimator';

/**
 * Property 1: Typed text state machine produces correct character sequence
 *
 * For any list of descriptor strings and any point in the animation cycle,
 * the displayed text should be a substring of the current descriptor — either
 * a progressively longer prefix (typing phase) or a progressively shorter
 * prefix (erasing phase) — and the animator should never display characters
 * not belonging to the current descriptor.
 *
 * **Validates: Requirements 3.3**
 */

/** Arbitrary for a non-empty list of non-empty descriptor strings */
const wordsArb = fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
  minLength: 1,
  maxLength: 10,
});


describe('Property 1: Typed text state machine produces correct character sequence', () => {
  it('displayText is always a prefix of the current word during typing and erasing', () => {
    fc.assert(
      fc.property(
        wordsArb,
        fc.integer({ min: 1, max: 200 }),
        (words, steps) => {
          let state: TypedState = {
            displayText: '',
            wordIndex: 0,
            phase: 'typing',
            words,
            cycle: 0,
          };

          for (let i = 0; i < steps; i++) {
            state = stepTypedState(state);
            const currentWord = state.words[state.wordIndex] ?? '';

            // The displayed text must always be a prefix of the current word
            expect(currentWord.startsWith(state.displayText)).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('typing phase increases displayText length by exactly 1 when word is not complete', () => {
    fc.assert(
      fc.property(
        wordsArb,
        fc.integer({ min: 0, max: 50 }),
        (words, stepsToAdvance) => {
          let state: TypedState = {
            displayText: '',
            wordIndex: 0,
            phase: 'typing',
            words,
            cycle: 0,
          };

          // Advance to some point in the animation
          for (let i = 0; i < stepsToAdvance; i++) {
            state = stepTypedState(state);
          }

          // Now find a typing state where the word isn't fully typed
          if (state.phase === 'typing') {
            const currentWord = state.words[state.wordIndex] ?? '';
            if (state.displayText.length < currentWord.length) {
              const prevLen = state.displayText.length;
              const next = stepTypedState(state);
              expect(next.displayText.length).toBe(prevLen + 1);
              expect(next.phase).toBe('typing');
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('erasing phase decreases displayText length by exactly 1 when text remains', () => {
    fc.assert(
      fc.property(
        wordsArb,
        (words) => {
          const currentWord = words[0];
          // Start in erasing phase with the full word displayed
          let state: TypedState = {
            displayText: currentWord,
            wordIndex: 0,
            phase: 'erasing',
            words,
            cycle: 0,
          };

          // Step through the entire erasing sequence
          while (state.displayText.length > 0) {
            const prevLen = state.displayText.length;
            const next = stepTypedState(state);
            expect(next.displayText.length).toBe(prevLen - 1);
            expect(next.phase).toBe('erasing');
            // The displayed text is still a prefix of the current word
            expect(currentWord.startsWith(next.displayText)).toBe(true);
            state = next;
          }

          // Once empty, next step transitions to 'next' phase
          const afterEmpty = stepTypedState(state);
          expect(afterEmpty.phase).toBe('next');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('a full type-pause-erase cycle for a word produces correct prefix sequence', () => {
    fc.assert(
      fc.property(
        wordsArb,
        fc.integer({ min: 0, max: 9 }),
        (words, wordIdx) => {
          const safeIdx = wordIdx % words.length;
          const currentWord = words[safeIdx];

          // Start typing from empty
          let state: TypedState = {
            displayText: '',
            wordIndex: safeIdx,
            phase: 'typing',
            words,
            cycle: 0,
          };

          // Type the entire word — each step adds one character prefix
          for (let c = 1; c <= currentWord.length; c++) {
            state = stepTypedState(state);
            expect(state.displayText).toBe(currentWord.slice(0, c));
            expect(state.phase).toBe(c < currentWord.length ? 'typing' : 'typing');
          }

          // After fully typed, next step transitions to pausing
          if (state.displayText.length === currentWord.length) {
            state = stepTypedState(state);
            expect(state.phase).toBe('pausing');
            expect(state.displayText).toBe(currentWord);
          }

          // Pausing → erasing
          state = stepTypedState(state);
          expect(state.phase).toBe('erasing');
          expect(state.displayText).toBe(currentWord);

          // Erase the entire word — each step removes one character from end
          for (let c = currentWord.length - 1; c >= 0; c--) {
            state = stepTypedState(state);
            expect(state.displayText).toBe(currentWord.slice(0, c));
          }

          // After fully erased, transitions to 'next'
          state = stepTypedState(state);
          expect(state.phase).toBe('next');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('displayText never contains characters outside the current word', () => {
    fc.assert(
      fc.property(
        wordsArb,
        fc.integer({ min: 1, max: 300 }),
        (words, steps) => {
          let state: TypedState = {
            displayText: '',
            wordIndex: 0,
            phase: 'typing',
            words,
            cycle: 0,
          };

          for (let i = 0; i < steps; i++) {
            state = stepTypedState(state);
            const currentWord = state.words[state.wordIndex] ?? '';

            if (state.displayText.length > 0) {
              // displayText must be a prefix of the current word
              expect(currentWord.startsWith(state.displayText)).toBe(true);
              // displayText length must not exceed the current word length
              expect(state.displayText.length).toBeLessThanOrEqual(
                currentWord.length,
              );
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('cycle counter increments exactly when all words have been visited', () => {
    fc.assert(
      fc.property(
        wordsArb,
        (words) => {
          let state: TypedState = {
            displayText: '',
            wordIndex: 0,
            phase: 'typing',
            words,
            cycle: 0,
          };

          // Step through until we complete one full cycle
          const maxSteps = words.reduce((sum, w) => sum + w.length * 2 + 3, 0) * 2;
          let prevCycle = 0;

          for (let i = 0; i < maxSteps; i++) {
            state = stepTypedState(state);
            if (state.cycle > prevCycle) {
              // Cycle incremented — wordIndex should be reset to 0
              expect(state.wordIndex).toBe(0);
              expect(state.phase).toBe('typing');
              expect(state.displayText).toBe('');
              prevCycle = state.cycle;
              break;
            }
          }

          // We should have completed at least one cycle
          expect(prevCycle).toBe(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});
