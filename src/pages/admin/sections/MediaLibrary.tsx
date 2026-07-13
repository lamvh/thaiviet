import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../../components/ui/Icon';
import { UploadButton } from './homepage-editor-primitives';
import { useAdminStore } from '../admin-content-store';
import { listMedia, deleteMedia, replaceMedia, acceptFor, formatBytes, type MediaItem } from '../../../lib/storage';
import { findMediaReferences } from '../../../lib/find-media-references';

// Browse / add / replace / delete every file in the Supabase Storage bucket.
// Operates directly on Storage (not the content row), so its changes are live
// immediately and don't go through Publish.
export function MediaLibrary() {
  const store = useAdminStore();
  const { toast } = store;
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null); // path currently mutating
  // Per-path cache-buster: replace keeps the same URL, so bump this to force the
  // grid <img>/<video> to refetch the new bytes instead of the cached old ones.
  const [bust, setBust] = useState<Record<string, number>>({});

  // One hidden file input drives Replace for whichever card was clicked.
  const replaceInput = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<MediaItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await listMedia());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load media.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const copy = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast('URL copied');
    } catch {
      toast('Could not copy — copy it manually from the address bar');
    }
  };

  const remove = async (item: MediaItem) => {
    // Warn concretely if the file is still referenced in the (unpublished) content —
    // deleting it would 404 those spots until they are re-pointed.
    const refs = findMediaReferences(store.state.content, item.url);
    const warn = refs.length
      ? `Delete "${item.name}"?\n\n⚠ Still used in ${refs.length} place${refs.length === 1 ? '' : 's'}:\n${refs.slice(0, 8).join('\n')}${refs.length > 8 ? `\n…and ${refs.length - 8} more` : ''}\n\nThose spots will show a broken image until re-pointed.`
      : `Delete "${item.name}"?\n\nAny page still using this file will show a broken image until you re-point it.`;
    if (!window.confirm(warn)) return;
    setBusy(item.path);
    try {
      await deleteMedia([item.path]);
      setItems((prev) => prev.filter((i) => i.path !== item.path));
      toast('File deleted');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(null);
    }
  };

  const startReplace = (item: MediaItem) => {
    replaceTarget.current = item;
    replaceInput.current?.click();
  };

  const onReplacePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = replaceTarget.current;
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    replaceTarget.current = null;
    if (!file || !item) return;

    setBusy(item.path);
    try {
      const next = await replaceMedia(item, file);
      setItems((prev) => prev.map((i) => (i.path === item.path ? next : i)));
      setBust((prev) => ({ ...prev, [item.path]: Date.now() }));
      toast('Image replaced');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Replace failed');
    } finally {
      setBusy(null);
    }
  };

  // Same URL after a replace won't refetch on its own, so append the buster.
  const src = (item: MediaItem) => (bust[item.path] ? `${item.url}?v=${bust[item.path]}` : item.url);

  return (
    <div className="flex flex-col gap-5">
      <input
        ref={replaceInput}
        type="file"
        accept={acceptFor(replaceTarget.current?.kind ?? 'media')}
        onChange={onReplacePick}
        className="hidden"
      />

      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-[13px] text-[#8a8377] flex-1 min-w-0">
          {loading ? 'Loading…' : `${items.length} file${items.length === 1 ? '' : 's'} in storage`}
        </p>
        <button
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface px-3 py-2 rounded-lg border border-[#e6e1d8] hover:bg-white"
        >
          <Icon name="refresh" className="text-[18px]" /> Refresh
        </button>
        {/* Upload lands in the bucket; refresh to pull it into the grid. */}
        <UploadButton kind="media" onUploaded={() => { toast('Uploaded'); void load(); }} />
      </div>

      {error && (
        <div className="bg-[#fdf2f0] border border-[#f3d5cf] text-primary text-sm font-semibold rounded-xl p-4">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white border border-dashed border-[#e0dbd2] rounded-2xl p-12 text-center text-[#8a8377]">
          <Icon name="image" className="text-4xl mb-2 opacity-60" />
          <p className="text-sm font-semibold">No media yet. Use Upload to add your first file.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.path} className="bg-white border border-[#eae6df] rounded-2xl overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] bg-[#faf8f4] flex items-center justify-center overflow-hidden">
              {item.kind === 'image' ? (
                <img src={src(item)} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <video src={src(item)} muted playsInline preload="metadata" className="w-full h-full object-cover" />
              )}
              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/55 text-white px-1.5 py-0.5 rounded">
                {item.kind}
              </span>
              {busy === item.path && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <Icon name="progress_activity" className="text-2xl animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="p-3 flex flex-col gap-2 flex-1">
              <p className="text-xs font-bold text-on-surface truncate" title={item.name}>{item.name}</p>
              <p className="text-[11px] text-[#8a8377]">{formatBytes(item.size)}</p>

              <div className="flex items-center gap-1 mt-auto pt-1">
                <IconBtn icon="link" title="Copy URL" onClick={() => void copy(item)} />
                <IconBtn icon="find_replace" title="Replace file" onClick={() => startReplace(item)} />
                <IconBtn icon="delete" title="Delete" danger onClick={() => void remove(item)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ icon, title, onClick, danger }: { icon: string; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={
        'inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e6e1d8] hover:bg-[#faf8f4] ' +
        (danger ? 'text-primary' : 'text-on-surface-variant')
      }
    >
      <Icon name={icon} className="text-[18px]" />
    </button>
  );
}
