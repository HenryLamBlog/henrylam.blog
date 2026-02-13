import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BlogPostLayout from './BlogPostLayout';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('BlogPostLayout', () => {
  it('renders children content inside an article element', () => {
    const { container } = renderWithRouter(
      <BlogPostLayout>
        <h1>Blog Title</h1>
        <p>Blog paragraph</p>
      </BlogPostLayout>
    );
    expect(screen.getByText('Blog Title')).toBeInTheDocument();
    expect(screen.getByText('Blog paragraph')).toBeInTheDocument();
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('applies Tailwind prose classes to the article element', () => {
    const { container } = renderWithRouter(
      <BlogPostLayout><p>Test content</p></BlogPostLayout>
    );
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(article?.className).toContain('prose');
  });

  it('renders a reading progress bar', () => {
    renderWithRouter(
      <BlogPostLayout><p>Content</p></BlogPostLayout>
    );
    expect(screen.getByRole('progressbar', { name: /reading progress/i })).toBeInTheDocument();
  });

  it('does not render the hero header gradient section', () => {
    const { container } = renderWithRouter(
      <BlogPostLayout><p>Content</p></BlogPostLayout>
    );
    // The old hero header had a gradient background
    const gradientSection = container.querySelector('.bg-gradient-to-br');
    expect(gradientSection).not.toBeInTheDocument();
    // No back-to-projects link
    expect(screen.queryByText(/back to projects/i)).not.toBeInTheDocument();
  });

  it('does not render RelatedProjects when relatedSlugs is omitted', () => {
    renderWithRouter(
      <BlogPostLayout><p>Content</p></BlogPostLayout>
    );
    expect(screen.queryByText('My Other Projects:')).not.toBeInTheDocument();
  });

  it('does not render RelatedProjects when relatedSlugs is empty', () => {
    renderWithRouter(
      <BlogPostLayout relatedSlugs={[]}><p>Content</p></BlogPostLayout>
    );
    expect(screen.queryByText('My Other Projects:')).not.toBeInTheDocument();
  });

  it('renders RelatedProjects when relatedSlugs are provided', () => {
    const { container } = renderWithRouter(
      <BlogPostLayout relatedSlugs={['wordle-solver']}>
        <p>Content</p>
      </BlogPostLayout>
    );
    // Use heading role to target the actual h2, not the TOC links
    const heading = container.querySelector('article h2#my-other-projects');
    expect(heading).toBeInTheDocument();
    expect(container.querySelector('.suggested-project')).toBeInTheDocument();
  });

  it('renders RelatedProjects inside the article element', () => {
    const { container } = renderWithRouter(
      <BlogPostLayout relatedSlugs={['wordle-solver']}>
        <p>Content</p>
      </BlogPostLayout>
    );
    const article = container.querySelector('article');
    expect(article?.querySelector('.suggested-project')).toBeInTheDocument();
  });
});
