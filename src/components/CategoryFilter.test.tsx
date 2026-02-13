import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryFilter from './CategoryFilter';

const categories = ['AI/ML', 'Games', 'Hardware', 'Web', 'Blockchain'];

describe('CategoryFilter', () => {
  it('renders "All" as the first tab', () => {
    render(<CategoryFilter categories={categories} selected="All" onSelect={() => {}} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveTextContent('All');
  });

  it('renders all categories as tabs', () => {
    render(<CategoryFilter categories={categories} selected="All" onSelect={() => {}} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(categories.length + 1);
    expect(tabs.map((t) => t.textContent)).toEqual(['All', ...categories]);
  });

  it('uses role="tablist" on the container', () => {
    render(<CategoryFilter categories={categories} selected="All" onSelect={() => {}} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('marks the selected category with aria-selected="true"', () => {
    render(<CategoryFilter categories={categories} selected="Games" onSelect={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Games' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelect when a tab is clicked', () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={categories} selected="All" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Hardware' }));
    expect(onSelect).toHaveBeenCalledWith('Hardware');
  });

  it('does not duplicate "All" if already in categories', () => {
    render(<CategoryFilter categories={['All', ...categories]} selected="All" onSelect={() => {}} />);
    const tabs = screen.getAllByRole('tab');
    const allTabs = tabs.filter((t) => t.textContent === 'All');
    expect(allTabs).toHaveLength(1);
  });

  it('applies accent text color to the active tab for contrast', () => {
    render(<CategoryFilter categories={categories} selected="Games" onSelect={() => {}} />);
    const activeTab = screen.getByRole('tab', { name: 'Games' });
    expect(activeTab.className).toContain('text-bg');
  });

  it('renders a sliding pill behind the active tab', () => {
    const { container } = render(
      <CategoryFilter categories={categories} selected="Games" onSelect={() => {}} />
    );
    const activeTab = screen.getByRole('tab', { name: 'Games' });
    const pill = activeTab.querySelector('[class*="bg-accent"]');
    expect(pill).toBeInTheDocument();
  });

  it('does not render a pill behind inactive tabs', () => {
    render(<CategoryFilter categories={categories} selected="Games" onSelect={() => {}} />);
    const inactiveTab = screen.getByRole('tab', { name: 'All' });
    const pill = inactiveTab.querySelector('[class*="bg-accent"]');
    expect(pill).toBeNull();
  });

  it('applies glassmorphic styling to inactive tabs', () => {
    render(<CategoryFilter categories={categories} selected="Games" onSelect={() => {}} />);
    const inactiveTab = screen.getByRole('tab', { name: 'All' });
    expect(inactiveTab.className).toContain('bg-surface/60');
    expect(inactiveTab.className).toContain('backdrop-blur-sm');
    expect(inactiveTab.className).toContain('text-text-muted');
    expect(inactiveTab.className).toContain('hover:text-accent');
  });
});
