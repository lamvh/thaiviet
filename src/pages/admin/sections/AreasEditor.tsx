import { Icon } from '../../../components/ui/Icon';

interface Props {
  areas: string[];
  newArea?: string;
  onNewAreaChange?: (value: string) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
}

export function AreasEditor({ areas, newArea = '', onNewAreaChange, onAdd, onRemove }: Props) {
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6 max-w-[760px]">
      <h3 className="font-headline text-base font-bold mb-1.5">Service Areas</h3>
      <p className="text-[13px] text-[#8a8377] mb-5">Suburbs and towns shown on the Contact page.{onRemove ? ' Click ✕ to remove.' : ''}</p>
      <div className="flex flex-wrap gap-2.5 mb-5">
        {areas.map((a, i) => (
          <span key={a + i} className="inline-flex items-center gap-2 bg-surface-container-low border border-[#eae6df] rounded-full pl-3.5 pr-3 py-2 text-[13px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {a}
            {onRemove && (
              <button onClick={() => onRemove(i)} className="text-[#b9b2a6] hover:text-on-surface flex" aria-label={'Remove ' + a}>
                <Icon name="close" className="text-[17px]" />
              </button>
            )}
          </span>
        ))}
      </div>
      <div className="flex gap-2.5">
        <input
          value={newArea}
          disabled={!onNewAreaChange}
          onChange={onNewAreaChange ? (e) => onNewAreaChange(e.target.value) : undefined}
          onKeyDown={onAdd ? (e) => e.key === 'Enter' && onAdd() : undefined}
          placeholder="Add a suburb or town…"
          className="flex-1 bg-[#faf8f4] border border-[#e6e1d8] rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-primary disabled:opacity-70"
        />
        <button onClick={onAdd} disabled={!onAdd} className="bg-primary text-white px-6 rounded-lg font-bold text-sm disabled:opacity-50">Add</button>
      </div>
    </div>
  );
}
