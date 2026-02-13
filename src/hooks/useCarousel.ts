import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCarouselOptions {
  /** Auto-scroll interval in ms. 0 = disabled. Default: 4000 */
  autoScrollInterval?: number;
  /** Number of items currently displayed */
  itemCount: number;
}

export interface UseCarouselReturn {
  /** Ref to attach to the scroll container */
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the container can scroll left */
  canScrollLeft: boolean;
  /** Whether the container can scroll right */
  canScrollRight: boolean;
  /** Scroll left by one card width */
  scrollPrev: () => void;
  /** Scroll right by one card width */
  scrollNext: () => void;
  /** Pause auto-scroll (call on mouseenter) */
  pauseAutoScroll: () => void;
  /** Resume auto-scroll (call on mouseleave) */
  resumeAutoScroll: () => void;
  /** Keyboard event handler for arrow key navigation */
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Computes the width to scroll by one card: first child's offsetWidth + container gap.
 * Returns 300 as a fallback if the container has no children.
 */
export function getCardWidth(container: HTMLDivElement): number {
  const firstChild = container.firstElementChild as HTMLElement | null;
  if (!firstChild) return 300;

  const gap = parseFloat(getComputedStyle(container).gap) || 0;
  return firstChild.offsetWidth + gap;
}

/**
 * Derives whether the container can scroll left or right from its current scroll state.
 */
export function getScrollBounds(container: HTMLDivElement): {
  canScrollLeft: boolean;
  canScrollRight: boolean;
} {
  const { scrollLeft, scrollWidth, clientWidth } = container;
  return {
    canScrollLeft: scrollLeft > 0,
    canScrollRight: Math.ceil(scrollLeft + clientWidth) < scrollWidth,
  };
}

/**
 * Determines whether auto-scroll should be active for the given container.
 * Auto-scroll is disabled when all items fit within the viewport
 * (scrollWidth <= clientWidth) or when the interval is set to 0.
 */
export function shouldAutoScroll(
  container: HTMLDivElement,
  autoScrollInterval: number,
): boolean {
  if (autoScrollInterval <= 0) return false;
  return container.scrollWidth > container.clientWidth;
}


/**
 * Custom hook that encapsulates carousel scroll behavior:
 * - Tracks scroll position to derive arrow visibility
 * - Provides scrollPrev / scrollNext for card-width navigation
 * - Auto-scrolls at a timed interval (disabled when all items fit)
 * - Pauses auto-scroll on hover, resumes on mouse leave
 * - Handles ArrowLeft / ArrowRight keyboard navigation
 */
export function useCarousel(options: UseCarouselOptions): UseCarouselReturn {
  const { autoScrollInterval = 4000, itemCount } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /** Update arrow visibility from current scroll position */
  const updateScrollBounds = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const bounds = getScrollBounds(container);
    setCanScrollLeft(bounds.canScrollLeft);
    setCanScrollRight(bounds.canScrollRight);
  }, []);

  /** Scroll forward by one card width, looping back to start when at the end */
  const scrollNext = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const { canScrollRight } = getScrollBounds(container);
    if (!canScrollRight) {
      // Loop back to the beginning
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      const cardWidth = getCardWidth(container);
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, []);

  /** Scroll backward by one card width */
  const scrollPrev = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = getCardWidth(container);
    container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  }, []);

  /** Clear the auto-scroll interval */
  const clearAutoScroll = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /** Start the auto-scroll interval if conditions are met */
  const startAutoScroll = useCallback(() => {
    clearAutoScroll();

    const container = scrollRef.current;
    if (!container) return;

    // Disable auto-scroll when interval is 0 or all items fit within the viewport
    if (!shouldAutoScroll(container, autoScrollInterval)) return;

    intervalRef.current = setInterval(() => {
      scrollNext();
    }, autoScrollInterval);
  }, [autoScrollInterval, clearAutoScroll, scrollNext]);

  /** Pause auto-scroll (e.g., on mouseenter) */
  const pauseAutoScroll = useCallback(() => {
    isPausedRef.current = true;
    clearAutoScroll();
  }, [clearAutoScroll]);

  /** Resume auto-scroll (e.g., on mouseleave) */
  const resumeAutoScroll = useCallback(() => {
    isPausedRef.current = false;
    startAutoScroll();
  }, [startAutoScroll]);

  /** Handle ArrowLeft / ArrowRight keyboard events */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  // Attach scroll event listener to update arrow visibility
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollBounds();
    container.addEventListener('scroll', updateScrollBounds, { passive: true });

    return () => {
      container.removeEventListener('scroll', updateScrollBounds);
    };
  }, [updateScrollBounds, itemCount]);

  // Manage auto-scroll lifecycle
  useEffect(() => {
    if (!isPausedRef.current) {
      startAutoScroll();
    }

    return () => {
      clearAutoScroll();
    };
  }, [startAutoScroll, clearAutoScroll, itemCount]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
    pauseAutoScroll,
    resumeAutoScroll,
    handleKeyDown,
  };
}
