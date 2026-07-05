import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Icon } from '../../../../components/ui/Icon';
import { useSiteContent } from '../../../../lib/site-content-context';
import { ProjectTemplateRenderer } from '../../../../components/templates/ProjectTemplateRenderer';
import { seedValues } from '../../../../lib/templates/seed';
import type { ProjectTemplateDef } from '../../../../lib/types';

// Full-screen preview of a template rendered from its own default content, so an admin can
// picture the layout before picking. Simple = scaled whole-page overview; Full = actual size.
export function TemplatePreviewModal({ def, onClose, onUse }: { def: ProjectTemplateDef; onClose: () => void; onUse: () => void }) {
  const { contact } = useSiteContent();
  const [full, setFull] = useState(false);
  const values = seedValues(def.sections);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-black/50">
      <div className="flex items-center flex-wrap gap-x-3 gap-y-2 px-4 sm:px-5 py-3 bg-white border-b border-[#eae6df]">
        <Icon name={def.icon} className="text-primary text-2xl flex-none" />
        <div className="flex-1 min-w-0">
          <div className="font-headline font-extrabold leading-tight truncate">{def.name}</div>
          <div className="text-xs text-[#8a8377] truncate">Preview with sample content — you can edit everything after picking.</div>
        </div>
        <div className="flex items-center rounded-lg border border-[#e2ddd4] overflow-hidden text-sm font-bold flex-none">
          <button onClick={() => setFull(false)} className={'px-3 py-1.5 ' + (!full ? 'bg-primary text-white' : 'text-[#8a8377]')}>Simple</button>
          <button onClick={() => setFull(true)} className={'px-3 py-1.5 ' + (full ? 'bg-primary text-white' : 'text-[#8a8377]')}>Full</button>
        </div>
        <button onClick={onUse} className="inline-flex items-center bg-primary text-white rounded-lg px-4 py-2 font-bold text-sm flex-none hover:brightness-110 whitespace-nowrap">Use this template</button>
        <button onClick={onClose} aria-label="Close preview" className="w-9 h-9 rounded-lg bg-[#f4f2ee] text-on-surface-variant flex items-center justify-center flex-none">
          <Icon name="close" className="text-[19px]" />
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-[#f4f2ee]">
        <div className={full ? '' : 'origin-top-left scale-[0.5] w-[200%]'}>
          <MemoryRouter>
            <ProjectTemplateRenderer meta={def.defaultMeta} values={values} sections={def.sections} contact={contact} />
          </MemoryRouter>
        </div>
      </div>
    </div>
  );
}
