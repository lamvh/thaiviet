import { useState } from 'react';
import { useAdminStore } from '../admin-content-store';
import type { ServiceDetail } from '../../../lib/types';
import { Card, Field, StringList, ItemCard, AddButton } from './homepage-editor-primitives';
import { ServiceStyleEditor } from './ServiceStyleEditor';

// Editor for the service detail pages (/services/<slug>). A selector picks one service;
// its fields are edited below. Each control patches one service in the array by index
// through the store's updateServiceDetails(updater) helper. Slugs are the route keys and
// are shown read-only — services are not added/removed here (they mirror the nav + cards).
export function ServiceDetailsEditor() {
  const { state, updateServiceDetails } = useAdminStore();
  const list = state.content.serviceDetails;
  const [active, setActive] = useState(0);
  const i = Math.min(active, list.length - 1);
  const s = list[i];

  if (!s) return <p className="text-sm text-[#8a8377]">No service pages defined.</p>;

  // Merge a partial into the active service.
  function patch(partial: Partial<ServiceDetail>) {
    updateServiceDetails((arr) => arr.map((x, j) => (j === i ? { ...x, ...partial } : x)));
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <ServiceStyleEditor />

      {/* Service selector */}
      <div className="flex flex-wrap gap-2">
        {list.map((sd, j) => (
          <button
            key={sd.slug}
            onClick={() => setActive(j)}
            className={'px-4 py-2 rounded-lg text-sm font-bold border transition-colors ' + (j === i ? 'bg-primary text-white border-primary' : 'bg-white border-[#e6e1d8] text-on-surface hover:bg-[#faf8f4]')}
          >
            {sd.name}
          </button>
        ))}
      </div>

      <Card title={s.name} hint={`Editing /services/${s.slug}`}>
        <Field label="Service name" value={s.name} onChange={(v) => patch({ name: v })} />
        <Field label="Hero title" value={s.heroTitle} onChange={(v) => patch({ heroTitle: v })} />
        <Field label="Hero subtitle" area value={s.heroSub} onChange={(v) => patch({ heroSub: v })} />
        <Field label="Hero image URL" value={s.heroImg} onChange={(v) => patch({ heroImg: v })} />
      </Card>

      <Card title="Intro — “What's Included”">
        <Field label="Intro title" value={s.introTitle} onChange={(v) => patch({ introTitle: v })} />
        <Field label="Paragraph 1" area value={s.introA} onChange={(v) => patch({ introA: v })} />
        <Field label="Paragraph 2" area value={s.introB} onChange={(v) => patch({ introB: v })} />
      </Card>

      <Card title="Feature cards">
        {s.features.map((f, k) => (
          <ItemCard key={k} onRemove={() => patch({ features: s.features.filter((_, m) => m !== k) })}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon (Material Symbol)" value={f.icon} onChange={(v) => patch({ features: s.features.map((x, m) => (m === k ? { ...x, icon: v } : x)) })} />
              <Field label="Title" value={f.title} onChange={(v) => patch({ features: s.features.map((x, m) => (m === k ? { ...x, title: v } : x)) })} />
            </div>
            <Field label="Description" area value={f.desc} onChange={(v) => patch({ features: s.features.map((x, m) => (m === k ? { ...x, desc: v } : x)) })} />
          </ItemCard>
        ))}
        <AddButton label="Add feature" onClick={() => patch({ features: [...s.features, { icon: 'check_circle', title: 'New feature', desc: '' }] })} />
      </Card>

      <Card title="Approach section">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow" value={s.midEyebrow} onChange={(v) => patch({ midEyebrow: v })} />
          <Field label="Title" value={s.midTitle} onChange={(v) => patch({ midTitle: v })} />
        </div>
        <Field label="Image URL" value={s.midImage} onChange={(v) => patch({ midImage: v })} />
        <StringList label="Paragraphs" items={s.midParas} area onChange={(midParas) => patch({ midParas })} />
        <StringList label="Checklist (Our promise)" items={s.midList} onChange={(midList) => patch({ midList })} />
        <StringList label="Paint partners (badges — optional)" items={s.paintPartners ?? []} onChange={(paintPartners) => patch({ paintPartners })} />
      </Card>

      <Card title="Before / After">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Before image URL" value={s.beforeImg} onChange={(v) => patch({ beforeImg: v })} />
          <Field label="After image URL" value={s.afterImg} onChange={(v) => patch({ afterImg: v })} />
        </div>
        <StringList label="Gallery image URLs" items={s.gallery} onChange={(gallery) => patch({ gallery })} />
      </Card>

      <Card title="Project showcase" hint="Cards link to the Projects page.">
        {s.showcase.map((c, k) => (
          <ItemCard key={k} onRemove={() => patch({ showcase: s.showcase.filter((_, m) => m !== k) })}>
            <Field label="Title" value={c.title} onChange={(v) => patch({ showcase: s.showcase.map((x, m) => (m === k ? { ...x, title: v } : x)) })} />
            <Field label="Blurb" area value={c.blurb} onChange={(v) => patch({ showcase: s.showcase.map((x, m) => (m === k ? { ...x, blurb: v } : x)) })} />
            <Field label="Image URL" value={c.img} onChange={(v) => patch({ showcase: s.showcase.map((x, m) => (m === k ? { ...x, img: v } : x)) })} />
          </ItemCard>
        ))}
        <AddButton label="Add showcase card" onClick={() => patch({ showcase: [...s.showcase, { title: 'New project', blurb: '', img: '' }] })} />
      </Card>

      <Card title="Testimonial" hint="Leave the quote empty to hide this section.">
        <Field label="Quote" area value={s.quote ?? ''} onChange={(v) => patch({ quote: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" value={s.quoteName ?? ''} onChange={(v) => patch({ quoteName: v })} />
          <Field label="Attribution" value={s.quoteSub ?? ''} onChange={(v) => patch({ quoteSub: v })} />
        </div>
      </Card>
    </div>
  );
}
