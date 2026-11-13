import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import type { AdminSection, SiteContent } from './useAdminContent';

interface NavDef { key: AdminSection; label: string; icon: string; count?: number; }

export function AdminSidebar({ section, onSelect, content }: { section: AdminSection; onSelect: (s: AdminSection) => void; content: SiteContent }) {
  // Grouped by what the editor is trying to do, so 14 sections scan as 6 short lists.
  const groups: { title?: string; items: NavDef[] }[] = [
    { items: [{ key: 'overview', label: 'Overview', icon: 'dashboard' }] },
    {
      title: 'Pages',
      items: [
        { key: 'home', label: 'Homepage', icon: 'home' },
        { key: 'about', label: 'About Page', icon: 'info' },
        { key: 'privacy', label: 'Privacy Policy', icon: 'privacy_tip' },
      ],
    },
    {
      title: 'Portfolio',
      items: [
        { key: 'projects', label: 'Projects', icon: 'photo_library', count: content.projects.length },
        { key: 'compose', label: 'Project Templates', icon: 'dashboard_customize' },
        { key: 'blog', label: 'Blog', icon: 'article', count: content.posts.length },
      ],
    },
    {
      title: 'Services',
      items: [
        { key: 'services', label: 'Services', icon: 'design_services', count: content.serviceDetails.length },
        { key: 'serviceCompose', label: 'Service Templates', icon: 'dashboard_customize' },
        { key: 'areas', label: 'Service Areas', icon: 'location_on', count: content.areas.length },
      ],
    },
    {
      title: 'Customers',
      items: [
        { key: 'leads', label: 'Leads', icon: 'inbox' },
        { key: 'contact', label: 'Contact & Social', icon: 'call' },
      ],
    },
    {
      title: 'System',
      items: [
        { key: 'media', label: 'Media Library', icon: 'perm_media' },
        { key: 'settings', label: 'Settings', icon: 'settings' },
      ],
    },
  ];

  return (
    <aside className="w-[264px] flex-none flex flex-col p-4 bg-[#1c1c19] text-white h-screen sticky top-0 overflow-y-auto">
      <Link to="/" title="Go to homepage" className="flex items-center gap-2.5 px-2.5 pt-1.5 pb-5 hover:opacity-90 transition-opacity">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center flex-none">
          <Icon name="format_paint" className="text-white text-xl" />
        </div>
        <div className="font-headline font-extrabold text-[17px] leading-none">
          ThaiViet
          <div className="text-[11px] font-semibold text-white/55 tracking-widest mt-1">CONTENT CMS</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-4 mt-2">
        {groups.map((g, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {g.title && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{g.title}</div>
            )}
            {g.items.map((n) => {
              const active = section === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => onSelect(n.key)}
                  aria-current={active ? 'page' : undefined}
                  className={'relative flex items-center gap-3 w-full text-left px-3 py-2 rounded-[10px] text-sm font-semibold transition-colors ' + (active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white')}
                >
                  {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" aria-hidden />}
                  <Icon name={n.icon} className={'text-xl ' + (active ? 'text-primary' : 'text-white/50')} />
                  <span className="flex-1">{n.label}</span>
                  {n.count != null && (
                    <span className={'text-[11px] font-bold px-2 py-0.5 rounded-full ' + (active ? 'bg-primary text-white' : 'bg-white/10 text-white/55')}>{n.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
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
