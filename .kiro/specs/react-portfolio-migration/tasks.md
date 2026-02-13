# Implementation Plan: React Portfolio Migration

## Overview

Migrate henrylam.blog from static HTML/CSS/jQuery to a React SPA using Vite, React Router (HashRouter), and TypeScript. Tasks are ordered to build incrementally: project setup → shared utilities → landing page sections → blog posts → wiring and polish.

## Tasks

- [x] 1. Initialize React project with Vite and configure for GitHub Pages
  - [x] 1.1 Scaffold Vite + React + TypeScript project in a `src/` directory structure
    - Initialize with `npm create vite@latest` using react-ts template
    - Configure `vite.config.ts` with `base: '/'` for custom domain deployment
    - Install dependencies: `react-router-dom`, `fast-check` (dev)
    - _Requirements: 1.1_
  - [x] 1.2 Create `.gitignore` file with proper exclusions
    - Exclude `node_modules/`, `dist/`, `.DS_Store`, `.env*`, `*.local`
    - _Requirements: 1.2_
  - [x] 1.3 Set up public assets and CNAME
    - Copy `CNAME` file to `public/` with content `henrylam.blog`
    - Copy `favicon/` directory to `public/favicon/`
    - Copy `images/` directory to `public/images/`
    - Copy `fonts/` directory to `public/fonts/`
    - Copy `site.webmanifest` to `public/favicon/`
    - _Requirements: 1.3, 10.4_
  - [x] 1.4 Add Google Analytics 4 script to `index.html`
    - Add GA4 async script tag with tracking ID `G-K03ESX8LJE`
    - _Requirements: 1.5_
  - [x] 1.5 Set up global CSS
    - Import existing `css/style.css` and `css/animate.css` as global styles
    - Import `css/icomoon.css` for icon fonts
    - Add Google Fonts link for Lato and Kaushan Script in `index.html`
    - Add Bootstrap 4.6.2 CSS via CDN link in `index.html`
    - _Requirements: 10.1, 10.2_

- [x] 2. Implement shared components and hooks
  - [x] 2.1 Create `useScrollAnimation` custom hook
    - Use Intersection Observer API with threshold mapping to ~85% viewport offset
    - Apply configured animation CSS class (fadeIn, fadeInLeft, fadeInRight, fadeInUp)
    - Implement 100ms stagger delay for sibling elements
    - Ensure animation fires only once per element (idempotence)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 2.2 Write property test for scroll animation stagger
    - **Property 6: Scroll animation applies correct effect class with stagger**
    - **Validates: Requirements 8.2, 8.3**
  - [x] 2.3 Write property test for scroll animation idempotence
    - **Property 7: Scroll animation is idempotent**
    - **Validates: Requirements 8.4**
  - [x] 2.4 Create `ScrollToTopButton` component
    - Show button when scroll position > 200px
    - Smooth scroll to top on click
    - _Requirements: 7.5_
  - [x] 2.5 Create `PageLoader` component
    - Display loading spinner matching existing `.fh5co-loader` style
    - Fade out when page is ready (useEffect on mount)
    - _Requirements: 10.5_
  - [x] 2.6 Create `Footer` component
    - Render copyright text with link to henrylam.blog
    - _Requirements: 7.4_

- [x] 3. Implement Navbar component
  - [x] 3.1 Create `Navbar` component with variant support
    - Fixed-top positioning with brand name "Henry Lam" in Kaushan Script
    - Links to About Me, Resume, Projects sections
    - `landing` variant: white background, orange text
    - `blog` variant: orange background, white text
    - Determine variant from current route using `useLocation`
    - _Requirements: 2.1, 2.2, 2.6, 2.7_
  - [x] 3.2 Implement responsive hamburger menu
    - Collapse navbar into toggle below 768px viewport width
    - Animated hamburger icon matching existing toggler-icon styles
    - _Requirements: 2.5_
  - [x] 3.3 Implement smooth scroll navigation
    - On Landing_Page: smooth scroll to section anchor
    - From Blog_Post_Page: navigate to landing page with hash, then scroll
    - _Requirements: 2.3, 2.4_

- [x] 4. Implement Landing Page sections
  - [x] 4.1 Create `TypedTextAnimator` component
    - Implement typing/erasing state machine with configurable speeds (150ms type, 75ms erase)
    - Shuffle descriptor order on each full cycle using Fisher-Yates shuffle
    - _Requirements: 3.3, 3.4, 3.5_
  - [x] 4.2 Write property test for typed text state machine
    - **Property 1: Typed text state machine produces correct character sequence**
    - **Validates: Requirements 3.3**
  - [x] 4.3 Write property test for shuffle preserving elements
    - **Property 2: Shuffle preserves all elements**
    - **Validates: Requirements 3.4**
  - [x] 4.4 Create `HeroSection` component
    - Full-viewport-height background image with parallax effect (CSS `background-attachment: fixed`)
    - Circular profile photo, name display, TypedTextAnimator
    - _Requirements: 3.1, 3.2_
  - [x] 4.5 Create `AboutSection` component
    - Personal info list (name, email) and biography text
    - Update content from Resume.docx
    - _Requirements: 4.1, 4.2, 4.3, 11.1_
  - [x] 4.6 Create `ResumeTimeline` component with `TimelineEntry` sub-component
    - Define `timelineData` array with education and work entries from Resume.docx
    - Render vertical alternating timeline with icon badges (graduation cap / suitcase)
    - Wrap entries in scroll animation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 11.2, 11.3_
  - [x] 4.7 Write property test for timeline entry rendering
    - **Property 3: Timeline entry renders complete and correct data**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  - [x] 4.8 Create `ProjectGallery` component with `ProjectCard` sub-component
    - Define `projects` data array with all 10 projects
    - Responsive 3-column grid with hover overlay (title + description)
    - Cards link to blog post routes via slug
    - Rounded corners (15px), 1:1 aspect ratio images
    - Wrap cards in scroll animation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 4.9 Write property test for project card links
    - **Property 4: Project card links to correct route**
    - **Validates: Requirements 6.3**
  - [x] 4.10 Assemble `LandingPage` component
    - Compose HeroSection, AboutSection, ResumeTimeline, ProjectGallery
    - _Requirements: 1.1_

- [x] 5. Checkpoint - Verify landing page
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement blog post pages
  - [x] 6.1 Create `BlogPostLayout` wrapper component
    - Provides consistent blog post styling (`.main-container`, `#main-text`)
    - Includes `RelatedProjects` component at bottom
    - _Requirements: 7.2, 7.3_
  - [x] 6.2 Write property test for related projects links
    - **Property 5: Related projects section contains valid links**
    - **Validates: Requirements 7.3**
  - [x] 6.3 Migrate all 10 blog post pages to React components
    - Convert each HTML blog post to a React component inside `src/pages/blog/`
    - Preserve all content: headings, paragraphs, images, tables, YouTube embeds, Chart.js
    - Update any outdated personal details from Resume.docx
    - Blog posts: WordleSolver, ImmersiveBallShooter, ColorizationOfGrayscaleImages, MazeGameBfs, AssemblingIphone, DistinguishingMasks, RobotControlledVehicle, BoxShooterGame, RollerMadness, CarbonCreditTokenization
    - _Requirements: 7.1, 7.2, 7.6, 11.4_

- [x] 7. Set up routing and App shell
  - [x] 7.1 Create `App.tsx` with HashRouter, Layout, and all routes
    - HashRouter wrapping all routes
    - Layout component with Navbar, Footer, ScrollToTopButton
    - Route for LandingPage at `/`
    - Routes for all 10 blog posts at `/:slug`
    - Catch-all route for NotFoundPage
    - Scroll-to-top on route change
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 7.2 Write property test for router slug mapping
    - **Property 8: Router maps all known slugs to components**
    - **Validates: Requirements 9.4**
  - [x] 7.3 Create `NotFoundPage` component
    - Display 404 message with link back to landing page
    - _Requirements: 9.2_
  - [x] 7.4 Add React Error Boundary around blog post routes
    - Catch rendering errors in blog post components
    - Display fallback UI with link to landing page
    - _Requirements: 7.2_

- [x] 8. Final checkpoint - Verify complete application
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases using Vitest + React Testing Library
- All existing images, fonts, and CSS are copied to `public/` to preserve visual fidelity
- Blog posts are migrated as React components (not markdown) to preserve complex content (Chart.js, YouTube embeds, tables)
