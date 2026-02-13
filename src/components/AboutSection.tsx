import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, scaleIn } from '../lib/animation';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    skills: ['Python', 'Java', 'C++', 'C', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Oracle SQL'],
  },
  {
    name: 'Frameworks & Tools',
    skills: ['React', 'Oracle Fusion Cloud', 'Git', 'Firebase', 'Google Cloud API', 'Unity'],
  },
  {
    name: 'Spoken Languages',
    skills: ['English (Native)', 'Cantonese (Native)', 'Mandarin (Proficient)'],
  },
];

export default function AboutSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.section
      id="about"
      className="py-20 bg-bg"
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-heading font-bold text-text-primary text-center mb-12"
          variants={fadeUp}
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column: bio + contact */}
          <motion.div variants={staggerContainer}>
            <motion.h3
              className="text-2xl font-heading font-semibold text-text-primary mb-4"
              variants={fadeUp}
            >
              Hello There!
            </motion.h3>
            <motion.p className="text-text-primary leading-relaxed mb-4" variants={fadeUp}>
              Hi, I'm Henry. I work as an IT Trainee at CK Hutchison Holdings, where I develop
              and maintain enterprise applications and contribute to cloud modernization projects.
              I'm passionate about building things — whether it's software dashboards for
              real-time data analysis, AI-powered recommendation systems, or games for Apple
              Vision Pro.
            </motion.p>
            <motion.p className="text-text-primary leading-relaxed mb-6" variants={fadeUp}>
              I graduated from the Hong Kong University of Science and Technology with a degree
              in Computer Science and AI, and had the opportunity to study abroad at the
              University of Minnesota and the Technical University of Denmark, which gave me a
              broader perspective on technology and problem-solving. In my spare time, I enjoy
              tinkering with hardware projects and exploring new frameworks.
            </motion.p>

            <motion.div className="border-t border-border pt-4 space-y-2" variants={fadeUp}>
              <p className="text-text-muted text-sm">
                <span className="font-semibold text-text-primary">Name:</span>{' '}
                <span>Henry Lam</span>
              </p>
              <p className="text-text-muted text-sm">
                <span className="font-semibold text-text-primary">Email:</span>{' '}
                <span>contact@henrylam.blog</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Right column: skill chips */}
          <motion.div className="space-y-6" variants={staggerContainer}>
            {skillCategories.map((category) => (
              <motion.div key={category.name} variants={fadeUp}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                  {category.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent border border-accent/20 backdrop-blur-sm"
                      variants={scaleIn}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
