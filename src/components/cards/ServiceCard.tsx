import { Link } from 'react-router-dom';
import type { ServiceDetail } from '../../lib/types';
import { Icon } from '../ui/Icon';

export function ServiceCard({ service, subtitle }: { service: ServiceDetail; subtitle?: string }) {
  return (
    <Link to={`/services/${service.slug}`} className="block bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(28,28,25,0.06)] group hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon name={service.icon || 'design_services'} />
      </div>
      <h3 className="text-xl font-bold mb-3 font-headline">{service.name}</h3>
      <p className="text-on-surface-variant leading-relaxed mb-6">{subtitle ?? service.desc}</p>
      <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
        Learn more <Icon name="arrow_forward" className="text-base" />
      </span>
    </Link>
  );
}
