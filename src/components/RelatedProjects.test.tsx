import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import RelatedProjects from './RelatedProjects';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RelatedProjects', () => {
  it('renders nothing when slugs array is empty', () => {
    const { container } = renderWithRouter(<RelatedProjects slugs={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when no slugs match known projects', () => {
    const { container } = renderWithRouter(<RelatedProjects slugs={['nonexistent-project']} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the "My Other Projects:" heading', () => {
    renderWithRouter(<RelatedProjects slugs={['wordle-solver']} />);
    expect(screen.getByText('My Other Projects:')).toBeInTheDocument();
  });

  it('renders a horizontal rule separator', () => {
    const { container } = renderWithRouter(<RelatedProjects slugs={['wordle-solver']} />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders a card for each valid slug', () => {
    const slugs = ['wordle-solver', 'immersive-ball-shooter'];
    const { container } = renderWithRouter(<RelatedProjects slugs={slugs} />);
    const cards = container.querySelectorAll('.suggested-project');
    expect(cards).toHaveLength(2);
  });

  it('renders project title and description', () => {
    renderWithRouter(<RelatedProjects slugs={['wordle-solver']} />);
    expect(screen.getByText('Wordle Solver')).toBeInTheDocument();
    expect(screen.getByText('Greedy Search Algorithm')).toBeInTheDocument();
  });

  it('renders project image with correct alt text', () => {
    renderWithRouter(<RelatedProjects slugs={['wordle-solver']} />);
    const img = screen.getByAltText('Wordle Solver');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('project-img');
  });

  it('links to the correct route for each project', () => {
    renderWithRouter(<RelatedProjects slugs={['wordle-solver', 'maze-game-implementing-bfs-algorithm']} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/wordle-solver');
    expect(links[1]).toHaveAttribute('href', '/maze-game-implementing-bfs-algorithm');
  });

  it('skips unknown slugs and renders only valid ones', () => {
    const slugs = ['wordle-solver', 'nonexistent', 'roller-madness'];
    const { container } = renderWithRouter(<RelatedProjects slugs={slugs} />);
    const cards = container.querySelectorAll('.suggested-project');
    expect(cards).toHaveLength(2);
  });

  it('uses Tailwind responsive grid layout', () => {
    const { container } = renderWithRouter(<RelatedProjects slugs={['wordle-solver']} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});
