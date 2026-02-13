# Implementation Plan: Carousel Gallery & Blog Cleanup

## Overview

Replace the ProjectGallery grid with a horizontal carousel, remove the BlogPostLayout hero header, and fix the invisible filtered cards bug. Implementation proceeds bottom-up: hook → component → integration → blog cleanup → test updates.

## Tasks

- [x] 1. Create the useCarousel hook
  - [x] 1.1 Create `src/hooks/useCarousel.ts` implementing the `UseCarouselOptions` and `UseCarouselReturn` interfaces from the design
    - Track `canScrollLeft` and `canScrollRight` state derived from scroll position via a `scroll` event listener on `scrollRef`
    - Implement `scrollPrev` and `scrollNext` using `scrollBy({ left: ±cardWidth, behavior: 'smooth' })` where cardWidth is computed from the first child's offsetWidth + gap
    - Implement auto-scroll with `setInterval` that calls `scrollNext`, disabled when `scrollWidth <= clientWidth`
    - Implement `pauseAutoScroll` (clears interval) and `resumeAutoScroll` (restarts interval)
    - Implement `handleKeyDown` for ArrowLeft/ArrowRight key events
    - Clean up interval and event listeners on unmount
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 7.3_

  - [x] 1.2 Write property tests for useCarousel arrow visibility logic
    - **Property 3: Arrow visibility matches scroll bounds**
    - **Validates: Requirements 2.4, 2.5**

  - [x] 1.3 Write property test for useCarousel auto-scroll disable logic
    - **Property 4: Auto-scroll disabled when items fit viewport**
    - **Validates: Requirements 3.4**

- [x] 2. Create the Carousel and NavigationArrow components
  - [x] 2.1 Create `src/components/Carousel.tsx` with the `CarouselProps` interface from the design
    - Render a `<div role="region" aria-label={ariaLabel}>` wrapper
    - Render left and right `NavigationArrow` buttons, hidden when `!canScrollLeft` / `!canScrollRight`
    - Render a scroll container `<div>` with `overflow-x: auto`, `flex`, `gap-6`, `scroll-snap-type: x mandatory`, and hidden scrollbar styling
    - Wire `onMouseEnter={pauseAutoScroll}`, `onMouseLeave={resumeAutoScroll}`, `onKeyDown={handleKeyDown}`, `tabIndex={0}`
    - Use Framer Motion `staggerContainer` and `fadeUp` variants for entrance animation
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.6, 3.2, 3.3, 7.1, 7.2_

  - [x] 2.2 Create the `NavigationArrow` component (can be in the same file or separate)
    - Render a `<button>` with `aria-label="Scroll left"` or `"Scroll right"`
    - Use `ChevronLeft` / `ChevronRight` from lucide-react
    - Style with design tokens: `text-text-muted hover:text-accent bg-surface/80 backdrop-blur-sm border border-border/50 rounded-full`
    - Position absolutely on carousel edges, transition opacity when disabled
    - _Requirements: 2.1, 2.6, 8.3_

  - [x] 2.3 Write property test for horizontal flex layout
    - **Property 1: Cards rendered in horizontal flex container**
    - **Validates: Requirements 1.1**

  - [x] 2.4 Write property test for card depth styling
    - **Property 2: Card depth styling uses design tokens**
    - **Validates: Requirements 1.3, 8.1**

- [x] 3. Integrate Carousel into ProjectGallery
  - [x] 3.1 Update `src/components/ProjectGallery.tsx` to use the Carousel component
    - Replace the `<motion.div className="grid ...">` with `<Carousel itemCount={filteredProjects.length} ariaLabel="Project gallery">`
    - Wrap each `ProjectCard` in a `<div className="min-w-[280px] sm:min-w-[320px] scroll-snap-align-start shrink-0">`
    - Add elevated shadow class to card wrappers (e.g., `shadow-glow` on hover)
    - When `filteredProjects.length <= 3`, add `justify-center` to the scroll container
    - Reset scroll position to 0 when `selectedCategory` changes (via useEffect or key prop)
    - _Requirements: 1.1, 1.3, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2_

  - [x] 3.2 Write property test for category filtering correctness
    - **Property 5: Category filtering correctness**
    - **Validates: Requirements 4.2, 4.5**

  - [x] 3.3 Write property test for small result set centering
    - **Property 6: Small result sets are centered**
    - **Validates: Requirements 4.4**

  - [x] 3.4 Write property test for no invisible clickable cards
    - **Property 8: No invisible clickable cards after filtering**
    - **Validates: Requirements 6.1, 6.2**

- [x] 4. Checkpoint - Verify carousel functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Remove BlogPostLayout hero header
  - [x] 5.1 Update `src/components/BlogPostLayout.tsx` to remove the hero header
    - Delete the entire hero header JSX block (gradient banner, back link, title, description, meta row, tags)
    - Remove unused imports: `Link`, `ArrowLeft`, `Clock`, `Calendar`, `Tag`, `staggerContainer`, `fadeUp`
    - Remove the `slug` and `project` variables that were only used by the hero header
    - Keep: `ReadingProgress`, content area with `article`, `TableOfContents`, `RelatedProjects`
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 5.2 Write property test for BlogPostLayout children rendering
    - **Property 7: BlogPostLayout renders children in article with prose styling**
    - **Validates: Requirements 5.3**

- [x] 6. Update existing test suites
  - [x] 6.1 Update `src/components/ProjectGallery.test.tsx`
    - Replace grid layout assertions (`.grid`, `grid-cols-*`) with carousel structure assertions (flex container, `role="region"`)
    - Update filter tests to verify carousel content instead of grid content
    - Keep card rendering, filtering logic, and image loading tests
    - Add tests for navigation arrow rendering and aria-labels
    - Add test for auto-scroll pause on hover / resume on mouse leave
    - _Requirements: 9.3_

  - [x] 6.2 Update `src/components/BlogPostLayout.test.tsx`
    - Remove the test that checks for "back to projects" link text
    - Add a test confirming the hero header gradient section is absent
    - Keep tests for article element, prose classes, ReadingProgress, RelatedProjects
    - _Requirements: 9.2_

  - [x] 6.3 Update `src/components/ProjectGallery.property.test.tsx`
    - Remove or update the "Uniform project card layout" property test (no longer grid-based)
    - Remove or update the "glassmorphism and hover styling" property test if card wrapper classes changed
    - Keep tag display, category filtering, and card link property tests
    - _Requirements: 9.1_

  - [x] 6.4 Add a scrollbar-hide CSS utility class
    - Add `.scrollbar-hide` class to `src/globals.css` (or equivalent) using `-webkit-scrollbar { display: none }` and `scrollbar-width: none`
    - _Requirements: 1.2_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The ProjectCard component interface is unchanged — existing property tests for tags, links, and filtering logic should continue to pass
- The `projectArb` arbitrary from the existing property test file can be reused for new carousel property tests
- All styling must use design tokens from `tailwind.config.ts` and CSS custom properties — no hardcoded colors
