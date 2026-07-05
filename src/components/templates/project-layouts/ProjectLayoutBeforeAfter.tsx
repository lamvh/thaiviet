import { ProjectHero, FactsGrid, ProjectCta, buildFacts, type ProjectLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Style C — leads with the transformation. Any before/after pair is lifted out of the
// body and featured full-width in a tinted band right under the hero; the remaining
// sections follow. Works for any template — if there is no pair it reads like the
// classic layout with a bolder facts band.
export function ProjectLayoutBeforeAfter({ meta, values, sections, contact }: ProjectLayoutProps) {
  const facts = buildFacts(meta);
  const pair = sections.find((s) => s.kind === 'pair');
  const rest = sections.filter((s) => s !== pair);

  return (
    <>
      <ProjectHero meta={meta} />

      {pair && (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-8">
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">The Transformation</span>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold mt-2">Before &amp; After</h2>
            </div>
            <SectionView section={pair} value={values[pair.key] ?? pair.default} />
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <FactsGrid facts={facts} />
        {meta.intro?.trim() && <p className="text-2xl leading-relaxed font-light mt-12 max-w-4xl text-on-surface">{meta.intro}</p>}
        <div className="mt-14 flex flex-col gap-12">
          {rest.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>
      <ProjectCta contact={contact} />
    </>
  );
}
