import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export interface UseScrollRevealOptions {
  /** Animate only once — default: true */
  once?: boolean;
  /** Viewport intersection threshold — default: 0.15 */
  amount?: number;
}

/**
 * Scroll-triggered animation hook built on Framer Motion's `useInView`.
 *
 * Returns a `ref` to attach to the target element and an `isInView` boolean
 * that flips to `true` when the element enters the viewport.
 *
 * When the user prefers reduced motion, `isInView` is always `true` so
 * content renders in its final state immediately.
 */
export function useScrollReveal(options?: UseScrollRevealOptions) {
  const { once = true, amount = 0.15 } = options ?? {};
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once, amount });

  return {
    ref,
    isInView: prefersReducedMotion ? true : isInView,
  };
}
