# Requirements Document

## Introduction

This feature covers a comprehensive UI/UX redesign of the henrylam.blog portfolio site. The site was recently migrated from static HTML/jQuery to a React SPA (Vite + TypeScript + React Router with HashRouter) and retains its circa-2015 Bootstrap/fh5co visual design. This redesign replaces Bootstrap with Tailwind CSS, introduces a modern color system, dark mode support, improved typography, page transitions, and reworks every major visual component while preserving all existing content, routing, analytics, and test infrastructure.

## Glossary

- **Site**: The henrylam.blog React SPA portfolio website
- **Tailwind_CSS**: A utility-first CSS framework used to replace Bootstrap for all styling
- **Theme_Provider**: A React context provider that manages light/dark mode state and exposes a toggle function
- **Navbar**: The fixed top navigation bar component rendered on all pages
- **Hero_Section**: The full-viewport introductory banner on the landing page featuring a background image, name, and typed text animator
- **About_Section**: The landing page section displaying personal biography and skill information
- **Resume_Timeline**: The landing page section displaying education and work experience entries chronologically
- **Project_Gallery**: The landing page section displaying project cards with filtering capability
- **Blog_Post_Layout**: The wrapper component for individual blog post pages providing reading enhancements
- **Footer**: The bottom section of every page containing social links and contact information
- **Scroll_To_Top_Button**: A floating button that appears after scrolling and returns the user to the top of the page
- **Page_Transition**: An animated transition effect applied when navigating between routes
- **Color_System**: A cohesive set of design tokens (CSS custom properties) defining the palette for light and dark themes
- **Category_Filter**: A UI control in the Project Gallery that filters displayed projects by category tag
- **Reading_Progress_Indicator**: A visual bar at the top of blog posts showing how far the user has scrolled through the content
- **Table_Of_Contents**: An auto-generated navigation sidebar for blog posts based on heading elements

## Requirements

### Requirement 1: Replace Bootstrap with Tailwind CSS

**User Story:** As a developer, I want to replace Bootstrap with Tailwind CSS, so that the site uses a modern utility-first styling approach that is easier to maintain and customize.

#### Acceptance Criteria

1. THE Site SHALL load Tailwind CSS as the primary styling framework and remove all Bootstrap CDN references from the HTML entry point
2. WHEN any component renders, THE Site SHALL use Tailwind utility classes instead of Bootstrap grid classes (e.g., `col-md-4`, `row`, `container`) for layout
3. THE Site SHALL remove the legacy `css/style.css`, `css/animate.css`, and `css/icomoon.css` files from the bundle after all components have been restyled
4. WHEN the site is built for production, THE Site SHALL produce no references to Bootstrap CSS or JavaScript files in the output

### Requirement 2: Modern Color System and Design Tokens

**User Story:** As a site visitor, I want a cohesive and modern color palette, so that the site feels visually polished and consistent across all sections.

#### Acceptance Criteria

1. THE Color_System SHALL define a primary, secondary, accent, neutral, and semantic (success, warning, error) color scale using CSS custom properties
2. THE Color_System SHALL define separate token sets for light mode and dark mode
3. WHEN a component references a color, THE component SHALL use a CSS custom property from the Color_System rather than a hardcoded hex or RGB value
4. THE Color_System SHALL replace the existing heavy orange (#FF9000) as the sole accent with a broader palette that includes the orange as one accent among complementary tones

### Requirement 3: Dark Mode Support

**User Story:** As a site visitor, I want to toggle between light and dark themes, so that I can read comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Theme_Provider SHALL expose a toggle function and the current theme value (light or dark) via React context
2. WHEN a user clicks the theme toggle control, THE Theme_Provider SHALL switch the active theme between light and dark
3. WHEN the theme changes, THE Site SHALL apply the corresponding Color_System token set to all visible components without a full page reload
4. WHEN a user returns to the site, THE Theme_Provider SHALL restore the previously selected theme from localStorage
5. WHEN no stored preference exists, THE Theme_Provider SHALL default to the user's operating system preferred color scheme
6. IF localStorage is unavailable or throws an error, THEN THE Theme_Provider SHALL fall back to light mode and continue operating without persisting the preference

### Requirement 4: Modern Typography

**User Story:** As a site visitor, I want clean and readable typography with clear visual hierarchy, so that content is easy to scan and pleasant to read.

#### Acceptance Criteria

1. THE Site SHALL use a modern font pairing with a sans-serif body font and a complementary heading font, replacing the legacy Kaushan Script and Lato combination
2. THE Site SHALL define a typographic scale with consistent font sizes, line heights, and spacing for headings (h1 through h4), body text, captions, and labels
3. WHEN content is displayed on a mobile viewport (width below 768px), THE Site SHALL adjust font sizes and line heights to maintain readability without horizontal scrolling

### Requirement 5: Consistent Navbar

**User Story:** As a site visitor, I want a consistent navigation bar across all pages, so that I always know where I am and can navigate without visual jarring.

#### Acceptance Criteria

1. THE Navbar SHALL use a single visual style across both landing and blog pages, removing the current variant switching between white and orange backgrounds
2. WHEN the user scrolls past the hero section on the landing page, THE Navbar SHALL transition from a transparent background to a solid background with a subtle animation
3. WHEN the user is on a blog post page, THE Navbar SHALL display with the solid background style immediately
4. THE Navbar SHALL include a theme toggle control for switching between light and dark modes
5. WHEN the viewport width is below the mobile breakpoint, THE Navbar SHALL collapse navigation links into a hamburger menu that expands on tap
6. WHEN a user clicks a navigation link pointing to a landing page section while on a blog post, THE Navbar SHALL navigate to the landing page and scroll to the target section

### Requirement 6: Modern Hero Section

**User Story:** As a site visitor, I want an impactful first impression when I land on the site, so that I immediately understand who Henry is and what he does.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a full-viewport banner with a background image using a subtle gradient overlay instead of the current heavy orange overlay
2. THE Hero_Section SHALL display the profile photo in a modern frame (rounded with a subtle border or shadow) instead of the legacy circular clip
3. THE Hero_Section SHALL display the name in the heading font from the typographic scale rather than Kaushan Script
4. THE Hero_Section SHALL cycle through 3 to 4 impactful descriptors using the typed text animator instead of the current 20 descriptors
5. WHEN the hero section is in view, THE Hero_Section SHALL render a subtle scroll-down indicator (arrow or chevron) near the bottom of the viewport

### Requirement 7: Improved About Section

**User Story:** As a site visitor, I want to quickly understand Henry's background and skills, so that I can assess his expertise at a glance.

#### Acceptance Criteria

1. THE About_Section SHALL display the biography text in a visually structured layout with clear separation between the introduction and detail paragraphs
2. THE About_Section SHALL display skill areas as styled tags or chips grouped by category (e.g., Languages, Frameworks, Interests)
3. WHEN the viewport width is below the mobile breakpoint, THE About_Section SHALL stack all content vertically with appropriate spacing

### Requirement 8: Improved Resume Timeline

**User Story:** As a site visitor, I want to scan education and work history quickly, so that I can understand Henry's professional background.

#### Acceptance Criteria

1. THE Resume_Timeline SHALL display entries in a single-column vertical layout with subtle card styling instead of the current alternating left-right pattern
2. THE Resume_Timeline SHALL visually distinguish education entries from work experience entries using distinct icon badges and color accents from the Color_System
3. THE Resume_Timeline SHALL group entries under clearly labeled section headings for Education and Work Experience
4. WHEN the viewport width is below the mobile breakpoint, THE Resume_Timeline SHALL maintain the single-column layout with reduced horizontal padding

### Requirement 9: Enhanced Project Gallery

**User Story:** As a site visitor, I want to browse projects by category and see key details at a glance, so that I can find projects relevant to my interests.

#### Acceptance Criteria

1. THE Project_Gallery SHALL display project cards with visible titles and descriptions by default, without requiring hover interaction
2. THE Project_Gallery SHALL display tech stack tags on each project card indicating the technologies used
3. THE Project_Gallery SHALL provide a Category_Filter control with category options (e.g., AI/ML, Games, Hardware, Web, Blockchain) that filters the displayed project cards
4. WHEN a user selects a category from the Category_Filter, THE Project_Gallery SHALL display only projects matching that category
5. WHEN the "All" category is selected or no filter is active, THE Project_Gallery SHALL display all projects
6. THE Project_Gallery SHALL use a responsive grid layout that adjusts from multiple columns on desktop to a single column on mobile viewports
7. WHEN a user clicks a project card, THE Project_Gallery SHALL navigate to the corresponding blog post route

### Requirement 10: Better Blog Reading Experience

**User Story:** As a site visitor reading a blog post, I want reading aids like a table of contents and progress indicator, so that I can navigate long posts and track my reading progress.

#### Acceptance Criteria

1. WHEN a blog post page loads, THE Blog_Post_Layout SHALL display an estimated reading time based on the word count of the post content
2. WHILE a user is scrolling through a blog post, THE Reading_Progress_Indicator SHALL display a horizontal bar at the top of the viewport showing the percentage of the post scrolled
3. WHEN a blog post contains two or more heading elements, THE Table_Of_Contents SHALL render a navigable list of links corresponding to those headings
4. WHEN a user clicks a Table_Of_Contents link, THE Blog_Post_Layout SHALL smooth-scroll to the corresponding heading in the post
5. THE Blog_Post_Layout SHALL style code blocks with syntax-appropriate font, background color, and padding consistent with the Color_System
6. THE Blog_Post_Layout SHALL style HTML tables with borders, alternating row backgrounds, and horizontal scroll on narrow viewports

### Requirement 11: Page Transitions

**User Story:** As a site visitor, I want smooth animated transitions when navigating between pages, so that the browsing experience feels polished and fluid.

#### Acceptance Criteria

1. WHEN a user navigates from one route to another, THE Site SHALL apply a fade or slide transition animation to the outgoing and incoming page content
2. THE Page_Transition SHALL complete within 300 milliseconds to avoid perceived sluggishness
3. WHILE a Page_Transition is animating, THE Site SHALL prevent additional route navigations until the transition completes
4. THE Page_Transition SHALL use Framer Motion as the animation library

### Requirement 12: Improved Footer

**User Story:** As a site visitor, I want easy access to social profiles and a way to get in touch, so that I can connect with Henry beyond the portfolio.

#### Acceptance Criteria

1. THE Footer SHALL display social media icon links (GitHub, LinkedIn, and email) with accessible labels
2. THE Footer SHALL include a "Let's Connect" call-to-action text or heading above the social links
3. THE Footer SHALL display the copyright notice with the current year dynamically
4. WHEN a user clicks a social link, THE Footer SHALL open the link in a new browser tab with appropriate `rel="noopener noreferrer"` attributes

### Requirement 13: Scroll-to-Top Button

**User Story:** As a site visitor, I want a floating button to quickly return to the top of the page, so that I do not have to manually scroll up on long pages.

#### Acceptance Criteria

1. WHEN the user scrolls more than 200 pixels from the top, THE Scroll_To_Top_Button SHALL become visible with a fade-in animation
2. WHEN the user is within 200 pixels of the top, THE Scroll_To_Top_Button SHALL be hidden
3. WHEN the user clicks the Scroll_To_Top_Button, THE Site SHALL smooth-scroll to the top of the page
4. THE Scroll_To_Top_Button SHALL be styled consistently with the Color_System and use a Tailwind-based icon instead of the legacy Icomoon icon font

### Requirement 14: Preserve Existing Content and Functionality

**User Story:** As the site owner, I want all existing content and functionality preserved during the redesign, so that nothing is lost or broken.

#### Acceptance Criteria

1. THE Site SHALL continue to render all 10 existing blog post pages at their current route paths
2. THE Site SHALL continue to use HashRouter for GitHub Pages compatibility
3. THE Site SHALL continue to include the Google Analytics 4 tracking script
4. THE Site SHALL continue to serve all existing images from the `public/images/` directory at their current paths
5. THE Site SHALL continue to deploy to GitHub Pages with the custom domain henrylam.blog via the CNAME file
6. WHEN the redesign is complete, THE Site SHALL pass all existing automated tests (169 tests across 22 test files) after tests are updated to reflect new markup

### Requirement 15: Responsive Design

**User Story:** As a site visitor on any device, I want the site to look and function well on screens of all sizes, so that I have a good experience regardless of my device.

#### Acceptance Criteria

1. THE Site SHALL be fully functional and visually correct at viewport widths of 320px, 768px, 1024px, and 1440px
2. WHEN the viewport width is below 768px, THE Site SHALL use single-column layouts for all content sections
3. THE Site SHALL use Tailwind responsive utility classes (sm, md, lg, xl breakpoints) for all layout adjustments
4. THE Site SHALL ensure all interactive elements (buttons, links, toggles) have a minimum touch target size of 44x44 pixels on mobile viewports
