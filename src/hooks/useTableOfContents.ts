import { useEffect, useState, type RefObject } from 'react';

export interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3
}

/**
 * Generates a URL-friendly slug from text.
 * Lowercase, replace spaces with hyphens, strip non-alphanumeric except hyphens.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Pure function that extracts TOC items from an array of heading-like objects.
 *
 * - Generates a slug from heading text if no id exists
 * - Handles duplicate IDs by appending a numeric suffix (e.g., "heading", "heading-1", "heading-2")
 * - Preserves document order
 */
export function extractHeadings(
  headings: { tagName: string; id: string; textContent: string }[],
): TOCItem[] {
  const usedIds = new Map<string, number>();

  return headings.map((heading) => {
    const level = parseInt(heading.tagName.replace(/\D/g, ''), 10);
    const text = heading.textContent.trim();
    const baseId = heading.id || slugify(text);

    let id: string;
    const count = usedIds.get(baseId);
    if (count === undefined) {
      id = baseId;
      usedIds.set(baseId, 1);
    } else {
      id = `${baseId}-${count}`;
      usedIds.set(baseId, count + 1);
    }

    return { id, text, level };
  });
}

/**
 * Hook that extracts table of contents items from heading elements within a container.
 * Queries for h2 and h3 elements, generates IDs for headings that lack them,
 * and sets the generated IDs on the actual DOM elements so TOC links work.
 */
export function useTableOfContents(contentRef: RefObject<HTMLElement | null>): TOCItem[] {
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const headingElements = Array.from(container.querySelectorAll<HTMLElement>('h2, h3'));

    const rawHeadings = headingElements.map((el) => ({
      tagName: el.tagName,
      id: el.id,
      textContent: el.textContent ?? '',
    }));

    const tocItems = extractHeadings(rawHeadings);

    // Set generated IDs on actual DOM elements so anchor links work
    headingElements.forEach((el, i) => {
      if (tocItems[i]) {
        el.id = tocItems[i].id;
      }
    });

    setItems(tocItems);
  }, [contentRef]);

  return items;
}
