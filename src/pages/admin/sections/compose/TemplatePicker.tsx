import { Icon } from '../../../../components/ui/Icon';
import { projectTemplateList } from '../../../../lib/templates/project-templates';
import type { ProjectTemplateId } from '../../../../lib/types';

export function TemplatePicker({ onPick }: { onPick: (id: ProjectTemplateId) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-headline text-lg font-extrabold">Choose a template</h2>
        <p className="text-sm text-[#8a8377] mt-1">Pick a layout to start from — you can edit every word before publishing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectTemplateList.map((t) => (
          <button key={t.id} onClick={() => onPick(t.id)} className="text-left bg-white border border-[#eae6df] rounded-2xl p-5 hover:border-primary transition-colors">
            <Icon name={t.icon} className="text-primary text-3xl mb-3" />
            <div className="font-headline font-bold text-base">{t.name}</div>
            <p className="text-sm text-[#8a8377] mt-1 mb-3">{t.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.includes.map((x) => <span key={x} className="text-[11px] font-bold bg-[#f4f2ee] text-[#8a8377] px-2 py-1 rounded-full">{x}</span>)}
            </div>
            <div className="flex items-center gap-1 text-primary font-bold text-sm mt-4">Use this template <Icon name="arrow_forward" className="text-[17px]" /></div>
          </button>
        ))}
      </div>
    </div>
  );
}
