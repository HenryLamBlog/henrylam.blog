# Implementation Plan: Portfolio UI Redesign

## Overview

Incremental migration from Bootstrap/fh5co to Tailwind CSS with modern design system. The approach establishes foundations first (Tailwind, tokens, theme), then restyles components top-to-bottom, then adds enhancement layers (blog reading aids, page transitions). TypeScript + React throughout.

## Tasks

- [x] 1. Set up Tailwind CSS and foundational design system
  - [x] 1.1 Install Tailwind CSS, PostCSS, autoprefixer, and @tailwindcss/typography as dev dependencies; create `tailwind.config.ts` and `postcss.config.js`; create `src/globals.css` with Tailwind directives and CSS custom property token definitions for light and dark modes
    - Configure `darkMode: 'class'` in Tailwind config
    - Extend theme with custom colors referencing CSS variables, font families (Inter, Plus Jakarta Sans), and any custom spacing
    - _Requirements: 1.1, 2.1, 2.2, 2.4, 4.1_
  - [x] 1.2 Update `index.html` to remove Bootstrap CDN link and legacy Google Fonts link; add Inter and Plus Jakarta Sans from Google Fonts; update `src/main.tsx` to import `globals.css` instead of legacy CSS files
    - Keep GA4 script, favicon, viewport meta unchanged
    - _Requirements: 1.1, 1.3, 4.1, 14.3_
  - [x] 1.3 Update `src/test/setup.ts` to add `window.matchMedia` mock for dark mode testing
    - _Requirements: 3.5, 3.6_

- [x] 2. Implement Theme Provider and Theme Toggle
  - [x] 2.1 Create `src/contexts/ThemeContext.tsx` with ThemeProvider component and `useTheme` hook
    - Read initial theme from localStorage, fall back to OS preference via matchMedia, fall back to 'light'
    - Toggle function flips theme, persists to localStorage, toggles 'dark' class on `<html>`
    - Wrap try-catch around localStorage access
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 2.2 Create `src/components/ThemeToggle.tsx` rendering a sun/moon icon button using Lucide React
    - Install `lucide-react` as a dependency
    - Accessible: `aria-label="Switch to dark/light mode"`
    - _Requirements: 3.2, 5.4_
  - [x] 2.3 Wrap app with ThemeProvider in `src/main.tsx` (above HashRouter)
    - _Requirements: 3.1_
  - [x] 2.4 Write property tests for ThemeContext
    - **Property 1: Theme toggle is an involution**
    - **Property 2: Theme persistence round-trip**
    - **Validates: Requirements 3.2, 3.4**
  - [x] 2.5 Write unit tests for ThemeContext and ThemeToggle
    - Test localStorage fallback, OS preference detection, error handling when localStorage throws
    - _Requirements: 3.5, 3.6_

- [x] 3. Checkpoint - Foundations verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Restyle Navbar component
  - [x] 4.1 Rewrite `src/components/Navbar.tsx` with Tailwind classes
    - Remove variant switching (landing vs blog); single consistent style
    - Transparent bg on landing when at top, solid bg on scroll and on blog pages
    - Use `transition-colors duration-300` for background change
    - Include ThemeToggle in nav bar
    - Mobile hamburger menu with Tailwind responsive classes
    - Preserve section scroll navigation logic (handleNavClick)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 4.2 Write property test for Navbar consistency
    - **Property 3: Navbar renders consistent base structure across all routes**
    - **Validates: Requirements 5.1**
  - [x] 4.3 Update `src/components/Navbar.test.tsx` unit tests for new markup
    - _Requirements: 5.2, 5.3, 5.6_

- [x] 5. Restyle Hero Section
  - [x] 5.1 Rewrite `src/components/HeroSection.tsx` with Tailwind classes
    - Full viewport `h-screen` with background image and gradient overlay (`bg-gradient-to-b from-black/30 to-black/60`)
    - Profile photo with `rounded-2xl ring-4 ring-white/20 shadow-2xl`
    - Name in heading font (`font-heading`)
    - Reduce descriptors array to 3-4 impactful items
    - Add scroll-down chevron indicator at bottom (Lucide ChevronDown icon, animated bounce)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 5.2 Update `src/components/HeroSection.test.tsx` unit tests for new markup
    - _Requirements: 6.4, 6.5_

- [x] 6. Restyle About Section
  - [x] 6.1 Rewrite `src/components/AboutSection.tsx` with Tailwind classes
    - Two-column grid on desktop (`md:grid-cols-2`), single column on mobile
    - Left: bio text with clear paragraph spacing
    - Right: skill chips grouped by category (define `SkillCategory` data, render as flex-wrap pill tags)
    - Contact info integrated into bio column
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 6.2 Update `src/components/AboutSection.test.tsx` unit tests for new markup
    - _Requirements: 7.2_

- [x] 7. Restyle Resume Timeline
  - [x] 7.1 Rewrite `src/components/ResumeTimeline.tsx` with Tailwind classes
    - Single-column layout with card styling and left border accent
    - Education entries: primary color border + GraduationCap Lucide icon
    - Work entries: secondary color border + Briefcase Lucide icon
    - Section headings for Education and Work Experience
    - TimelineItem interface and data unchanged
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 7.2 Update property test for timeline entry type distinction
    - **Property 4: Timeline entries receive type-appropriate styling**
    - **Validates: Requirements 8.2**
  - [x] 7.3 Update `src/components/ResumeTimeline.test.tsx` unit tests for new markup
    - _Requirements: 8.3_

- [x] 8. Checkpoint - Core landing sections restyled
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Restyle Project Gallery with category filtering
  - [x] 9.1 Extend `Project` interface with `tags: string[]` and `category: string` fields; update `projects` array with appropriate tags and categories for all 10 projects; define `CATEGORIES` constant
    - _Requirements: 9.2, 9.3_
  - [x] 9.2 Create `src/components/CategoryFilter.tsx` with horizontal pill buttons for each category
    - "All" as first option, accessible with `role="tablist"` / `role="tab"`
    - _Requirements: 9.3_
  - [x] 9.3 Rewrite `src/components/ProjectGallery.tsx` with Tailwind classes
    - Integrate CategoryFilter with `selectedCategory` state
    - Filter projects by selected category
    - Project cards: image at top (aspect-video), title + description always visible, tech stack tag pills, hover scale+shadow transition
    - Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
    - Card links to blog post via `<Link to={slug}>`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  - [x] 9.4 Write property tests for Project Gallery
    - **Property 5: Project tags are displayed on cards**
    - **Property 6: Category filtering returns only matching projects**
    - **Property 7: Project card links match slugs**
    - **Validates: Requirements 9.2, 9.4, 9.5, 9.7**
  - [x] 9.5 Update `src/components/ProjectGallery.test.tsx` unit tests for new markup and filtering
    - _Requirements: 9.1, 9.4_

- [x] 10. Implement blog reading enhancements
  - [x] 10.1 Create `src/hooks/useReadingProgress.ts` with `calculateReadingProgress` pure function and hook
    - Pure function: `(scrollY, documentHeight, viewportHeight) => number` clamped 0-100
    - Hook: uses passive scroll listener, returns progress number
    - _Requirements: 10.2_
  - [x] 10.2 Create `src/hooks/useTableOfContents.ts` with `extractHeadings` pure function and hook
    - Pure function: takes heading elements array, returns `TOCItem[]` with id, text, level
    - Generates IDs for headings without them, handles duplicates
    - Hook: accepts content ref, queries h2/h3 elements, returns TOC items
    - _Requirements: 10.3_
  - [x] 10.3 Create `src/components/ReadingProgress.tsx` — fixed bar at top of viewport showing scroll percentage
    - _Requirements: 10.2_
  - [x] 10.4 Create `src/components/TableOfContents.tsx` — navigable heading list, sticky on desktop, collapsible on mobile
    - _Requirements: 10.3, 10.4_
  - [x] 10.5 Rewrite `src/components/BlogPostLayout.tsx` with Tailwind classes
    - Add reading time estimate display (word count / 200 wpm, min 1 min)
    - Integrate ReadingProgress bar
    - Integrate TableOfContents sidebar
    - Style code blocks and tables using @tailwindcss/typography prose classes
    - Preserve RelatedProjects integration
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  - [x] 10.6 Write property tests for reading hooks
    - **Property 8: Reading time calculation is proportional to word count**
    - **Property 9: Reading progress calculation is bounded and monotonic**
    - **Property 10: Table of contents extraction preserves heading order and content**
    - **Validates: Requirements 10.1, 10.2, 10.3**
  - [x] 10.7 Update `src/components/BlogPostLayout.test.tsx` unit tests for new markup and reading aids
    - _Requirements: 10.1, 10.5, 10.6_

- [x] 11. Restyle Footer and ScrollToTopButton
  - [x] 11.1 Rewrite `src/components/Footer.tsx` with Tailwind classes
    - "Let's Connect" heading above social links
    - Social links: GitHub, LinkedIn, Email with Lucide icons
    - `target="_blank"` and `rel="noopener noreferrer"` on all external links
    - `aria-label` on each social link
    - Dynamic copyright year: `new Date().getFullYear()`
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  - [x] 11.2 Rewrite `src/components/ScrollToTopButton.tsx` with Tailwind classes
    - Replace Icomoon icon with Lucide ArrowUp
    - `fixed bottom-6 right-6 rounded-full shadow-lg`
    - Fade in/out with opacity transition
    - Preserve existing scroll logic (visible when scrollY > 200)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  - [x] 11.3 Write property tests for Footer and ScrollToTopButton
    - **Property 11: Social links have correct accessibility and security attributes**
    - **Property 12: Scroll-to-top visibility tracks scroll position**
    - **Validates: Requirements 12.1, 12.4, 13.1, 13.2**
  - [x] 11.4 Update `src/components/Footer.test.tsx` and `src/components/ScrollToTopButton.test.tsx` unit tests
    - _Requirements: 12.2, 12.3, 13.3_

- [x] 12. Checkpoint - All components restyled
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Add page transitions with Framer Motion
  - [x] 13.1 Install `framer-motion` as a dependency; create `src/components/PageTransition.tsx` wrapper component
    - Fade + translateY animation: `initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -8 }}`
    - `transition={{ duration: 0.3 }}`
    - _Requirements: 11.1, 11.2, 11.4_
  - [x] 13.2 Update `src/App.tsx` to wrap Routes content with `AnimatePresence` and `PageTransition`, keyed by `location.pathname`
    - _Requirements: 11.1, 11.3_
  - [x] 13.3 Update `src/pages/LandingPage.test.tsx` and `src/pages/NotFoundPage.test.tsx` for any wrapper changes
    - _Requirements: 11.1_

- [x] 14. Restyle Related Projects and update blog post pages
  - [x] 14.1 Rewrite `src/components/RelatedProjects.tsx` with Tailwind card layout
    - Replace Bootstrap grid classes with Tailwind flex/grid
    - _Requirements: 9.1, 14.1_
  - [x] 14.2 Update all 10 blog post pages in `src/pages/blog/` to work with the restyled BlogPostLayout
    - Ensure all content preserved, images still reference correct paths
    - _Requirements: 14.1, 14.4_
  - [x] 14.3 Update `src/components/RelatedProjects.test.tsx` and related property tests
    - _Requirements: 14.1_

- [x] 15. Clean up legacy assets and verify preservation
  - [x] 15.1 Remove legacy CSS files (`src/css/style.css`, `src/css/animate.css`, `src/css/icomoon.css`) and legacy font files from `public/fonts/icomoon/`
    - Remove any remaining imports of these files
    - _Requirements: 1.3, 1.4_
  - [x] 15.2 Update `src/hooks/useScrollAnimation.ts` to use Tailwind/Framer Motion classes instead of animate.css classes
    - Preserve `processAnimationEntries` and `applyAnimation` function signatures for test compatibility
    - _Requirements: 1.3_
  - [x] 15.3 Write property tests for content preservation
    - **Property 13: All blog routes map to valid components**
    - **Property 14: All project images reference existing paths**
    - **Validates: Requirements 14.1, 14.4**
  - [x] 15.4 Update `src/hooks/useScrollAnimation.property.test.ts` and `src/hooks/useScrollAnimation.test.ts` for updated animation classes
    - _Requirements: 1.3_

- [x] 16. Restyle NotFoundPage and PageLoader
  - [x] 16.1 Restyle `src/pages/NotFoundPage.tsx` with Tailwind classes
    - _Requirements: 15.1_
  - [x] 16.2 Restyle `src/components/PageLoader.tsx` with Tailwind classes
    - _Requirements: 15.1_
  - [x] 16.3 Update `src/pages/NotFoundPage.test.tsx` and `src/components/PageLoader.test.tsx` unit tests
    - _Requirements: 15.1_

- [x] 17. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 3, 8, 12, and 17 ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation order (foundations → components → enhancements → cleanup) minimizes broken intermediate states
