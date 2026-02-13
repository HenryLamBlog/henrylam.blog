import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React Error Boundary that catches rendering errors in child components.
 * Displays a friendly fallback UI with a link back to the landing page.
 *
 * Must be a class component — React hooks cannot catch render errors.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center pt-36 pb-24 bg-bg text-text-primary">
          <h1 className="text-7xl font-heading font-bold text-accent">Oops!</h1>
          <h2 className="text-2xl mt-4 text-text-primary">Something went wrong</h2>
          <p className="mt-2 text-text-muted">An unexpected error occurred while loading this page.</p>
          <Link to="/" className="text-accent font-bold hover:text-accent-light transition-colors mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
