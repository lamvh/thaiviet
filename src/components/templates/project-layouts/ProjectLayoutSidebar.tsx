import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import { ProjectHero, ProjectCta, buildFacts, type ProjectLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Style B — sticky facts sidebar (white card + quote CTA) beside a narrower content
// column. Compact hero. Mirrors the "Project Detail · Sidebar layout" design frame.
export function ProjectLayoutSidebar({ meta, values, sections, contact }: ProjectLayoutProps) {
  const facts = buildFacts(meta);
  return (
    <>
      <ProjectHero meta={meta} minH="min-h-[380px]" />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xl shadow-black/5">
            <dl className="flex flex-col gap-5">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">{f.label}</dt>
                  <dd className="font-headline font-bold text-on-surface">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link to="/contact" className="mt-7 block text-center bg-primary text-on-primary p-4 rounded-lg font-bold hover:scale-[0.98] transition-transform">
              Get a Similar Quote
            </Link>
          </div>
          <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="call" className="text-base" /> {contact.phone}
          </a>
        </aside>

        <div>
          {meta.intro?.trim() && <p className="text-2xl leading-relaxed font-light mb-10 text-on-surface">{meta.intro}</p>}
          <div className="flex flex-col gap-10">
            {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
          </div>
        </div>
      </section>
      <ProjectCta contact={contact} />
    </>
  );
}
