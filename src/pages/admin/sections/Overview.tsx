import { Icon } from '../../../components/ui/Icon';
import type { SiteContent, AdminSection } from '../useAdminContent';

const card = 'bg-white border border-[#eae6df] rounded-2xl p-5';

export function Overview({ content, onNavigate }: { content: SiteContent; onNavigate: (s: AdminSection) => void }) {
  const stats = [
    { label: 'Projects', value: content.projects.length, icon: 'photo_library', sub: content.projects.filter((p) => p.visible !== false).length + ' visible' },
    { label: 'Blog posts', value: content.posts.length, icon: 'article', sub: content.posts.filter((p) => p.visible !== false).length + ' visible' },
    { label: 'Service areas', value: content.areas.length, icon: 'location_on', sub: 'across the region' },
    { label: 'Live pages', value: 7, icon: 'public', sub: 'Home · About · more' },
  ];
  const quick: { label: string; icon: string; to: AdminSection }[] = [
    { label: 'Edit projects', icon: 'photo_library', to: 'projects' },
    { label: 'Write a post', icon: 'article', to: 'blog' },
    { label: 'Update hero', icon: 'home', to: 'home' },
    { label: 'Contact details', icon: 'call', to: 'contact' },
  ];

  return (
    <>
      <p className="text-xs text-[#8a8377] mb-3">Stats as of last load</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={card}>
            <div className="flex justify-between items-start">
              <div className="font-headline text-3xl font-extrabold leading-none">{s.value}</div>
              <Icon name={s.icon} className="text-primary text-xl" />
            </div>
            <div className="text-sm font-bold mt-2">{s.label}</div>
            <div className="text-xs text-[#8a8377] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className={card.replace('p-5', 'p-6')}>
        <h3 className="font-headline text-lg font-bold mb-1.5">Manage your website content</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl mb-5">
          Update what visitors see on thaiviet.co.nz — edit projects and blog posts, toggle what's published, change the
          homepage hero, service areas and contact details. Pick a section to begin.
        </p>
        <div className="flex flex-wrap gap-3">
          {quick.map((q) => (
            <button
              key={q.to}
              onClick={() => onNavigate(q.to)}
              className="flex items-center gap-2.5 bg-surface-container-low border border-[#eae6df] rounded-xl px-4 py-3.5 text-sm font-semibold hover:bg-surface-container transition-colors"
            >
              <Icon name={q.icon} className="text-primary text-lg" />
              {q.label}
              <Icon name="chevron_right" className="text-[#b9b2a6] text-lg" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
