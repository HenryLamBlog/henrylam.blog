import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  function renderNotFound() {
    return render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
  }

  it('renders the 404 heading', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders a "Page Not Found" message', () => {
    renderNotFound();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('has a link back to the landing page', () => {
    renderNotFound();
    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
