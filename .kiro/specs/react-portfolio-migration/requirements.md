# Requirements Document

## Introduction

This document specifies the requirements for migrating Henry Lam's personal portfolio and blog website from a static HTML/CSS/jQuery site to a React single-page application. The migration preserves the existing visual design, content, and functionality while modernizing the tech stack. The site is deployed to GitHub Pages with a custom domain (henrylam.blog). Personal details and blog content will be updated from Resume.docx. Proper ignore files will be added for the React project.

## Glossary

- **Portfolio_App**: The React single-page application that replaces the existing static HTML/CSS/jQuery site
- **Landing_Page**: The main page of the Portfolio_App containing the Hero, About Me, Resume, and Projects sections
- **Hero_Section**: The full-height header area displaying a background image, profile photo, and animated typed text
- **Typed_Text_Animator**: The component responsible for cycling through descriptors with a typing/erasing animation effect
- **Resume_Timeline**: The vertical timeline component displaying education and work experience entries
- **Project_Gallery**: The grid of project cards with hover overlay effects
- **Blog_Post_Page**: An individual project/blog detail page accessible via React Router
- **Navbar**: The fixed-top responsive navigation bar with links to About Me, Resume, and Projects sections
- **Router**: React Router, the client-side routing library used for navigation between pages
- **Scroll_Animator**: The component that triggers CSS animations on elements as they scroll into the viewport
- **GitHub_Pages**: The static hosting service used to deploy the Portfolio_App with a custom domain

## Requirements

### Requirement 1: React Project Initialization and Configuration

**User Story:** As a developer, I want the portfolio site rebuilt as a React application with proper project configuration, so that the codebase is modern, maintainable, and deployable to GitHub Pages.

#### Acceptance Criteria

1. THE Portfolio_App SHALL be bootstrapped using Create React App or Vite as the build tool
2. THE Portfolio_App SHALL include a `.gitignore` file that excludes `node_modules/`, build output, OS files (`.DS_Store`), and environment files
3. THE Portfolio_App SHALL include a `CNAME` file in the public directory containing `henrylam.blog` for custom domain support on GitHub Pages
4. THE Portfolio_App SHALL be configured to deploy as a static site to GitHub Pages
5. THE Portfolio_App SHALL include Google Analytics 4 integration with tracking ID `G-K03ESX8LJE`

### Requirement 2: Responsive Navigation

**User Story:** As a visitor, I want a fixed navigation bar that works on all screen sizes, so that I can easily navigate between sections and pages.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed to the top of the viewport and display the brand name "Henry Lam" in Kaushan Script font
2. THE Navbar SHALL contain links to About Me, Resume, and Projects sections on the Landing_Page
3. WHEN a visitor clicks a Navbar section link on the Landing_Page, THE Portfolio_App SHALL smooth-scroll to the corresponding section
4. WHEN a visitor clicks a Navbar section link from a Blog_Post_Page, THE Portfolio_App SHALL navigate to the Landing_Page and scroll to the corresponding section
5. WHEN the viewport width is below 768px, THE Navbar SHALL collapse into a hamburger menu toggle
6. THE Navbar SHALL display a white background with orange (#FF9000) link text on the Landing_Page
7. THE Navbar SHALL display an orange (#FF9000) background with white link text on Blog_Post_Pages

### Requirement 3: Hero Section with Typed Text Animation

**User Story:** As a visitor, I want to see an engaging hero section with animated text, so that I get an immediate impression of who Henry Lam is.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a full-viewport-height background image with a parallax scrolling effect
2. THE Hero_Section SHALL display a circular profile photo and the name "Henry Lam"
3. THE Typed_Text_Animator SHALL cycle through a list of descriptors by typing each one character-by-character, pausing, then erasing character-by-character before moving to the next
4. THE Typed_Text_Animator SHALL randomize the order of descriptors on each full cycle
5. THE Typed_Text_Animator SHALL use a typing speed of 150ms per character and an erasing speed of 75ms per character

### Requirement 4: About Me Section

**User Story:** As a visitor, I want to read about Henry Lam's background, so that I can learn about the person behind the portfolio.

#### Acceptance Criteria

1. THE Portfolio_App SHALL display an About Me section with personal information including name and email (contact@henrylam.blog)
2. THE Portfolio_App SHALL display a biography describing Henry Lam's academic background and interests
3. THE About Me section SHALL update its content to reflect the latest information from Resume.docx

### Requirement 5: Resume Timeline Section

**User Story:** As a visitor, I want to see Henry Lam's education and work experience in a timeline format, so that I can understand the professional background.

#### Acceptance Criteria

1. THE Resume_Timeline SHALL display education entries and work experience entries in a vertical alternating timeline layout
2. THE Resume_Timeline SHALL display each entry with a title, organization name, and date range
3. THE Resume_Timeline SHALL use an icon badge for each entry (graduation cap for education, suitcase for work)
4. THE Resume_Timeline SHALL update its content to reflect the latest education and work experience from Resume.docx
5. WHEN a timeline entry scrolls into the viewport, THE Scroll_Animator SHALL apply a fade-in-up animation to the entry

### Requirement 6: Project Gallery

**User Story:** As a visitor, I want to browse project cards in a grid layout, so that I can discover and navigate to individual project posts.

#### Acceptance Criteria

1. THE Project_Gallery SHALL display project cards in a responsive grid (3 columns on desktop, fewer on smaller screens)
2. WHEN a visitor hovers over a project card, THE Project_Gallery SHALL display a white overlay with the project title and a short description
3. WHEN a visitor clicks a project card, THE Router SHALL navigate to the corresponding Blog_Post_Page
4. THE Project_Gallery SHALL render cards with rounded corners (15px border-radius) and a 1:1 aspect ratio thumbnail image
5. WHEN a project card scrolls into the viewport, THE Scroll_Animator SHALL apply a fade-in-up animation to the card

### Requirement 7: Blog Post Pages

**User Story:** As a visitor, I want to read detailed project write-ups on individual pages, so that I can learn about each project in depth.

#### Acceptance Criteria

1. THE Router SHALL define a route for each of the 10 blog posts using clean URL paths matching the current site (e.g., `/wordle-solver`)
2. EACH Blog_Post_Page SHALL render its content including headings, paragraphs, images, tables, embedded YouTube videos, and code snippets
3. EACH Blog_Post_Page SHALL display a "Related Projects" section at the bottom linking to other blog posts
4. EACH Blog_Post_Page SHALL include a footer with copyright text and a link to henrylam.blog
5. EACH Blog_Post_Page SHALL include a scroll-to-top button that appears after scrolling down 200px
6. THE Portfolio_App SHALL update blog post content to reflect the latest information from Resume.docx where applicable

### Requirement 8: Scroll-Based Animations

**User Story:** As a visitor, I want elements to animate into view as I scroll, so that the browsing experience feels polished and engaging.

#### Acceptance Criteria

1. THE Scroll_Animator SHALL detect when an element enters the viewport (at 85% offset from the top)
2. WHEN an element enters the viewport, THE Scroll_Animator SHALL apply the animation specified by the element's configuration (fadeIn, fadeInLeft, fadeInRight, or fadeInUp)
3. THE Scroll_Animator SHALL apply animations sequentially to sibling elements with a 100ms stagger delay
4. THE Scroll_Animator SHALL apply each animation only once per element (no re-triggering on subsequent scrolls)

### Requirement 9: Client-Side Routing and GitHub Pages Compatibility

**User Story:** As a developer, I want client-side routing to work correctly on GitHub Pages, so that visitors can navigate directly to any page via URL without getting a 404 error.

#### Acceptance Criteria

1. THE Router SHALL use `HashRouter` or a 404.html redirect strategy to support direct URL access on GitHub Pages
2. WHEN a visitor navigates to a non-existent route, THE Portfolio_App SHALL display a 404 page with a link back to the Landing_Page
3. WHEN a visitor navigates between pages, THE Portfolio_App SHALL scroll to the top of the new page
4. THE Router SHALL preserve all existing URL paths so that existing links and bookmarks continue to work

### Requirement 10: Visual Design Preservation

**User Story:** As a site owner, I want the migrated site to look identical to the current site, so that the brand identity and user experience are maintained.

#### Acceptance Criteria

1. THE Portfolio_App SHALL use the existing color scheme: primary orange (#FF9000), dark (#2F3C4F), text (#4d4d4d), background (#f8f9fa)
2. THE Portfolio_App SHALL use Lato (weight 300) as the body font and Kaushan Script as the brand font, loaded from Google Fonts
3. THE Portfolio_App SHALL be responsive at breakpoints 480px, 768px, and 992px
4. THE Portfolio_App SHALL include all existing favicon files and the site.webmanifest
5. THE Portfolio_App SHALL include a page loader animation that fades out when the page is ready

### Requirement 11: Content Update from Resume

**User Story:** As the site owner, I want my portfolio content updated with the latest information from my Resume.docx, so that visitors see current and accurate details.

#### Acceptance Criteria

1. THE Portfolio_App SHALL update the About Me biography to reflect the latest information from Resume.docx
2. THE Resume_Timeline SHALL include all education entries from Resume.docx with accurate titles, institutions, and date ranges
3. THE Resume_Timeline SHALL include all work experience entries from Resume.docx with accurate titles, companies, and date ranges
4. THE Blog_Post_Pages SHALL update any project descriptions that reference outdated personal details
