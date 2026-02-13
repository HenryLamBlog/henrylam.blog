import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the "Let\'s Connect" heading', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /let's connect/i })).toBeInTheDocument();
  });

  it('renders GitHub, LinkedIn, and Email social links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
  });

  it('opens external links in a new tab with security attributes', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('mailto:')) {
        // mailto links should not open in a new tab
        expect(link).not.toHaveAttribute('target');
      } else {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
        expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
      }
    }
  });

  it('renders each social link with an aria-label', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveAttribute('aria-label');
      expect(link.getAttribute('aria-label')).not.toBe('');
    }
  });

  it('displays the copyright notice with the current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`©.*${year}.*henrylam\\.blog`))).toBeInTheDocument();
  });

  it('uses a semantic footer element', () => {
    render(<Footer />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
