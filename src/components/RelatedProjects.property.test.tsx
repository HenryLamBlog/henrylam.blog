import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import RelatedProjects from './RelatedProjects';
import { projects } from './ProjectGallery';

/**
 * Property 5: Related projects section contains valid links
 *
 * For any blog post page with a list of related project slugs, the rendered
 * RelatedProjects component should contain a link for each slug, and each
 * link's href should contain the corresponding slug.
 *
 * **Validates: Requirements 7.3**
 */

const knownSlugs = projects.map((p) => p.slug);

/** Arbitrary that generates a non-empty subset of known project slugs */
const slugSubsetArb: fc.Arbitrary<string[]> = fc
  .subarray(knownSlugs, { minLength: 1 })
  .filter((arr) => arr.length > 0);

describe('Property 5: Related projects section contains valid links', () => {
  it('renders a link for each provided slug and each href contains the slug', () => {
    fc.assert(
      fc.property(slugSubsetArb, (slugs) => {
        const { container } = render(
          <MemoryRouter>
            <RelatedProjects slugs={slugs} />
          </MemoryRouter>,
        );

        const links = container.querySelectorAll('a[href]');

        // There should be exactly one link per slug
        expect(links).toHaveLength(slugs.length);

        // Each link's href should contain the corresponding slug
        slugs.forEach((slug) => {
          const matchingLink = Array.from(links).find((link) =>
            link.getAttribute('href')?.includes(slug),
          );
          expect(matchingLink).toBeTruthy();
        });
      }),
      { numRuns: 100 },
    );
  });

  it('renders no links when given an empty slug list', () => {
    const { container } = render(
      <MemoryRouter>
        <RelatedProjects slugs={[]} />
      </MemoryRouter>,
    );

    expect(container.innerHTML).toBe('');
  });
});
