import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '../lib/animation';

/**
 * Full-page loading overlay using Framer Motion for fade-out.
 * Shows a spinning indicator centered on the page background, then fades out
 * and removes itself from the DOM via onAnimationComplete. Dark mode aware.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fade-out shortly after mount
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 100);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg"
      data-testid="page-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      onAnimationComplete={() => {
        if (fadingOut) {
          setVisible(false);
        }
      }}
      aria-hidden="true"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
    </motion.div>
  );
}
