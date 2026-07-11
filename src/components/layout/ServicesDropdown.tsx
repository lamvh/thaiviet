import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useSiteContent } from '../../lib/site-content-context';

export function ServicesDropdown() {
  const { serviceDetails } = useSiteContent();
  const shown = serviceDetails.filter((s) => s.visible !== false);
  return (
    <div className="relative group">
      <button className="flex items-center gap-0.5 text-slate-700 hover:text-primary transition-colors font-headline cursor-pointer bg-transparent border-none p-0 text-base">
        Services <Icon name="expand_more" className="text-base leading-none mt-0.5" />
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white rounded-xl shadow-2xl border border-slate-100 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
          {shown.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-red-50 hover:text-primary transition-colors font-headline">
              <Icon name={s.icon || 'design_services'} className="text-base" />{s.name}
            </Link>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-3">
          <Link to="/services" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors">
            <Icon name="grid_view" className="text-primary" />
            <div><div className="font-headline font-bold text-sm text-slate-700">All Services</div><div className="text-xs text-on-surface-variant">Browse the full range</div></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
