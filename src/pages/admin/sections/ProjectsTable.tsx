import { Icon } from '../../../components/ui/Icon';
import type { Project } from '../../../lib/types';

interface Props {
  projects: Project[];
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onNew?: () => void;
  onNewFromTemplate?: () => void;
}

const COLS = 'grid grid-cols-[64px_minmax(150px,1fr)_180px_130px_112px] gap-3.5 min-w-[736px]';

export function ProjectsTable({ projects, onToggle, onEdit, onDelete, onNew, onNewFromTemplate }: Props) {
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl overflow-x-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee9e1] gap-2">
        <div className="font-bold text-[15px]">All Projects</div>
        <div className="flex items-center gap-2">
          {onNewFromTemplate && (
            <button
              onClick={onNewFromTemplate}
              className="inline-flex items-center gap-1.5 bg-white border border-[#e2ddd4] text-on-surface px-3.5 py-2 rounded-lg font-bold text-[13px]"
            >
              <Icon name="auto_awesome" className="text-[17px]" /> New from template
            </button>
          )}
          <button
            onClick={onNew}
            disabled={!onNew}
            className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-lg font-bold text-[13px] disabled:opacity-50"
          >
            <Icon name="add" className="text-[17px]" /> New Project
          </button>
        </div>
      </div>
      <div className={COLS + ' px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#9b9488] border-b border-[#eee9e1]'}>
        <div /><div>Title</div><div>Category</div><div>Status</div><div className="text-right">Actions</div>
      </div>
      {projects.map((p) => (
        <div key={p.id} className={COLS + ' px-5 py-3 items-center border-b border-[#f2eee7]'}>
          <div className="w-14 h-12 rounded-lg overflow-hidden bg-surface-container">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="font-bold text-sm truncate">{p.title}</div>
          <div>
            <span className="text-xs font-semibold text-primary bg-primary/[0.08] px-2.5 py-1 rounded-full">{p.categoryLabel}</span>
          </div>
          <div>
            <VisPill visible={p.visible !== false} onClick={onToggle ? () => onToggle(p.id) : undefined} />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onEdit ? () => onEdit(p.id) : undefined}
              disabled={!onEdit}
              className="border border-[#e2ddd4] bg-white w-[34px] h-[34px] rounded-lg text-on-surface-variant disabled:opacity-50"
              aria-label={'Edit ' + p.title}
            >
              <Icon name="edit" className="text-lg" />
            </button>
            <button
              onClick={onDelete ? () => { if (window.confirm(`Delete "${p.title}"? It will be removed from the site when you publish.`)) onDelete(p.id); } : undefined}
              disabled={!onDelete}
              className="border border-[#e7c9c6] bg-white w-[34px] h-[34px] rounded-lg text-[#b94b40] hover:bg-[#f7ecea] disabled:opacity-50"
              aria-label={'Delete ' + p.title}
            >
              <Icon name="delete" className="text-lg" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VisPill({ visible, onClick }: { visible: boolean; onClick?: () => void }) {
  const cls =
    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold ' +
    (visible ? 'bg-[#e7f4ec] text-[#1f8a5b]' : 'bg-[#f0ede9] text-[#8a8377]');
  const dot = <span className="w-1.5 h-1.5 rounded-full" style={{ background: visible ? '#1f8a5b' : '#b0a89c' }} />;
  const label = visible ? 'Visible' : 'Hidden';
  return onClick ? (
    <button onClick={onClick} className={cls}>{dot}{label}</button>
  ) : (
    <span className={cls}>{dot}{label}</span>
  );
}
