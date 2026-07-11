import { ServiceHero, ServiceCta, valueOf, asArray, type ServiceLayoutProps } from './shared';

export function ServiceLayoutTimeline({ meta, values, sections, contact }: ServiceLayoutProps) {
  const steps = asArray(valueOf(values, sections, 'approach')).filter((s) => (s.t ?? '').trim());
  return (
    <div data-testid="svc-timeline">
      <ServiceHero meta={meta} />
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        {meta.introTitle && <h2 className="font-headline text-3xl font-bold mb-10">{meta.introTitle}</h2>}
        <div className="relative pl-12">
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-primary/25" />
          {steps.map((s, i) => (
            <div key={i} className="relative mb-12 last:mb-0">
              <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-extrabold">{i + 1}</div>
              <p className="text-on-surface font-medium">{s.t}</p>
            </div>
          ))}
        </div>
      </section>
      <ServiceCta contact={contact} />
    </div>
  );
}
