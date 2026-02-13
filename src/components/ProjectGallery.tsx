import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { staggerContainer, fadeUp, fadeIn, hoverScale, tapScale } from '../lib/animation';
import CategoryFilter from './CategoryFilter';
import Carousel from './Carousel';

export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
}

export const CATEGORIES = ['All', 'AI/ML', 'Games', 'Hardware', 'Web', 'Blockchain'] as const;
export type Category = typeof CATEGORIES[number];

export const projects: Project[] = [
  { slug: 'fashion-assistant', title: 'AI Fashion Assistant', description: 'Final Year Project — AI-Powered Recommendations', image: '/images/Automatic-Colorization.png', tags: ['Python', 'Deep Learning', 'Recommendation Systems'], category: 'AI/ML' },
  { slug: 'search-engine', title: 'Web Search Engine', description: 'BFS Crawler, TF-IDF, Cosine Similarity', image: '/images/short_path.png', tags: ['Python', 'Information Retrieval', 'BFS'], category: 'Web' },
  { slug: 'wordle-solver', title: 'Wordle Solver', description: 'Greedy Search Algorithm', image: '/images/wordle.jpg', tags: ['Python', 'Algorithms'], category: 'AI/ML' },
  { slug: 'immersive-ball-shooter', title: 'Immersive Ball Shooter', description: 'Apple Vision Pro', image: '/images/ball_shooter.png', tags: ['Swift', 'ARKit', 'RealityKit'], category: 'Games' },
  { slug: 'colorization-of-grayscale-images', title: 'Colorization of Grayscale Images', description: 'Computational Imagery', image: '/images/Automatic-Colorization.png', tags: ['Python', 'TensorFlow', 'CNN'], category: 'AI/ML' },
  { slug: 'maze-game-implementing-bfs-algorithm', title: 'Maze Game', description: 'BFS Algorithm', image: '/images/short_path.png', tags: ['JavaScript', 'BFS Algorithm'], category: 'Games' },
  { slug: 'assembling-iphone-from-parts', title: 'Assembling iPhone from parts', description: 'Hardware', image: '/images/iphone.PNG', tags: ['Hardware', 'Electronics'], category: 'Hardware' },
  { slug: '3d-box-shooter-game', title: '3D Box Shooter Game', description: 'Game Development', image: '/images/box.png', tags: ['C#', 'Unity'], category: 'Games' },
  { slug: 'roller-madness', title: 'Roller Madness Game', description: 'Game Development', image: '/images/roller_madness2.png', tags: ['C#', 'Unity'], category: 'Games' },
  { slug: 'distinguishing-people-with-masks', title: 'Distinguishing individuals with masks', description: 'Machine Learning', image: '/images/masks.png', tags: ['Python', 'OpenCV', 'Deep Learning'], category: 'AI/ML' },
  { slug: 'carbon-credit-tokenization', title: 'Carbon Credit Tokenization', description: 'Report', image: '/images/carbon2.jpg', tags: ['Solidity', 'Ethereum', 'Web3'], category: 'Blockchain' },
  { slug: 'robot-controlled-vehicle', title: 'Robot-Controlled Vehicle', description: 'Lab', image: '/images/robot.JPG', tags: ['Arduino', 'Electronics', 'IoT'], category: 'Hardware' },
];

export function ProjectCard({ slug, title, description, image, tags }: Project) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link
        to={`/${slug}`}
        className="group h-full flex flex-col overflow-hidden bg-surface/60 backdrop-blur-md border border-border/50 rounded-2xl hover:shadow-glow hover:border-accent/50 transition-all duration-300"
      >
        <motion.div whileHover={hoverScale} whileTap={tapScale} className="h-full flex flex-col">
          <div className="aspect-video w-full overflow-hidden relative bg-surface shrink-0">
            <img
              src={image}
              alt={title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-300 group-hover:scale-105 transition-transform ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-lg font-heading font-semibold text-text-primary">{title}</h3>
            <p className="mt-1 text-sm text-text-muted">{description}</p>
            {tags.length > 0 && (
              <motion.div
                className="mt-auto pt-3 flex flex-wrap gap-1.5"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent/10 text-accent border border-accent/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ProjectGallery() {
  const { ref, isInView } = useScrollReveal();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProjects = projects.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <motion.section
      id="projects"
      className="bg-bg py-20"
      ref={ref as React.RefObject<HTMLDivElement>}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          className="mb-8 text-center font-heading text-2xl sm:text-3xl font-bold text-text-primary"
          variants={fadeUp}
        >
          Projects
        </motion.h2>

        <motion.div className="mb-8 flex justify-center" variants={fadeUp}>
          <CategoryFilter
            categories={[...CATEGORIES.filter((c) => c !== 'All')]}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </motion.div>

        <Carousel
          key={selectedCategory}
          itemCount={filteredProjects.length}
          ariaLabel="Project gallery"
          centerContent={filteredProjects.length <= 3}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              className="w-[280px] sm:w-[320px] snap-start shrink-0 transition-shadow duration-300 rounded-2xl h-auto"
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </Carousel>
      </div>
    </motion.section>
  );
}
