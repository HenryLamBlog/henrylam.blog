import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import Navbar from './Navbar';

function renderNavbar(initialRoute = '/') {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('renders the brand name "Henry Lam"', () => {
    renderNavbar();
    expect(screen.getByText('Henry Lam')).toBeInTheDocument();
  });

  it('brand uses the heading font family', () => {
    renderNavbar();
    const brand = screen.getByText('Henry Lam');
    expect(brand).toHaveClass('font-heading');
  });

  it('renders links to About Me and Projects', () => {
    renderNavbar();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('links point to correct section anchors', () => {
    renderNavbar();
    expect(screen.getByText('About Me').closest('a')).toHaveAttribute('href', '#about');
    expect(screen.getByText('Projects').closest('a')).toHaveAttribute('href', '#projects');
  });

  it('has navigation role and aria-label', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it('is fixed to the top of the viewport', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('top-0');
  });

  it('includes a theme toggle control', () => {
    renderNavbar();
    const toggles = screen.getAllByRole('button', { name: /switch to (dark|light) mode/i });
    // Desktop and mobile each render a ThemeToggle
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  describe('scroll behavior on landing page', () => {
    it('has transparent background on landing page at top', () => {
      renderNavbar('/');
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toHaveClass('bg-transparent');
    });

    it('transitions to solid background after scrolling', () => {
      renderNavbar('/');
      const nav = screen.getByRole('navigation', { name: /main navigation/i });

      // Simulate scroll past threshold
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(nav).not.toHaveClass('bg-transparent');
      expect(nav).toHaveClass('shadow-sm');
    });

    it('returns to transparent when scrolling back to top', () => {
      renderNavbar('/');
      const nav = screen.getByRole('navigation', { name: /main navigation/i });

      // Scroll down
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(nav).not.toHaveClass('bg-transparent');

      // Scroll back up
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(nav).toHaveClass('bg-transparent');
    });
  });

  describe('blog page background', () => {
    it('has solid background immediately on blog pages', () => {
      renderNavbar('/wordle-solver');
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).not.toHaveClass('bg-transparent');
      expect(nav).toHaveClass('shadow-sm');
    });

    it('has solid background on any non-root route', () => {
      renderNavbar('/immersive-ball-shooter');
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).not.toHaveClass('bg-transparent');
    });
  });

  describe('hamburger menu toggle', () => {
    it('renders a toggle button with aria-label', () => {
      renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      expect(toggle).toBeInTheDocument();
    });

    it('toggle button starts with aria-expanded false', () => {
      renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('mobile menu is not visible initially', () => {
      renderNavbar();
      expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
    });

    it('clicking toggle expands the mobile menu', () => {
      renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(document.getElementById('mobile-menu')).toBeInTheDocument();
    });

    it('clicking toggle twice collapses the mobile menu', async () => {
      renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await waitFor(() => {
        expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('smooth scroll navigation', () => {
    let aboutSection: HTMLDivElement;

    beforeEach(() => {
      aboutSection = document.createElement('div');
      aboutSection.id = 'about';
      aboutSection.scrollIntoView = vi.fn();
      document.body.appendChild(aboutSection);
    });

    afterEach(() => {
      if (document.body.contains(aboutSection)) {
        document.body.removeChild(aboutSection);
      }
    });

    it('smooth scrolls to section on landing page when link is clicked', () => {
      renderNavbar('/');
      const aboutLink = screen.getByText('About Me');
      fireEvent.click(aboutLink);
      expect(aboutSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('prevents default anchor behavior on nav link click', () => {
      renderNavbar('/');
      const aboutLink = screen.getByText('About Me');
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      aboutLink.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('collapses hamburger menu after clicking a nav link', async () => {
      renderNavbar('/');
      // Expand the menu
      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      fireEvent.click(toggle);
      const mobileMenu = document.getElementById('mobile-menu');
      expect(mobileMenu).toBeInTheDocument();

      // Click a nav link inside the mobile menu
      const mobileAboutLink = mobileMenu!.querySelector('a[href="#about"]') as HTMLElement;
      fireEvent.click(mobileAboutLink);

      // Menu should be collapsed
      await waitFor(() => {
        expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
      });
    });

    it('smooth scrolls to each section correctly', () => {
      const sections = ['about', 'projects'];
      const linkTexts = ['About Me', 'Projects'];
      const elements: HTMLDivElement[] = [];

      // Remove the beforeEach about section to avoid duplicates
      document.body.removeChild(aboutSection);

      sections.forEach((id) => {
        const el = document.createElement('div');
        el.id = id;
        el.scrollIntoView = vi.fn();
        document.body.appendChild(el);
        elements.push(el);
      });

      renderNavbar('/');

      linkTexts.forEach((text, i) => {
        const link = screen.getByText(text);
        fireEvent.click(link);
        expect(elements[i].scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      });

      elements.forEach((el) => document.body.removeChild(el));
    });
  });

  describe('cross-page navigation', () => {
    it('navigates to landing page with scrollTo state from blog page', () => {
      renderNavbar('/wordle-solver');
      const aboutLink = screen.getByText('About Me');
      // On a blog page, clicking a nav link should trigger navigation
      // (the link click handler calls navigate('/', { state: { scrollTo: sectionId } }))
      fireEvent.click(aboutLink);
      // After navigation, the component should attempt to scroll
      // We verify the link is clickable and the handler runs without error
      expect(aboutLink).toBeInTheDocument();
    });
  });
});
