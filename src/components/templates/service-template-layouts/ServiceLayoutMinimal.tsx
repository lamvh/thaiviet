import { ServiceCta, RenderSection, type ServiceLayoutProps } from './shared';

export function ServiceLayoutMinimal({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <div data-testid="svc-minimal" className="bg-surface">
      <article className="max-w-[720px] mx-auto px-5 sm:px-8 pt-28 text-center">
        <div className="text-primary uppercase tracking-[0.2em] text-xs">{meta.name}</div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mt-3">{meta.heroTitle}</h1>
        {meta.heroSub && <p className="text-on-surface-variant mt-4">{meta.heroSub}</p>}
      </article>
      {meta.heroImg && (
        <div className="max-w-[1040px] mx-auto px-5 sm:px-8 mt-12">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden"><img className="w-full h-full object-cover" src={meta.heroImg} alt={meta.heroTitle} /></div>
        </div>
      )}
      <article className="max-w-[680px] mx-auto px-5 sm:px-8 py-14 flex flex-col gap-10">
        {meta.intro && <p className="text-lg leading-8 text-on-surface-variant">{meta.intro}</p>}
        <RenderSection sections={sections} values={values} k="features" />
        <div className="border-y border-outline-variant/20 py-8 text-center italic">
          <RenderSection sections={sections} values={values} k="quote" />
          <RenderSection sections={sections} values={values} k="author" />
        </div>
      </article>
      <ServiceCta contact={contact} />
    </div>
  );
}
