import { Card, Field, ItemCard, AddButton, labelCls, fieldCls } from '../homepage-editor-primitives';
import type { ProjectCategory, ProjectMeta, SectionDef, TemplateValue } from '../../../../lib/types';
import { PROJECT_FILTERS } from '../../../../data/projects';

const CATEGORY_OPTIONS = PROJECT_FILTERS.filter((f) => f.value !== 'all');

function RepeatEditor({ section: s, value, onChange }: { section: SectionDef; value: Array<Record<string, string>>; onChange: (v: TemplateValue) => void }) {
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

export function TemplateForm({
  meta, values, sections, onMeta, onValue, category, onCategory,
}: {
  meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[];
  onMeta: (k: keyof ProjectMeta, v: string) => void; onValue: (k: string, v: TemplateValue) => void;
  category: ProjectCategory; onCategory: (c: ProjectCategory) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Card title="Project details" hint="The header facts shown at the top of the page.">
        <Field label="Title" value={meta.title} onChange={(v) => onMeta('title', v)} />
        <div>
          <label className={labelCls}>Category</label>
          <select className={fieldCls} value={category} onChange={(e) => onCategory(e.target.value as ProjectCategory)}>
            {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <Field label="Location" value={meta.location} onChange={(v) => onMeta('location', v)} />
        <Field label="Duration" value={meta.duration} onChange={(v) => onMeta('duration', v)} />
        <Field label="Year" value={meta.year} onChange={(v) => onMeta('year', v)} />
        <Field label="Cover image URL" value={meta.cover} onChange={(v) => onMeta('cover', v)} />
        <Field label="Intro" value={meta.intro} onChange={(v) => onMeta('intro', v)} area />
      </Card>

      {sections.map((s) => {
        const v = values[s.key] ?? s.default;
        return (
          <Card key={s.key} title={s.title}>
            {s.kind === 'text' && <Field label={s.label ?? s.title} value={typeof v === 'string' ? v : ''} onChange={(val) => onValue(s.key, val)} area={s.area} />}
            {s.kind === 'pair' && (s.fields ?? []).map((f) => (
              <Field key={f.key} label={f.label} value={(v as Record<string, string>)[f.key] ?? ''} onChange={(val) => onValue(s.key, { ...(v as Record<string, string>), [f.key]: val })} />
            ))}
            {s.kind === 'repeat' && <RepeatEditor section={s} value={v as Array<Record<string, string>>} onChange={(val) => onValue(s.key, val)} />}
          </Card>
        );
      })}
    </div>
  );
}
