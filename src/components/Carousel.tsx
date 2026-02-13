import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { staggerContainer } from '../lib/animation';
import { useCarousel } from '../hooks/useCarousel';

export interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}

export function NavigationArrow({
  direction,
  onClick,
  disabled,
}: NavigationArrowProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const label = direction === 'left' ? 'Scroll left' : 'Scroll right';
  const positionClass = direction === 'left' ? 'left-0' : 'right-0';

  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-10 ${positionClass} rounded-full p-2 bg-surface/80 backdrop-blur-sm border border-border/50 text-text-muted hover:text-accent transition-opacity duration-200 ${
        disabled ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export interface CarouselProps {
  children: React.ReactNode;
  itemCount: number;
  autoScrollInterval?: number;
  ariaLabel?: string;
  centerContent?: boolean;
}

export default function Carousel({
  children,
  itemCount,
  autoScrollInterval = 4000,
  ariaLabel = 'Carousel',
  centerContent = false,
}: CarouselProps) {
  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
    pauseAutoScroll,
    resumeAutoScroll,
    handleKeyDown,
  } = useCarousel({ autoScrollInterval, itemCount });

  return (
    <div role="region" aria-label={ariaLabel} className="relative">
      <NavigationArrow
        direction="left"
        onClick={scrollPrev}
        disabled={!canScrollLeft}
      />

      <motion.div
        ref={scrollRef}
        className={`flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide${centerContent ? ' justify-center' : ''}`}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        onMouseEnter={pauseAutoScroll}
        onMouseLeave={resumeAutoScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {children}
      </motion.div>

      <NavigationArrow
        direction="right"
        onClick={scrollNext}
        disabled={!canScrollRight}
      />
    </div>
  );
}
