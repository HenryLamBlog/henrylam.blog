# Requirements Document

## Introduction

A complete visual identity overhaul of the henrylam.blog portfolio site. The goal is to transform the site from a generic template aesthetic into a distinctive, eye-catching developer/AI engineer personal space. This is a visual reskin — the existing component architecture, routing, functionality, and blog post content remain unchanged. All 242 existing tests must continue to pass (updated as needed for new class names/structure).

## Glossary

- **Design_Tokens**: CSS custom properties defined in `globals.css` that control the site's color palette, referenced by Tailwind utility classes.
- **Theme_System**: The light/dark mode toggle powered by `ThemeContext`, which adds/removes the `dark` class on the document root.
- **Glassmorphism**: A visual effect combining semi-transparent backgrounds, backdrop blur, and subtle borders to create a frosted-glass appearance.
- **Gradient_Mesh**: An animated background effect using multiple overlapping radial or conic gradients that shift position or color over time.
- **Hero_Section**: The full-viewport landing header component (`HeroSection.tsx`) displaying the developer's name, photo, and tagline.
- **Project_Gallery**: The filterable grid of project cards (`ProjectGallery.tsx`) on the landing page.
- **Blog_Layout**: The content wrapper component (`BlogPostLayout.tsx`) that provides the header, reading progress, table of contents, and prose styling for all blog posts.
- **Scroll_Animation_System**: The `useScrollAnimation` hook and associated Tailwind classes that trigger entrance animations as elements scroll into view.
- **Featured_Projects**: The top 2–3 projects in the gallery that are displayed at a larger size than the rest.

## Requirements

### Requirement 1: Dark-First Color Palette

**User Story:** As a visitor, I want the site to have a distinctive dark-first color palette with electric accent colors, so that it feels like a developer's personal space rather than a corporate template.

#### Acceptance Criteria

1. THE Design_Tokens SHALL define a dark-first palette where the dark theme uses a deep charcoal/near-black base (approximate RGB 10–18 for background) with a cyan/teal or violet primary accent color instead of the current orange.
2. THE Design_Tokens SHALL define a light theme as the alternative mode, using light neutral backgrounds with the same accent color family.
3. WHEN the Theme_System initializes without a stored preference, THE Theme_System SHALL default to dark mode.
4. WHEN a user toggles the theme, THE Theme_System SHALL switch all Design_Tokens between dark and light values and persist the choice.
5. THE Design_Tokens SHALL include semantic color tokens for success, warning, and error states that are legible on both dark and light backgrounds.
6. THE Design_Tokens SHALL remove all references to the current orange accent color (RGB 249 115 22) and replace them with the new accent family.

### Requirement 2: Developer-Oriented Typography

**User Story:** As a visitor, I want the site's typography to signal "developer" through a monospace-influenced heading font, so that the site's identity is immediately clear.

#### Acceptance Criteria

1. THE Tailwind configuration SHALL define a heading font family using JetBrains Mono or Space Grotesk loaded from Google Fonts.
2. THE Tailwind configuration SHALL retain Inter as the body/sans-serif font family.
3. WHEN the page loads, THE index.html SHALL preconnect to Google Fonts and load the heading font with weights 500, 600, 700, and 800.
4. THE Design_Tokens SHALL ensure heading text is legible and has sufficient contrast (WCAG AA minimum 4.5:1 for normal text, 3:1 for large text) against both dark and light backgrounds.

### Requirement 3: Redesigned Hero Section

**User Story:** As a visitor, I want the hero section to feature an animated gradient mesh background and a bold static statement instead of typed text, so that the first impression is distinctive and memorable.

#### Acceptance Criteria

1. WHEN the landing page loads, THE Hero_Section SHALL display an animated Gradient_Mesh background instead of the current static background image with dark overlay.
2. THE Hero_Section SHALL display the developer's name as a bold static heading with a subtle glow or blur effect behind it, replacing the typed text animation.
3. THE Hero_Section SHALL display the profile photo with updated styling consistent with the new visual identity (border glow or accent ring instead of white ring).
4. THE Hero_Section SHALL retain the scroll-down indicator at the bottom of the viewport.
5. WHEN the Hero_Section renders, THE Hero_Section SHALL not import or use the TypedTextAnimator component.

### Requirement 4: Glassmorphic Project Cards with Featured Layout

**User Story:** As a visitor, I want project cards to use glassmorphism effects and the top projects to be visually prominent, so that the gallery feels modern and highlights the best work.

#### Acceptance Criteria

1. THE Project_Gallery SHALL render the first 2–3 projects at a larger card size (spanning more grid columns) than the remaining projects.
2. THE Project_Gallery SHALL apply Glassmorphism styling to all project cards (semi-transparent background, backdrop-blur, subtle border).
3. WHEN a user hovers over a project card, THE project card SHALL display a glow or animated border effect instead of the current scale transform.
4. THE Project_Gallery SHALL restyle tag pills to match the new accent color palette with a glassmorphic appearance.
5. THE CategoryFilter SHALL restyle filter buttons to match the new visual identity, using the new accent color for the active state.

### Requirement 5: Code-Editor Blog Layout

**User Story:** As a visitor reading a blog post, I want the content area to have a dark code-editor aesthetic with clear section separation, so that reading technical content feels immersive.

#### Acceptance Criteria

1. THE Blog_Layout SHALL apply a code-editor-inspired dark aesthetic to the content area, using the surface color token for the content background.
2. THE Blog_Layout SHALL provide visual separation between sections using styled horizontal rules, gradient dividers, or spacing changes at `h2` boundaries.
3. THE Blog_Layout SHALL restyle the hero header to use the new color palette and remove the current gradient-to-accent pattern.
4. THE Blog_Layout SHALL restyle tag pills and metadata (reading time, category) to match the new visual identity.
5. THE Blog_Layout SHALL preserve all existing functionality: reading progress bar, table of contents (desktop sidebar and mobile collapsible), related projects section, and back-to-projects link.
6. WHEN blog post content is rendered, THE Blog_Layout SHALL not modify the children content (the actual article text in each blog `.tsx` file).

### Requirement 6: Enhanced Micro-Interactions and Animations

**User Story:** As a visitor, I want smooth hover glows, staggered scroll animations, and polished page transitions, so that the site feels responsive and satisfying to interact with.

#### Acceptance Criteria

1. WHEN a user hovers over an interactive element (link, button, card), THE element SHALL display a smooth glow or color transition effect.
2. WHEN elements scroll into view, THE Scroll_Animation_System SHALL apply staggered entrance animations with configurable delay between sibling elements.
3. WHEN navigating between pages, THE PageTransition component SHALL provide a smooth opacity and position transition using Framer Motion.
4. THE ScrollToTopButton SHALL restyle to match the new accent color and include a hover glow effect.

### Requirement 7: Section Transitions and Visual Continuity

**User Story:** As a visitor scrolling through the landing page, I want subtle gradient dividers or mesh backgrounds between sections, so that the page flows smoothly rather than having flat color blocks.

#### Acceptance Criteria

1. THE landing page SHALL use subtle gradient dividers or mesh background transitions between the Hero_Section, About section, and Project_Gallery.
2. THE section backgrounds SHALL use Design_Tokens so they respond correctly to theme changes.
3. THE Footer SHALL restyle to match the new visual identity with the updated color palette and accent colors.

### Requirement 8: Component Visual Consistency

**User Story:** As a visitor, I want all UI components (navbar, table of contents, error pages, loading screen) to share the same visual language, so that the site feels cohesive.

#### Acceptance Criteria

1. THE Navbar SHALL restyle to use the new color palette, with the brand name in the heading font and nav links using the new accent color on hover.
2. THE TableOfContents SHALL restyle links and headings to use the new color palette and accent color.
3. THE NotFoundPage SHALL restyle the 404 display to use the new accent color and heading font.
4. THE ErrorBoundary SHALL replace inline styles with Tailwind classes using the new Design_Tokens.
5. THE PageLoader SHALL restyle the loading spinner to use the new accent color.
6. THE ThemeToggle SHALL restyle to match the new visual identity.

### Requirement 9: Test Compatibility

**User Story:** As a developer, I want all 242 existing tests to continue passing after the visual overhaul, so that I can be confident no functionality was broken.

#### Acceptance Criteria

1. WHEN visual class names or DOM structure change in a component, THE corresponding test files SHALL be updated to match the new selectors and assertions.
2. THE test suite SHALL maintain the same number of passing tests (242) after the overhaul is complete.
3. WHEN the ThemeContext default changes to dark mode, THE ThemeContext tests SHALL be updated to reflect the new default behavior.
