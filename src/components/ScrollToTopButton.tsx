import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scaleIn, EASE_OUT_EXPO } from '../lib/animation';

/**
 * A scroll-to-top button that appears after scrolling down 300px.
 * Uses AnimatePresence with scaleIn variant for entrance/exit animations.
 * No props — manages its own scroll position state internally.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position in case page is already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: EASE_OUT_EXPO } }}
          className="fixed bottom-6 right-6 rounded-full shadow-lg p-3 bg-accent/90 text-white hover:bg-accent hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
