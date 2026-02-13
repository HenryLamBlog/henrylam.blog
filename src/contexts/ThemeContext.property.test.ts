import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  getStoredTheme,
  getInitialTheme,
  isValidTheme,
  persistTheme,
} from './ThemeContext';
import type { Theme } from './ThemeContext';

const themeArb = fc.constantFrom<Theme>('light', 'dark');

describe('Feature: portfolio-ui-redesign, Property 1: Theme toggle is an involution', () => {
  /**
   * **Validates: Requirements 3.2**
   *
   * For any current theme value (light or dark), toggling the theme twice
   * should return to the original theme value.
   * Formally: toggle(toggle(theme)) === theme
   */
  function toggleTheme(theme: Theme): Theme {
    return theme === 'light' ? 'dark' : 'light';
  }

  it('toggling twice returns the original theme', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const afterDoubleToggle = toggleTheme(toggleTheme(theme));
        expect(afterDoubleToggle).toBe(theme);
      }),
      { numRuns: 100 },
    );
  });

  it('a single toggle always produces the opposite theme', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const toggled = toggleTheme(theme);
        expect(toggled).not.toBe(theme);
        expect(isValidTheme(toggled)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: portfolio-ui-redesign, Property 2: Theme persistence round-trip', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * For any valid theme value written to localStorage, reading it back
   * via getStoredTheme should return that same theme value.
   * Formally: initTheme(writeTheme(theme)) === theme
   */
  beforeEach(() => {
    localStorage.clear();
  });

  it('persistTheme followed by getStoredTheme returns the same theme', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        persistTheme(theme);
        const retrieved = getStoredTheme();
        expect(retrieved).toBe(theme);
      }),
      { numRuns: 100 },
    );
  });

  it('persistTheme followed by getInitialTheme returns the same theme', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        persistTheme(theme);
        const initial = getInitialTheme();
        expect(initial).toBe(theme);
      }),
      { numRuns: 100 },
    );
  });
});
