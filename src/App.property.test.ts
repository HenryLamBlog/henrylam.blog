import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { blogRoutes } from './App';
import { projects } from './components/ProjectGallery';

/**
 * Property 8: Router maps all known slugs to components
 *
 * For any slug in the known set of blog post slugs, the router configuration
 * should map that slug to a valid React component, ensuring no slug results
 * in a 404 when it should resolve to a blog post.
 *
 * **Validates: Requirements 9.4**
 */

/** All known slugs from the blogRoutes configuration */
const routeSlugs = blogRoutes.map((r) => r.slug);

/** Build a lookup map from slug → component for quick verification */
const routeMap = new Map(blogRoutes.map((r) => [r.slug, r.component]));

/** Arbitrary that picks a random slug from the known set */
const knownSlugArb = fc.constantFrom(...routeSlugs);

describe('Property 8: Router maps all known slugs to components', () => {
  it('every randomly-selected known slug maps to a valid React component', () => {
    fc.assert(
      fc.property(knownSlugArb, (slug) => {
        const component = routeMap.get(slug);
        expect(component).toBeDefined();
        expect(typeof component).toBe('function');
      }),
      { numRuns: 100 },
    );
  });

  it('all project gallery slugs are covered by blog routes', () => {
    fc.assert(
      fc.property(fc.constantFrom(...projects.map((p) => p.slug)), (slug) => {
        expect(routeMap.has(slug)).toBe(true);
        expect(typeof routeMap.get(slug)).toBe('function');
      }),
      { numRuns: 100 },
    );
  });

  it('blogRoutes and projects have the same set of slugs', () => {
    const projectSlugs = new Set(projects.map((p) => p.slug));
    const blogSlugs = new Set(routeSlugs);
    expect(blogSlugs).toEqual(projectSlugs);
  });

  it('no duplicate slugs exist in blogRoutes', () => {
    const slugSet = new Set(routeSlugs);
    expect(slugSet.size).toBe(blogRoutes.length);
  });
});

/**
 * Feature: portfolio-ui-redesign, Property 13: All blog routes map to valid components
 *
 * For any blog route in the blogRoutes configuration, the slug should be a
 * non-empty string and the component should be a valid React component
 * (not null or undefined).
 *
 * **Validates: Requirements 14.1**
 */
describe('Feature: portfolio-ui-redesign, Property 13: All blog routes map to valid components', () => {
  const blogRouteArb = fc.constantFrom(...blogRoutes);

  it('every blog route has a non-empty slug and a valid React component', () => {
    fc.assert(
      fc.property(blogRouteArb, (route) => {
        // Slug must be a non-empty string
        expect(typeof route.slug).toBe('string');
        expect(route.slug.length).toBeGreaterThan(0);

        // Component must not be null or undefined
        expect(route.component).not.toBeNull();
        expect(route.component).not.toBeUndefined();

        // Component must be a valid React component (function)
        expect(typeof route.component).toBe('function');
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: portfolio-ui-redesign, Property 14: All project images reference existing paths
 *
 * For any project in the projects array, the image path should start with
 * `/images/` and reference a file that exists in the `public/images/` directory.
 *
 * **Validates: Requirements 14.4**
 */
describe('Feature: portfolio-ui-redesign, Property 14: All project images reference existing paths', () => {
  const projectArb = fc.constantFrom(...projects);

  it('every project image path starts with /images/ and references an existing file', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        // Image path must start with /images/
        expect(project.image.startsWith('/images/')).toBe(true);

        // The referenced file must exist in public/images/
        const relativePath = project.image.replace(/^\//, '');
        const fullPath = path.resolve(process.cwd(), 'public', relativePath);
        expect(fs.existsSync(fullPath)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
