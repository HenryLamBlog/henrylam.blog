import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { staggerContainer, fadeUp, fadeIn } from '../lib/animation';
import TypedTextAnimator from './TypedTextAnimator';

export default function HeroSection() {
  return (
    <header
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-bg"
      role="banner"
    >
      {/* Animated gradient mesh background — orange/amber tones */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          backgroundSize: '400% 400%',
          backgroundImage: [
            'radial-gradient(ellipse at 20% 50%, rgba(245, 124, 0, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 20%, rgba(251, 163, 60, 0.12) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 80%, rgba(194, 120, 86, 0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 60%, rgba(253, 186, 116, 0.08) 0%, transparent 50%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Profile photo with accent ring and animated glow pulse */}
        <motion.div
          className="mb-6"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <img
            src="/images/me.jpg"
            alt="Profile photo of Henry Lam"
            className="h-36 w-36 rounded-2xl object-cover ring-4 ring-accent/40 shadow-glow animate-pulse-glow"
          />
        </motion.div>

        {/* Staggered name + subtitle */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Name with glow/blur effect behind it */}
          <motion.div className="relative mb-4" variants={fadeUp}>
            <div
              className="absolute inset-0 blur-2xl opacity-30 bg-accent"
              aria-hidden="true"
            />
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-text-primary">
              Henry Lam
            </h1>
          </motion.div>

          {/* Subtitle with typing animation */}
          <motion.p
            className="text-base sm:text-lg md:text-xl font-medium text-text-muted h-8"
            variants={fadeUp}
          >
            <TypedTextAnimator
              strings={[
                'Software Engineer',
                'AI Developer',
                'HKUST CS & AI Graduate',
                'Full Stack Builder',
                'Machine Learning Engineer',
                'Cloud & Enterprise Developer',
                'iOS & Vision Pro Developer',
                'React & TypeScript Developer',
                'Python & Deep Learning',
                'Game Developer',
                'Hardware Tinkerer',
                'IT Trainee @ CK Hutchison',
              ]}
              typingSpeed={100}
              erasingSpeed={50}
              pauseDuration={2000}
            /><span className="animate-pulse text-accent">|</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll-down indicator with infinite bounce animation */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
        <motion.button
          className="cursor-pointer bg-transparent border-none p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => {
            const about = document.getElementById('about');
            about?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Scroll down to content"
        >
          <ChevronDown className="h-8 w-8 text-text-muted" />
        </motion.button>
      </div>
    </header>
  );
}
