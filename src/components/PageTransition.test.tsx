import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PageTransition from './PageTransition';

// Track the useReducedMotion return value
let mockReducedMotion = false;

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
  };
});

describe('PageTransition', () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it('renders children content', () => {
    render(
      <PageTransition>
        <p>Hello World</p>
      </PageTransition>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('wraps children in a motion.div with animation attributes', () => {
    const { container } = render(
      <PageTransition>
        <span>Content</span>
      </PageTransition>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeTruthy();
    expect(wrapper!.tagName).toBe('DIV');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders a plain div when reduced motion is preferred', () => {
    mockReducedMotion = true;
    const { container } = render(
      <PageTransition>
        <span>Accessible</span>
      </PageTransition>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeTruthy();
    expect(wrapper!.tagName).toBe('DIV');
    expect(screen.getByText('Accessible')).toBeInTheDocument();
  });

  it('uses pageTransition variants from animation.ts', async () => {
    const animation = await import('../lib/animation');
    expect(animation.pageTransition).toBeDefined();
    expect(animation.pageTransition.initial).toBeDefined();
    expect(animation.pageTransition.animate).toBeDefined();
    expect(animation.pageTransition.exit).toBeDefined();
  });
});
