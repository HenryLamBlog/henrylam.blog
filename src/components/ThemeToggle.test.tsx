import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeToggle', () => {
  it('renders a button with accessible aria-label', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button.getAttribute('aria-label')).toMatch(/switch to (dark|light) mode/i);
  });

  it('shows "Switch to light mode" label when in dark mode (default)', () => {
    renderWithTheme();
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('toggles aria-label after clicking', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('toggles back to original label after two clicks', () => {
    renderWithTheme();
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('renders an SVG icon inside the button', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeTruthy();
  });

  it('wraps icon in a motion.div for rotation animation', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    // The SVG should be inside a div (motion.div) which is inside the button
    const wrapper = svg?.parentElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper?.tagName).toBe('DIV');
    // The wrapper should have flex centering classes from the motion.div
    expect(wrapper?.className).toContain('items-center');
    expect(wrapper?.className).toContain('justify-center');
  });

  it('applies hover:text-accent class for accent hover color', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    expect(button.className).toContain('hover:text-accent');
  });
});
