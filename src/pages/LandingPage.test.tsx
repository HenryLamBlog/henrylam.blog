import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders all three sections', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // HeroSection renders the banner
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // AboutSection renders the About Me heading
    expect(screen.getByText('About Me')).toBeInTheDocument();

    // ProjectGallery renders the Projects heading
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('wraps sections in a #page container', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const pageDiv = container.querySelector('#page');
    expect(pageDiv).toBeInTheDocument();
  });
});

describe('LandingPage gradient dividers', () => {
  it('renders gradient dividers between sections', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const dividers = container.querySelectorAll('.bg-gradient-to-r.from-transparent.via-accent\\/20.to-transparent');
    expect(dividers.length).toBe(2);
  });

  it('places dividers as direct children of #page', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const page = container.querySelector('#page');
    expect(page).toBeInTheDocument();
    // #page should have 5 children: HeroSection, divider, AboutSection, divider, ProjectGallery
    expect(page!.children.length).toBe(5);
  });
});

