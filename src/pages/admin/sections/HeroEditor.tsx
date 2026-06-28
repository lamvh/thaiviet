import type { Hero } from '../../../lib/types';

interface Props {
  hero: Hero;
  onChange?: (key: keyof Hero, value: string) => void;
  onSave?: () => void;
}

const label = 'block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5';
const field = 'w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-70';

export function HeroEditor({ hero, onChange, onSave }: Props) {
  const ro = !onChange;
  const fields: { key: keyof Hero; label: string; area?: boolean }[] = [
    { key: 'title', label: 'Headline' },
    { key: 'subtitle', label: 'Sub-headline', area: true },
    { key: 'image', label: 'Background image URL' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6">
        <h3 className="font-headline text-base font-bold mb-4">Homepage Hero</h3>
        <div className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className={label}>{f.label}</label>
              {f.area ? (
                <textarea rows={3} className={field + ' resize-none'} value={hero[f.key]} disabled={ro}
                  onChange={onChange ? (e) => onChange(f.key, e.target.value) : undefined} />
              ) : (
                <input className={field} value={hero[f.key]} disabled={ro}
                  onChange={onChange ? (e) => onChange(f.key, e.target.value) : undefined} />
              )}
            </div>
          ))}
          <div>
            <button onClick={onSave} disabled={!onSave}
              className="bg-primary text-white px-5 py-3 rounded-lg font-bold text-sm disabled:opacity-50">Save changes</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#eae6df] rounded-2xl p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-3">Live preview</div>
        {/* Full-bleed hero preview — matches the homepage (centered text over a wide image) */}
        <div className="relative rounded-xl overflow-hidden aspect-video">
          <img src={hero.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="font-headline text-white font-extrabold text-lg leading-tight">{hero.title}</div>
            <div className="text-white/85 text-[11px] mt-1.5 max-w-[80%]">{hero.subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
