import { useEffect, useRef } from 'react';

/** Valid animation effect names mapped to Tailwind transition classes */
export type AnimationEffect = 'fadeIn' | 'fadeInLeft' | 'fadeInRight' | 'fadeInUp';

/** Sentinel class marking an element as already animated */
const ANIMATED_CLASS = 'scroll-animated';

/**
 * Maps animation effect names to Tailwind classes applied when the element
 * becomes visible. Elements start with `opacity-0` and a translate offset;
 * these classes transition them to their final position.
 */
const EFFECT_CLASSES: Record<AnimationEffect, string[]> = {
  fadeIn: ['opacity-100'],
  fadeInLeft: ['opacity-100', 'translate-x-0'],
  fadeInRight: ['opacity-100', 'translate-x-0'],
  fadeInUp: ['opacity-100', 'translate-y-0'],
};

/**
 * Initial (hidden) classes applied to elements before they scroll into view.
 * These set up the starting state for the transition.
 */
const INITIAL_CLASSES: Record<AnimationEffect, string[]> = {
  fadeIn: ['opacity-0'],
  fadeInLeft: ['opacity-0', '-translate-x-8'],
  fadeInRight: ['opacity-0', 'translate-x-8'],
  fadeInUp: ['opacity-0', 'translate-y-8'],
};

/** Transition utility classes added to every animated element */
const TRANSITION_CLASSES = ['transition-all', 'duration-500', 'ease-out'];

/**
 * Determines which elements need animation from a set of IntersectionObserver entries.
 * Returns an array of { element, effect, delay } objects for elements that are
 * intersecting and haven't been animated yet.
 *
 * This is extracted as a pure function for testability (used by property tests).
 */
export function processAnimationEntries(
  entries: { isIntersecting: boolean; target: Element }[],
  staggerDelay: number,
): { element: Element; effect: string; delay: number }[] {
  const results: { element: Element; effect: string; delay: number }[] = [];
  let staggerIndex = 0;

  for (const entry of entries) {
    if (!entry.isIntersecting) continue;

    const el = entry.target;

    // Skip already-animated elements (idempotence)
    if (el.classList.contains(ANIMATED_CLASS)) continue;

    const effect = el.getAttribute('data-animate-effect') || 'fadeInUp';
    results.push({
      element: el,
      effect,
      delay: staggerIndex * staggerDelay,
    });
    staggerIndex++;
  }

  return results;
}

/**
 * Applies Tailwind animation classes to an element, transitioning it from
 * its hidden initial state to the visible final state. Separated for testability.
 */
export function applyAnimation(el: Element, effect: string): void {
  const effectKey = effect as AnimationEffect;
  const initialClasses = INITIAL_CLASSES[effectKey] || INITIAL_CLASSES.fadeInUp;
  const finalClasses = EFFECT_CLASSES[effectKey] || EFFECT_CLASSES.fadeInUp;

  // Remove initial hidden-state classes
  for (const cls of initialClasses) {
    el.classList.remove(cls);
  }

  // Add final visible-state classes
  for (const cls of finalClasses) {
    el.classList.add(cls);
  }

  // Mark as animated to prevent re-processing
  el.classList.add(ANIMATED_CLASS);
}

export interface ScrollAnimationOptions {
  /** IntersectionObserver threshold. Default 0.15 (~85% viewport offset) */
  threshold?: number;
  /** Stagger delay in ms between sibling animations. Default 100 */
  staggerDelay?: number;
}

/**
 * Custom hook that triggers Tailwind CSS transitions on elements as they scroll
 * into view. Uses native Intersection Observer to detect visibility.
 *
 * Attach the returned ref to a container or individual `.animate-box` element.
 * Each element should have a `data-animate-effect` attribute specifying the
 * animation effect (fadeIn, fadeInLeft, fadeInRight, fadeInUp).
 *
 * Elements are initialized with hidden-state Tailwind classes (opacity-0 + translate)
 * and transitioned to their visible state when they enter the viewport.
 */
export function useScrollAnimation(options?: ScrollAnimationOptions) {
  const { threshold = 0.15, staggerDelay = 100 } = options ?? {};
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    /**
     * Applies initial hidden-state classes and transition utilities to an element
     * so it's ready to animate when it scrolls into view.
     */
    const initElement = (el: Element) => {
      const effect = (el.getAttribute('data-animate-effect') || 'fadeInUp') as AnimationEffect;
      const initialClasses = INITIAL_CLASSES[effect] || INITIAL_CLASSES.fadeInUp;

      // Add transition utilities and initial hidden state
      for (const cls of TRANSITION_CLASSES) {
        el.classList.add(cls);
      }
      for (const cls of initialClasses) {
        el.classList.add(cls);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const actions = processAnimationEntries(entries, staggerDelay);
        for (const action of actions) {
          if (action.delay === 0) {
            applyAnimation(action.element, action.effect);
          } else {
            setTimeout(() => applyAnimation(action.element, action.effect), action.delay);
          }
        }
      },
      { threshold },
    );

    // If the container itself is an animate-box, observe it directly
    if (container.classList.contains('animate-box')) {
      initElement(container);
      observer.observe(container);
    }

    // Also observe any child animate-box elements
    const children = container.querySelectorAll('.animate-box');
    children.forEach((child) => {
      initElement(child);
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [threshold, staggerDelay]);

  return ref;
}
