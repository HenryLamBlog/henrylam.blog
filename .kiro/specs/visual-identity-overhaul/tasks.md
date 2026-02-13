# Implementation Plan: Visual Identity Overhaul

## Overview

Restyle the henrylam.blog portfolio from a corporate blue-gray template to a distinctive dark-first developer aesthetic. Changes flow bottom-up: design tokens and config first, then components section by section, updating tests alongside each change to keep the 242-test suite green throughout.

## Tasks

- [x] 1. Update design foundation (tokens, config, fonts)
  - [x] 1.1 Update `src/globals.css` with new color palette
    - Replace all CSS custom property values in `:root` and `.dark` with the new cyan/teal accent, deep charcoal dark base, and light neutral light base as specified in the design document
    - Remove all orange accent references (249 115 22, 251 146 60, etc.)
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

  - [x] 1.2 Update `tailwind.config.ts` with new font families and utilities
    - Change `fontFamily.heading` to Space Grotesk
    - Add `fontFamily.mono` for JetBrains Mono
    - Add `boxShadow.glow` and `boxShadow.glow-lg` utilities
    - Add `animation.gradient-shift` keyframes for hero mesh background
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 Update `index.html` Google Fonts link
    - Replace Plus Jakarta Sans with Space Grotesk (weights 500–800) and JetBrains Mono (weights 400–700)
    - Keep Inter
    - _Requirements: 2.3_

  - [x] 1.4 Update `src/contexts/ThemeContext.tsx` to default to dark mode
    - Change `getInitialTheme()` fallback from `'light'` to `'dark'` when no stored preference and no OS preference
    - Change `getOSPreference()` fallback from `'light'` to `'dark'`
    - _Requirements: 1.3_

  - [x] 1.5 Update ThemeContext tests for new default
    - Update `src/contexts/ThemeContext.test.tsx` and `src/contexts/ThemeContext.property.test.ts` to expect `'dark'` as the default theme
    - _Requirements: 9.1, 9.3_

- [x] 2. Checkpoint — Verify foundation changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Restyle Hero Section
  - [x] 3.1 Rewrite `src/components/HeroSection.tsx` visual layer
    - Replace background image + dark overlay with animated gradient mesh using CSS radial gradients and the `animate-gradient-shift` keyframe
    - Remove TypedTextAnimator import and usage
    - Replace typed descriptors with a bold static subtitle ("Software Engineer · AI Developer")
    - Add glow/blur effect behind the name heading
    - Restyle profile photo with accent ring and glow instead of white ring
    - Keep scroll-down ChevronDown indicator
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Update HeroSection tests
    - Update `src/components/HeroSection.test.tsx` to remove TypedTextAnimator assertions and add assertions for static heading, gradient mesh elements, and profile photo
    - _Requirements: 9.1_

  - [x]  3.3 Write property test for featured project layout
    - **Property 4: Featured project layout differentiation**
    - **Validates: Requirements 4.1**

- [x] 4. Restyle Project Gallery and Cards
  - [x] 4.1 Update `src/components/ProjectGallery.tsx` and ProjectCard
    - Add featured layout: first 2 projects get `lg:col-span-2` in the grid
    - Apply glassmorphism to all cards: `bg-surface/60 backdrop-blur-md border border-border/50 rounded-2xl`
    - Replace `hover:scale-[1.02]` with `hover:shadow-glow hover:border-accent/50`
    - Restyle tag pills with new accent color and glassmorphic appearance
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.2 Update `src/components/CategoryFilter.tsx`
    - Restyle active button to `bg-accent text-bg`
    - Restyle inactive buttons with glassmorphic appearance
    - _Requirements: 4.5_

  - [x] 4.3 Update ProjectGallery and CategoryFilter tests
    - Update `src/components/ProjectGallery.test.tsx`, `src/components/ProjectGallery.property.test.tsx`, and `src/components/CategoryFilter.test.tsx` for new class names and featured layout
    - _Requirements: 9.1_

  - [x] 4.4 Write property test for project card glassmorphism and hover styling
    - **Property 5: Project card glassmorphism and hover styling**
    - **Validates: Requirements 4.2, 4.3**

- [x] 5. Restyle Blog Post Layout
  - [x] 5.1 Update `src/components/BlogPostLayout.tsx`
    - Restyle hero header with new dark gradient using surface/bg tokens
    - Add code-editor aesthetic to content area (subtle surface background, border on dark mode)
    - Change h2 section separation from bottom border to left accent border
    - Restyle tag pills and metadata to match new palette
    - Preserve all functional elements: ReadingProgress, TableOfContents, RelatedProjects, back link
    - Do not modify children content
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 5.2 Update `src/components/TableOfContents.tsx`
    - Restyle links with `hover:text-accent`
    - Add subtle left border to desktop sticky sidebar
    - _Requirements: 8.2_

  - [x] 5.3 Update `src/components/RelatedProjects.tsx`
    - Apply same glassmorphism card styling as ProjectCard
    - _Requirements: 4.2_

  - [x] 5.4 Update BlogPostLayout and related component tests
    - Update `src/components/BlogPostLayout.test.tsx`, `src/components/RelatedProjects.test.tsx` for new class names
    - _Requirements: 9.1_

  - [x] 5.5 Write property test for blog layout functional preservation
    - **Property 6: Blog layout functional element preservation**
    - **Validates: Requirements 5.5**

  - [x] 5.6 Write property test for blog layout children passthrough
    - **Property 7: Blog layout children passthrough**
    - **Validates: Requirements 5.6**

- [x] 6. Checkpoint — Verify main content components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Restyle Navigation and Chrome Components
  - [x] 7.1 Update `src/components/Navbar.tsx`
    - Add frosted glass effect when scrolled: `bg-bg/80 backdrop-blur-md`
    - Ensure brand name uses `font-heading` (Space Grotesk)
    - Update hover states to use accent color
    - Frosted mobile menu: `bg-bg/95 backdrop-blur-lg`
    - _Requirements: 8.1_

  - [x] 7.2 Update `src/components/Footer.tsx`
    - Apply `bg-surface/50 backdrop-blur-sm border-t border-border/50`
    - Add glow effect on social icon hover
    - _Requirements: 7.3_

  - [x] 7.3 Update `src/components/ScrollToTopButton.tsx`
    - Restyle with `bg-accent/90 hover:bg-accent hover:shadow-glow`
    - _Requirements: 6.4_

  - [x] 7.4 Update `src/components/ThemeToggle.tsx`
    - Add `hover:text-accent` glow effect
    - _Requirements: 8.6_

  - [x] 7.5 Update `src/components/PageLoader.tsx`
    - Restyle spinner with new accent color
    - _Requirements: 8.5_

  - [x] 7.6 Update Navbar, Footer, ScrollToTopButton tests
    - Update `src/components/Navbar.test.tsx`, `src/components/Navbar.property.test.tsx`, `src/components/Footer.test.tsx`, `src/components/Footer.property.test.tsx`, `src/components/ScrollToTopButton.test.tsx`, `src/components/ScrollToTopButton.property.test.ts`, `src/components/PageLoader.test.tsx` for new class names
    - _Requirements: 9.1_

- [x] 8. Restyle Error and Utility Pages
  - [x] 8.1 Update `src/components/ErrorBoundary.tsx`
    - Replace all inline `style=` attributes with Tailwind classes using design tokens
    - Use `text-accent` instead of hardcoded `#FF9000`
    - _Requirements: 8.4_

  - [x] 8.2 Update `src/pages/NotFoundPage.tsx`
    - Restyle 404 heading with accent color and glow effect
    - Use `font-heading` for headings
    - _Requirements: 8.3_

  - [x] 8.3 Update ErrorBoundary and NotFoundPage tests
    - Update `src/components/ErrorBoundary.test.tsx` and `src/pages/NotFoundPage.test.tsx` for new class names and removal of inline styles
    - _Requirements: 9.1_

  - [x] 8.4 Write property test for ErrorBoundary no inline styles
    - **Property 10: ErrorBoundary uses no inline styles**
    - **Validates: Requirements 8.4**

- [x] 9. Add Section Transitions and Enhance Animations
  - [x] 9.1 Update `src/pages/LandingPage.tsx`
    - Add gradient divider elements between HeroSection, AboutSection, and ProjectGallery
    - _Requirements: 7.1_

  - [x] 9.2 Update `src/components/AboutSection.tsx`
    - Restyle skill chips and section to match new palette
    - Ensure background uses design token classes
    - _Requirements: 7.2_

  - [x] 9.3 Update `src/components/PageTransition.tsx`
    - Enhance Framer Motion variants: longer duration (0.35s), add subtle scale (0.99)
    - _Requirements: 6.3_

  - [x] 9.4 Update `src/components/ReadingProgress.tsx`
    - Verify bar uses `bg-accent` (should auto-update with new token, but confirm)
    - _Requirements: 5.5_

  - [x] 9.5 Update LandingPage, AboutSection, and PageTransition tests
    - Update `src/pages/LandingPage.test.tsx`, `src/components/AboutSection.test.tsx`, `src/components/PageTransition.test.tsx`, `src/components/ReadingProgress.test.tsx` for new structure and class names
    - _Requirements: 9.1_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Run full test suite with `npx vitest --run`
  - Verify all 242+ tests pass (original 242 + any new property tests)
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 9.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation — run tests after each section
- The TypedTextAnimator component file and its tests are kept intact (not deleted), just no longer imported by HeroSection
- Blog post content files (src/pages/blog/*.tsx) are never modified — only the layout wrapper changes
- Property tests validate universal correctness properties using fast-check with 100+ iterations
- Unit tests validate specific examples and edge cases
