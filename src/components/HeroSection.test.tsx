import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders the name "Henry Lam" in an h1', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Henry Lam');
  });

  it('renders with banner role', () => {
    render(<HeroSection />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders a full-viewport-height section', () => {
    render(<HeroSection />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('h-screen');
  });

  it('renders an animated gradient mesh background', () => {
    render(<HeroSection />);
    const header = screen.getByRole('banner');
    const meshDiv = header.querySelector('.animate-gradient-shift');
    expect(meshDiv).toBeInTheDocument();
    expect(meshDiv).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a profile photo with accessible alt text', () => {
    render(<HeroSection />);
    const profileImg = screen.getByRole('img', {
      name: /profile photo of henry lam/i,
    });
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute('src', '/images/me.jpg');
  });

  it('renders the profile photo with accent ring and glow styling', () => {
    render(<HeroSection />);
    const profileImg = screen.getByRole('img', {
      name: /profile photo of henry lam/i,
    });
    expect(profileImg).toHaveClass('ring-accent/40', 'shadow-glow');
  });

  it('renders the name with heading font', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-heading');
  });

  it('renders a glow/blur effect behind the name', () => {
    render(<HeroSection />);
    const header = screen.getByRole('banner');
    const glowDiv = header.querySelector('.blur-2xl');
    expect(glowDiv).toBeInTheDocument();
    expect(glowDiv).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a typing animation subtitle with TypedTextAnimator', () => {
    const { container } = render(<HeroSection />);
    // The TypedTextAnimator renders a span inside the subtitle paragraph
    const subtitle = container.querySelector('p.text-text-muted');
    expect(subtitle).toBeInTheDocument();
    // Should have the blinking cursor
    const cursor = subtitle!.querySelector('.animate-pulse');
    expect(cursor).toBeInTheDocument();
    expect(cursor!.textContent).toBe('|');
  });

  it('renders a clickable scroll-down button', () => {
    render(<HeroSection />);
    const scrollButton = screen.getByRole('button', { name: /scroll down/i });
    expect(scrollButton).toBeInTheDocument();
  });
});
