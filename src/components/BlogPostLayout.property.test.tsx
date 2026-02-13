import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import BlogPostLayout from './BlogPostLayout';

/** Valid project slugs from the projects array */
const VALID_SLUGS = [
  'fashion-assistant',
  'search-engine',
  'wordle-solver',
  'immersive-ball-shooter',
  'colorization-of-grayscale-images',
  'maze-game-implementing-bfs-algorithm',
  'assembling-iphone-from-parts',
  '3d-box-shooter-game',
  'roller-madness',
  'distinguishing-people-with-masks',
  'carbon-credit-tokenization',
  'robot-controlled-vehicle',
] as const;

/** Arbitrary for a non-empty subset of valid project slugs */
const nonEmptySlugsArb = fc
  .subarray([...VALID_SLUGS], { minLength: 1, maxLength: VALID_SLUGS.length });

/** Arbitrary for any subset of valid project slugs (including empty) */
const slugsArb = fc
  .subarray([...VALID_SLUGS], { minLength: 0, maxLength: VALID_SLUGS.length });

/**
 * Property 6: Blog layout functional element preservation
 *
 * For any BlogPostLayout rendered with a set of related slugs, the output
 * should contain: a reading progress bar, a table of contents region,
 * a back-to-projects link, and a related projects section (when slugs
 * are non-empty).
 *
 * **Validates: Requirements 5.5**
 */
describe('Feature: visual-identity-overhaul, Property 6: Blog layout functional element preservation', () => {
  it('always renders a reading progress bar', () => {
    fc.assert(
      fc.property(slugsArb, (slugs) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <BlogPostLayout relatedSlugs={slugs}>
              <p>Test content</p>
            </BlogPostLayout>
          </MemoryRouter>,
        );

        const progressBar = container.querySelector('[role="progressbar"][aria-label="Reading progress"]');
        expect(progressBar).toBeInTheDocument();
      }),
      { numRuns: 100 },
    );
  });

  it('always renders children inside an article element with prose styling', () => {
    fc.assert(
      fc.property(slugsArb, (slugs) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <BlogPostLayout relatedSlugs={slugs}>
              <p>Test content</p>
            </BlogPostLayout>
          </MemoryRouter>,
        );

        const article = container.querySelector('article');
        expect(article).toBeInTheDocument();
        expect(article!.className).toContain('prose');
      }),
      { numRuns: 100 },
    );
  });

  it('renders table of contents region when content has 2+ headings', () => {
    fc.assert(
      fc.property(slugsArb, (slugs) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <BlogPostLayout relatedSlugs={slugs}>
              <h2>Section One</h2>
              <p>Content one</p>
              <h2>Section Two</h2>
              <p>Content two</p>
            </BlogPostLayout>
          </MemoryRouter>,
        );

        const toc = container.querySelector('nav[aria-label="Table of contents"]');
        expect(toc).toBeInTheDocument();
      }),
      { numRuns: 100 },
    );
  });

  it('renders related projects section when slugs are non-empty', () => {
    fc.assert(
      fc.property(nonEmptySlugsArb, (slugs) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <BlogPostLayout relatedSlugs={slugs}>
              <p>Test content</p>
            </BlogPostLayout>
          </MemoryRouter>,
        );

        // The RelatedProjects heading is an h2 with id="my-other-projects"
        const heading = container.querySelector('h2#my-other-projects');
        expect(heading).toBeInTheDocument();
        expect(heading!.textContent).toBe('My Other Projects:');
        expect(container.querySelector('.suggested-project')).toBeInTheDocument();
      }),
      { numRuns: 100 },
    );
  });

  it('does not render related projects section when slugs are empty', () => {
    fc.assert(
      fc.property(fc.constant([] as string[]), (slugs: string[]) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <BlogPostLayout relatedSlugs={slugs}>
              <p>Test content</p>
            </BlogPostLayout>
          </MemoryRouter>,
        );

        const heading = container.querySelector('h2#my-other-projects');
        expect(heading).not.toBeInTheDocument();
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 7: Blog layout children passthrough
 *
 * For any children passed to BlogPostLayout, the children content should
 * appear in the rendered output without modification.
 *
 * **Validates: Requirements 5.6**
 */
describe('Feature: visual-identity-overhaul, Property 7: Blog layout children passthrough', () => {
  it('renders arbitrary text children without modification', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
        (text) => {
          cleanup();
          const { container } = render(
            <MemoryRouter>
              <BlogPostLayout relatedSlugs={[]}>
                <p data-testid="child-content">{text}</p>
              </BlogPostLayout>
            </MemoryRouter>,
          );

          const childEl = container.querySelector('[data-testid="child-content"]');
          expect(childEl).toBeInTheDocument();
          expect(childEl!.textContent).toBe(text);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders multiple children elements preserving order and content', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
          { minLength: 1, maxLength: 5 },
        ),
        (texts) => {
          cleanup();
          const { container } = render(
            <MemoryRouter>
              <BlogPostLayout relatedSlugs={[]}>
                {texts.map((t, i) => (
                  <p key={i} data-testid={`child-${i}`}>{t}</p>
                ))}
              </BlogPostLayout>
            </MemoryRouter>,
          );

          texts.forEach((t, i) => {
            const el = container.querySelector(`[data-testid="child-${i}"]`);
            expect(el).toBeInTheDocument();
            expect(el!.textContent).toBe(t);
          });
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 7: BlogPostLayout renders children in article with prose styling
 *
 * For any children content passed to BlogPostLayout, the content SHALL be
 * rendered inside an <article> element that has the prose CSS class.
 *
 * **Feature: carousel-gallery-blog-cleanup, Property 7: BlogPostLayout renders children in article with prose styling**
 * **Validates: Requirements 5.3**
 */
describe('Feature: carousel-gallery-blog-cleanup, Property 7: BlogPostLayout renders children in article with prose styling', () => {
  it('children appear inside an article with prose class', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
        (text) => {
          cleanup();
          const { container } = render(
            <MemoryRouter>
              <BlogPostLayout relatedSlugs={[]}>
                <p data-testid="prose-child">{text}</p>
              </BlogPostLayout>
            </MemoryRouter>,
          );

          const article = container.querySelector('article');
          expect(article).not.toBeNull();
          expect(article!.className).toContain('prose');

          const child = container.querySelector('[data-testid="prose-child"]');
          expect(child).not.toBeNull();
          expect(child!.textContent).toBe(text);

          // Child must be inside the article
          expect(article!.contains(child)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});
