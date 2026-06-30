import { useAdminStore } from '../admin-content-store';
import type { Homepage } from '../../../lib/types';
import { Card, Field, StringList, ItemCard, AddButton } from './homepage-editor-primitives';

// Full editor for every homepage content block below the hero. Each control patches one
// slice of the `homepage` object through the store's updateHomepage(updater) helper.
export function HomepageEditor() {
  const { state, updateHomepage } = useAdminStore();
  const hp = state.content.homepage;

  // Patch one top-level block (heritage, mission, …) by merging a partial into it.
  function patch<K extends keyof Homepage>(block: K, partial: Partial<Homepage[K]>) {
    updateHomepage((h) => ({ ...h, [block]: { ...h[block], ...partial } }));
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <Card title="Heritage — “Your Home. Our Care.”">
        <Field label="Eyebrow" value={hp.heritage.eyebrow} onChange={(v) => patch('heritage', { eyebrow: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title (lead)" value={hp.heritage.titleLead} onChange={(v) => patch('heritage', { titleLead: v })} />
          <Field label="Title (accent)" value={hp.heritage.titleAccent} onChange={(v) => patch('heritage', { titleAccent: v })} />
        </div>
        <StringList label="Paragraphs" items={hp.heritage.paragraphs} area onChange={(paragraphs) => patch('heritage', { paragraphs })} />
        <Field label="Image URL" value={hp.heritage.image} onChange={(v) => patch('heritage', { image: v })} />
        <Field label="Quote badge" value={hp.heritage.quote} onChange={(v) => patch('heritage', { quote: v })} />
      </Card>

      <Card title="Mission" hint="Heading plus the three feature cards.">
        <Field label="Title" value={hp.mission.title} onChange={(v) => patch('mission', { title: v })} />
        <Field label="Subtitle" area value={hp.mission.subtitle} onChange={(v) => patch('mission', { subtitle: v })} />
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377]">Cards</label>
        {hp.mission.cards.map((c, i) => (
          <ItemCard key={i} onRemove={() => patch('mission', { cards: hp.mission.cards.filter((_, j) => j !== i) })}>
            <Field label="Icon name (Material Symbol)" value={c.icon} onChange={(v) => patch('mission', { cards: hp.mission.cards.map((x, j) => (j === i ? { ...x, icon: v } : x)) })} />
            <Field label="Title" value={c.title} onChange={(v) => patch('mission', { cards: hp.mission.cards.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
            <Field label="Description" area value={c.desc} onChange={(v) => patch('mission', { cards: hp.mission.cards.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
          </ItemCard>
        ))}
        <AddButton label="Add card" onClick={() => patch('mission', { cards: [...hp.mission.cards, { icon: 'brush', title: 'New card', desc: '' }] })} />
      </Card>

      <Card title="People — “Highly Skilled Professionals”">
        <Field label="Eyebrow" value={hp.people.eyebrow} onChange={(v) => patch('people', { eyebrow: v })} />
        <Field label="Title" value={hp.people.title} onChange={(v) => patch('people', { title: v })} />
        <StringList label="Paragraphs" items={hp.people.paragraphs} area onChange={(paragraphs) => patch('people', { paragraphs })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Image URL (left)" value={hp.people.imageA} onChange={(v) => patch('people', { imageA: v })} />
          <Field label="Image URL (right)" value={hp.people.imageB} onChange={(v) => patch('people', { imageB: v })} />
        </div>
      </Card>

      <Card title="Preparation">
        <Field label="Title" value={hp.preparation.title} onChange={(v) => patch('preparation', { title: v })} />
        <Field label="Intro" area value={hp.preparation.intro} onChange={(v) => patch('preparation', { intro: v })} />
        <StringList label="Checklist bullets" items={hp.preparation.bullets} onChange={(bullets) => patch('preparation', { bullets })} />
        <Field label="Image URL" value={hp.preparation.image} onChange={(v) => patch('preparation', { image: v })} />
      </Card>

      <Card title="Stats — “Why Wellington Trusts Us”">
        <Field label="Title" value={hp.stats.title} onChange={(v) => patch('stats', { title: v })} />
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377]">Stat items</label>
        {hp.stats.items.map((s, i) => (
          <ItemCard key={i} onRemove={() => patch('stats', { items: hp.stats.items.filter((_, j) => j !== i) })}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Value" value={s.value} onChange={(v) => patch('stats', { items: hp.stats.items.map((x, j) => (j === i ? { ...x, value: v } : x)) })} />
              <Field label="Label" value={s.label} onChange={(v) => patch('stats', { items: hp.stats.items.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
            </div>
            <Field label="Description" value={s.desc} onChange={(v) => patch('stats', { items: hp.stats.items.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
          </ItemCard>
        ))}
        <AddButton label="Add stat" onClick={() => patch('stats', { items: [...hp.stats.items, { value: '', label: 'New stat', desc: '' }] })} />
      </Card>

      <Card title="Call to action (bottom)">
        <Field label="Title" value={hp.cta.title} onChange={(v) => patch('cta', { title: v })} />
        <Field label="Subtitle" area value={hp.cta.subtitle} onChange={(v) => patch('cta', { subtitle: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary button label" value={hp.cta.primaryLabel} onChange={(v) => patch('cta', { primaryLabel: v })} />
          <Field label="Primary button link" value={hp.cta.primaryTo} onChange={(v) => patch('cta', { primaryTo: v })} />
          <Field label="Secondary button label" value={hp.cta.secondaryLabel} onChange={(v) => patch('cta', { secondaryLabel: v })} />
          <Field label="Secondary button link" value={hp.cta.secondaryTo} onChange={(v) => patch('cta', { secondaryTo: v })} />
        </div>
      </Card>
    </div>
  );
}
