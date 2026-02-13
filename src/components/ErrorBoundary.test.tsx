import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

function ThrowingComponent() {
  throw new Error('Test render error');
  return null; // unreachable but satisfies TS return type
}

function GoodComponent() {
  return <div>All good</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    renderWithRouter(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeTruthy();
  });

  it('renders fallback UI when a child throws during render', () => {
    // Suppress console.error noise from React and the boundary
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Oops!')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('An unexpected error occurred while loading this page.')).toBeTruthy();

    const link = screen.getByText('← Back to Home');
    expect(link.getAttribute('href')).toBe('/');

    spy.mockRestore();
  });

  it('does not render children when in error state', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('All good')).toBeNull();

    spy.mockRestore();
  });
});
