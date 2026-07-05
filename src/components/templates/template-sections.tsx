import { Icon } from '../ui/Icon';
import type { SectionDef, TemplateValue } from '../../lib/templates/types';

const asStr = (v: TemplateValue): string => (typeof v === 'string' ? v : '');
const asObj = (v: TemplateValue): Record<string, string> => (typeof v === 'object' && !Array.isArray(v) ? v as Record<string, string> : {});
const asArr = (v: TemplateValue): Array<Record<string, string>> => (Array.isArray(v) ? v : []);

// Renders one section of a project template by its kind/style. Public + preview share this.
export function SectionView({ section: s, value }: { section: SectionDef; value: TemplateValue }) {
  if (s.kind === 'text') {
    const text = asStr(value);
    if (!text.trim()) return null;
    if (s.style === 'quote') {
      return (
        <blockquote className="max-w-3xl mx-auto text-center my-4">
          <Icon name="format_quote" className="text-primary text-4xl" filled />
          <p className="text-2xl md:text-3xl font-medium leading-relaxed mt-4">"{text}"</p>
        </blockquote>
      );
    }
    if (s.style === 'author') {
      return <p className="text-center font-headline font-bold mt-3">{text}</p>;
    }
    // rule / plain
    return (
      <div className="max-w-3xl">
        {s.style === 'rule' && <div className="w-10 h-1 bg-primary mb-4" />}
        {s.heading && <h3 className="font-headline text-xl font-bold mb-3">{s.heading}</h3>}
        <p className="text-on-surface-variant leading-relaxed">{text}</p>
      </div>
    );
  }

  if (s.kind === 'pair') {
    const o = asObj(value);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['before', 'Before'], ['after', 'After']].map(([k, lbl]) => (
          <figure key={k} className="relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-container-low">
            {o[k] && <img className="w-full h-full object-cover" src={o[k]} alt={lbl} loading="lazy" />}
            <figcaption className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{lbl}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  // repeat — drop items the admin left entirely blank so they don't render empty rows.
  const items = asArr(value).filter((it) => Object.values(it).some((x) => (x ?? '').trim() !== ''));
  if (s.style === 'gallery') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <figure key={i} className="rounded-xl overflow-hidden bg-surface-container-low">
            {it.img && <img className="w-full aspect-[4/3] object-cover" src={it.img} alt={it.cap || ''} loading="lazy" />}
            {it.cap && <figcaption className="p-3 text-sm text-on-surface-variant">{it.cap}</figcaption>}
          </figure>
        ))}
      </div>
    );
  }
  if (s.style === 'highlights') {
    return (
      <ul className="space-y-3 max-w-2xl">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary text-lg" /><span className="font-medium">{it.t}</span></li>
        ))}
      </ul>
    );
  }
  if (s.style === 'features') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((it, i) => (
          <div key={i} className="flex gap-4">
            <Icon name={it.icon || 'check_circle'} className="text-primary text-2xl flex-none" />
            <div>
              <h4 className="font-headline font-bold">{it.title}</h4>
              {it.desc && <p className="text-on-surface-variant text-sm leading-relaxed mt-1">{it.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (s.style === 'showcase') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <figure key={i} className="rounded-xl overflow-hidden bg-surface-container-low">
            {it.img && <img className="w-full aspect-[4/3] object-cover" src={it.img} alt={it.title || ''} loading="lazy" />}
            <figcaption className="p-4">
              <div className="font-headline font-bold text-sm">{it.title}</div>
              {it.blurb && <p className="text-on-surface-variant text-sm mt-1">{it.blurb}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }
  if (s.style === 'approach') {
    return (
      <ul className="space-y-3 max-w-2xl">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary text-lg" /><span className="font-medium">{it.t}</span></li>
        ))}
      </ul>
    );
  }
  // steps
  return (
    <ol className="space-y-6 max-w-3xl">
      {items.map((it, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex-none w-9 h-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">{i + 1}</span>
          <div>
            <h4 className="font-headline text-lg font-bold">{it.h}</h4>
            {it.b && <p className="text-on-surface-variant leading-relaxed mt-1">{it.b}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
