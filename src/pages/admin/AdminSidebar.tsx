import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import type { AdminSection, SiteContent } from './useAdminContent';

interface NavDef { key: AdminSection; label: string; icon: string; count?: number; }

export function AdminSidebar({ section, onSelect, content }: { section: AdminSection; onSelect: (s: AdminSection) => void; content: SiteContent }) {
  const nav: NavDef[] = [
    { key: 'overview', label: 'Overview', icon: 'dashboard' },
    { key: 'projects', label: 'Projects', icon: 'photo_library', count: content.projects.length },
    { key: 'blog', label: 'Blog', icon: 'article', count: content.posts.length },
    { key: 'compose', label: 'Create content', icon: 'add_circle' },
    { key: 'home', label: 'Homepage', icon: 'home' },
    { key: 'about', label: 'About Page', icon: 'info' },
    { key: 'servicePages', label: 'Service Pages', icon: 'design_services', count: content.serviceDetails.length },
    { key: 'areas', label: 'Service Areas', icon: 'location_on', count: content.areas.length },
    { key: 'contact', label: 'Contact & Social', icon: 'call' },
    { key: 'privacy', label: 'Privacy Policy', icon: 'privacy_tip' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="w-[264px] flex-none flex flex-col p-4 bg-[#1c1c19] text-white min-h-screen">
      <Link to="/" title="Go to homepage" className="flex items-center gap-2.5 px-2.5 pt-1.5 pb-5 hover:opacity-90 transition-opacity">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center flex-none">
          <Icon name="format_paint" className="text-white text-xl" />
        </div>
        <div className="font-headline font-extrabold text-[17px] leading-none">
          ThaiViet
          <div className="text-[11px] font-semibold text-white/55 tracking-widest mt-1">CONTENT CMS</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1 mt-2">
        {nav.map((n) => {
          const active = section === n.key;
          return (
            <button
              key={n.key}
              onClick={() => onSelect(n.key)}
              className={'flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ' + (active ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5')}
            >
              <Icon name={n.icon} className={'text-xl ' + (active ? 'text-primary' : 'text-white/55')} />
              <span className="flex-1">{n.label}</span>
              {n.count != null && (
                <span className={'text-[11px] font-bold px-2 py-0.5 rounded-full ' + (active ? 'bg-primary text-white' : 'bg-white/10 text-white/55')}>{n.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />
      <div className="border-t border-white/10 pt-3.5 flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-none">T</div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold">Thai Nguyen</div>
          <div className="text-[11px] text-white/55">Administrator</div>
        </div>
      </div>
    </aside>
  );
}
