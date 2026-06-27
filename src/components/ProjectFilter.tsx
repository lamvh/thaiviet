import { PROJECT_FILTERS } from '../data/projects';

export function ProjectFilter({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {PROJECT_FILTERS.map((f) => {
        const on = f.value === active;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={'px-5 py-2 rounded-full text-sm transition-all ' + (on ? 'bg-primary text-on-primary font-semibold' : 'bg-secondary-container text-on-secondary-container hover:bg-surface-container-high font-medium')}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
