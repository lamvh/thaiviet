import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import { RenderSection, type ServiceLayoutProps } from './shared';

// Cinematic layout: dark premium frame centered on before/after imagery.
export function ServiceLayoutCinematic({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <div data-testid="svc-cinematic" className="bg-[#1c1c19] text-white">
      <section className="pt-36 pb-14 px-5 sm:px-8 max-w-4xl mx-auto text-center">
        <span className="text-[#ffb4ab] uppercase tracking-[0.2em] text-sm">{meta.name}</span>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold mt-3">{meta.heroTitle}</h1>
        {meta.heroSub && <p className="text-white/70 mt-4">{meta.heroSub}</p>}
      </section>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        {/* before/after (dark) — reuse the pair renderer; AFTER emphasis via wrapper ring in CSS-less mode */}
        <div className="[&_figure:last-child]:ring-2 [&_figure:last-child]:ring-primary rounded-2xl">
          <RenderSection sections={sections} values={values} k="ba" />
        </div>
      </section>
      <section className="bg-[#262522] py-14 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <RenderSection sections={sections} values={values} k="features" />
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-6">Ready to get started?</h2>
        <Link to="/contact" className="inline-block bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold">Request a Free Quote</Link>
        <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="mt-4 flex items-center justify-center gap-2 text-white/80"><Icon name="call" /> {contact.phone}</a>
      </section>
    </div>
  );
}
