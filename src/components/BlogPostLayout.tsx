import { type ReactNode, useRef } from 'react';
import { motion } from 'framer-motion';
import RelatedProjects from './RelatedProjects';
import ReadingProgress from './ReadingProgress';
import TableOfContents from './TableOfContents';
import { useTableOfContents } from '../hooks/useTableOfContents';
import { fadeIn } from '../lib/animation';

interface BlogPostLayoutProps {
  children: ReactNode;
  relatedSlugs?: string[];
}

export default function BlogPostLayout({ children, relatedSlugs = [] }: BlogPostLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const tocItems = useTableOfContents(contentRef);

  return (
    <>
      <ReadingProgress />

      {/* Content area */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
          {/* Main content */}
          <article
            ref={contentRef}
            className="prose dark:prose-invert max-w-none
              bg-surface/0 dark:bg-surface/30 rounded-2xl p-0 sm:p-6 lg:p-8 border border-transparent dark:border-border/30
              prose-headings:font-heading prose-headings:tracking-tight
              prose-h1:hidden
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-l-4 prose-h2:border-l-accent prose-h2:pl-4 prose-h2:border-b-0
              prose-h3:text-lg prose-h3:mt-8
              prose-p:leading-relaxed prose-p:text-text-primary/90 dark:prose-p:text-inherit
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-code:bg-surface prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
              prose-pre:bg-surface prose-pre:rounded-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border
              prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden
              prose-th:bg-surface prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-border prose-th:text-sm prose-th:font-semibold
              prose-td:px-4 prose-td:py-2.5 prose-td:border prose-td:border-border prose-td:text-sm
              prose-tr:even:bg-surface/50
              prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-border/50
              prose-blockquote:border-l-accent prose-blockquote:bg-surface/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
              prose-li:marker:text-accent
              prose-strong:text-text-primary dark:prose-strong:text-inherit"
          >
            {/* Mobile TOC (above content) */}
            <div className="lg:hidden not-prose mb-8">
              <TableOfContents items={tocItems} />
            </div>

            {children}

            {relatedSlugs.length > 0 && (
              <div className="not-prose mt-16">
                <RelatedProjects slugs={relatedSlugs} />
              </div>
            )}
          </article>

          {/* Desktop TOC sidebar */}
          <aside className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
        </div>
      </motion.div>
    </>
  );
}
