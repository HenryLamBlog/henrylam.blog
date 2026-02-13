# Implementation Plan: Portfolio Visual Redesign

## Overview

Incremental implementation of the visual redesign, starting with the token/animation foundation, then updating each component. Each task builds on the previous — tokens first, then animation infrastructure, then components from top-level (Navbar, Hero) down to details (Footer, PageLoader).

## Tasks

- [x] 1. Update Design Token System and Tailwind config
  - [x] 1.1 Replace color tokens in `src/globals.css`
    - Replace all CSS custom property values in `:root` and `.dark` with the new orange-anchored palette as specified in the design document
    - Update `:root` with warm cream backgrounds, orange accent, terracotta secondary
    - Update `.dark` with warm charcoal backgrounds, bright orange accent
    - Keep semantic tokens (success, warning, error) updated for contrast
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7_

  - [x] 1.2 Update `tailwind.config.ts` with new fonts and shadows
    - Change `fontFamily.heading` to `"Cabinet Grotesk"`
    - Update `boxShadow.glow` and `boxShadow.glow-lg` to use orange rgba values
    - Keep existing animation keyframes, update gradient-shift colors if needed
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.3 Add Cabinet Grotesk font loading
    - Add font import to `index.html` or via `@font-face` in `globals.css`
    - Ensure fallback to `system-ui, sans-serif`
    - _Requirements: 2.1_

  - [x] 1.4 Write property tests for color token system
    - **Property 2: WCAG AA contrast for all text/background token pairs**
    - **Validates: Requirements 1.5, 2.5**
    - **Property 4: Light and dark token sets define identical token names**
    - **Validates: Requirements 1.7**

- [x] 2. Create centralized animation system
  - [x] 2.1 Create `src/lib/animation.ts` with all Framer Motion variants
    - Export `EASE_OUT_EXPO`, `defaultTransition`, `fadeUp`, `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`, `staggerContainer`, `pageTransition`, `hoverScale`, `tapScale`, `navUnderline`
    - All variants must use the shared `EASE_OUT_EXPO` easing curve
    - _Requirements: 4.5, 5.1, 8.3_

  - [x] 2.2 Create `src/hooks/useScrollReveal.ts` hook
    - Implement using Framer Motion's `useInView` hook
    - Support `once` (default true), `amount` (default 0.15) options
    - Auto-detect `prefers-reduced-motion` and return `isInView: true` immediately when enabled
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.3 Write property tests for animation system
    - **Property 9: Consistent easing curve across all animation variants**
    - **Validates: Requirements 8.3**

  - [x] 2.4 Write property test for scroll reveal once-only behavior
    - **Property 6: Scroll-triggered animations fire only once**
    - **Validates: Requirements 4.3**

- [x] 3. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Update Navbar with animations and new styling
  - [x] 4.1 Update `src/components/Navbar.tsx`
    - Replace static nav links with `motion.a` wrappers and `navUnderline` variant for hover underline
    - Wrap mobile menu in `AnimatePresence` + `motion.div` with slide-down animation
    - Add icon rotation transition for hamburger ↔ X toggle
    - Update all color classes from cyan/teal to accent token classes
    - Update scroll threshold behavior with `motion.nav` for smooth bg transition
    - _Requirements: 6.5, 8.1, 18.1, 18.2, 18.3_

  - [x] 4.2 Write property test for navbar scroll threshold
    - **Property 8: Navbar background changes at scroll threshold**
    - **Validates: Requirements 6.5**

- [x] 5. Redesign HeroSection with animations
  - [x] 5.1 Update `src/components/HeroSection.tsx`
    - Replace gradient mesh background colors with orange/amber tones
    - Add animated glow pulse on profile photo ring using accent color
    - Wrap name and subtitle in `motion.div` with `staggerContainer` + `fadeUp` variants
    - Add `motion.div` scroll indicator with `animate={{ y: [0, 8, 0] }}` infinite loop
    - Update all color classes to new palette
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6. Update AboutSection with staggered animations
  - [x] 6.1 Update `src/components/AboutSection.tsx`
    - Add `useScrollReveal` hook to section container
    - Wrap content in `motion.div` with `staggerContainer` variant
    - Wrap bio paragraphs and skill category groups in `motion.div` with `fadeUp` variant
    - Wrap individual skill chips in `motion.span` with `scaleIn` variant and stagger
    - Add `whileHover={{ scale: 1.05 }}` to skill chips
    - Update all color classes to new palette (accent/10, accent/20, etc.)
    - _Requirements: 16.1, 16.2, 16.3_

- [x] 7. Update ProjectGallery with interactive animations
  - [x] 7.1 Update `src/components/ProjectGallery.tsx` and `ProjectCard`
    - Add `useScrollReveal` + `staggerContainer` to gallery section
    - Wrap each card in `motion.div` with `fadeUp` variant
    - Add `whileHover={hoverScale}` and `whileTap={tapScale}` to card links
    - Add tag reveal animation on hover using `motion.div` with `fadeIn`
    - Add `loading="lazy"` to card images with fade-in on load
    - Add `bg-surface` placeholder while images load
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 19.1, 19.2, 19.3_

  - [x] 7.2 Update `src/components/CategoryFilter.tsx` with sliding pill
    - Add `motion.div` with `layoutId="category-pill"` for the active tab indicator
    - Wrap filtered card grid in `AnimatePresence mode="popLayout"` with `layout` prop on cards
    - Update active tab colors to accent bg with bg text color
    - _Requirements: 13.1, 13.2, 13.3_

- [x] 8. Update BlogPostLayout and reading components
  - [x] 8.1 Update `src/components/BlogPostLayout.tsx`
    - Wrap title and metadata in `motion.div` with `staggerContainer` + `fadeUp`
    - Wrap content area in `motion.div` with `fadeIn` and delay after title
    - Update all prose accent colors from cyan to orange token classes
    - Update blockquote, list marker, heading border, and link colors
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 8.2 Update `src/components/ReadingProgress.tsx`
    - Add gradient background using accent color tokens
    - Add CSS transition for smooth width changes
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 8.3 Update `src/components/TableOfContents.tsx`
    - Add active heading tracking with accent color highlight using `motion.div` with `layoutId="toc-active"`
    - Wrap mobile disclosure content in `AnimatePresence` with height animation
    - Update hover colors to accent
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 8.4 Write property tests for reading progress and TOC
    - **Property 10: Reading progress reaches 100% at document end**
    - **Validates: Requirements 10.4**
    - **Property 12: Table of contents active heading tracks scroll position**
    - **Validates: Requirements 12.1**

- [x] 9. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Update remaining components
  - [x] 10.1 Update `src/components/PageTransition.tsx`
    - Import `pageTransition` variants from `animation.ts`
    - Replace inline variant values with imported variants
    - Add reduced-motion support
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 10.2 Update `src/components/ScrollToTopButton.tsx`
    - Wrap in `AnimatePresence` with `scaleIn` variant for entrance/exit
    - Add `whileHover={{ scale: 1.1 }}` 
    - Update colors from cyan to accent tokens
    - Update visibility threshold to 300px
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 10.3 Update `src/components/Footer.tsx`
    - Add `useScrollReveal` + `fadeUp` to footer section
    - Add `whileHover={{ scale: 1.15 }}` and accent glow to social icons
    - Update all color classes from cyan to accent tokens
    - Remove cyan drop-shadow, add orange glow
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 10.4 Update `src/components/PageLoader.tsx`
    - Update spinner border color to accent token
    - Replace inline opacity transition with Framer Motion `animate={{ opacity: 0 }}`
    - Use `onAnimationComplete` to remove from DOM
    - Ensure bg color uses theme token
    - _Requirements: 15.1, 15.2, 15.3_

  - [x] 10.5 Update `src/components/ThemeToggle.tsx`
    - Add icon rotation/morph animation using `motion.div` with `animate={{ rotate }}` based on theme
    - Update hover color to accent
    - _Requirements: 8.4_

  - [x] 10.6 Write property tests for scroll-to-top visibility
    - **Property 11: Scroll-to-top button visibility tracks scroll threshold**
    - **Validates: Requirements 11.1, 11.2**

- [x] 11. Update landing page structure and section dividers
  - [x] 11.1 Update `src/pages/LandingPage.tsx`
    - Wrap section dividers in `motion.div` with `fadeIn` variant
    - Update gradient colors from `accent/20` to new accent token
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 11.2 Verify responsive behavior across all updated components
    - Ensure Navbar collapses at 768px with animated mobile menu
    - Ensure ProjectGallery switches to single column at 768px
    - Ensure typography scales down at 640px
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 12. Update remaining color references and clean up
  - [x] 12.1 Search and replace any remaining cyan/teal color references
    - Grep for `rgba(0, 210, 210`, `rgba(0, 230, 230`, old glow values
    - Update `RelatedProjects.tsx` card hover styles
    - Update any remaining `shadow-glow` references that may use old colors
    - _Requirements: 1.6_

  - [x] 12.2 Write property test for no hardcoded colors
    - **Property 3: No hardcoded color values in components**
    - **Validates: Requirements 1.6**

  - [x] 12.3 Write property test for theme persistence round-trip
    - **Property 5: Theme preference persistence round-trip**
    - **Validates: Requirements 3.2**

- [x] 13. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The animation system (task 2) must be completed before any component updates (tasks 4-11)
- Token updates (task 1) must be completed first as all components depend on them
