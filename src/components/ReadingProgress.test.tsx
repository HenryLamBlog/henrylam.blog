import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReadingProgress from './ReadingProgress';

vi.mock('../hooks/useReadingProgress', () => ({
  useReadingProgress: vi.fn(() => 42),
}));

describe('ReadingProgress', () => {
  it('renders a progressbar element', () => {
    render(<ReadingProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has fixed positioning at top of viewport', () => {
    render(<ReadingProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveClass('fixed', 'top-0', 'left-0', 'z-50');
  });

  it('has 3px height', () => {
    render(<ReadingProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveClass('h-[3px]');
  });

  it('uses accent gradient background', () => {
    render(<ReadingProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.background).toContain('linear-gradient');
    expect(bar.style.background).toContain('var(--color-accent)');
    expect(bar.style.background).toContain('var(--color-accent-light)');
  });

  it('sets width based on progress percentage', () => {
    render(<ReadingProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.width).toBe('42%');
  });

  it('has CSS transition for smooth width changes', () => {
    render(<ReadingProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.transition).toContain('width');
  });

  it('has accessible aria attributes', () => {
    render(<ReadingProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-label', 'Reading progress');
  });
});
