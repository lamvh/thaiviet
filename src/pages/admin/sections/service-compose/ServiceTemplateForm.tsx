import { Card, Field, ItemCard, AddButton } from '../homepage-editor-primitives';
import type { ServiceMeta, SectionDef, TemplateValue, ServiceStyleId } from '../../../../lib/types';
import type { FieldDef } from '../../../../lib/templates/types';
import { guessMediaKind } from '../../../../lib/storage';
import { LAYOUT_SECTIONS } from '../../../../components/templates/service-skins-templated';

// Explicit `media` flag wins; otherwise infer image/video from the field's label + key.
const fieldMedia = (f: FieldDef) => f.media ?? guessMediaKind(f.label, f.key);

function RepeatEditor({ section: s, value, onChange }: { section: SectionDef; value: Array<Record<string, string>>; onChange: (v: TemplateValue) => void }) {
  const set = (i: number, k: string, v: string) => onChange(value.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const add = () => onChange([...value, Object.fromEntries((s.fields ?? []).map((f) => [f.key, '']))]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  return (
    <div className="flex flex-col gap-3">
      {value.map((it, i) => (
        <ItemCard key={i} onRemove={() => remove(i)}>
          {(s.fields ?? []).map((f) => <Field key={f.key} label={f.label} value={it[f.key] ?? ''} onChange={(v) => set(i, f.key, v)} area={f.area} upload={fieldMedia(f)} />)}
        </ItemCard>
      ))}
      <AddButton label={s.addLabel ?? 'Add'} onClick={add} />
    </div>
  );
}

export function ServiceTemplateForm({
  meta, values, sections, layout, onMeta, onValue, editing,
}: {
  meta: ServiceMeta; values: Record<string, TemplateValue>; sections: SectionDef[];
  layout: ServiceStyleId;
  onMeta: (k: keyof ServiceMeta, v: string) => void; onValue: (k: string, v: TemplateValue) => void;
  editing: boolean;
}) {
  // Only show editor cards for sections this layout actually renders — hidden blocks keep
  // their stored values (a user switching layouts loses nothing) but aren't editable here.
  const visibleKeys = LAYOUT_SECTIONS[layout];
  const shown = sections.filter((s) => visibleKeys.includes(s.key));
  return (
    <div className="flex flex-col gap-5">
      <Card title="Service details" hint="The card fields, menu label and hero shown for this service.">
        <Field label="Slug (URL)" value={meta.slug} onChange={(v) => onMeta('slug', v)} />
        {editing && <p className="text-xs text-[#b94b40] -mt-1.5">Changing the slug changes this page's URL and breaks existing links.</p>}
        <Field label="Name" value={meta.name} onChange={(v) => onMeta('name', v)} />
        <Field label="Icon (Material Symbol)" value={meta.icon} onChange={(v) => onMeta('icon', v)} />
        <Field label="Hero title" value={meta.heroTitle} onChange={(v) => onMeta('heroTitle', v)} />
        <Field label="Hero subtitle" value={meta.heroSub} onChange={(v) => onMeta('heroSub', v)} area />
        <Field label="Hero image URL" upload="image" value={meta.heroImg} onChange={(v) => onMeta('heroImg', v)} />
        <Field label="Intro title" value={meta.introTitle} onChange={(v) => onMeta('introTitle', v)} />
        <Field label="Intro" value={meta.intro} onChange={(v) => onMeta('intro', v)} area />
      </Card>

      {shown.map((s) => {
        const v = values[s.key] ?? s.default;
        return (
          <Card key={s.key} title={s.title}>
            {s.kind === 'text' && <Field label={s.label ?? s.title} value={typeof v === 'string' ? v : ''} onChange={(val) => onValue(s.key, val)} area={s.area} />}
            {s.kind === 'pair' && (s.fields ?? []).map((f) => (
              <Field key={f.key} label={f.label} value={(v as Record<string, string>)[f.key] ?? ''} onChange={(val) => onValue(s.key, { ...(v as Record<string, string>), [f.key]: val })} upload={fieldMedia(f)} />
            ))}
            {s.kind === 'repeat' && <RepeatEditor section={s} value={v as Array<Record<string, string>>} onChange={(val) => onValue(s.key, val)} />}
          </Card>
        );
      })}
    </div>
  );
}
