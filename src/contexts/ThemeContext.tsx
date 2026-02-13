import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isValidTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme');
    return isValidTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function getOSPreference(): Theme {
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // matchMedia unavailable
  }
  return 'dark';
}

function getInitialTheme(): Theme {
  return getStoredTheme() ?? getOSPreference();
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // localStorage unavailable — continue without persisting
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply the class on mount and whenever theme changes
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      persistTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Exported for testing
export { getStoredTheme, getOSPreference, getInitialTheme, isValidTheme, applyThemeClass, persistTheme };
