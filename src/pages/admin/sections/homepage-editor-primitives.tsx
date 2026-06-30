import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from '../../../components/ui/Icon';

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

export function Field({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {area ? (
        <AutoTextarea value={value} onChange={onChange} className={fieldCls + ' resize-none overflow-hidden min-h-[88px]'} />
      ) : (
        <input className={fieldCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

// Editor for a list of plain strings (paragraphs, bullet points): edit / add / remove.
export function StringList({ label, items, onChange, area }: { label: string; items: string[]; onChange: (items: string[]) => void; area?: boolean }) {
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
            <RemoveButton onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
        ))}
        <AddButton label="Add" onClick={() => onChange([...items, ''])} />
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
