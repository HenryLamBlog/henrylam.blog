import { Link } from 'react-router-dom';

/**
 * 404 page displayed when no route matches.
 * Styled with Tailwind CSS, dark mode aware, responsive.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-heading text-7xl sm:text-8xl font-bold text-accent mb-4 drop-shadow-[0_0_20px_rgba(0,210,210,0.4)]">
        404
      </h1>
      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-3">
        Page Not Found
      </h2>
      <p className="text-text-muted text-base sm:text-lg mb-8 max-w-md">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block text-accent hover:text-accent-light font-semibold transition-colors duration-200"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
