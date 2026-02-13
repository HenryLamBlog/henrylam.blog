import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import TypedTextAnimator, {
  fisherYatesShuffle,
  stepTypedState,
  getStepDelay,
} from './TypedTextAnimator';
import type { TypedState } from './TypedTextAnimator';

// --- Pure function tests ---

describe('fisherYatesShuffle', () => {
  it('returns a new array with the same elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = fisherYatesShuffle(input);
    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual([...input].sort());
  });

  it('does not mutate the original array', () => {
    const input = ['x', 'y', 'z'];
    const copy = [...input];
    fisherYatesShuffle(input);
    expect(input).toEqual(copy);
  });

  it('returns an empty array for empty input', () => {
    expect(fisherYatesShuffle([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(fisherYatesShuffle(['only'])).toEqual(['only']);
  });
});

describe('stepTypedState', () => {
  const baseState: TypedState = {
    displayText: '',
    wordIndex: 0,
    phase: 'typing',
    words: ['Hello', 'World'],
    cycle: 0,
  };

  it('types one character at a time during typing phase', () => {
    const s1 = stepTypedState(baseState);
    expect(s1.displayText).toBe('H');
    expect(s1.phase).toBe('typing');

    const s2 = stepTypedState(s1);
    expect(s2.displayText).toBe('He');
  });

  it('transitions from typing to pausing when word is complete', () => {
    const fullyTyped: TypedState = { ...baseState, displayText: 'Hello' };
    const next = stepTypedState(fullyTyped);
    expect(next.phase).toBe('pausing');
    expect(next.displayText).toBe('Hello');
  });

  it('transitions from pausing to erasing', () => {
    const pausing: TypedState = { ...baseState, displayText: 'Hello', phase: 'pausing' };
    const next = stepTypedState(pausing);
    expect(next.phase).toBe('erasing');
  });

  it('erases one character at a time during erasing phase', () => {
    const erasing: TypedState = { ...baseState, displayText: 'Hel', phase: 'erasing' };
    const s1 = stepTypedState(erasing);
    expect(s1.displayText).toBe('He');
    expect(s1.phase).toBe('erasing');
  });

  it('transitions from erasing to next when fully erased', () => {
    const lastChar: TypedState = { ...baseState, displayText: '', phase: 'erasing' };
    const next = stepTypedState(lastChar);
    expect(next.phase).toBe('next');
  });

  it('advances to next word on next phase', () => {
    const nextPhase: TypedState = { ...baseState, phase: 'next' };
    const next = stepTypedState(nextPhase);
    expect(next.wordIndex).toBe(1);
    expect(next.phase).toBe('typing');
    expect(next.displayText).toBe('');
    expect(next.cycle).toBe(0);
  });

  it('increments cycle when all words exhausted', () => {
    const lastWord: TypedState = { ...baseState, wordIndex: 1, phase: 'next' };
    const next = stepTypedState(lastWord);
    expect(next.wordIndex).toBe(0);
    expect(next.phase).toBe('typing');
    expect(next.cycle).toBe(1);
  });
});

describe('getStepDelay', () => {
  it('returns typingSpeed for typing phase', () => {
    const state: TypedState = { displayText: 'H', wordIndex: 0, phase: 'typing', words: ['Hi'], cycle: 0 };
    expect(getStepDelay(state, 150, 75, 1000)).toBe(150);
  });

  it('returns pauseDuration for pausing phase', () => {
    const state: TypedState = { displayText: 'Hi', wordIndex: 0, phase: 'pausing', words: ['Hi'], cycle: 0 };
    expect(getStepDelay(state, 150, 75, 1000)).toBe(1000);
  });

  it('returns erasingSpeed for erasing phase', () => {
    const state: TypedState = { displayText: 'H', wordIndex: 0, phase: 'erasing', words: ['Hi'], cycle: 0 };
    expect(getStepDelay(state, 150, 75, 1000)).toBe(75);
  });

  it('returns 0 for next phase', () => {
    const state: TypedState = { displayText: '', wordIndex: 0, phase: 'next', words: ['Hi'], cycle: 0 };
    expect(getStepDelay(state, 150, 75, 1000)).toBe(0);
  });
});

// --- Component integration tests ---

describe('TypedTextAnimator component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders empty initially', () => {
    const { container } = render(
      <TypedTextAnimator strings={['Hi']} typingSpeed={100} erasingSpeed={50} pauseDuration={500} />,
    );
    expect(container.querySelector('span')!.textContent).toBe('');
  });

  it('types out the first character after typingSpeed delay', () => {
    const { container } = render(
      <TypedTextAnimator strings={['Hi']} typingSpeed={100} erasingSpeed={50} pauseDuration={500} />,
    );

    act(() => { vi.advanceTimersByTime(100); }); // first tick: types 'H'
    expect(container.querySelector('span')!.textContent).toBe('H');
  });

  it('fully types a word then starts erasing after pause', () => {
    const { container } = render(
      <TypedTextAnimator strings={['Hi']} typingSpeed={100} erasingSpeed={50} pauseDuration={500} />,
    );
    const span = container.querySelector('span')!;

    // Type 'H' (100ms) + 'i' (100ms) = 200ms
    act(() => { vi.advanceTimersByTime(100); });
    expect(span.textContent).toBe('H');
    act(() => { vi.advanceTimersByTime(100); });
    expect(span.textContent).toBe('Hi');

    // Next tick: typing phase sees word complete → transitions to pausing
    act(() => { vi.advanceTimersByTime(100); });
    expect(span.textContent).toBe('Hi'); // still showing full word

    // Pause duration tick: pausing → erasing phase transition (no char removed yet)
    act(() => { vi.advanceTimersByTime(500); });
    expect(span.textContent).toBe('Hi');

    // First erase tick (erasingSpeed=50ms): erases one char
    act(() => { vi.advanceTimersByTime(50); });
    expect(span.textContent).toBe('H');

    // Second erase tick: erases last char
    act(() => { vi.advanceTimersByTime(50); });
    expect(span.textContent).toBe('');
  });

  it('renders nothing when strings is empty', () => {
    const { container } = render(
      <TypedTextAnimator strings={[]} typingSpeed={100} erasingSpeed={50} pauseDuration={500} />,
    );
    expect(container.querySelector('span')!.textContent).toBe('');
  });
});
