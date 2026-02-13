# Requirements Document

## Introduction

This feature replaces the ProjectGallery grid layout with a horizontal scrollable carousel, removes the redundant hero header from BlogPostLayout, and fixes the invisible-but-clickable filtered cards bug. The carousel provides a polished browsing experience with auto-scroll, navigation arrows, and graceful handling of small result sets. The blog cleanup removes the hero banner since the navbar already handles navigation.

## Glossary

- **Carousel**: A horizontal scrollable container that displays ProjectCard components in a single row with overflow scrolling, navigation arrows, and optional auto-scroll behavior.
- **ProjectGallery**: The React component that renders the projects section on the landing page, including category filter tabs and project cards.
- **ProjectCard**: The React component that renders an individual project as a clickable card with image, title, description, and tags.
- **CategoryFilter**: The React component that renders filter tabs allowing users to select a project category.
- **BlogPostLayout**: The React component that wraps blog post content with reading progress, table of contents, and related projects.
- **Hero_Header**: The gradient banner section in BlogPostLayout containing the back-to-projects link, project title, description, meta row, and tags.
- **Navigation_Arrows**: Left and right arrow buttons overlaid on the Carousel edges for manual scrolling.
- **Auto_Scroll**: Automatic horizontal scrolling behavior that cycles through Carousel items at a timed interval.
- **Design_Tokens**: CSS custom properties defined in globals.css and Tailwind config that provide the color palette, shadows, and spacing values.

## Requirements

### Requirement 1: Carousel Layout

**User Story:** As a visitor, I want to browse projects in a horizontal carousel, so that I can quickly scan through projects with a modern, engaging interaction.

#### Acceptance Criteria

1. WHEN the ProjectGallery renders, THE Carousel SHALL display filtered ProjectCard components in a single horizontal scrollable row.
2. WHEN the number of visible cards exceeds the viewport width, THE Carousel SHALL allow horizontal scrolling to reveal additional cards.
3. THE Carousel SHALL render ProjectCard components with elevated shadow styling and depth treatment using the existing Design_Tokens (shadow-glow, surface, border).
4. WHEN a user scrolls or navigates the Carousel, THE Carousel SHALL animate card transitions with smooth easing using Framer Motion.
5. THE Carousel SHALL preserve the existing ProjectCard component interface (slug, title, description, image, tags, category props) without modification.

### Requirement 2: Carousel Navigation

**User Story:** As a visitor, I want navigation arrows on the carousel, so that I can manually browse projects without relying solely on scroll gestures.

#### Acceptance Criteria

1. THE Carousel SHALL display a left Navigation_Arrow and a right Navigation_Arrow overlaid on the carousel edges.
2. WHEN a user clicks the right Navigation_Arrow, THE Carousel SHALL scroll forward by one card width with a smooth animation.
3. WHEN a user clicks the left Navigation_Arrow, THE Carousel SHALL scroll backward by one card width with a smooth animation.
4. WHEN the Carousel is scrolled to the beginning, THE left Navigation_Arrow SHALL be visually hidden or disabled.
5. WHEN the Carousel is scrolled to the end, THE right Navigation_Arrow SHALL be visually hidden or disabled.
6. THE Navigation_Arrows SHALL be keyboard-focusable and include aria-label attributes describing their scroll direction.

### Requirement 3: Carousel Auto-Scroll

**User Story:** As a visitor, I want the carousel to auto-scroll through projects, so that I can passively discover projects without manual interaction.

#### Acceptance Criteria

1. WHEN the ProjectGallery mounts and the filtered project count exceeds the number of visible cards, THE Carousel SHALL begin Auto_Scroll at a timed interval.
2. WHEN a user hovers over the Carousel, THE Auto_Scroll SHALL pause.
3. WHEN a user moves the pointer away from the Carousel, THE Auto_Scroll SHALL resume from the current scroll position.
4. WHEN the filtered project count is less than or equal to the number of visible cards, THE Carousel SHALL disable Auto_Scroll and display cards as a static horizontal strip.

### Requirement 4: Category Filtering with Carousel

**User Story:** As a visitor, I want to filter projects by category and see results in the carousel, so that I can focus on projects in a specific domain.

#### Acceptance Criteria

1. THE CategoryFilter SHALL remain positioned above the Carousel and continue to function with the existing tab interface.
2. WHEN a user selects a category, THE Carousel SHALL display only ProjectCard components matching that category.
3. WHEN a category filter changes, THE Carousel SHALL reset its scroll position to the beginning.
4. WHEN filtering results in one or two cards, THE Carousel SHALL display them as a centered horizontal strip without looping or awkward spacing.
5. WHEN the "All" category is selected, THE Carousel SHALL display all ProjectCard components.

### Requirement 5: Remove Blog Hero Header

**User Story:** As a visitor, I want a cleaner blog post layout without the redundant hero banner, so that I can focus on the content without duplicate navigation elements.

#### Acceptance Criteria

1. THE BlogPostLayout SHALL render without the Hero_Header section (gradient banner, back-to-projects link, project title, description, meta row, and tags).
2. THE BlogPostLayout SHALL retain the ReadingProgress bar, TableOfContents, article content area, and RelatedProjects section.
3. THE BlogPostLayout SHALL continue to accept and render children content inside the article element with existing prose styling.

### Requirement 6: Fix Invisible Filtered Cards Bug

**User Story:** As a visitor, I want filtered project cards to be fully visible and interactive, so that I do not encounter invisible but clickable elements.

#### Acceptance Criteria

1. WHEN a category filter is applied, THE Carousel SHALL render only the matching ProjectCard components in the DOM.
2. THE Carousel SHALL not render hidden or zero-opacity cards that remain clickable.

### Requirement 7: Accessibility

**User Story:** As a visitor using assistive technology, I want the carousel to be keyboard-navigable and properly labeled, so that I can browse projects without a mouse.

#### Acceptance Criteria

1. THE Carousel container SHALL have an appropriate ARIA role and aria-label describing its purpose.
2. THE Navigation_Arrows SHALL be focusable via keyboard Tab navigation and activatable via Enter or Space keys.
3. WHEN a user presses the left or right arrow key while the Carousel has focus, THE Carousel SHALL scroll in the corresponding direction.

### Requirement 8: Design Token Compliance

**User Story:** As a developer, I want the carousel to use the existing design token system, so that the visual style remains consistent and maintainable.

#### Acceptance Criteria

1. THE Carousel SHALL use only Design_Tokens (CSS custom properties and Tailwind config values) for colors, shadows, and borders.
2. THE Carousel SHALL not contain hardcoded color values (hex, rgb, hsl literals).
3. THE Navigation_Arrows SHALL use Design_Token colors for their icons and hover states.

### Requirement 9: Test Compatibility

**User Story:** As a developer, I want all existing tests to continue passing after these changes, so that the refactoring does not introduce regressions.

#### Acceptance Criteria

1. WHEN the carousel replaces the grid layout, THE existing ProjectCard unit tests and property tests SHALL continue to pass without modification to the ProjectCard component interface.
2. WHEN the Hero_Header is removed from BlogPostLayout, THE BlogPostLayout test suite SHALL be updated to reflect the new structure.
3. THE ProjectGallery test suite SHALL be updated to validate carousel behavior instead of grid layout behavior.
