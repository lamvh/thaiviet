import { useEffect, useState } from 'react';
import { Icon } from '../../../components/ui/Icon';
import { listMedia, formatBytes, type MediaItem, type MediaKind } from '../../../lib/storage';

// "Choose from Library" — a button that opens a modal grid of everything already
// in Storage and hands back the picked file's URL. onPicked has the same shape as
// UploadButton's onUploaded, so it drops into any media field the same way.
export function MediaPickerButton({ kind = 'image', onPicked }: { kind?: MediaKind; onPicked: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm font-bold text-primary px-3 py-1.5 rounded-lg border border-[#e6e1d8] hover:bg-[#faf8f4]"
      >
        <Icon name="photo_library" className="text-[18px]" /> Library
      </button>
      {open && (
        <PickerModal kind={kind} onClose={() => setOpen(false)} onPicked={(url) => { onPicked(url); setOpen(false); }} />
      )}
    </>
  );
}

function PickerModal({ kind, onClose, onPicked }: { kind: MediaKind; onClose: () => void; onPicked: (url: string) => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await listMedia();
        // Image fields show only images, video fields only videos; 'media' shows both.
        if (alive) setItems(kind === 'media' ? all : all.filter((i) => i.kind === kind));
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Could not load media.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [kind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#eae6df]">
          <Icon name="perm_media" className="text-primary text-xl" />
          <h3 className="font-headline text-base font-bold flex-1">Choose from Library</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-on-surface-variant hover:bg-[#faf8f4] rounded-lg p-1.5">
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        <div className="p-5 overflow-auto">
          {loading && <p className="text-sm text-[#8a8377]">Loading…</p>}
          {error && <div className="bg-[#fdf2f0] border border-[#f3d5cf] text-primary text-sm font-semibold rounded-xl p-4">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <p className="text-sm text-[#8a8377] text-center py-8">
              No {kind === 'video' ? 'videos' : kind === 'image' ? 'images' : 'files'} in storage yet — use Upload to add one.
            </p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {items.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => onPicked(item.url)}
                title={item.name}
                className="text-left bg-white border border-[#eae6df] rounded-xl overflow-hidden hover:border-primary focus:border-primary focus:outline-none"
              >
                <div className="aspect-[4/3] bg-[#faf8f4] overflow-hidden">
                  {item.kind === 'image' ? (
                    <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-bold truncate">{item.name}</p>
                  <p className="text-[10px] text-[#8a8377]">{formatBytes(item.size)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
