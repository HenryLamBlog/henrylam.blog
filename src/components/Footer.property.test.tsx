import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import Footer from './Footer';

afterEach(() => {
  cleanup();
});

/**
 * Property 11: Social links have correct accessibility and security attributes
 *
 * For any social link rendered in the Footer, the link element should have
 * a non-empty `aria-label`, `target="_blank"`, and `rel` containing both
 * "noopener" and "noreferrer".
 *
 * **Validates: Requirements 12.1, 12.4**
 */
describe('Feature: portfolio-ui-redesign, Property 11: Social links have correct accessibility and security attributes', () => {
  /** Arbitrary that picks one of the social link labels rendered by Footer */
  const socialLinkIndexArb = fc.integer({ min: 0, max: 2 });

  it('every social link has a non-empty aria-label', () => {
    fc.assert(
      fc.property(socialLinkIndexArb, (index) => {
        cleanup();
        render(<Footer />);
        const links = screen.getAllByRole('link');
        const link = links[index];
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel!.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it('every social link has target="_blank"', () => {
    fc.assert(
      fc.property(socialLinkIndexArb, (index) => {
        cleanup();
        render(<Footer />);
        const links = screen.getAllByRole('link');
        const link = links[index];
        expect(link).toHaveAttribute('target', '_blank');
      }),
      { numRuns: 100 },
    );
  });

  it('every social link has rel containing "noopener" and "noreferrer"', () => {
    fc.assert(
      fc.property(socialLinkIndexArb, (index) => {
        cleanup();
        render(<Footer />);
        const links = screen.getAllByRole('link');
        const link = links[index];
        const rel = link.getAttribute('rel');
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }),
      { numRuns: 100 },
    );
  });
});
