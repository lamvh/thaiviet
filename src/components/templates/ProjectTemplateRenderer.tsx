import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import type { Contact } from '../../lib/types';
import type { ProjectMeta, SectionDef, TemplateValue } from '../../lib/templates/types';
import { SectionView } from './template-sections';

// One renderer for every project template — differs only by the sections it walks.
export function ProjectTemplateRenderer({
  meta, values, sections, contact,
}: { meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; contact: Contact }) {
  const facts = [
    { label: 'Location', value: meta.location },
    { label: 'Duration', value: meta.duration },
    { label: 'Year', value: meta.year },
    { label: 'Service', value: meta.category },
  ].filter((f) => f.value?.trim());

  return (
    <>
      <section className="relative min-h-[460px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-black/45 z-10" />
        {meta.cover && <img className="absolute inset-0 w-full h-full object-cover" src={meta.cover} alt={meta.title} />}
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 pb-12 w-full">
          <Link to="/projects" className="inline-flex items-center gap-1 text-white/90 text-sm font-semibold mb-4 hover:text-white transition-colors">
            <Icon name="arrow_back" className="text-base" /> All Projects
          </Link>
          <span className="block text-inverse-primary font-bold uppercase tracking-[0.2em] text-sm mb-2">{meta.category}</span>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white tracking-tight">{meta.title}</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-5 sm:px-8 py-16">
        {facts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-outline-variant/30">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{f.label}</div>
                <div className="font-headline font-bold text-lg">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        {meta.intro?.trim() && <p className="text-2xl leading-relaxed font-light mt-12 max-w-4xl text-on-surface">{meta.intro}</p>}
        <div className="mt-14 flex flex-col gap-12">
          {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">Want a finish like this?</h2>
        <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Tell us about your place and we'll give you an honest, no-obligation quote.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-95 transition-all">Request a Free Quote</Link>
          <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-surface-container-high transition-all inline-flex items-center justify-center gap-2"><Icon name="call" /> {contact.phone}</a>
        </div>
      </section>
    </>
  );
}
