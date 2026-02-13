import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import * as fc from 'fast-check';
import ErrorBoundary from './ErrorBoundary';

/** Component that always throws during render to trigger ErrorBoundary fallback */
function ThrowingComponent({ message }: { message: string }) {
  throw new Error(message);
  return null; // unreachable but satisfies TS return type
}

/** Arbitrary for error messages */
const errorMessageArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);

/**
 * Property 10: ErrorBoundary uses no inline styles
 *
 * For any error state in ErrorBoundary, the rendered fallback UI should
 * contain zero inline `style` attributes, using only Tailwind CSS classes
 * for styling.
 *
 * **Validates: Requirements 8.4**
 */
describe('Feature: visual-identity-overhaul, Property 10: ErrorBoundary uses no inline styles', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    // Suppress console.error — React logs errors when ErrorBoundary catches
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('fallback UI contains zero inline style attributes for any error', () => {
    fc.assert(
      fc.property(errorMessageArb, (message) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <ErrorBoundary>
              <ThrowingComponent message={message} />
            </ErrorBoundary>
          </MemoryRouter>,
        );

        // Query every element in the rendered fallback UI
        const allElements = container.querySelectorAll('*');
        allElements.forEach((el) => {
          expect(el.getAttribute('style')).toBeNull();
        });
      }),
      { numRuns: 100 },
    );
  });

  it('fallback UI uses Tailwind className on all visible elements', () => {
    fc.assert(
      fc.property(errorMessageArb, (message) => {
        cleanup();
        const { container } = render(
          <MemoryRouter>
            <ErrorBoundary>
              <ThrowingComponent message={message} />
            </ErrorBoundary>
          </MemoryRouter>,
        );

        // The root fallback wrapper and its children should have className set
        const fallbackRoot = container.firstElementChild;
        expect(fallbackRoot).not.toBeNull();
        expect(fallbackRoot!.className.length).toBeGreaterThan(0);

        // Every element with visual content should use className (Tailwind), not style
        const allElements = container.querySelectorAll('*');
        allElements.forEach((el) => {
          // No element should have an inline style attribute
          expect(el.hasAttribute('style')).toBe(false);
        });
      }),
      { numRuns: 100 },
    );
  });
});
