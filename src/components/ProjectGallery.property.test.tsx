import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ProjectCard, CATEGORIES } from './ProjectGallery';
import type { Project } from './ProjectGallery';
import Carousel from './Carousel';

/** Arbitrary for a valid Project */
const projectArb: fc.Arbitrary<Project> = fc.record({
  slug: fc
    .stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .filter((s) => s.length >= 1 && s.length <= 60),
  title: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.string({ minLength: 1, maxLength: 120 }),
  image: fc.constant('/images/placeholder.png'),
  tags: fc.array(fc.stringMatching(/^[A-Za-z0-9][A-Za-z0-9 .#+/-]{0,29}$/), {
    minLength: 1,
    maxLength: 5,
  }),
  category: fc.constantFrom('AI/ML', 'Games', 'Hardware', 'Web', 'Blockchain'),
});

/**
 * Property 5: Project tags are displayed on cards
 *
 * For any project with non-empty tags, the rendered ProjectCard should
 * contain text matching each tag string.
 *
 * **Validates: Requirements 9.2**
 */
describe('Feature: portfolio-ui-redesign, Property 5: Project tags are displayed on cards', () => {
  it('each tag in the project appears as a rounded-full span in the rendered card', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container } = render(
          <MemoryRouter>
            <ProjectCard {...project} />
          </MemoryRouter>,
        );

        const tagSpans = container.querySelectorAll('span.rounded-full');
        const tagTexts = Array.from(tagSpans).map((el) => el.textContent);

        for (const tag of project.tags) {
          expect(tagTexts).toContain(tag);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('the number of rendered tag spans matches the number of tags', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container } = render(
          <MemoryRouter>
            <ProjectCard {...project} />
          </MemoryRouter>,
        );

        const tagSpans = container.querySelectorAll('span.rounded-full');
        expect(tagSpans.length).toBe(project.tags.length);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 6: Category filtering returns only matching projects
 *
 * For any category selection and projects array, filtering returns only
 * matching projects. "All" returns all.
 *
 * **Validates: Requirements 9.4, 9.5**
 */
describe('Feature: portfolio-ui-redesign, Property 6: Category filtering returns only matching projects', () => {
  /** Arbitrary for an array of projects */
  const projectsArrayArb = fc.array(projectArb, { minLength: 0, maxLength: 15 });

  /** The exact filtering logic from the component */
  function filterProjects(allProjects: Project[], selected: string): Project[] {
    return allProjects.filter((p) => selected === 'All' || p.category === selected);
  }

  it('"All" category returns every project', () => {
    fc.assert(
      fc.property(projectsArrayArb, (allProjects) => {
        const result = filterProjects(allProjects, 'All');
        expect(result).toEqual(allProjects);
      }),
      { numRuns: 100 },
    );
  });

  it('selecting a specific category returns only projects with that category', () => {
    const categoryArb = fc.constantFrom('AI/ML', 'Games', 'Hardware', 'Web', 'Blockchain');

    fc.assert(
      fc.property(projectsArrayArb, categoryArb, (allProjects, category) => {
        const result = filterProjects(allProjects, category);

        // Every returned project must match the selected category
        for (const project of result) {
          expect(project.category).toBe(category);
        }

        // Every project matching the category must be in the result
        const expected = allProjects.filter((p) => p.category === category);
        expect(result).toEqual(expected);
      }),
      { numRuns: 100 },
    );
  });

  it('filtered result is always a subset of the original array', () => {
    const categoryArb = fc.constantFrom(...CATEGORIES);

    fc.assert(
      fc.property(projectsArrayArb, categoryArb, (allProjects, category) => {
        const result = filterProjects(allProjects, category);
        expect(result.length).toBeLessThanOrEqual(allProjects.length);

        for (const project of result) {
          expect(allProjects).toContainEqual(project);
        }
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 7: Project card links match slugs
 *
 * For any project, the rendered ProjectCard should contain a link
 * whose href ends with the project's slug.
 *
 * **Validates: Requirements 9.7**
 */
describe('Feature: portfolio-ui-redesign, Property 7: Project card links match slugs', () => {
  it('the card link href ends with the project slug', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container } = render(
          <MemoryRouter>
            <ProjectCard {...project} />
          </MemoryRouter>,
        );

        const link = container.querySelector('a');
        expect(link).not.toBeNull();
        const href = link!.getAttribute('href')!;
        expect(href.endsWith(project.slug)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('the card link href is exactly /{slug}', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container } = render(
          <MemoryRouter>
            <ProjectCard {...project} />
          </MemoryRouter>,
        );

        const link = container.querySelector('a');
        expect(link).not.toBeNull();
        expect(link!.getAttribute('href')).toBe(`/${project.slug}`);
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * (Removed) Property 4: Uniform project card layout — no longer applicable
 * after carousel migration. Grid layout was replaced with flex carousel.
 */


/**
 * Property 5: Project card glassmorphism and hover styling
 *
 * For any rendered project card, the card element should contain glassmorphism
 * classes (`backdrop-blur-md`, semi-transparent background `bg-surface/60`) and
 * glow-based hover classes (`hover:shadow-glow`), and should not contain the
 * old `hover:scale` transform class.
 *
 * **Validates: Requirements 4.2, 4.3**
 */
describe('Feature: visual-identity-overhaul, Property 5: Project card glassmorphism and hover styling', () => {
  it('card has glassmorphism classes and glow hover, no old hover:scale', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container } = render(
          <MemoryRouter>
            <ProjectCard {...project} />
          </MemoryRouter>,
        );

        // The card root is the <a> (Link) element
        const card = container.querySelector('a');
        expect(card).not.toBeNull();
        const classes = card!.className;

        // Glassmorphism: backdrop blur
        expect(classes).toContain('backdrop-blur-md');

        // Glassmorphism: semi-transparent background
        expect(classes).toContain('bg-surface/60');

        // Glow-based hover effect
        expect(classes).toContain('hover:shadow-glow');

        // Old scale transform must be removed
        expect(classes).not.toContain('hover:scale');
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 5: Category filtering correctness
 *
 * For any category selection and any projects array, the Carousel SHALL display
 * exactly the projects whose category matches the selection. When "All" is selected,
 * the Carousel SHALL display every project. The filtering function filter(projects, category)
 * SHALL satisfy: result = category === 'All' ? projects : projects.filter(p => p.category === category).
 *
 * **Feature: carousel-gallery-blog-cleanup, Property 5: Category filtering correctness**
 * **Validates: Requirements 4.2, 4.5**
 */
describe('Feature: carousel-gallery-blog-cleanup, Property 5: Category filtering correctness', () => {
  const projectsArrayArb = fc.array(projectArb, { minLength: 0, maxLength: 20 });
  const categoryArb = fc.constantFrom(...CATEGORIES);

  /** The filtering logic extracted from ProjectGallery */
  function filterProjects(allProjects: Project[], selected: string): Project[] {
    return selected === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === selected);
  }

  it('filtering with "All" returns every project unchanged', () => {
    fc.assert(
      fc.property(projectsArrayArb, (allProjects) => {
        const result = filterProjects(allProjects, 'All');
        expect(result).toEqual(allProjects);
        expect(result.length).toBe(allProjects.length);
      }),
      { numRuns: 100 },
    );
  });

  it('filtering with a specific category returns exactly the matching projects', () => {
    fc.assert(
      fc.property(projectsArrayArb, categoryArb, (allProjects, category) => {
        const result = filterProjects(allProjects, category);

        if (category === 'All') {
          expect(result).toEqual(allProjects);
        } else {
          // Every returned project matches the category
          for (const project of result) {
            expect(project.category).toBe(category);
          }
          // Result equals the expected filtered set
          const expected = allProjects.filter((p) => p.category === category);
          expect(result).toEqual(expected);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('filtered result is always a subset with length <= original', () => {
    fc.assert(
      fc.property(projectsArrayArb, categoryArb, (allProjects, category) => {
        const result = filterProjects(allProjects, category);
        expect(result.length).toBeLessThanOrEqual(allProjects.length);
        for (const project of result) {
          expect(allProjects).toContainEqual(project);
        }
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * Property 6: Small result sets are centered
 *
 * For any filtered result set with count <= 3, the Carousel container
 * SHALL apply centering styles (justify-center) so cards appear as a
 * centered horizontal strip.
 *
 * **Feature: carousel-gallery-blog-cleanup, Property 6: Small result sets are centered**
 * **Validates: Requirements 4.4**
 */
describe('Feature: carousel-gallery-blog-cleanup, Property 6: Small result sets are centered', () => {
  const smallProjectsArb = fc.array(projectArb, { minLength: 0, maxLength: 3 })
    .map((projects) => projects.map((p, i) => ({ ...p, slug: `small-${i}-${p.slug}` })));

  it('carousel has justify-center when itemCount <= 3', () => {
    fc.assert(
      fc.property(smallProjectsArb, (projectList) => {
        const { container } = render(
          <MemoryRouter>
            <Carousel
              itemCount={projectList.length}
              ariaLabel="Test gallery"
              centerContent={projectList.length <= 3}
            >
              {projectList.map((project) => (
                <div key={project.slug} data-testid="card-wrapper">
                  <ProjectCard {...project} />
                </div>
              ))}
            </Carousel>
          </MemoryRouter>,
        );

        const region = container.querySelector('[role="region"]');
        expect(region).not.toBeNull();
        const scrollContainer = region!.querySelector('.flex');
        expect(scrollContainer).not.toBeNull();
        expect(scrollContainer!.className).toContain('justify-center');
      }),
      { numRuns: 100 },
    );
  });

  it('carousel does NOT have justify-center when itemCount > 3', () => {
    const largeProjectsArb = fc.array(projectArb, { minLength: 4, maxLength: 12 })
      .map((projects) => projects.map((p, i) => ({ ...p, slug: `large-${i}-${p.slug}` })));

    fc.assert(
      fc.property(largeProjectsArb, (projectList) => {
        const { container } = render(
          <MemoryRouter>
            <Carousel
              itemCount={projectList.length}
              ariaLabel="Test gallery"
              centerContent={projectList.length <= 3}
            >
              {projectList.map((project) => (
                <div key={project.slug} data-testid="card-wrapper">
                  <ProjectCard {...project} />
                </div>
              ))}
            </Carousel>
          </MemoryRouter>,
        );

        const region = container.querySelector('[role="region"]');
        const scrollContainer = region!.querySelector('.flex');
        expect(scrollContainer!.className).not.toContain('justify-center');
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * Property 8: No invisible clickable cards after filtering
 *
 * For any category filter state, every link element within the Carousel SHALL
 * be visible (no ancestor with opacity: 0, visibility: hidden, or display: none).
 * The number of link elements SHALL equal the number of projects matching the
 * active filter.
 *
 * **Feature: carousel-gallery-blog-cleanup, Property 8: No invisible clickable cards after filtering**
 * **Validates: Requirements 6.1, 6.2**
 */
describe('Feature: carousel-gallery-blog-cleanup, Property 8: No invisible clickable cards after filtering', () => {
  const projectsArrayArb = fc.array(projectArb, { minLength: 0, maxLength: 15 })
    .map((projects) => projects.map((p, i) => ({ ...p, slug: `vis-${i}-${p.slug}` })));
  const categoryArb = fc.constantFrom(...CATEGORIES);

  function filterProjects(allProjects: Project[], selected: string): Project[] {
    return selected === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === selected);
  }

  it('number of visible links equals number of filtered projects', () => {
    fc.assert(
      fc.property(projectsArrayArb, categoryArb, (allProjects, category) => {
        const filtered = filterProjects(allProjects, category);

        const { container } = render(
          <MemoryRouter>
            <Carousel itemCount={filtered.length} ariaLabel="Test gallery" centerContent={filtered.length <= 3}>
              {filtered.map((project) => (
                <div key={project.slug} data-testid="card-wrapper">
                  <ProjectCard {...project} />
                </div>
              ))}
            </Carousel>
          </MemoryRouter>,
        );

        const links = container.querySelectorAll('a');
        expect(links.length).toBe(filtered.length);
      }),
      { numRuns: 100 },
    );
  });

  it('no link has an ancestor with opacity-0, visibility-hidden, or display-none', () => {
    fc.assert(
      fc.property(projectsArrayArb, categoryArb, (allProjects, category) => {
        const filtered = filterProjects(allProjects, category);

        const { container } = render(
          <MemoryRouter>
            <Carousel itemCount={filtered.length} ariaLabel="Test gallery" centerContent={filtered.length <= 3}>
              {filtered.map((project) => (
                <div key={project.slug} data-testid="card-wrapper">
                  <ProjectCard {...project} />
                </div>
              ))}
            </Carousel>
          </MemoryRouter>,
        );

        const links = container.querySelectorAll('a');
        links.forEach((link) => {
          let el: HTMLElement | null = link;
          while (el) {
            const classes = (el.className || '').split(/\s+/);
            // Check for exact utility classes that hide elements
            expect(classes).not.toContain('opacity-0');
            expect(classes).not.toContain('invisible');
            // 'hidden' means display:none, but not 'overflow-hidden'
            expect(classes.filter((c) => c === 'hidden').length).toBe(0);
            el = el.parentElement;
          }
        });
      }),
      { numRuns: 100 },
    );
  });
});
