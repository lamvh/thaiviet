import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import { ServiceCta, RenderSection, type ServiceLayoutProps } from './shared';

// Sidebar layout: compact hero + sticky facts/CTA aside beside the content column.
export function ServiceLayoutSidebar({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <div data-testid="svc-sidebar">
      <section className="relative h-[380px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/15 z-10" />
        {meta.heroImg && <img className="absolute inset-0 w-full h-full object-cover" src={meta.heroImg} alt={meta.heroTitle} />}
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 w-full">
          <span className="text-white/80 uppercase tracking-[0.2em] text-sm">{meta.name}</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white mt-2">{meta.heroTitle}</h1>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
        <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-[0_12px_40px_rgba(28,28,25,0.06)]">
            {meta.intro && <p className="text-on-surface-variant text-sm leading-relaxed mb-5">{meta.intro}</p>}
            <Link to="/contact" className="block text-center bg-primary text-on-primary py-4 rounded-lg font-bold">Get a Free Quote</Link>
            <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="mt-3 flex items-center justify-center gap-2 text-primary font-bold"><Icon name="call" /> {contact.phone}</a>
          </div>
        </aside>
        <div className="flex flex-col gap-12">
          {meta.introTitle && <h2 className="font-headline text-3xl font-bold">{meta.introTitle}</h2>}
          <RenderSection sections={sections} values={values} k="features" />
          <RenderSection sections={sections} values={values} k="approachBody" />
          <RenderSection sections={sections} values={values} k="approach" />
          <RenderSection sections={sections} values={values} k="ba" />
          <RenderSection sections={sections} values={values} k="showcase" />
          <RenderSection sections={sections} values={values} k="gallery" />
          <div className="border-l-4 border-primary pl-6">
            <RenderSection sections={sections} values={values} k="quote" />
            <RenderSection sections={sections} values={values} k="author" />
          </div>
        </div>
      </section>
      <ServiceCta contact={contact} />
    </div>
  );
}
