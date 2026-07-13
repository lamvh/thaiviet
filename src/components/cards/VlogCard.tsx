import type { Reel } from '../../lib/types';
import { isEmbedVideoUrl, getEmbedWatchUrl } from '../../lib/media-embed';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { Icon } from '../ui/Icon';

export function VlogCard({ reel, ratio = '9/16', padding = 'p-4' }: { reel: Reel; ratio?: string; padding?: string }) {
  const title = reel.title ?? reel.label;
  const isEmbed = isEmbedVideoUrl(reel.src);
  const isMobile = useIsMobile();
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="bg-black relative" style={{ aspectRatio: ratio }}>
        {isEmbed && isMobile ? (
          // Facebook's iframe player redirects iOS to a player-less page, so on phones
          // open the real video on Facebook (native app or watch page) instead.
          <a
            href={getEmbedWatchUrl(reel.src)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Play video on Facebook: ${title}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black text-white bg-cover bg-center"
            style={reel.poster ? { backgroundImage: `url(${reel.poster})` } : undefined}
          >
            <span className="absolute inset-0 bg-black/40" />
            <Icon name="play_circle" filled className="relative !text-6xl drop-shadow-lg" />
            <span className="relative text-xs font-bold uppercase tracking-widest">Watch on Facebook</span>
          </a>
        ) : isEmbed ? (
          <iframe className="absolute inset-0 w-full h-full border-none" src={reel.src} scrolling="no" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" title={title} />
        ) : (
          <video className="absolute inset-0 w-full h-full object-cover" src={reel.src} poster={reel.poster} controls playsInline preload="metadata" aria-label={title} />
        )}
      </div>
      <div className={padding}>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">{reel.label}</span>
        {reel.title && <h3 className="font-headline text-sm font-bold mt-1 text-on-surface leading-snug">{reel.title}</h3>}
      </div>
    </article>
  );
}
