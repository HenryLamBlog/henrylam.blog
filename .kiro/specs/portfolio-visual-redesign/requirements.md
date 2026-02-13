# Requirements Document

## Introduction

A complete visual redesign of the henrylam.blog portfolio site. The new direction is minimal and clean but distinctive — not generic. The design centers on an orange-anchored color palette with complementary tones, upgraded typography with more personality, and rich animations and satisfying transitions throughout the experience. The site uses React, Tailwind CSS, Vite, and Framer Motion.

## Glossary

- **Design_Token_System**: The set of CSS custom properties (variables) that define colors, spacing, and other visual primitives consumed by Tailwind and components
- **Color_Palette**: The complete set of color tokens including primary, accent, surface, and semantic colors for both light and dark modes
- **Animation_System**: The collection of Framer Motion variants, Tailwind keyframes, and transition presets used across all components
- **Typography_Scale**: The font families, sizes, weights, and line heights used across the site
- **Theme_Toggle**: The UI control and underlying context that switches between light and dark modes
- **Hero_Section**: The full-viewport landing banner with profile photo, name, and subtitle
- **Navbar**: The top navigation bar with links and theme toggle
- **Project_Gallery**: The grid of project cards on the landing page
- **Blog_Post_Layout**: The layout wrapper for individual blog post pages
- **Page_Transition**: The animated wrapper that handles route-change animations
- **Scroll_Animation**: Motion triggered by elements entering or leaving the viewport

## Requirements

### Requirement 1: Orange-Anchored Color Palette

**User Story:** As a visitor, I want the site to have a cohesive, warm color palette anchored by orange, so that the design feels distinctive and intentional.

#### Acceptance Criteria

1. THE Color_Palette SHALL use a warm orange (approximately HSL 25-35°, saturation 90-100%, lightness 55-65%) as the primary accent color
2. THE Color_Palette SHALL include a complementary deep navy or charcoal (approximately HSL 220-240°, lightness 10-15%) as the dark-mode background color
3. THE Color_Palette SHALL include a warm off-white or cream (approximately HSL 30-45°, lightness 96-99%) as the light-mode background color
4. THE Color_Palette SHALL define at least two secondary tones that complement the orange accent, such as a muted amber and a soft coral or terracotta
5. THE Color_Palette SHALL define semantic tokens for success, warning, and error states that maintain WCAG AA contrast on both light and dark backgrounds
6. WHEN a component references a color, THE component SHALL use a CSS custom property from the Design_Token_System rather than a hardcoded value
7. THE Color_Palette SHALL define separate token sets for light mode and dark mode, with the orange accent adapted for legibility in each mode

### Requirement 2: Typography with Personality

**User Story:** As a visitor, I want the typography to feel modern and distinctive, so that the site has a memorable visual identity beyond generic sans-serif.

#### Acceptance Criteria

1. THE Typography_Scale SHALL use a display or heading font with geometric or humanist character (such as Satoshi, General Sans, Cabinet Grotesk, or similar) for headings and the site name
2. THE Typography_Scale SHALL use a clean, highly legible sans-serif (such as Inter, Plus Jakarta Sans, or similar) for body text
3. THE Typography_Scale SHALL define a monospace font for code snippets and technical content
4. THE Typography_Scale SHALL define a type scale with at least five distinct sizes (xs, sm, base, lg, xl, 2xl) with consistent ratios
5. THE Typography_Scale SHALL ensure all body text meets WCAG AA contrast requirements against both light and dark background tokens

### Requirement 3: Dark and Light Mode Support

**User Story:** As a visitor, I want to switch between dark and light modes, so that I can read comfortably in any lighting condition.

#### Acceptance Criteria

1. WHEN the Theme_Toggle is activated, THE Design_Token_System SHALL swap all color tokens between dark and light values within 200ms
2. WHEN the Theme_Toggle is activated, THE Design_Token_System SHALL persist the user preference to local storage
3. WHEN the site loads without a stored preference, THE Design_Token_System SHALL respect the operating system color scheme preference
4. THE Design_Token_System SHALL ensure all interactive elements maintain visible focus indicators in both modes
5. WHEN the theme changes, THE Animation_System SHALL apply a smooth crossfade transition to background and surface colors

### Requirement 4: Scroll-Triggered Animations

**User Story:** As a visitor, I want content to animate into view as I scroll, so that the browsing experience feels dynamic and polished.

#### Acceptance Criteria

1. WHEN a section enters the viewport, THE Animation_System SHALL animate the section content into view using a fade-and-slide-up effect
2. THE Animation_System SHALL stagger child elements within a section so that items appear sequentially with a configurable delay (default 80-120ms between items)
3. THE Animation_System SHALL trigger animations only once per element per page load, preventing re-triggering on scroll-back
4. WHEN the user has enabled reduced-motion preferences, THE Animation_System SHALL disable all scroll-triggered animations and display content immediately
5. THE Animation_System SHALL define reusable Framer Motion variants for fade-up, fade-in, scale-in, and slide-in-from-left/right effects

### Requirement 5: Page Transition Animations

**User Story:** As a visitor, I want smooth transitions between pages, so that navigation feels seamless rather than jarring.

#### Acceptance Criteria

1. WHEN the user navigates between routes, THE Page_Transition SHALL animate the outgoing page out and the incoming page in using a crossfade with subtle vertical shift
2. THE Page_Transition SHALL complete the full enter/exit cycle within 400ms total
3. WHEN the user navigates using browser back/forward, THE Page_Transition SHALL apply the same transition animation
4. WHEN the user has enabled reduced-motion preferences, THE Page_Transition SHALL skip animations and render the new page immediately

### Requirement 6: Hero Section Redesign

**User Story:** As a visitor, I want the hero section to make a strong first impression with animation and visual polish, so that the site feels crafted and professional.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the profile photo with a subtle animated border or glow effect using the accent color
2. THE Hero_Section SHALL animate the name and subtitle into view on initial load using a staggered fade-and-slide-up sequence
3. THE Hero_Section SHALL include a subtle animated background element (such as a gradient shift, floating shapes, or particle effect) that adds visual interest without distracting from content
4. THE Hero_Section SHALL include an animated scroll indicator that pulses or bounces to invite scrolling
5. WHEN the user scrolls past the Hero_Section, THE Navbar SHALL transition from transparent to a solid surface background with a smooth opacity animation

### Requirement 7: Interactive Project Cards

**User Story:** As a visitor, I want project cards to respond to interaction with satisfying animations, so that browsing projects feels engaging.

#### Acceptance Criteria

1. WHEN a visitor hovers over a project card, THE Project_Gallery SHALL apply a scale-up and subtle shadow elevation animation within 200ms
2. WHEN a visitor hovers over a project card, THE Project_Gallery SHALL reveal additional information (such as tech stack tags or a short description) with a slide-up or fade-in animation
3. THE Project_Gallery SHALL stagger the entrance animation of cards when the gallery section scrolls into view
4. WHEN a visitor clicks a project card, THE Project_Gallery SHALL apply a brief press animation before navigating

### Requirement 8: Micro-Interactions and Polish

**User Story:** As a visitor, I want small interactive details throughout the site, so that the experience feels responsive and thoughtfully designed.

#### Acceptance Criteria

1. WHEN a visitor hovers over a navigation link, THE Navbar SHALL display an animated underline or highlight effect
2. WHEN a visitor hovers over a button or clickable element, THE element SHALL apply a subtle scale or color transition within 150ms
3. THE Animation_System SHALL define a consistent easing curve (such as cubic-bezier(0.16, 1, 0.3, 1)) used across all micro-interactions for visual coherence
4. WHEN a visitor clicks the Theme_Toggle, THE Theme_Toggle SHALL animate the icon transition (sun to moon or vice versa) with a rotation or morph effect

### Requirement 9: Blog Post Layout Polish

**User Story:** As a reader, I want blog posts to be visually clean and pleasant to read, so that I can focus on the content.

#### Acceptance Criteria

1. THE Blog_Post_Layout SHALL use the Typography_Scale with comfortable line height (1.7-1.8) and a maximum content width of 65-75 characters for readability
2. THE Blog_Post_Layout SHALL style code blocks with the monospace font, a distinct surface background, and syntax highlighting that complements the Color_Palette
3. WHEN a blog post loads, THE Blog_Post_Layout SHALL animate the title and metadata into view before the body content
4. THE Blog_Post_Layout SHALL style blockquotes, lists, and headings with accent color highlights that tie into the overall Color_Palette

### Requirement 10: Animated Reading Progress Bar

**User Story:** As a blog reader, I want a visual indicator of how far I've read, so that I can gauge my progress through an article.

#### Acceptance Criteria

1. WHILE a visitor is on a blog post page, THE ReadingProgress bar SHALL display a fixed bar at the top of the viewport that fills from left to right based on scroll position
2. THE ReadingProgress bar SHALL use the primary accent color with a subtle gradient or glow effect
3. THE ReadingProgress bar SHALL animate width changes smoothly rather than jumping between values
4. WHEN the visitor reaches the end of the article, THE ReadingProgress bar SHALL fill to 100% and remain visible

### Requirement 11: Scroll-to-Top Button

**User Story:** As a visitor, I want a button to quickly return to the top of the page, so that I can navigate long pages easily.

#### Acceptance Criteria

1. WHEN the visitor scrolls past 300px from the top, THE ScrollToTopButton SHALL fade in with a scale-up animation
2. WHEN the visitor scrolls back above 300px, THE ScrollToTopButton SHALL fade out with a scale-down animation
3. WHEN the visitor clicks the ScrollToTopButton, THE page SHALL scroll smoothly to the top
4. THE ScrollToTopButton SHALL use the accent color and include a hover animation consistent with the Animation_System easing curve

### Requirement 12: Table of Contents with Active Tracking

**User Story:** As a blog reader, I want a table of contents that highlights where I am in the article, so that I can navigate and orient myself within long posts.

#### Acceptance Criteria

1. WHILE a visitor is reading a blog post, THE TableOfContents SHALL highlight the currently visible heading using the accent color
2. WHEN the visitor clicks a table of contents link, THE page SHALL smooth-scroll to the corresponding heading
3. WHEN the viewport is below 1024px, THE TableOfContents SHALL collapse into a disclosure widget with an animated open/close transition
4. THE TableOfContents SHALL update the active heading indicator with a smooth transition rather than an instant swap

### Requirement 13: Animated Category Filter

**User Story:** As a visitor browsing projects, I want the category filter to animate when switching categories, so that the interaction feels polished and responsive.

#### Acceptance Criteria

1. WHEN a visitor selects a category filter, THE CategoryFilter SHALL animate the active indicator (background pill) sliding to the selected tab
2. WHEN the project list filters, THE Project_Gallery SHALL animate cards out and in using a layout animation so cards reflow smoothly rather than jumping
3. THE CategoryFilter active tab SHALL use the accent color as its background with the background text color for contrast

### Requirement 14: Footer and Social Link Animations

**User Story:** As a visitor, I want the footer to feel interactive and alive, so that the site's polish extends to the very bottom.

#### Acceptance Criteria

1. WHEN a visitor hovers over a social link icon in the footer, THE Footer SHALL apply a scale-up and accent-color glow animation
2. THE Footer SHALL animate into view when it enters the viewport using the standard scroll-triggered fade-up animation
3. THE Footer social icons SHALL use the accent color on hover with a smooth color transition

### Requirement 15: Branded Page Loader

**User Story:** As a visitor, I want a visually branded loading state, so that even the loading experience feels intentional.

#### Acceptance Criteria

1. WHEN the site is loading, THE PageLoader SHALL display a centered loading animation using the accent color
2. WHEN the site finishes loading, THE PageLoader SHALL fade out smoothly over 400-600ms before being removed from the DOM
3. THE PageLoader SHALL use the current theme's background color so it blends seamlessly with the loaded page

### Requirement 16: About Section with Staggered Skill Animations

**User Story:** As a visitor, I want the about section to reveal content progressively, so that it feels dynamic rather than static.

#### Acceptance Criteria

1. WHEN the About section enters the viewport, THE AboutSection SHALL animate the bio text and skill categories into view with a staggered sequence
2. THE AboutSection skill chips SHALL animate in with a staggered delay within each category group
3. WHEN a visitor hovers over a skill chip, THE skill chip SHALL apply a subtle scale and accent-highlight animation

### Requirement 17: Animated Section Dividers

**User Story:** As a visitor, I want visual separation between sections that feels intentional and animated, so that the page has clear rhythm and flow.

#### Acceptance Criteria

1. THE LandingPage SHALL display animated dividers between the Hero, About, and Projects sections
2. THE section dividers SHALL use a gradient line that animates its opacity or width when it enters the viewport
3. THE section dividers SHALL use colors from the Color_Palette (accent color with transparency)

### Requirement 18: Navbar Mobile Menu Animation

**User Story:** As a mobile visitor, I want the navigation menu to open and close with a smooth animation, so that the interaction feels polished.

#### Acceptance Criteria

1. WHEN the hamburger menu is tapped, THE Navbar mobile menu SHALL slide down or fade in with a smooth animation over 200-300ms
2. WHEN the mobile menu is closed, THE Navbar mobile menu SHALL animate out with a matching reverse animation
3. THE Navbar hamburger icon SHALL animate between the open (menu) and close (X) states with a morph or rotation transition

### Requirement 19: Project Card Image Lazy Loading with Fade-In

**User Story:** As a visitor, I want project images to load gracefully, so that the page feels smooth even on slower connections.

#### Acceptance Criteria

1. THE Project_Gallery card images SHALL lazy-load using native browser lazy loading or Intersection Observer
2. WHEN a project card image finishes loading, THE image SHALL fade in from transparent to fully visible over 300ms
3. WHILE a project card image is loading, THE card SHALL display a placeholder with the surface background color

### Requirement 20: Responsive Design Consistency

**User Story:** As a visitor on any device, I want the design to adapt gracefully, so that the experience is consistent across screen sizes.

#### Acceptance Criteria

1. THE Design_Token_System SHALL define responsive breakpoints at 640px, 768px, 1024px, and 1280px
2. WHEN the viewport is below 768px, THE Navbar SHALL collapse into a hamburger menu with an animated open/close transition
3. WHEN the viewport is below 768px, THE Project_Gallery SHALL switch from a multi-column grid to a single-column stack
4. THE Typography_Scale SHALL scale heading sizes down proportionally on viewports below 640px
5. WHEN the viewport is below 640px, THE Animation_System SHALL reduce animation distances (translate values) by 50% to prevent content from appearing to jump
