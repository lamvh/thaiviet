import { Icon } from '../../../../components/ui/Icon';
import { serviceTemplateList } from '../../../../lib/templates/service-templates';
import type { ServiceTemplateId } from '../../../../lib/types';

// Pick one of the six service-page layouts (A–F) to start a new service from.
export function ServiceTemplatePicker({ onPick }: { onPick: (id: ServiceTemplateId) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-headline text-lg font-extrabold">Choose a template</h2>
        <p className="text-sm text-[#8a8377] mt-1">Pick a layout to start from — edit every word before publishing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {serviceTemplateList.map((t) => (
          <div key={t.id} className="flex flex-col bg-white border border-[#eae6df] rounded-2xl p-5">
            <Icon name={t.icon} className="text-primary text-3xl mb-3" />
            <div className="font-headline font-bold text-base">{t.name}</div>
            <p className="text-sm text-[#8a8377] mt-1 mb-3">{t.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.includes.map((x) => <span key={x} className="text-[11px] font-bold bg-[#f4f2ee] text-[#8a8377] px-2 py-1 rounded-full">{x}</span>)}
            </div>
            <div className="flex items-center gap-2 mt-5 pt-1">
              <button onClick={() => onPick(t.id)} className="inline-flex items-center gap-1.5 flex-1 justify-center bg-primary text-white rounded-lg px-3 py-2 font-bold text-sm hover:brightness-110">
                Use this template <Icon name="arrow_forward" className="text-[17px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
