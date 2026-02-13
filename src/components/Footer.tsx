import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { staggerContainer, fadeUp } from '../lib/animation';
import { useScrollReveal } from '../hooks/useScrollReveal';

const socialLinks = [
  {
    href: 'https://github.com/HenryLamBlog',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://www.linkedin.com/in/lamhuiyin',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'mailto:contact@henrylam.blog',
    label: 'Email',
    icon: Mail,
  },
];

/**
 * Footer component with social links and copyright notice.
 * Uses scroll-reveal animation and accent-glow hover on social icons.
 */
export default function Footer() {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.footer
      ref={ref}
      className="bg-surface/50 backdrop-blur-sm border-t border-border/50 py-12"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h2
          className="font-heading text-2xl font-semibold text-text-primary mb-6"
          variants={fadeUp}
        >
          Let's Connect
        </motion.h2>
        <motion.div className="flex justify-center gap-6 mb-8" variants={fadeUp}>
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <motion.a
              key={label}
              href={href}
              {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              aria-label={label}
              className="text-text-muted hover:text-accent transition-colors duration-200 p-2"
              whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 8px rgba(245,124,0,0.5))' }}
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </motion.div>
        <motion.p className="text-text-muted text-sm" variants={fadeUp}>
          &copy; {new Date().getFullYear()} henrylam.blog
        </motion.p>
      </div>
    </motion.footer>
  );
}
