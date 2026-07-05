import { useState } from 'react';
import { Icon } from '../../../../components/ui/Icon';
import { useSiteContent } from '../../../../lib/site-content-context';
import { ProjectTemplateRenderer } from '../../../../components/templates/ProjectTemplateRenderer';
import { seedValues } from '../../../../lib/templates/seed';
import type { ProjectTemplateDef } from '../../../../lib/types';

// Inline preview panel — renders inside the admin content area (the sidebar and dashboard
// header stay visible), NOT as a full-screen overlay. Simple = scaled whole-page overview;
// Full = actual size. The renderer's <Link>s use the app router (no nested Router), and
// pointer-events-none keeps the scaled preview non-interactive.
export function TemplatePreviewPanel({ def, onBack, onUse }: { def: ProjectTemplateDef; onBack: () => void; onUse: () => void }) {
  const { contact } = useSiteContent();
  const [full, setFull] = useState(false);
  const values = seedValues(def.sections);

  return (
    <div className="border border-[#eae6df] rounded-2xl overflow-hidden bg-white">
      <div className="flex items-center flex-wrap gap-x-3 gap-y-2 px-4 sm:px-5 py-3 border-b border-[#eae6df] bg-white">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 border border-[#e2ddd4] bg-white rounded-lg px-3 py-2 text-sm font-bold flex-none">
          <Icon name="arrow_back" className="text-[18px]" /> Templates
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon name={def.icon} className="text-primary text-2xl flex-none" />
          <div className="min-w-0">
            <div className="font-headline font-extrabold leading-tight truncate">{def.name}</div>
            <div className="text-xs text-[#8a8377] truncate">Preview with sample content — you can edit everything after picking.</div>
          </div>
        </div>
        <div className="flex items-center rounded-lg border border-[#e2ddd4] overflow-hidden text-sm font-bold flex-none">
          <button onClick={() => setFull(false)} className={'px-3 py-1.5 ' + (!full ? 'bg-primary text-white' : 'text-[#8a8377]')}>Simple</button>
          <button onClick={() => setFull(true)} className={'px-3 py-1.5 ' + (full ? 'bg-primary text-white' : 'text-[#8a8377]')}>Full</button>
        </div>
        <button onClick={onUse} className="inline-flex items-center bg-primary text-white rounded-lg px-4 py-2 font-bold text-sm flex-none hover:brightness-110 whitespace-nowrap">Use this template</button>
      </div>
      <div className="h-[68vh] overflow-auto bg-[#f4f2ee]">
        <div className={(full ? '' : 'origin-top-left scale-[0.5] w-[200%] ') + 'pointer-events-none'}>
          <ProjectTemplateRenderer layout={def.layout} meta={def.defaultMeta} values={values} sections={def.sections} contact={contact} />
        </div>
      </div>
    </div>
  );
}
