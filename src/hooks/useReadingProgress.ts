import { useEffect, useState } from 'react';

/**
 * Pure function that calculates reading progress as a percentage (0-100).
 *
 * - Returns 0 when scrollY is 0
 * - Returns 100 when content fits entirely within the viewport (documentHeight <= viewportHeight)
 * - Clamped to [0, 100] for all inputs
 */
export function calculateReadingProgress(
  scrollY: number,
  documentHeight: number,
  viewportHeight: number,
): number {
  if (documentHeight <= viewportHeight) return 100;

  const maxScroll = documentHeight - viewportHeight;
  if (maxScroll <= 0) return 100;

  const progress = (scrollY / maxScroll) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Pure function that estimates reading time in minutes based on word count.
 * Assumes 200 words per minute. Returns a minimum of 1 minute.
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Hook that tracks reading progress as the user scrolls.
 * Returns a number 0-100 representing the scroll percentage through the page.
 * Uses a passive scroll listener for performance.
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      setProgress(calculateReadingProgress(scrollY, documentHeight, viewportHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
