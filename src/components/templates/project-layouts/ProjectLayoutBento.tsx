import { ProjectHero, ProjectCta, buildFacts, type ProjectLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Style E — bento mosaic. The lede fills a large tinted tile beside a stack of fact
// tiles, then every section becomes its own rounded card flowed into a two-column
// masonry so mixed content (text, quote, gallery, steps) tiles neatly at any length.
export function ProjectLayoutBento({ meta, values, sections, contact }: ProjectLayoutProps) {
  const facts = buildFacts(meta);
  return (
    <>
      <ProjectHero meta={meta} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        {/* Top row: lede tile (2/3) + facts tile (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {meta.intro?.trim() && (
            <div className="md:col-span-2 bg-on-surface text-white rounded-2xl p-8 md:p-10 flex items-center">
              <p className="text-2xl md:text-3xl leading-relaxed font-light">{meta.intro}</p>
            </div>
          )}
          {facts.length > 0 && (
            <div className="bg-primary text-on-primary rounded-2xl p-8 grid grid-cols-2 gap-6 content-center">
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">{f.label}</div>
                  <div className="font-headline font-bold leading-tight">{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section cards flowed into a masonry mosaic */}
        <div className="mt-5 gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {sections.map((s) => (
            <div key={s.key} className="bg-surface-container-low rounded-2xl p-6 md:p-8">
              <SectionView section={s} value={values[s.key] ?? s.default} />
            </div>
          ))}
        </div>
      </section>
      <ProjectCta contact={contact} />
    </>
  );
}
