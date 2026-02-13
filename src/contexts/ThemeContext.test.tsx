import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, getStoredTheme, getOSPreference, getInitialTheme, isValidTheme, applyThemeClass } from './ThemeContext';

// Helper component that exposes theme context values for testing
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  // Reset matchMedia to default (no dark preference)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe('ThemeContext unit tests', () => {
  describe('isValidTheme', () => {
    it('returns true for "light"', () => {
      expect(isValidTheme('light')).toBe(true);
    });

    it('returns true for "dark"', () => {
      expect(isValidTheme('dark')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isValidTheme('blue')).toBe(false);
      expect(isValidTheme('')).toBe(false);
      expect(isValidTheme(null)).toBe(false);
      expect(isValidTheme(undefined)).toBe(false);
    });
  });

  describe('getStoredTheme', () => {
    it('returns null when localStorage is empty', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('returns "light" when localStorage has "light"', () => {
      localStorage.setItem('theme', 'light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns "dark" when localStorage has "dark"', () => {
      localStorage.setItem('theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns null for invalid localStorage value like "blue"', () => {
      localStorage.setItem('theme', 'blue');
      expect(getStoredTheme()).toBeNull();
    });

    it('returns null when localStorage throws an error', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      expect(getStoredTheme()).toBeNull();
      spy.mockRestore();
    });
  });

  describe('getOSPreference', () => {
    it('returns "dark" when OS does not prefer dark (dark-first default)', () => {
      expect(getOSPreference()).toBe('dark');
    });

    it('returns "dark" when OS prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: (query: string): MediaQueryList => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
      expect(getOSPreference()).toBe('dark');
    });
  });

  describe('getInitialTheme', () => {
    it('defaults to "dark" when no localStorage and no OS dark preference', () => {
      expect(getInitialTheme()).toBe('dark');
    });

    it('reads theme from localStorage when available', () => {
      localStorage.setItem('theme', 'dark');
      expect(getInitialTheme()).toBe('dark');
    });

    it('falls back to OS preference when localStorage is empty', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: (query: string): MediaQueryList => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
      expect(getInitialTheme()).toBe('dark');
    });

    it('falls back to "dark" when localStorage throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      // matchMedia returns false (no dark preference), but dark-first default applies
      expect(getInitialTheme()).toBe('dark');
      spy.mockRestore();
    });
  });

  describe('applyThemeClass', () => {
    it('adds "dark" class for dark theme', () => {
      applyThemeClass('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes "dark" class for light theme', () => {
      document.documentElement.classList.add('dark');
      applyThemeClass('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('ThemeProvider integration', () => {
    it('defaults to "dark" when no localStorage and no OS preference', () => {
      renderWithProvider();
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('reads theme from localStorage on mount', () => {
      localStorage.setItem('theme', 'dark');
      renderWithProvider();
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('falls back to OS dark preference when localStorage is empty', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: (query: string): MediaQueryList => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
      renderWithProvider();
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('falls back to "dark" when localStorage throws an error', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      renderWithProvider();
      expect(screen.getByTestId('theme').textContent).toBe('dark');
      spy.mockRestore();
    });

    it('treats invalid localStorage value as missing', () => {
      localStorage.setItem('theme', 'blue');
      renderWithProvider();
      // Falls back to OS preference (dark by default)
      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('toggleTheme switches from dark to light (default is dark)', () => {
      renderWithProvider();
      expect(screen.getByTestId('theme').textContent).toBe('dark');

      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('toggleTheme switches from dark to light', () => {
      localStorage.setItem('theme', 'dark');
      renderWithProvider();
      expect(screen.getByTestId('theme').textContent).toBe('dark');

      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('toggleTheme persists the new theme to localStorage', () => {
      renderWithProvider();
      fireEvent.click(screen.getByText('Toggle'));
      expect(localStorage.getItem('theme')).toBe('light');

      fireEvent.click(screen.getByText('Toggle'));
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('adds "dark" class on document.documentElement when theme is dark', () => {
      localStorage.setItem('theme', 'dark');
      renderWithProvider();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes "dark" class when toggling back to light', () => {
      localStorage.setItem('theme', 'dark');
      renderWithProvider();
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      fireEvent.click(screen.getByText('Toggle'));
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('useTheme hook', () => {
    it('throws when used outside ThemeProvider', () => {
      // Suppress console.error for expected error
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<ThemeConsumer />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );
      spy.mockRestore();
    });
  });
});
