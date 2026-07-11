import { RenderSection, ServiceCta, valueOf, asArray, type ServiceLayoutProps } from './shared';
import { ServiceHero } from './shared';

export function ServiceLayoutBento({ meta, values, sections, contact }: ServiceLayoutProps) {
  const cards = asArray(valueOf(values, sections, 'showcase')).filter((c) => (c.img ?? '').trim());
  const span = (i: number) => (i === 0 ? 'col-span-2 row-span-2' : i % 3 === 1 ? 'col-span-2' : '');
  return (
    <div data-testid="svc-bento">
      <ServiceHero meta={meta} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {cards.map((c, i) => (
            <div key={i} className={'relative rounded-2xl overflow-hidden ' + span(i)}>
              <img className="w-full h-full object-cover" src={c.img} alt={c.title || ''} />
              {c.title && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><span className="text-white font-bold">{c.title}</span></div>}
            </div>
          ))}
          <div className="col-span-2 rounded-2xl bg-primary text-on-primary p-7 flex flex-col justify-center">
            <div className="font-headline text-3xl font-extrabold">{meta.name}</div>
            {meta.heroSub && <p className="mt-2 opacity-90">{meta.heroSub}</p>}
          </div>
        </div>
        <div className="mt-14">
          <RenderSection sections={sections} values={values} k="quote" />
          <RenderSection sections={sections} values={values} k="author" />
        </div>
      </section>
      <ServiceCta contact={contact} />
    </div>
  );
}
