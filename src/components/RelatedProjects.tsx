import { Link } from 'react-router-dom';
import { projects } from './ProjectGallery';

interface RelatedProjectsProps {
  slugs: string[];
}

export default function RelatedProjects({ slugs }: RelatedProjectsProps) {
  const related = slugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => p !== undefined);

  if (related.length === 0) return null;

  return (
    <>
      <hr className="my-8 border-border" />
      <h2 className="mb-6 font-heading text-2xl font-bold text-text-primary">
        My Other Projects:
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {related.map((project) => (
          <div key={project.slug} className="suggested-project">
            <Link
              to={`/${project.slug}`}
              className="group block overflow-hidden rounded-2xl bg-surface/60 backdrop-blur-md border border-border/50 shadow-md hover:shadow-glow hover:border-accent/50 transition-all duration-300"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {project.description}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
