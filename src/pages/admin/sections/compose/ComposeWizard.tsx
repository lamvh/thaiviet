import { Icon } from '../../../../components/ui/Icon';
import { useAdminStore } from '../../admin-content-store';
import { projectTemplates } from '../../../../lib/templates/project-templates';
import { TemplatePicker } from './TemplatePicker';
import { TemplateForm } from './TemplateForm';
import { TemplatePreview } from './TemplatePreview';

export function ComposeWizard() {
  const store = useAdminStore();
  const c = store.state.compose;

  if (c.step === 'pick' || !c.templateId || !c.meta || !c.values) {
    return <TemplatePicker onPick={store.pickTemplate} />;
  }
  const def = projectTemplates[c.templateId];
  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <button onClick={store.backToTemplates} className="inline-flex items-center gap-1.5 border border-[#e2ddd4] bg-white rounded-lg px-3.5 py-2 text-sm font-bold">
          <Icon name="arrow_back" className="text-[18px]" /> Templates
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-headline font-extrabold">{def.name}</div>
          <div className="text-xs text-[#8a8377]">Fill the fields — the preview updates live.</div>
        </div>
        <button onClick={store.publishComposed} className="bg-primary text-white rounded-lg px-5 py-2.5 font-bold text-sm">Add project</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-6 items-start">
        <TemplateForm meta={c.meta} values={c.values} sections={def.sections} onMeta={store.updateComposeMeta} onValue={store.updateComposeValue} />
        <TemplatePreview meta={c.meta} values={c.values} sections={def.sections} />
      </div>
    </div>
  );
}
