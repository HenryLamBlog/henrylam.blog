import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { ThemeProvider } from '../contexts/ThemeContext';
import Navbar from './Navbar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderNavbar(initialRoute = '/') {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

function setScrollPosition(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

// ---------------------------------------------------------------------------
// Property 8: Navbar background changes at scroll threshold
// Feature: portfolio-visual-redesign, Property 8: Navbar background changes
//   at scroll threshold
// Validates: Requirements 6.5
// ---------------------------------------------------------------------------

describe('Feature: portfolio-visual-redesign, Property 8: Navbar background changes at scroll threshold', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  /**
   * **Validates: Requirements 6.5**
   *
   * For any scroll position <= 64 on the landing page, the Navbar should
   * display a transparent background (bg-transparent class present).
   */
  it('displays transparent background for any scrollY <= 64 on landing page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 64 }),
        (scrollY) => {
          const { unmount } = renderNavbar('/');
          const nav = screen.getByRole('navigation', { name: /main navigation/i });

          act(() => {
            setScrollPosition(scrollY);
          });

          expect(nav).toHaveClass('bg-transparent');

          unmount();
        },
      ),
      { numRuns: 100, verbose: true },
    );
  });

  /**
   * **Validates: Requirements 6.5**
   *
   * For any scroll position > 64 on the landing page, the Navbar should
   * display a solid surface background (bg-transparent class absent).
   */
  it('displays solid background for any scrollY > 64 on landing page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 65, max: 10000 }),
        (scrollY) => {
          const { unmount } = renderNavbar('/');
          const nav = screen.getByRole('navigation', { name: /main navigation/i });

          act(() => {
            setScrollPosition(scrollY);
          });

          expect(nav).not.toHaveClass('bg-transparent');

          unmount();
        },
      ),
      { numRuns: 100, verbose: true },
    );
  });
});
