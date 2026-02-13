import { describe, it, expect } from 'vitest';
import { processAnimationEntries, applyAnimation } from './useScrollAnimation';

/**
 * Unit tests for the extracted pure functions in useScrollAnimation.
 * The React hook itself is tested indirectly through component tests;
 * these tests focus on the core animation logic.
 */

function makeElement(attrs?: {
  effect?: string;
  alreadyAnimated?: boolean;
}): Element {
  const el = document.createElement('div');
  if (attrs?.effect) {
    el.setAttribute('data-animate-effect', attrs.effect);
  }
  if (attrs?.alreadyAnimated) {
    el.classList.add('scroll-animated');
  }
  return el;
}

function makeEntry(
  el: Element,
  isIntersecting: boolean,
): { isIntersecting: boolean; target: Element } {
  return { isIntersecting, target: el };
}

describe('processAnimationEntries', () => {
  it('returns empty array when no entries are intersecting', () => {
    const el = makeElement({ effect: 'fadeInUp' });
    const result = processAnimationEntries(
      [makeEntry(el, false)],
      100,
    );
    expect(result).toEqual([]);
  });

  it('returns action for intersecting element with correct effect', () => {
    const el = makeElement({ effect: 'fadeInLeft' });
    const result = processAnimationEntries(
      [makeEntry(el, true)],
      100,
    );
    expect(result).toHaveLength(1);
    expect(result[0].element).toBe(el);
    expect(result[0].effect).toBe('fadeInLeft');
    expect(result[0].delay).toBe(0);
  });

  it('defaults to fadeInUp when no data-animate-effect attribute', () => {
    const el = makeElement();
    const result = processAnimationEntries(
      [makeEntry(el, true)],
      100,
    );
    expect(result[0].effect).toBe('fadeInUp');
  });

  it('skips already-animated elements (idempotence)', () => {
    const el = makeElement({ effect: 'fadeIn', alreadyAnimated: true });
    const result = processAnimationEntries(
      [makeEntry(el, true)],
      100,
    );
    expect(result).toEqual([]);
  });

  it('applies stagger delay to sibling elements', () => {
    const el1 = makeElement({ effect: 'fadeInUp' });
    const el2 = makeElement({ effect: 'fadeInLeft' });
    const el3 = makeElement({ effect: 'fadeInRight' });

    const result = processAnimationEntries(
      [
        makeEntry(el1, true),
        makeEntry(el2, true),
        makeEntry(el3, true),
      ],
      100,
    );

    expect(result).toHaveLength(3);
    expect(result[0].delay).toBe(0);
    expect(result[1].delay).toBe(100);
    expect(result[2].delay).toBe(200);
  });

  it('skips non-intersecting entries in stagger count', () => {
    const el1 = makeElement({ effect: 'fadeInUp' });
    const el2 = makeElement({ effect: 'fadeInLeft' });
    const el3 = makeElement({ effect: 'fadeInRight' });

    const result = processAnimationEntries(
      [
        makeEntry(el1, true),
        makeEntry(el2, false), // not intersecting
        makeEntry(el3, true),
      ],
      100,
    );

    expect(result).toHaveLength(2);
    expect(result[0].delay).toBe(0);
    expect(result[1].delay).toBe(100);
  });

  it('handles empty entries array', () => {
    const result = processAnimationEntries([], 100);
    expect(result).toEqual([]);
  });

  it('uses custom stagger delay value', () => {
    const el1 = makeElement({ effect: 'fadeIn' });
    const el2 = makeElement({ effect: 'fadeIn' });

    const result = processAnimationEntries(
      [makeEntry(el1, true), makeEntry(el2, true)],
      250,
    );

    expect(result[0].delay).toBe(0);
    expect(result[1].delay).toBe(250);
  });
});

describe('applyAnimation', () => {
  it('adds scroll-animated sentinel and Tailwind final-state classes for fadeInUp', () => {
    const el = makeElement({ effect: 'fadeInUp' });
    // Simulate initial hidden state that the hook would set up
    el.classList.add('opacity-0', 'translate-y-8');

    applyAnimation(el, 'fadeInUp');

    expect(el.classList.contains('scroll-animated')).toBe(true);
    // Final-state classes added
    expect(el.classList.contains('opacity-100')).toBe(true);
    expect(el.classList.contains('translate-y-0')).toBe(true);
    // Initial hidden-state classes removed
    expect(el.classList.contains('opacity-0')).toBe(false);
    expect(el.classList.contains('translate-y-8')).toBe(false);
  });

  it('adds correct Tailwind classes for fadeIn effect', () => {
    const el = makeElement({ effect: 'fadeIn' });
    el.classList.add('opacity-0');

    applyAnimation(el, 'fadeIn');

    expect(el.classList.contains('scroll-animated')).toBe(true);
    expect(el.classList.contains('opacity-100')).toBe(true);
    expect(el.classList.contains('opacity-0')).toBe(false);
  });

  it('adds correct Tailwind classes for fadeInLeft effect', () => {
    const el = makeElement({ effect: 'fadeInLeft' });
    el.classList.add('opacity-0', '-translate-x-8');

    applyAnimation(el, 'fadeInLeft');

    expect(el.classList.contains('scroll-animated')).toBe(true);
    expect(el.classList.contains('opacity-100')).toBe(true);
    expect(el.classList.contains('translate-x-0')).toBe(true);
    expect(el.classList.contains('opacity-0')).toBe(false);
    expect(el.classList.contains('-translate-x-8')).toBe(false);
  });

  it('adds correct Tailwind classes for fadeInRight effect', () => {
    const el = makeElement({ effect: 'fadeInRight' });
    el.classList.add('opacity-0', 'translate-x-8');

    applyAnimation(el, 'fadeInRight');

    expect(el.classList.contains('scroll-animated')).toBe(true);
    expect(el.classList.contains('opacity-100')).toBe(true);
    expect(el.classList.contains('translate-x-0')).toBe(true);
    expect(el.classList.contains('opacity-0')).toBe(false);
    expect(el.classList.contains('translate-x-8')).toBe(false);
  });

  it('does not remove existing unrelated classes', () => {
    const el = makeElement();
    el.classList.add('animate-box', 'opacity-0', 'translate-y-8');

    applyAnimation(el, 'fadeInUp');

    expect(el.classList.contains('animate-box')).toBe(true);
    expect(el.classList.contains('scroll-animated')).toBe(true);
    expect(el.classList.contains('opacity-100')).toBe(true);
  });
});
