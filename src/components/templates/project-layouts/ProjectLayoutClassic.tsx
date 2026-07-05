import { ProjectHero, FactsGrid, ProjectCta, buildFacts, type ProjectLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Style A — the original full-width layout: hero, facts strip, lede, then every section
// stacked in a single column. The default for all templated project pages.
export function ProjectLayoutClassic({ meta, values, sections, contact }: ProjectLayoutProps) {
  const facts = buildFacts(meta);
  return (
    <>
      <ProjectHero meta={meta} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <FactsGrid facts={facts} />
        {meta.intro?.trim() && <p className="text-2xl leading-relaxed font-light mt-12 max-w-4xl text-on-surface">{meta.intro}</p>}
        <div className="mt-14 flex flex-col gap-12">
          {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>
      <ProjectCta contact={contact} />
    </>
  );
}
