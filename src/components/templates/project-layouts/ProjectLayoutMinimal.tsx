import { ProjectHero, ProjectCta, buildFacts, type ProjectLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Style F — minimal, centred. A short centred hero, an inline facts row, and a single
// narrow reading column with generous whitespace. Quiet and editorial.
export function ProjectLayoutMinimal({ meta, values, sections, contact }: ProjectLayoutProps) {
  const facts = buildFacts(meta);
  return (
    <>
      <ProjectHero meta={meta} align="center" minH="min-h-[420px]" />
      <section className="max-w-2xl mx-auto px-5 sm:px-8 py-20">
        {facts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pb-10 border-b border-outline-variant/30">
            {facts.map((f) => (
              <div key={f.label} className="text-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{f.label}: </span>
                <span className="font-headline font-bold text-sm">{f.value}</span>
              </div>
            ))}
          </div>
        )}
        {meta.intro?.trim() && <p className="text-2xl leading-relaxed font-light mt-12 text-center text-on-surface">{meta.intro}</p>}
        <div className="mt-14 flex flex-col gap-14">
          {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>
      <ProjectCta contact={contact} />
    </>
  );
}
