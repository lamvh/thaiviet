import { Link } from 'react-router-dom';
import type { Project } from '../../lib/types';
import { Icon } from '../ui/Icon';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={'/projects/' + project.id} className="project-item group cursor-pointer relative block overflow-hidden rounded-2xl aspect-[4/5] bg-surface-container-low shadow-md hover:shadow-2xl transition-all duration-500">
      <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110" src={project.image} alt={project.title} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <span className="absolute top-5 left-5 bg-white/95 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary rounded-full">{project.categoryLabel}</span>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-headline text-xl font-bold leading-tight mb-2">{project.title}</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-3 max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">{project.desc}</p>
        <div className="flex items-center gap-2 text-sm font-bold text-white opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
          View Project <Icon name="arrow_forward" className="text-base" />
        </div>
      </div>
    </Link>
  );
}
