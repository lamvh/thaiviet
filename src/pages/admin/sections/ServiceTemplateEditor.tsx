import { Card, Field, ItemCard, AddButton } from './homepage-editor-primitives';
import { serviceTemplates } from '../../../lib/templates/service-templates';
import { useAdminStore } from '../admin-content-store';
import type { SectionDef, ServiceMeta, ServicePage, TemplateValue } from '../../../lib/types';

// Repeat-section editor (add/remove rows) — mirrors compose/TemplateForm's RepeatEditor.
function RepeatEditor({ section: s, value, onChange }: {
  section: SectionDef; value: Array<Record<string, string>>; onChange: (v: TemplateValue) => void;
}) {
  const set = (i: number, k: string, v: string) => onChange(value.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const add = () => onChange([...value, Object.fromEntries((s.fields ?? []).map((f) => [f.key, '']))]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  return (
    <div className="flex flex-col gap-3">
      {value.map((it, i) => (
        <ItemCard key={i} onRemove={() => remove(i)}>
          {(s.fields ?? []).map((f) => <Field key={f.key} label={f.label} value={it[f.key] ?? ''} onChange={(v) => set(i, f.key, v)} area={f.area} />)}
        </ItemCard>
      ))}
      <AddButton label={s.addLabel ?? 'Add'} onClick={add} />
    </div>
  );
}

// Edits a service's applied template: hero/intro meta + one card per section.
export function ServiceTemplateEditor({ index, page }: { index: number; page: ServicePage }) {
  const store = useAdminStore();
  const def = serviceTemplates[page.templateId];
  const meta = page.meta;
  const setMeta = (k: keyof ServiceMeta, v: string) => store.updateServicePageMeta(index, k, v);
  const setVal = (k: string, v: TemplateValue) => store.updateServicePageValue(index, k, v);

  return (
    <div className="flex flex-col gap-5">
      <Card title="Hero & intro">
        <Field label="Service name" value={meta.name} onChange={(v) => setMeta('name', v)} />
        <Field label="Hero title" value={meta.heroTitle} onChange={(v) => setMeta('heroTitle', v)} />
        <Field label="Hero subtitle" area value={meta.heroSub} onChange={(v) => setMeta('heroSub', v)} />
        <Field label="Hero image URL" value={meta.heroImg} onChange={(v) => setMeta('heroImg', v)} />
        <Field label="Intro title" value={meta.introTitle} onChange={(v) => setMeta('introTitle', v)} />
        <Field label="Intro" area value={meta.intro} onChange={(v) => setMeta('intro', v)} />
      </Card>

      {def.sections.map((sec) => {
        const v = page.values[sec.key] ?? sec.default;
        return (
          <Card key={sec.key} title={sec.title}>
            {sec.kind === 'text' && (
              <Field label={sec.label ?? sec.title} area={sec.area} value={typeof v === 'string' ? v : ''} onChange={(val) => setVal(sec.key, val)} />
            )}
            {sec.kind === 'pair' && (sec.fields ?? []).map((f) => (
              <Field key={f.key} label={f.label} value={(v as Record<string, string>)[f.key] ?? ''} onChange={(val) => setVal(sec.key, { ...(v as Record<string, string>), [f.key]: val })} />
            ))}
            {sec.kind === 'repeat' && <RepeatEditor section={sec} value={v as Array<Record<string, string>>} onChange={(val) => setVal(sec.key, val)} />}
          </Card>
        );
      })}
    </div>
  );
}
