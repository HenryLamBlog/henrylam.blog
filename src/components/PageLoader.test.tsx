import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PageLoader from './PageLoader';

// Track the latest onAnimationComplete callback
let latestOnAnimationComplete: (() => void) | undefined;

// Mock framer-motion to avoid animation timing issues in tests
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(
        (props: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => {
          const {
            initial,
            animate,
            transition,
            onAnimationComplete,
            ...rest
          } = props;
          // Store the callback so tests can invoke it
          latestOnAnimationComplete = onAnimationComplete as (() => void) | undefined;
          // Apply the animate opacity as inline style for testability
          const opacity =
            animate && typeof animate === 'object' && 'opacity' in animate
              ? (animate as { opacity: number }).opacity
              : 1;
          return <div ref={ref} style={{ opacity }} {...rest} />;
        }
      ),
    },
  };
});

describe('PageLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    latestOnAnimationComplete = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the loader overlay initially', () => {
    render(<PageLoader />);
    const loader = screen.getByTestId('page-loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('starts fully opaque', () => {
    render(<PageLoader />);
    const loader = screen.getByTestId('page-loader');
    expect(loader.style.opacity).toBe('1');
  });

  it('begins fading out after a short delay', () => {
    render(<PageLoader />);
    const loader = screen.getByTestId('page-loader');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(loader.style.opacity).toBe('0');
  });

  it('removes itself from the DOM when fade animation completes', () => {
    render(<PageLoader />);
    expect(screen.getByTestId('page-loader')).toBeInTheDocument();

    // Trigger fade-out
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Simulate Framer Motion calling onAnimationComplete
    act(() => {
      latestOnAnimationComplete?.();
    });

    expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument();
  });

  it('does not remove from DOM if animation completes before fade-out starts', () => {
    render(<PageLoader />);
    expect(screen.getByTestId('page-loader')).toBeInTheDocument();

    // Call onAnimationComplete before fadingOut is true (initial render animation)
    act(() => {
      latestOnAnimationComplete?.();
    });

    expect(screen.getByTestId('page-loader')).toBeInTheDocument();
  });

  it('has aria-hidden for accessibility', () => {
    render(<PageLoader />);
    const loader = screen.getByTestId('page-loader');
    expect(loader).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses Tailwind utility classes for styling', () => {
    render(<PageLoader />);
    const loader = screen.getByTestId('page-loader');
    expect(loader).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
  });

  it('uses theme bg token class', () => {
    render(<PageLoader />);
    const loader = screen.getByTestId('page-loader');
    expect(loader).toHaveClass('bg-bg');
  });

  it('spinner uses accent border color', () => {
    render(<PageLoader />);
    const spinner = screen.getByTestId('page-loader').firstElementChild!;
    expect(spinner).toHaveClass('border-t-accent');
  });

  it('cleans up timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(<PageLoader />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
