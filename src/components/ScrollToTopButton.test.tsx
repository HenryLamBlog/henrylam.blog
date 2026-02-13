import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScrollToTopButton from './ScrollToTopButton';

// Mock framer-motion to avoid animation timing issues in tests
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      button: React.forwardRef(
        (props: Record<string, unknown>, ref: React.Ref<HTMLButtonElement>) => {
          const {
            variants,
            initial,
            animate,
            exit,
            whileHover,
            ...rest
          } = props;
          return <button ref={ref} {...rest} />;
        }
      ),
    },
  };
});

describe('ScrollToTopButton', () => {
  let scrollY: number;

  beforeEach(() => {
    scrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      get: () => scrollY,
      configurable: true,
    });
    window.scrollTo = vi.fn();
  });

  function simulateScroll(position: number) {
    scrollY = position;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  }

  it('is not rendered when scroll position is at the top', () => {
    render(<ScrollToTopButton />);
    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument();
  });

  it('becomes visible when scroll position exceeds 300px', () => {
    render(<ScrollToTopButton />);
    simulateScroll(301);
    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();
  });

  it('hides again when scrolling back above 300px', () => {
    render(<ScrollToTopButton />);
    simulateScroll(400);
    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();

    simulateScroll(100);
    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument();
  });

  it('stays hidden at exactly 300px (threshold is > 300)', () => {
    render(<ScrollToTopButton />);
    simulateScroll(300);
    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument();
  });

  it('calls window.scrollTo with smooth behavior on click', () => {
    render(<ScrollToTopButton />);
    simulateScroll(400);

    const button = screen.getByRole('button', { name: /scroll to top/i });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('renders with correct aria-label when visible', () => {
    render(<ScrollToTopButton />);
    simulateScroll(400);
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button).toHaveAttribute('aria-label', 'Scroll to top');
  });

  it('uses accent color classes instead of cyan', () => {
    render(<ScrollToTopButton />);
    simulateScroll(400);
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button.className).toContain('bg-accent/90');
    expect(button.className).toContain('focus:ring-accent');
    expect(button.className).not.toContain('cyan');
  });

  it('cleans up scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollToTopButton />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
