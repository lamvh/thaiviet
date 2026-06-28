import { Icon } from '../../components/ui/Icon';
import { PROJECT_FILTERS } from '../../data/projects';
import { useAdminStore, isHttpsUrl } from './admin-content-store';

interface FieldDef { key: string; label: string; area?: boolean; url?: boolean; categorySelect?: boolean; }

// Project category options (the gallery filters, minus "All").
const CATEGORY_OPTIONS = PROJECT_FILTERS.filter((f) => f.value !== 'all');

const FIELDS: Record<'projects' | 'posts', FieldDef[]> = {
  projects: [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', categorySelect: true },
    { key: 'desc', label: 'Description', area: true },
    { key: 'image', label: 'Image URL', url: true },
  ],
  posts: [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'excerpt', label: 'Excerpt', area: true },
    { key: 'image', label: 'Image URL', url: true },
    { key: 'readTime', label: 'Read time' },
  ],
};

const inputCls = 'w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-primary';

export function EditDrawer() {
  const { state, updateDraft, saveEdit, closeEdit } = useAdminStore();
  if (!state.editing) return null;

  const fields = FIELDS[state.editing.kind];
  const typeLabel = state.editing.kind === 'projects' ? 'Project' : 'Post';

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div onClick={closeEdit} className="absolute inset-0 bg-on-surface/40" />
      <div className="relative w-[420px] max-w-[90%] bg-white h-full flex flex-col shadow-[-12px_0_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eee9e1]">
          <h3 className="font-headline text-lg font-extrabold">Edit {typeLabel}</h3>
          <button onClick={closeEdit} className="bg-[#f4f2ee] w-[34px] h-[34px] rounded-lg text-on-surface-variant" aria-label="Close">
            <Icon name="close" className="text-[19px]" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-auto flex flex-col gap-4">
          {fields.map((f) => {
            const val = state.draft[f.key] ?? '';
            const invalid = f.url && val !== '' && !isHttpsUrl(val);
            return (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">{f.label}</label>
                {f.categorySelect ? (
                  <select
                    className={inputCls}
                    value={val}
                    onChange={(e) => {
                      const opt = CATEGORY_OPTIONS.find((o) => o.value === e.target.value);
                      updateDraft('category', e.target.value);
                      // Keep the human-readable label in sync with the enum value.
                      if (opt) updateDraft('categoryLabel', opt.label);
                    }}
                  >
                    {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.area ? (
                  <textarea rows={4} className={inputCls + ' resize-none'} value={val} onChange={(e) => updateDraft(f.key, e.target.value)} />
                ) : (
                  <input className={inputCls + (invalid ? ' border-primary' : '')} value={val} onChange={(e) => updateDraft(f.key, e.target.value)} />
                )}
                {invalid && <p className="text-xs text-primary mt-1">Must start with https://</p>}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#eee9e1] flex gap-2.5 justify-end">
          <button onClick={closeEdit} className="bg-[#f4f2ee] px-5 py-2.5 rounded-lg font-bold text-sm">Cancel</button>
          <button onClick={saveEdit} className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm">Save changes</button>
        </div>
      </div>
    </div>
  );
}
