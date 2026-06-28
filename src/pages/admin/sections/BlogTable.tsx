import { Icon } from '../../../components/ui/Icon';
import type { Post } from '../../../lib/types';
import { VisPill } from './ProjectsTable';

interface Props {
  posts: Post[];
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onNew?: () => void;
}

const COLS = 'grid grid-cols-[minmax(150px,1fr)_160px_130px_130px_96px] gap-3.5 min-w-[700px]';

export function BlogTable({ posts, onToggle, onEdit, onNew }: Props) {
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl overflow-x-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee9e1]">
        <div className="font-bold text-[15px]">All Blog Posts</div>
        <button
          onClick={onNew}
          disabled={!onNew}
          className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-lg font-bold text-[13px] disabled:opacity-50"
        >
          <Icon name="add" className="text-[17px]" /> New Post
        </button>
      </div>
      <div className={COLS + ' px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#9b9488] border-b border-[#eee9e1]'}>
        <div>Title</div><div>Category</div><div>Date</div><div>Status</div><div className="text-right">Edit</div>
      </div>
      {posts.map((b) => (
        <div key={b.id} className={COLS + ' px-5 py-3.5 items-center border-b border-[#f2eee7]'}>
          <div className="font-bold text-sm truncate">{b.title}</div>
          <div>
            <span className="text-xs font-semibold text-primary bg-primary/[0.08] px-2.5 py-1 rounded-full">{b.category}</span>
          </div>
          <div className="text-[13px] text-[#8a8377]">{b.date}</div>
          <div>
            <VisPill visible={b.visible !== false} onClick={onToggle ? () => onToggle(b.id) : undefined} />
          </div>
          <div className="text-right">
            <button
              onClick={onEdit ? () => onEdit(b.id) : undefined}
              disabled={!onEdit}
              className="border border-[#e2ddd4] bg-white w-[34px] h-[34px] rounded-lg text-on-surface-variant disabled:opacity-50"
              aria-label={'Edit ' + b.title}
            >
              <Icon name="edit" className="text-lg" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
