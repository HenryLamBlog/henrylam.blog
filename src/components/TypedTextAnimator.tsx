import { useState, useEffect, useCallback, useRef } from 'react';

// --- Pure, testable functions ---

/**
 * Fisher-Yates shuffle. Returns a new shuffled array without mutating the input.
 */
export function fisherYatesShuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Phases of the typing state machine */
export type TypedPhase = 'typing' | 'pausing' | 'erasing' | 'next';

/** Immutable snapshot of the state machine */
export interface TypedState {
  /** Current displayed text */
  displayText: string;
  /** Index into the current word list */
  wordIndex: number;
  /** Current phase */
  phase: TypedPhase;
  /** The ordered list of words for the current cycle */
  words: readonly string[];
  /** Number of completed full cycles (used to detect when to reshuffle) */
  cycle: number;
}

/**
 * Pure state-machine step function. Given the current state, returns the next
 * state. This is deterministic and has no side effects — the caller is
 * responsible for scheduling the next step with the appropriate delay and
 * for reshuffling when a new cycle begins.
 */
export function stepTypedState(state: TypedState): TypedState {
  const currentWord = state.words[state.wordIndex] ?? '';

  switch (state.phase) {
    case 'typing': {
      if (state.displayText.length < currentWord.length) {
        // Type one more character
        return {
          ...state,
          displayText: currentWord.slice(0, state.displayText.length + 1),
        };
      }
      // Word fully typed — transition to pause
      return { ...state, phase: 'pausing' };
    }

    case 'pausing': {
      // After pause, start erasing
      return { ...state, phase: 'erasing' };
    }

    case 'erasing': {
      if (state.displayText.length > 0) {
        // Erase one character
        return {
          ...state,
          displayText: state.displayText.slice(0, -1),
        };
      }
      // Fully erased — move to next word
      return { ...state, phase: 'next' };
    }

    case 'next': {
      const nextIndex = state.wordIndex + 1;
      if (nextIndex < state.words.length) {
        // Move to next word in current cycle
        return {
          ...state,
          wordIndex: nextIndex,
          phase: 'typing',
          displayText: '',
        };
      }
      // Cycle complete — bump cycle counter, reset index
      // The caller should reshuffle `words` when it sees cycle increment
      return {
        ...state,
        wordIndex: 0,
        phase: 'typing',
        displayText: '',
        cycle: state.cycle + 1,
      };
    }
  }
}

/**
 * Returns the delay (in ms) that should elapse before the next step,
 * based on the current state's phase.
 */
export function getStepDelay(
  state: TypedState,
  typingSpeed: number,
  erasingSpeed: number,
  pauseDuration: number,
): number {
  switch (state.phase) {
    case 'typing':
      return typingSpeed;
    case 'pausing':
      return pauseDuration;
    case 'erasing':
      return erasingSpeed;
    case 'next':
      return 0; // immediately advance to typing
  }
}

// --- React component ---

export interface TypedTextAnimatorProps {
  /** List of descriptors to cycle through */
  strings: string[];
  /** Milliseconds per character when typing (default 150) */
  typingSpeed?: number;
  /** Milliseconds per character when erasing (default 75) */
  erasingSpeed?: number;
  /** Milliseconds to pause after typing a word (default 1000) */
  pauseDuration?: number;
}

export default function TypedTextAnimator({
  strings,
  typingSpeed = 150,
  erasingSpeed = 75,
  pauseDuration = 1000,
}: TypedTextAnimatorProps) {
  const [displayText, setDisplayText] = useState('');
  const stateRef = useRef<TypedState | null>(null);

  // Build initial shuffled word list
  const initState = useCallback((): TypedState => {
    const shuffled = fisherYatesShuffle(strings);
    return {
      displayText: '',
      wordIndex: 0,
      phase: 'typing',
      words: shuffled,
      cycle: 0,
    };
  }, [strings]);

  useEffect(() => {
    if (strings.length === 0) return;

    let state = stateRef.current ?? initState();
    stateRef.current = state;
    let timerId: ReturnType<typeof setTimeout>;

    function tick() {
      let prevCycle = state.cycle;
      state = stepTypedState(state);

      // If cycle incremented, reshuffle
      if (state.cycle !== prevCycle) {
        state = { ...state, words: fisherYatesShuffle(strings) };
      }

      stateRef.current = state;
      setDisplayText(state.displayText);

      const delay = getStepDelay(state, typingSpeed, erasingSpeed, pauseDuration);
      timerId = setTimeout(tick, delay);
    }

    // Kick off the first tick
    const delay = getStepDelay(state, typingSpeed, erasingSpeed, pauseDuration);
    timerId = setTimeout(tick, delay);

    return () => clearTimeout(timerId);
  }, [strings, typingSpeed, erasingSpeed, pauseDuration, initState]);

  return <span>{displayText}</span>;
}
