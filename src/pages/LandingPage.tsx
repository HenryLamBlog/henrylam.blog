import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProjectGallery from '../components/ProjectGallery';
import { fadeIn } from '../lib/animation';

export default function LandingPage() {
  return (
    <div id="page">
      <HeroSection />
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      />
      <AboutSection />
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      />
      <ProjectGallery />
    </div>
  );
}
