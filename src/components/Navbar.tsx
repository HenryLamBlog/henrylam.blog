import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { navUnderline, EASE_OUT_EXPO } from '../lib/animation';

const NAV_LINKS = [
  { label: 'About Me', sectionId: 'about' },
  { label: 'Projects', sectionId: 'projects' },
] as const;

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.25, ease: EASE_OUT_EXPO as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';

  // Track scroll position to toggle transparent → solid bg on landing page
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 64);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (isLanding) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Handle cross-page scroll navigation (from blog → landing section)
  useEffect(() => {
    if (location.pathname === '/' && location.state && (location.state as { scrollTo?: string }).scrollTo) {
      const sectionId = (location.state as { scrollTo: string }).scrollTo;
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Clear the state so it doesn't re-trigger
          window.history.replaceState({}, '');
        } else if (attempts < 10) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      const timeoutId = setTimeout(tryScroll, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [location]);

  // Transparent on landing at top, solid otherwise
  const showSolidBg = !isLanding || scrolled;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBg
          ? 'bg-bg/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a href="/" className="flex-shrink-0">
            <h1 className="font-heading text-2xl font-bold text-text-primary m-0">
              Henry Lam
            </h1>
          </a>

          {/* Desktop nav links + theme toggle */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, sectionId }) => (
              <motion.a
                key={sectionId}
                href={`#${sectionId}`}
                onClick={(e) => handleNavClick(e, sectionId)}
                className="relative text-text-primary hover:text-accent transition-colors duration-200 text-sm font-medium"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                {label}
                <motion.span
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-accent"
                  variants={navUnderline}
                />
              </motion.a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile hamburger + theme toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleMenu}
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              className="p-2 rounded-lg text-text-primary hover:bg-surface transition-colors duration-200"
            >
              <motion.span
                className="block"
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT_EXPO as [number, number, number, number] }}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden border-t border-border/50 bg-bg/95 backdrop-blur-lg overflow-hidden"
            id="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 py-3 space-y-2">
              {NAV_LINKS.map(({ label, sectionId }) => (
                <a
                  key={sectionId}
                  href={`#${sectionId}`}
                  onClick={(e) => handleNavClick(e, sectionId)}
                  className="block px-3 py-2 rounded-md text-text-primary hover:bg-surface hover:text-accent transition-colors duration-200 text-sm font-medium"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
