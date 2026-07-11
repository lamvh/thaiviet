import { Icon } from '../../../components/ui/Icon';
import { VisPill } from './ProjectsTable';
import type { ServiceDetail } from '../../../lib/types';

interface Props {
  services: ServiceDetail[];
  onToggle?: (slug: string) => void;
  onEdit?: (slug: string) => void;
  onDelete?: (slug: string) => void;
  onNewFromTemplate?: () => void;
}

const COLS = 'grid grid-cols-[64px_minmax(150px,1fr)_150px_112px_112px] gap-3.5 min-w-[736px]';

export function ServicesTable({ services, onToggle, onEdit, onDelete, onNewFromTemplate }: Props) {
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl overflow-x-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee9e1] gap-2">
        <div className="font-bold text-[15px]">All Services</div>
        <button onClick={onNewFromTemplate} className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-lg font-bold text-[13px]">
          <Icon name="auto_awesome" className="text-[17px]" /> New from template
        </button>
      </div>
      <div className={COLS + ' px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#9b9488] border-b border-[#eee9e1]'}>
        <div /><div>Name</div><div>Slug</div><div>Status</div><div className="text-right">Actions</div>
      </div>
      {services.map((s) => (
        <div key={s.slug} className={COLS + ' px-5 py-3 items-center border-b border-[#f2eee7]'}>
          <div className="w-14 h-12 rounded-lg overflow-hidden bg-surface-container"><img src={s.image} alt="" className="w-full h-full object-cover" /></div>
          <div className="font-bold text-sm truncate">{s.name}</div>
          <div className="text-xs text-[#8a8377]">/{s.slug}</div>
          <div><VisPill visible={s.visible !== false} onClick={onToggle ? () => onToggle(s.slug) : undefined} /></div>
          <div className="flex justify-end gap-2">
            <button onClick={onEdit ? () => onEdit(s.slug) : undefined} className="border border-[#e2ddd4] bg-white w-[34px] h-[34px] rounded-lg text-on-surface-variant" aria-label={'Edit ' + s.name}><Icon name="edit" className="text-lg" /></button>
            <button onClick={onDelete ? () => { if (window.confirm(`Delete "${s.name}"? It will be removed from the site when you publish.`)) onDelete(s.slug); } : undefined} className="border border-[#e7c9c6] bg-white w-[34px] h-[34px] rounded-lg text-[#b94b40]" aria-label={'Delete ' + s.name}><Icon name="delete" className="text-lg" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
