import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { TOCItem } from '../hooks/useTableOfContents';
import { EASE_OUT_EXPO } from '../lib/animation';

interface TableOfContentsProps {
  items: TOCItem[];
}

/**
 * Tracks which heading is currently active based on scroll position.
 * Returns the id of the last heading whose top is at or above scrollY + offset.
 */
function useActiveHeading(items: TOCItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    if (items.length === 0) return;

    const offset = 100; // px below top of viewport
    let current: string | null = null;

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top <= offset) {
          current = item.id;
        }
      }
    }

    setActiveId(current);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;

    handleScroll(); // set initial active heading
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, handleScroll]);

  return activeId;
}

function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth' });
}

function TOCList({ items, activeId }: { items: TOCItem[]; activeId: string | null }) {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id} className={`relative ${item.level === 3 ? 'ml-4' : ''}`}>
          {activeId === item.id && (
            <motion.div
              layoutId="toc-active"
              className="absolute inset-0 rounded bg-accent/10 border-l-2 border-accent"
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            />
          )}
          <a
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`relative z-10 block px-2 py-1 transition-colors ${
              activeId === item.id
                ? 'text-accent font-medium'
                : 'text-text-muted hover:text-accent'
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Navigable table of contents built from heading elements.
 * Desktop: sticky sidebar with active heading tracking.
 * Mobile: collapsible disclosure widget with animated open/close.
 */
export default function TableOfContents({ items }: TableOfContentsProps) {
  const activeId = useActiveHeading(items);
  const [isOpen, setIsOpen] = useState(false);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents">
      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block sticky top-20 border-l border-border/50 pl-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          On this page
        </h2>
        <TOCList items={items} activeId={activeId} />
      </div>

      {/* Mobile: collapsible disclosure with animation */}
      <div className="lg:hidden border border-border rounded-lg p-3 mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between text-sm font-semibold text-text-primary"
          aria-expanded={isOpen}
        >
          Table of Contents
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="toc-mobile-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                <TOCList items={items} activeId={activeId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
