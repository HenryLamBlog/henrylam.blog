import { render, screen, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProjectGallery, { ProjectCard, projects, CATEGORIES } from './ProjectGallery';

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({
    ref: { current: null },
    isInView: true,
  }),
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProjectGallery', () => {
  it('renders the "Projects" heading with font-heading', () => {
    renderWithRouter(<ProjectGallery />);
    const heading = screen.getByText('Projects');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
    expect(heading.className).toContain('font-heading');
  });

  it('has the correct section id and styling', () => {
    const { container } = renderWithRouter(<ProjectGallery />);
    const section = container.querySelector('section#projects');
    expect(section).toBeInTheDocument();
    expect(section?.className).toContain('bg-bg');
    expect(section?.className).toContain('py-20');
  });

  it('renders all 12 project cards when no filter is active', () => {
    renderWithRouter(<ProjectGallery />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(12);
  });

  it('contains 12 projects in the data array', () => {
    expect(projects).toHaveLength(12);
  });

  it('uses a carousel layout with role="region"', () => {
    const { container } = renderWithRouter(<ProjectGallery />);
    const region = container.querySelector('[role="region"]');
    expect(region).toBeInTheDocument();
    expect(region?.getAttribute('aria-label')).toBe('Project gallery');

    // Scroll container uses flex layout
    const scrollContainer = region!.querySelector('.flex');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer?.className).toContain('overflow-x');
  });

  it('renders navigation arrows with correct aria-labels', () => {
    renderWithRouter(<ProjectGallery />);
    const leftArrow = screen.getByLabelText('Scroll left');
    const rightArrow = screen.getByLabelText('Scroll right');
    expect(leftArrow).toBeInTheDocument();
    expect(rightArrow).toBeInTheDocument();
  });

  it('renders the CategoryFilter with all category options', () => {
    renderWithRouter(<ProjectGallery />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    for (const category of CATEGORIES) {
      expect(screen.getByRole('tab', { name: category })).toBeInTheDocument();
    }
  });

  it('"All" tab is selected by default', () => {
    renderWithRouter(<ProjectGallery />);
    const allTab = screen.getByRole('tab', { name: 'All' });
    expect(allTab).toHaveAttribute('aria-selected', 'true');
  });

  it('filters projects when a category tab is clicked', () => {
    renderWithRouter(<ProjectGallery />);

    const aiMlProjects = projects.filter((p) => p.category === 'AI/ML');
    const gamesTab = screen.getByRole('tab', { name: 'Games' });
    fireEvent.click(gamesTab);

    const gamesProjects = projects.filter((p) => p.category === 'Games');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(gamesProjects.length);

    // Verify only Games projects are shown
    for (const project of gamesProjects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }

    // Verify AI/ML projects are not shown
    for (const project of aiMlProjects) {
      expect(screen.queryByText(project.title)).not.toBeInTheDocument();
    }
  });

  it('shows all projects again when "All" is selected after filtering', () => {
    renderWithRouter(<ProjectGallery />);

    // Filter to a category first
    fireEvent.click(screen.getByRole('tab', { name: 'Hardware' }));
    const hardwareCount = projects.filter((p) => p.category === 'Hardware').length;
    expect(screen.getAllByRole('link')).toHaveLength(hardwareCount);

    // Click "All" to reset
    fireEvent.click(screen.getByRole('tab', { name: 'All' }));
    expect(screen.getAllByRole('link')).toHaveLength(12);
  });

  it('updates the active tab styling when a category is selected', () => {
    renderWithRouter(<ProjectGallery />);

    const webTab = screen.getByRole('tab', { name: 'Web' });
    fireEvent.click(webTab);

    expect(webTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
  });
});

describe('ProjectCard', () => {
  const project = {
    slug: 'wordle-solver',
    title: 'Wordle Solver',
    description: 'Greedy Search Algorithm',
    image: '/images/wordle.jpg',
    tags: ['Python', 'Algorithms'],
    category: 'AI/ML',
  };

  it('renders title in an h3 and description in a paragraph', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const title = screen.getByText('Wordle Solver');
    expect(title.tagName).toBe('H3');
    const desc = screen.getByText('Greedy Search Algorithm');
    expect(desc.tagName).toBe('P');
  });

  it('renders image with correct alt text', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const img = screen.getByAltText('Wordle Solver');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/wordle.jpg');
  });

  it('wraps the entire card in a Link to the correct route', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/wordle-solver');
    // The link should contain both the image and the title
    expect(within(link).getByAltText('Wordle Solver')).toBeInTheDocument();
    expect(within(link).getByText('Wordle Solver')).toBeInTheDocument();
  });

  it('renders tech stack tags as rounded-full pills', () => {
    const { container } = renderWithRouter(<ProjectCard {...project} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();

    const tagSpans = container.querySelectorAll('span.rounded-full');
    expect(tagSpans).toHaveLength(2);
  });

  it('applies hover glow and border transition classes', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:shadow-glow');
    expect(link.className).toContain('hover:border-accent/50');
    expect(link.className).not.toContain('hover:scale-[1.02]');
  });

  it('renders the image in an aspect-video container', () => {
    const { container } = renderWithRouter(<ProjectCard {...project} />);
    const aspectContainer = container.querySelector('.aspect-video');
    expect(aspectContainer).toBeInTheDocument();
    expect(within(aspectContainer as HTMLElement).getByAltText('Wordle Solver')).toBeInTheDocument();
  });

  it('renders a card with no tags when tags array is empty', () => {
    const noTagsProject = { ...project, tags: [] };
    const { container } = renderWithRouter(<ProjectCard {...noTagsProject} />);
    const tagSpans = container.querySelectorAll('span.rounded-full');
    expect(tagSpans).toHaveLength(0);
  });

  it('applies glassmorphism styling to the card', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('bg-surface/60');
    expect(link.className).toContain('backdrop-blur-md');
    expect(link.className).toContain('border-border/50');
    expect(link.className).toContain('rounded-2xl');
  });

  it('renders tag pills with accent color and glassmorphic border', () => {
    const { container } = renderWithRouter(<ProjectCard {...project} />);
    const tagSpan = container.querySelector('span.rounded-full');
    expect(tagSpan).not.toBeNull();
    expect(tagSpan!.className).toContain('border');
    expect(tagSpan!.className).toContain('border-accent/20');
    expect(tagSpan!.className).toContain('backdrop-blur-sm');
  });
});

describe('ProjectGallery carousel layout', () => {
  it('renders all project cards inside the carousel flex container', () => {
    const { container } = renderWithRouter(<ProjectGallery />);
    const region = container.querySelector('[role="region"]');
    expect(region).not.toBeNull();
    const scrollContainer = region!.querySelector('.flex');
    expect(scrollContainer).not.toBeNull();

    // All card wrappers are direct children of the flex container
    const wrappers = Array.from(scrollContainer!.children);
    expect(wrappers.length).toBe(12);
  });
});

describe('ProjectCard lazy loading and animations', () => {
  const project = {
    slug: 'wordle-solver',
    title: 'Wordle Solver',
    description: 'Greedy Search Algorithm',
    image: '/images/wordle.jpg',
    tags: ['Python', 'Algorithms'],
    category: 'AI/ML',
  };

  it('adds loading="lazy" to card images', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const img = screen.getByAltText('Wordle Solver');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders image with bg-surface placeholder', () => {
    const { container } = renderWithRouter(<ProjectCard {...project} />);
    const imageContainer = container.querySelector('.aspect-video');
    expect(imageContainer?.className).toContain('bg-surface');
  });

  it('image starts with opacity-0 before load', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const img = screen.getByAltText('Wordle Solver');
    expect(img.className).toContain('opacity-0');
  });

  it('image transitions to opacity-100 after load event', () => {
    renderWithRouter(<ProjectCard {...project} />);
    const img = screen.getByAltText('Wordle Solver');
    fireEvent.load(img);
    expect(img.className).toContain('opacity-100');
  });
});
