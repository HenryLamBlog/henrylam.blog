import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutSection from './AboutSection';

describe('AboutSection', () => {
  it('renders the "About Me" heading', () => {
    render(<AboutSection />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('has the correct section id for scroll navigation', () => {
    const { container } = render(<AboutSection />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });

  it('displays the name "Henry Lam"', () => {
    render(<AboutSection />);
    expect(screen.getByText('Henry Lam')).toBeInTheDocument();
  });

  it('displays the email "contact@henrylam.blog"', () => {
    render(<AboutSection />);
    expect(screen.getByText('contact@henrylam.blog')).toBeInTheDocument();
  });

  it('renders the biography greeting', () => {
    render(<AboutSection />);
    expect(screen.getByText('Hello There!')).toBeInTheDocument();
  });

  it('renders biography paragraphs', () => {
    render(<AboutSection />);
    expect(
      screen.getByText(/Hi, I'm Henry/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I graduated from the Hong Kong University/),
    ).toBeInTheDocument();
  });

  it('displays contact info with Name and Email labels', () => {
    render(<AboutSection />);
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
  });

  it('renders skill category headings', () => {
    render(<AboutSection />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks & Tools')).toBeInTheDocument();
    expect(screen.getByText('Spoken Languages')).toBeInTheDocument();
  });

  it('renders skill tags as pill-shaped chips', () => {
    const { container } = render(<AboutSection />);
    const skillTags = container.querySelectorAll('.rounded-full');
    expect(skillTags.length).toBeGreaterThanOrEqual(10);
  });

  it('displays all expected skills', () => {
    render(<AboutSection />);
    const expectedSkills = [
      'Python', 'Java', 'C++', 'C', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Oracle SQL',
      'React', 'Oracle Fusion Cloud', 'Git', 'Firebase', 'Google Cloud API', 'Unity',
      'English (Native)', 'Cantonese (Native)', 'Mandarin (Proficient)',
    ];
    for (const skill of expectedSkills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it('uses a two-column grid layout', () => {
    const { container } = render(<AboutSection />);
    const grid = container.querySelector('.md\\:grid-cols-2');
    expect(grid).toBeInTheDocument();
  });
});

describe('AboutSection skill chip styling', () => {
  it('applies accent glassmorphic styling to skill chips', () => {
    const { container } = render(<AboutSection />);
    const chips = container.querySelectorAll('.bg-accent\\/10');
    expect(chips.length).toBeGreaterThanOrEqual(10);
    chips.forEach((chip) => {
      expect(chip).toHaveClass('text-accent');
      expect(chip).toHaveClass('backdrop-blur-sm');
    });
  });

  it('applies accent border to skill chips', () => {
    const { container } = render(<AboutSection />);
    const chips = container.querySelectorAll('.border-accent\\/20');
    expect(chips.length).toBeGreaterThanOrEqual(10);
  });
});

