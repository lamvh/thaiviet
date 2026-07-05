import { ServiceHero, ServiceCta, type ServiceLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Layout A — the starter service template layout: hero, intro, then each section stacked.
export function ServiceLayoutClassic({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <>
      <ServiceHero meta={meta} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        {(meta.introTitle?.trim() || meta.intro?.trim()) && (
          <div className="max-w-3xl mb-12">
            {meta.introTitle?.trim() && <h2 className="font-headline text-3xl font-bold mb-4">{meta.introTitle}</h2>}
            {meta.intro?.trim() && <p className="text-lg text-on-surface-variant leading-relaxed">{meta.intro}</p>}
          </div>
        )}
        <div className="flex flex-col gap-14">
          {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>
      <ServiceCta contact={contact} />
    </>
  );
}
