import { useSiteContent } from '../../../../lib/site-content-context';
import { ProjectTemplateRenderer } from '../../../../components/templates/ProjectTemplateRenderer';
import type { ProjectMeta, ProjectStyleId, SectionDef, TemplateValue } from '../../../../lib/types';

// Live preview = the real public renderer, scaled to fit. The renderer's <Link>s resolve
// against the app's existing router (do NOT wrap in another Router — react-router v6 throws
// on nested routers). pointer-events-none keeps the scaled preview non-interactive.
export function TemplatePreview({ meta, values, sections, layout }: { meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; layout?: ProjectStyleId }) {
  const { contact } = useSiteContent();
  return (
    <div className="sticky top-4 border border-[#eae6df] rounded-2xl overflow-hidden bg-white">
      <div className="text-[11px] font-bold uppercase tracking-widest text-[#8a8377] px-4 py-2 border-b border-[#eae6df] bg-[#faf8f4]">Live preview</div>
      <div className="h-[620px] overflow-auto">
        <div className="origin-top-left scale-[0.62] w-[161%] pointer-events-none">
          <ProjectTemplateRenderer layout={layout} meta={meta} values={values} sections={sections} contact={contact} />
        </div>
      </div>
    </div>
  );
}
