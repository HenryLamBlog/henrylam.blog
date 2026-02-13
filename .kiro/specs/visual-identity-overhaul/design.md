# Design Document: Visual Identity Overhaul

## Overview

This design covers a complete visual reskin of the henrylam.blog portfolio site. The existing React + Tailwind + Vite + Framer Motion architecture is preserved — no structural rewrites, no new dependencies beyond a Google Fonts change. The overhaul touches design tokens, typography, and every visual component to create a cohesive dark-first developer aesthetic.

The approach is layered: update the foundation (CSS custom properties, Tailwind config, fonts) first, then restyle components top-down. Tests are updated alongside each component to maintain the 242-test pass count.

## Architecture

The site's visual system is a three-layer stack:

```
┌─────────────────────────────────────┐
│  Components (TSX + Tailwind classes)│  ← Per-component styling
├─────────────────────────────────────┤
│  Tailwind Config (tailwind.config.ts)│  ← Semantic color aliases, font families
├─────────────────────────────────────┤
│  Design Tokens (globals.css)         │  ← CSS custom properties (RGB triplets)
└─────────────────────────────────────┘
```

Changes flow bottom-up: updating a design token automatically propagates to every component using that Tailwind alias. Component-level changes are only needed for structural styling changes (glassmorphism, gradient mesh, layout shifts).

### Key Design Decisions

1. **Dark-first default**: `ThemeContext.getInitialTheme()` changes to return `'dark'` when no stored preference exists and no OS preference is detected. The `:root` tokens become the dark palette; `.light` class overrides for light mode (inverted from current `.dark` override pattern — but we keep the existing `darkMode: 'class'` Tailwind strategy and just swap which set of values is `:root` vs `.dark`).

   **Decision rationale**: Keeping `darkMode: 'class'` with `.dark` on `<html>` means we keep the existing Tailwind `dark:` prefix working. We just swap the color values so `:root` = dark palette and `.dark` is still applied by default. The `.dark` class removal triggers light mode. This minimizes code changes — only `globals.css` token values and `ThemeContext` default change.

   **Correction**: Actually, to minimize disruption, we keep the exact same mechanism: `:root` = light tokens, `.dark` = dark tokens. We only change `getInitialTheme()` to default to `'dark'` instead of `'light'`. This way all existing `dark:` prefixes in Tailwind classes continue to work correctly.

2. **Accent color**: Cyan/teal (`--color-accent`) as primary accent. This provides strong contrast on dark backgrounds and reads as "tech/developer."

3. **No new runtime dependencies**: The gradient mesh and glow effects use pure CSS (radial gradients, `@keyframes`, `box-shadow`). No canvas libraries or particle systems.

4. **Featured projects via CSS grid**: The first 2 projects span 2 columns on `lg:` breakpoint using `col-span-2` / conditional classes. No data model changes.

## Components and Interfaces

### Design Tokens (globals.css)

```css
:root {
  /* Primary: slate-blue */
  --color-primary: 100 120 160;
  --color-primary-light: 140 160 200;

  /* Secondary: cool gray */
  --color-secondary: 130 140 155;

  /* Accent: cyan/teal */
  --color-accent: 0 210 210;
  --color-accent-light: 80 235 235;

  /* Light mode base */
  --color-bg: 250 250 252;
  --color-surface: 240 242 246;
  --color-text: 20 25 35;
  --color-text-muted: 100 110 130;
  --color-border: 215 220 230;

  /* Semantic */
  --color-success: 34 197 94;
  --color-warning: 234 179 8;
  --color-error: 239 68 68;
}

.dark {
  --color-primary: 160 180 220;
  --color-primary-light: 200 210 235;

  --color-secondary: 140 150 170;

  --color-accent: 0 230 230;
  --color-accent-light: 100 245 245;

  --color-bg: 12 12 18;
  --color-surface: 22 24 32;
  --color-text: 235 238 245;
  --color-text-muted: 140 150 175;
  --color-border: 40 45 60;

  --color-success: 74 222 128;
  --color-warning: 250 204 21;
  --color-error: 248 113 113;
}
```

### Typography (tailwind.config.ts + index.html)

```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
}
```

Google Fonts link updated to load Space Grotesk (500–800) and JetBrains Mono (400–700) alongside Inter.

**Decision**: Space Grotesk for headings (geometric, developer-adjacent but still readable at display sizes). JetBrains Mono available as `font-mono` for code blocks and decorative elements. Inter stays for body text.

### Tailwind Config Additions

New utility classes added to `theme.extend`:

```typescript
boxShadow: {
  glow: '0 0 20px rgba(0, 210, 210, 0.3)',
  'glow-lg': '0 0 40px rgba(0, 210, 210, 0.4)',
},
backdropBlur: {
  xs: '2px',
},
animation: {
  'gradient-shift': 'gradient-shift 8s ease infinite',
},
keyframes: {
  'gradient-shift': {
    '0%, 100%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
  },
},
```

### HeroSection.tsx

**Before**: Background image + dark overlay + TypedTextAnimator
**After**: Animated gradient mesh + static bold statement + glow name

```
┌──────────────────────────────────────────┐
│  Animated gradient mesh (CSS keyframes)  │
│                                          │
│         [Profile photo with              │
│          accent ring + glow]             │
│                                          │
│     ░░ Henry Lam ░░  (glow behind)       │
│     Software Engineer · AI Developer     │
│                                          │
│            ▼ (scroll indicator)          │
└──────────────────────────────────────────┘
```

The gradient mesh is built with 3–4 overlapping `radial-gradient` layers on a `div`, animated via CSS `@keyframes` that shift `background-position`. No JS animation loop needed.

The TypedTextAnimator import is removed. The component file and its tests are kept.

### ProjectGallery.tsx + ProjectCard

**Featured layout**: First 2 projects get `md:col-span-2 lg:col-span-1 lg:row-span-1` on medium screens, and on `lg:` the grid becomes a 3-column layout where the first 2 cards span the full width of 2 columns each (stacked), or a bento-style layout. Simplest approach: first 2 cards get `lg:col-span-2` in a `grid-cols-3` layout.

**Glassmorphism card styling**:
```
bg-surface/60 backdrop-blur-md border border-border/50 rounded-2xl
```

**Hover effect**: Replace `hover:scale-[1.02]` with a glow border:
```
hover:shadow-glow hover:border-accent/50 transition-all duration-300
```

**Tag pills**: `bg-accent/10 text-accent border border-accent/20 backdrop-blur-sm`

### BlogPostLayout.tsx

**Hero header**: Dark gradient using surface/bg tokens instead of primary-to-accent. Pattern overlay kept but updated to match new palette.

**Content area**: The `prose` container gets a subtle surface background on dark mode to create the "editor panel" feel:
```
dark:bg-surface/30 dark:rounded-2xl dark:p-8 dark:border dark:border-border/30
```

**Section separation**: `prose-h2` gets a left accent border instead of bottom border:
```
prose-h2:border-l-4 prose-h2:border-l-accent prose-h2:pl-4 prose-h2:border-b-0
```

Children content is never modified — only the wrapper/prose classes change.

### Navbar.tsx

- Solid background uses `bg-bg/80 backdrop-blur-md` for a frosted effect when scrolled
- Brand name uses `font-heading` (Space Grotesk)
- Hover states use accent color glow: `hover:text-accent`
- Mobile menu gets `bg-bg/95 backdrop-blur-lg`

### Other Components

**CategoryFilter**: Active button gets `bg-accent text-bg` (dark text on cyan). Inactive: `bg-surface/60 backdrop-blur-sm text-text-muted hover:text-accent`.

**Footer**: `bg-surface/50 backdrop-blur-sm border-t border-border/50`. Social icons get `hover:text-accent hover:drop-shadow-[0_0_8px_rgba(0,210,210,0.5)]`.

**ScrollToTopButton**: `bg-accent/90 hover:bg-accent hover:shadow-glow`.

**PageLoader**: Spinner border uses accent color. Background matches `bg-bg`.

**NotFoundPage**: 404 in accent color with glow effect. Heading in `font-heading`.

**ErrorBoundary**: Replace all inline `style=` attributes with Tailwind classes using design tokens. `text-accent` instead of hardcoded `#FF9000`.

**ThemeToggle**: Hover state adds subtle glow: `hover:text-accent`.

**TableOfContents**: Links use `hover:text-accent`. Desktop sticky sidebar gets subtle left border `border-l border-border/50`.

**RelatedProjects**: Cards get same glassmorphism treatment as ProjectCard.

**ReadingProgress**: Bar color stays `bg-accent` (just changes with new accent value).

**PageTransition**: Enhance Framer Motion variants — slightly longer duration (0.35s), add subtle scale:
```typescript
initial={{ opacity: 0, y: 12, scale: 0.99 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -12, scale: 0.99 }}
transition={{ duration: 0.35, ease: 'easeOut' }}
```

### Section Transitions (LandingPage)

Add gradient divider elements between sections in `LandingPage.tsx`:

```tsx
<div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
```

These are thin decorative `div`s placed between HeroSection → AboutSection → ProjectGallery.

## Data Models

No data model changes. The `Project` interface, `projects` array, `CATEGORIES`, blog route config, and all hook interfaces remain unchanged. This is purely a visual reskin.

The only data-adjacent change is in `ThemeContext.tsx` where `getInitialTheme()` defaults to `'dark'` instead of `'light'` when no stored preference or OS preference is found.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Theme token value ranges

*For any* theme mode (dark or light), the background design token (`--color-bg`) RGB components should fall within the expected luminance range for that mode — dark mode backgrounds below 30 per channel, light mode backgrounds above 230 per channel.

**Validates: Requirements 1.1, 1.2**

### Property 2: Theme toggle round-trip

*For any* initial theme state, toggling the theme twice should return the theme to its original value, and the persisted value in localStorage should match.

**Validates: Requirements 1.4**

### Property 3: Heading text contrast ratio

*For any* theme mode, the computed contrast ratio between the heading text color (`--color-text`) and the background color (`--color-bg`) should meet WCAG AA large text minimum (3:1 ratio).

**Validates: Requirements 2.4**

### Property 4: Featured project layout differentiation

*For any* list of projects with 3 or more items, the first 2 rendered project cards should have CSS classes that make them visually larger (e.g., `col-span-2` or equivalent) while the remaining cards do not have those classes.

**Validates: Requirements 4.1**

### Property 5: Project card glassmorphism and hover styling

*For any* rendered project card, the card element should contain glassmorphism classes (`backdrop-blur`, semi-transparent background) and glow-based hover classes, and should not contain the old `hover:scale` transform class.

**Validates: Requirements 4.2, 4.3**

### Property 6: Blog layout functional element preservation

*For any* BlogPostLayout rendered with a set of related slugs, the output should contain: a reading progress bar, a table of contents region, a back-to-projects link, and a related projects section (when slugs are non-empty).

**Validates: Requirements 5.5**

### Property 7: Blog layout children passthrough

*For any* children passed to BlogPostLayout, the children content should appear in the rendered output without modification.

**Validates: Requirements 5.6**

### Property 8: Staggered scroll animation delays

*For any* set of N intersecting elements processed by `processAnimationEntries`, the returned delay values should form an arithmetic sequence: element i gets delay `i * staggerDelay`.

**Validates: Requirements 6.2**

### Property 9: Section backgrounds use design tokens

*For any* section-level component (HeroSection, AboutSection, ProjectGallery, Footer), the rendered background CSS classes should reference Tailwind token aliases (`bg-bg`, `bg-surface`, or gradient classes using token colors) rather than hardcoded color values.

**Validates: Requirements 7.2**

### Property 10: ErrorBoundary uses no inline styles

*For any* error state in ErrorBoundary, the rendered fallback UI should contain zero inline `style` attributes, using only Tailwind CSS classes for styling.

**Validates: Requirements 8.4**

## Error Handling

No new error handling is introduced. The existing error handling remains:

- **ErrorBoundary**: Catches render errors in blog post routes, displays fallback UI (now styled with Tailwind instead of inline styles)
- **ThemeContext**: Gracefully handles missing `localStorage` and `matchMedia` APIs
- **Image loading**: Project card images use standard `<img>` tags; broken images show browser default behavior (unchanged)
- **Font loading**: Google Fonts loaded with `display=swap` to prevent FOIT (Flash of Invisible Text)

The only behavioral change is the ErrorBoundary fallback UI moving from inline styles to Tailwind classes, which is covered by Property 10.

## Testing Strategy

### Dual Testing Approach

The site has 242 existing tests (unit + property-based) using Vitest + Testing Library + fast-check. The overhaul requires:

1. **Updating existing tests** to match new class names, DOM structure, and default theme
2. **Adding new property tests** for the correctness properties defined above
3. **Keeping all existing property tests passing** (they test functional behavior, not visual styling)

### Unit Tests

Unit tests should be updated alongside each component change:

- **ThemeContext tests**: Update default theme expectation from `'light'` to `'dark'`
- **HeroSection tests**: Remove TypedTextAnimator assertions, add static heading assertions
- **ProjectGallery tests**: Update card class assertions for glassmorphism, add featured layout checks
- **ErrorBoundary tests**: Update to check for Tailwind classes instead of inline styles
- **Navbar tests**: Update class name assertions if needed
- **Component snapshot/class assertions**: Any test checking specific CSS classes needs updating

### Property-Based Tests

Property-based tests use `fast-check` with minimum 100 iterations per property.

Each property test must be tagged with:
**Feature: visual-identity-overhaul, Property {number}: {property_text}**

Properties to implement:
- Property 1 (token ranges): Generate theme mode, parse CSS custom property values, assert range
- Property 2 (toggle round-trip): Already covered by existing ThemeContext property tests — verify still passes with new default
- Property 3 (contrast ratio): Compute relative luminance and contrast ratio from token RGB values
- Property 4 (featured layout): Generate project lists of varying length, render, check first 2 cards
- Property 5 (glassmorphism + hover): Generate projects, render cards, check class lists
- Property 6 (blog functional elements): Render BlogPostLayout with random slug sets, check for required elements
- Property 7 (children passthrough): Render BlogPostLayout with random children, verify children appear
- Property 8 (stagger delays): Already covered by existing `useScrollAnimation.property.test.ts` — verify still passes
- Property 9 (token backgrounds): Render section components, inspect background classes
- Property 10 (no inline styles): Trigger ErrorBoundary error state, inspect rendered HTML for `style=`

### Test Configuration

- Runner: Vitest with `--run` flag (no watch mode)
- Property iterations: 100 minimum per property test
- Library: `fast-check` (already installed)
- Coverage: All 242 existing tests must pass + new property tests added
