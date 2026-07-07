import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../../components/ui/Icon';
import { uploadMedia, acceptFor, type MediaKind } from '../../../lib/storage';

// Textarea that grows to fit its content (no inner scrollbar, no fixed row count) so
// long paragraphs stay fully visible while editing.
export function AutoTextarea({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// Shared building blocks for the Homepage section editor. Kept generic so each
// content block (heritage, mission, stats, …) composes the same small parts.

export const labelCls = 'block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5';
export const fieldCls = 'w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary';

export function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6">
      <h3 className="font-headline text-base font-bold">{title}</h3>
      {hint && <p className="text-xs text-[#8a8377] mt-1 mb-4">{hint}</p>}
      <div className={'flex flex-col gap-4' + (hint ? '' : ' mt-4')}>{children}</div>
    </div>
  );
}

// Uploads a picked file to Supabase Storage, then hands the public URL back.
// Shows an inline spinner while uploading and an error message on failure.
export function UploadButton({ kind = 'image', onUploaded }: { kind?: MediaKind; onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setErr('');
    setBusy(true);
    try {
      onUploaded(await uploadMedia(file, kind));
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <input ref={inputRef} type="file" accept={acceptFor(kind)} onChange={pick} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-1 text-sm font-bold text-primary px-3 py-1.5 rounded-lg border border-[#e6e1d8] hover:bg-[#faf8f4] disabled:opacity-60"
      >
        <Icon name={busy ? 'progress_activity' : 'upload'} className={'text-[18px]' + (busy ? ' animate-spin' : '')} />
        {busy ? 'Uploading…' : 'Upload'}
      </button>
      {err && <span className="text-xs font-semibold text-primary">{err}</span>}
    </span>
  );
}

// Small thumbnail preview for an image/video URL (used beside upload-enabled inputs).
export function MediaPreview({ url, kind }: { url: string; kind: MediaKind }) {
  if (!url) return null;
  const isVideo = kind === 'video' || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
  return (
    <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden bg-[#f4f2ee] border border-[#e6e1d8]">
      {isVideo ? (
        <video src={url} className="w-full h-full object-cover" muted />
      ) : (
        <img src={url} alt="" className="w-full h-full object-cover" />
      )}
    </div>
  );
}

export function Field({ label, value, onChange, area, upload }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; upload?: MediaKind }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className={labelCls.replace('mb-1.5', '')}>{label}</label>
        {upload && <UploadButton kind={upload} onUploaded={onChange} />}
      </div>
      {area ? (
        <AutoTextarea value={value} onChange={onChange} className={fieldCls + ' resize-none overflow-hidden min-h-[88px]'} />
      ) : (
        <input className={fieldCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {upload && <MediaPreview url={value} kind={upload} />}
    </div>
  );
}

// Editor for a list of plain strings (paragraphs, bullet points): edit / add / remove.
// Pass `upload` to also allow uploading media into the list (galleries, cert images).
export function StringList({ label, items, onChange, area, upload }: { label: string; items: string[]; onChange: (items: string[]) => void; area?: boolean; upload?: MediaKind }) {
  const set = (i: number, v: string) => onChange(items.map((x, j) => (j === i ? v : x)));
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start">
            {area ? (
              <AutoTextarea value={it} onChange={(v) => set(i, v)} className={fieldCls + ' resize-none overflow-hidden min-h-[64px]'} />
            ) : (
              <input className={fieldCls} value={it} onChange={(e) => set(i, e.target.value)} />
            )}
            {upload && <MediaPreview url={it} kind={upload} />}
            <RemoveButton onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <AddButton label="Add" onClick={() => onChange([...items, ''])} />
          {upload && <UploadButton kind={upload} onUploaded={(url) => onChange([...items, url])} />}
        </div>
      </div>
    </div>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" aria-label="Remove" className="flex-none text-[#b94b40] hover:bg-[#f7ecea] rounded-lg p-2">
      <Icon name="close" className="text-[18px]" />
    </button>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} type="button" className="self-start inline-flex items-center gap-1 text-sm font-bold text-primary px-3 py-1.5 rounded-lg border border-[#e6e1d8] hover:bg-[#faf8f4]">
      <Icon name="add" className="text-[18px]" /> {label}
    </button>
  );
}

export function ItemCard({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <div className="border border-[#e6e1d8] rounded-lg p-3 pt-8 flex flex-col gap-3 relative">
      <div className="absolute top-2 right-2"><RemoveButton onClick={onRemove} /></div>
      {children}
    </div>
  );
}
