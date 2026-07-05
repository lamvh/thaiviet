import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import type { Contact } from '../../../lib/types';
import type { ServiceMeta, SectionDef, TemplateValue } from '../../../lib/templates/types';

// Every templated-service layout receives the same shape — the template's layout only
// changes how this content is arranged, never the content itself.
export interface ServiceLayoutProps {
  meta: ServiceMeta;
  values: Record<string, TemplateValue>;
  sections: SectionDef[];
  contact: Contact;
}

export function ServiceHero({ meta }: { meta: ServiceMeta }) {
  return (
    <section className="relative min-h-[420px] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-black/45 z-10" />
      {meta.heroImg && <img className="absolute inset-0 w-full h-full object-cover" src={meta.heroImg} alt={meta.heroTitle} />}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 pb-12 w-full">
        <Link to="/services" className="inline-flex items-center gap-1 text-white/90 text-sm font-semibold mb-4 hover:text-white transition-colors">
          <Icon name="arrow_back" className="text-base" /> All Services
        </Link>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white tracking-tight">{meta.heroTitle}</h1>
        {meta.heroSub && <p className="text-white/85 text-lg mt-3 max-w-2xl">{meta.heroSub}</p>}
      </div>
    </section>
  );
}

export function ServiceCta({ contact }: { contact: Contact }) {
  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
      <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">Ready to get started?</h2>
      <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Tell us about your place and we’ll give you an honest, no-obligation quote.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/contact" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-95 transition-all">Request a Free Quote</Link>
        <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-surface-container-high transition-all inline-flex items-center justify-center gap-2"><Icon name="call" /> {contact.phone}</a>
      </div>
    </section>
  );
}
