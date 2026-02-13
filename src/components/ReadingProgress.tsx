import { useReadingProgress } from '../hooks/useReadingProgress';

/**
 * A fixed 3px bar at the top of the viewport that shows scroll progress.
 * Rendered on blog post pages by the parent BlogPostLayout.
 */
export default function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div
      className="fixed top-0 left-0 h-[3px] z-50"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, rgb(var(--color-accent)), rgb(var(--color-accent-light)))',
        transition: 'width 150ms ease-out',
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}
