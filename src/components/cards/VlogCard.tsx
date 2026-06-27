import type { Reel } from '../../lib/types';

export function VlogCard({ reel, ratio = '9/16', padding = 'p-4' }: { reel: Reel; ratio?: string; padding?: string }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="bg-black relative" style={{ aspectRatio: ratio }}>
        <iframe className="absolute inset-0 w-full h-full border-none" src={reel.src} scrolling="no" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" title={reel.title ?? reel.label} />
      </div>
      <div className={padding}>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">{reel.label}</span>
        {reel.title && <h3 className="font-headline text-sm font-bold mt-1 text-on-surface leading-snug">{reel.title}</h3>}
      </div>
    </article>
  );
}
