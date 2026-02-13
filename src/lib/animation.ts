import type { Variants, Transition, TargetAndTransition } from 'framer-motion';

// Shared easing curve used across all animations
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Default transition preset
export const defaultTransition: Transition = {
  duration: 0.5,
  ease: EASE_OUT_EXPO,
};

// --- Scroll-triggered entrance variants ---

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: defaultTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: defaultTransition },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
};

// --- Stagger container ---

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// --- Page transitions ---

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } },
};

// --- Micro-interaction variants ---

export const hoverScale: TargetAndTransition = {
  scale: 1.03,
  transition: { duration: 0.2, ease: EASE_OUT_EXPO },
};

export const tapScale: TargetAndTransition = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const navUnderline: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.25, ease: EASE_OUT_EXPO } },
};
