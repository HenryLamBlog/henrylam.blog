import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  return (
    <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const isActive = category === selected;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-bg'
                : 'bg-surface/60 backdrop-blur-sm text-text-muted hover:text-accent'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
