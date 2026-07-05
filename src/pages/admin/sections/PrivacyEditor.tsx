import { useAdminStore } from '../admin-content-store';
import type { PrivacyPolicy } from '../../../lib/types';
import { Card, Field, StringList, ItemCard, AddButton } from './homepage-editor-primitives';

// Editor for the Privacy Policy page ("/privacy"). Title + intro, an ordered list of
// sections (heading, paragraphs, optional bullets), and the Contact/closing copy. The
// contact block on the page pulls email + phone live from Contact & Social — not edited here.
export function PrivacyEditor() {
  const { state, updatePrivacy } = useAdminStore();
  const pv = state.content.privacy;

  const setSection = (i: number, partial: Partial<PrivacyPolicy['sections'][number]>) =>
    updatePrivacy((p) => ({ ...p, sections: p.sections.map((s, j) => (j === i ? { ...s, ...partial } : s)) }));

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <Card title="Header">
        <Field label="Title" value={pv.title} onChange={(v) => updatePrivacy((p) => ({ ...p, title: v }))} />
        <Field label="Intro" area value={pv.intro} onChange={(v) => updatePrivacy((p) => ({ ...p, intro: v }))} />
      </Card>

      <Card title="Sections" hint="Each section renders as a heading with its paragraphs and (optional) bullet list.">
        {pv.sections.map((s, i) => (
          <ItemCard key={i} onRemove={() => updatePrivacy((p) => ({ ...p, sections: p.sections.filter((_, j) => j !== i) }))}>
            <Field label="Heading" value={s.heading} onChange={(v) => setSection(i, { heading: v })} />
            <StringList label="Paragraphs" area items={s.paragraphs} onChange={(paragraphs) => setSection(i, { paragraphs })} />
            <StringList label="Bullet points" items={s.bullets} onChange={(bullets) => setSection(i, { bullets })} />
          </ItemCard>
        ))}
        <AddButton label="Add section" onClick={() => updatePrivacy((p) => ({ ...p, sections: [...p.sections, { heading: 'New section', paragraphs: [''], bullets: [] }] }))} />
      </Card>

      <Card title="Contact & closing" hint="Email and phone are pulled from Contact & Social automatically.">
        <Field label="Contact heading" value={pv.contactHeading} onChange={(v) => updatePrivacy((p) => ({ ...p, contactHeading: v }))} />
        <Field label="Contact intro" area value={pv.contactIntro} onChange={(v) => updatePrivacy((p) => ({ ...p, contactIntro: v }))} />
        <Field label="Closing note" area value={pv.closing} onChange={(v) => updatePrivacy((p) => ({ ...p, closing: v }))} />
      </Card>
    </div>
  );
}
