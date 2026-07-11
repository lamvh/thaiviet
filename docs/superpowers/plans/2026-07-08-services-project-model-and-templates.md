# Services → Project Model + Service Page Templates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make services a fully CRUD-able, template-driven CMS list exactly like projects, remove the legacy service "skin" system, and ship the full A–F family of service-page template layouts from the Claude design.

**Architecture:** Two parts sequenced to keep `npm run build` green at every commit. **Part 2 first** (additive: build six `ServiceLayout<X>` components + six template defs + registry, nothing removed). **Part 1 second** (the migration: introduce card fields + a load-time `migrateServices()` back-fill, rewire every public surface to derive from `serviceDetails[]`, add the admin `ServicesTable` + service compose wizard, then delete the skin system and slim the types once nothing references them).

**Tech Stack:** React 18 + TypeScript (strict) + Vite + Tailwind, React Router v6, Supabase (single `site_content` JSON blob), Vitest.

## Global Constraints

- `npm run build` (runs `tsc` strict + `vite build`) MUST pass before any task is considered done.
- Content lives in one JSON blob. **Never rename a content key without a migration path** — `serviceDetails` keeps its key; old DB rows are healed at load by `withContentDefaults`/`migrateServices`.
- Code comments and migration/test names MUST NOT reference plan phases, task numbers, or finding codes — explain the *why* (invariant/trade-off), using stable domain terms only.
- Do NOT create git branches or commit unless the user explicitly asks — the "Commit" steps below stage the intent, but leave commits to the user (per the repo's git rule). Treat each "Commit" step as "changes are complete + build-green for this task".
- Reuse existing editor primitives (`Card`, `Field`, `ItemCard`, `AddButton`, `StringList`) and `VisPill` — do not re-create them.
- **Testing infra:** add NO new test deps. This repo's Vitest runs `environment: 'node'` and `include: ['src/**/*.test.ts']` — tests are pure-logic `.test.ts` only (no `@testing-library`/jsdom, no `.tsx` render tests). Importing `.tsx` modules for identity/logic assertions (no rendering) is fine. Any implementer who breaks an existing test (e.g. `service-templates.test.ts`, `service-prefill.test.ts`, `validate-service-page.test.ts`) MUST update it to the new shapes. `npx vitest run` (whole suite) must pass at each build-green gate.
- Brand tokens come from `tailwind.config.js` (`primary`, `on-surface`, `surface-container*`, etc.), NOT the design's inline hex. Map design hexes to the nearest existing token (e.g. design `#ba0013` → `primary`; dark frame `#1c1c19` → `bg-[#1c1c19]` literal where no token exists).
- Design reference: `docs/superpowers/specs/2026-07-08-migrate-services-to-project-model-design.md` (§ "Part 2" layout table) + decoded design HTML at `/private/tmp/claude-501/-Users-lamvh-src-thaiviet/62675fe6-73da-4931-bb2d-62acb9fe4266/scratchpad/thaiviet-home-design.html` (read specific frames with grep/Read; do not dump).

---

## File Structure

**Part 2 — create:**
- `src/components/templates/service-template-layouts/ServiceLayoutSidebar.tsx` — sticky-facts + content column (B)
- `.../ServiceLayoutCinematic.tsx` — dark/cinematic frame (C)
- `.../ServiceLayoutTimeline.tsx` — process timeline (D)
- `.../ServiceLayoutBento.tsx` — bento mosaic (E)
- `.../ServiceLayoutMinimal.tsx` — minimal centered (F)

**Part 2 — modify:**
- `src/components/templates/service-template-layouts/shared.tsx` — add shared bits used by >1 layout (`ServiceFacts`, dark hero variant)
- `src/components/templates/service-skins-templated.tsx` — map A–F to real components; flip `ready`
- `src/lib/templates/types.ts` — `ServiceStyleId` → A–F; `ServiceTemplateId` → six ids; `ServiceMeta` gains `slug` + `icon`
- `src/lib/templates/service-templates.ts` — six template defs
- `src/lib/templates/validate-page.ts` — no change needed (looks up by `serviceTemplates[id]`, already generic)

**Part 1 — create:**
- `src/pages/admin/sections/ServicesTable.tsx` — CRUD table (clone of ProjectsTable)
- `src/pages/admin/sections/service-compose/ServiceComposeWizard.tsx`
- `src/pages/admin/sections/service-compose/ServiceTemplatePicker.tsx`
- `src/pages/admin/sections/service-compose/ServiceTemplateForm.tsx`
- `src/pages/admin/sections/service-compose/ServiceTemplatePreview.tsx`
- `src/lib/migrate-services.ts` — `migrateServices()` + `SERVICE_ICON` map

**Part 1 — modify:**
- `src/lib/types.ts` (slim `ServiceDetail`, remove `Service`, keep re-exports)
- `src/lib/content-defaults.ts` (call `migrateServices` inside `withContentDefaults`)
- `src/lib/content-schema.ts` (validate services as template items; drop `serviceStyle`)
- `src/lib/service-visibility.ts` (unchanged — still slug-keyed)
- `src/pages/admin/useAdminContent.ts` (drop `serviceStyle`; `AdminSection` gains `services` + `serviceCompose`, drops `servicePages`)
- `src/pages/admin/admin-content-store.tsx` (service CRUD + `serviceCompose` slice; drop skin helpers)
- `src/pages/admin/AdminSidebar.tsx`, `AdminPage.tsx` (wire table + wizard + META)
- `src/pages/ServiceDetailPage.tsx` (template-only)
- `src/pages/ServicesPage.tsx` (grid from `serviceDetails`)
- `src/components/cards/ServiceCard.tsx` (accept `ServiceItem`)
- `src/components/layout/Footer.tsx`, `Header.tsx`, `ServicesDropdown.tsx` (derive flat menu/list from `serviceDetails`)
- `src/pages/HomePage.tsx` (service cards from `serviceDetails`)
- `src/pages/admin/sections/HomeEditor.tsx` (drop the service-cards sub-editor) + `HomeServices` type
- `src/content/site-content.json` (migrate serviceDetails, drop `serviceStyle`, drop `home.services.cards`)
- `src/data/nav.ts` (remove `SERVICE_LINKS`)

**Part 1 — delete:**
- `src/data/services.ts`
- `src/components/services/service-skins.tsx`, `ServiceSkinA.tsx`, `ServiceSkinB.tsx`, `BeforeAfter.tsx`
- `src/pages/admin/sections/ServiceStyleEditor.tsx`, `ServiceDetailsEditor.tsx`, `ServiceTemplateEditor.tsx`

---

# PART 2 — Service Page Template Layouts (A–F)

## Task 1: Expand service template types

**Files:**
- Modify: `src/lib/templates/types.ts`

**Interfaces:**
- Produces: `ServiceStyleId = 'A'|'B'|'C'|'D'|'E'|'F'`; `ServiceTemplateId = 'serviceclassic'|'servicesidebar'|'servicecinematic'|'servicetimeline'|'servicebento'|'serviceminimal'`; `ServiceMeta` now includes `slug: string` and `icon: string`.

- [ ] **Step 1: Edit the types**

In `src/lib/templates/types.ts`:

```ts
export type ServiceStyleId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
```

```ts
export interface ServiceMeta {
  slug: string; icon: string; name: string;
  heroTitle: string; heroSub: string;
  heroImg: string; introTitle: string; intro: string;
}

export type ServiceTemplateId =
  | 'serviceclassic' | 'servicesidebar' | 'servicecinematic'
  | 'servicetimeline' | 'servicebento' | 'serviceminimal';
```

- [ ] **Step 2: Verify it compiles (will surface downstream gaps, fixed in next tasks)**

Run: `npx tsc --noEmit`
Expected: errors ONLY in `service-templates.ts` (missing new template ids / meta fields) and `service-prefill.ts` (missing `slug`/`icon`) — these are fixed in Tasks 2–3. No errors elsewhere.

- [ ] **Step 3: Commit** — `feat: widen service template + style id unions and service meta`

---

## Task 2: Six service template definitions

**Files:**
- Modify: `src/lib/templates/service-templates.ts`
- Test: `src/lib/templates/__tests__/service-templates.test.ts`

**Interfaces:**
- Consumes: `ServiceTemplateDef`, `ServiceTemplateId`, `ServiceStyleId` (Task 1).
- Produces: `serviceTemplateList: ServiceTemplateDef[]` (length 6, one per layout A–F); `serviceTemplates: Record<ServiceTemplateId, ServiceTemplateDef>`.

All six templates share ONE `sections[]` (features/approach/ba/showcase/quote/author — the current `serviceclassic` sections) and differ only by `id`, `layout`, picker card meta, and `defaultMeta`. Extract the shared sections to a `SERVICE_SECTIONS` const.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/templates/__tests__/service-templates.test.ts
import { describe, it, expect } from 'vitest';
import { serviceTemplateList, serviceTemplates } from '../service-templates';

const LAYOUTS = ['A', 'B', 'C', 'D', 'E', 'F'];

describe('service templates', () => {
  it('defines one template per layout A–F', () => {
    expect(serviceTemplateList).toHaveLength(6);
    expect(serviceTemplateList.map((t) => t.layout).sort()).toEqual(LAYOUTS);
  });
  it('every template has slug + icon in defaultMeta and the shared sections', () => {
    for (const t of serviceTemplateList) {
      expect(typeof t.defaultMeta.slug).toBe('string');
      expect(typeof t.defaultMeta.icon).toBe('string');
      expect(t.sections.map((s) => s.key)).toEqual(['features', 'approach', 'ba', 'showcase', 'quote', 'author']);
    }
  });
  it('registry is keyed by id', () => {
    for (const t of serviceTemplateList) expect(serviceTemplates[t.id]).toBe(t);
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (`toHaveLength(6)` fails; still one template)

Run: `npx vitest run src/lib/templates/__tests__/service-templates.test.ts`

- [ ] **Step 3: Rewrite `service-templates.ts`**

Keep the existing `serviceclassic` sections as `SERVICE_SECTIONS`; add `slug: ''`, `icon: 'design_services'` to each `defaultMeta`. Add five more defs. Card meta (name/icon/desc/includes) per the design table.

```ts
import type { ServiceTemplateDef, ServiceTemplateId, SectionDef } from './types';

const SERVICE_SECTIONS: SectionDef[] = [
  { key: 'features', kind: 'repeat', style: 'features', title: 'Feature cards', itemLabel: 'Feature', addLabel: 'Add feature',
    fields: [{ key: 'icon', label: 'Icon (Material Symbol)' }, { key: 'title', label: 'Title' }, { key: 'desc', label: 'Description', area: true }],
    default: [
      { icon: 'check_circle', title: 'Feature one', desc: 'What it means for the customer.' },
      { icon: 'check_circle', title: 'Feature two', desc: 'What it means for the customer.' },
    ] },
  { key: 'approach', kind: 'repeat', style: 'approach', title: 'Approach section', itemLabel: 'Point', addLabel: 'Add point',
    fields: [{ key: 't', label: 'Checklist item' }],
    default: [{ t: 'We prepare every surface properly.' }, { t: 'We leave the site clean each day.' }] },
  { key: 'ba', kind: 'pair', style: 'beforeafter', title: 'Before & After',
    fields: [{ key: 'before', label: 'Before image URL' }, { key: 'after', label: 'After image URL' }],
    default: { before: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=700&q=80', after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80' } },
  { key: 'showcase', kind: 'repeat', style: 'showcase', title: 'Project showcase', itemLabel: 'Card', addLabel: 'Add card',
    fields: [{ key: 'title', label: 'Title' }, { key: 'blurb', label: 'Blurb', area: true }, { key: 'img', label: 'Image URL' }],
    default: [{ title: 'Recent project', blurb: 'A short blurb.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' }] },
  { key: 'quote', kind: 'text', style: 'quote', title: 'Testimonial', heading: 'Client quote', label: 'Testimonial quote', area: true,
    default: 'They did a fantastic job — tidy, on time and a flawless finish.' },
  { key: 'author', kind: 'text', style: 'author', title: 'Quote attribution', label: 'Who said it', area: false,
    default: 'A happy homeowner' },
];

const baseMeta = (over: Partial<ServiceTemplateDef['defaultMeta']> = {}) => ({
  slug: '', icon: 'design_services', name: 'New Service',
  heroTitle: 'Service Title', heroSub: 'Short hero subtitle.',
  heroImg: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
  introTitle: 'What’s Included', intro: 'A short introduction to the service.',
  ...over,
});

export const serviceTemplateList: ServiceTemplateDef[] = [
  { id: 'serviceclassic', name: 'Classic', icon: 'design_services', layout: 'A',
    desc: 'Hero, what’s included, approach, before/after, showcase and testimonial.',
    includes: ['Hero', 'Features', 'Approach', 'Before/After', 'Showcase'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicesidebar', name: 'Sidebar', icon: 'view_sidebar', layout: 'B',
    desc: 'Compact hero with a sticky facts + quote sidebar next to the content column.',
    includes: ['Compact hero', 'Sticky facts', 'Approach', 'Before/After'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicecinematic', name: 'Cinematic', icon: 'dark_mode', layout: 'C',
    desc: 'Dark, premium magazine treatment focused on before/after pairs and a stat strip.',
    includes: ['Dark hero', 'Before/After', 'Stats', 'CTA'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicetimeline', name: 'Process Timeline', icon: 'timeline', layout: 'D',
    desc: 'Split hero then a vertical numbered process timeline and a red CTA band.',
    includes: ['Split hero', 'Timeline', 'CTA band'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicebento', name: 'Bento Mosaic', icon: 'grid_view', layout: 'E',
    desc: 'A bento tile grid mixing images, a red statement tile and stat tiles.',
    includes: ['Simple hero', 'Bento grid', 'Testimonial'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'serviceminimal', name: 'Minimal', icon: 'article', layout: 'F',
    desc: 'A calm, narrow centered reading column with a wide hero image.',
    includes: ['Centered hero', 'Wide image', 'Prose', 'Quote'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
];

export const serviceTemplates: Record<ServiceTemplateId, ServiceTemplateDef> =
  Object.fromEntries(serviceTemplateList.map((t) => [t.id, t])) as Record<ServiceTemplateId, ServiceTemplateDef>;
```

- [ ] **Step 4: Run — expect PASS**

Run: `npx vitest run src/lib/templates/__tests__/service-templates.test.ts`

- [ ] **Step 5: Fix `service-prefill.ts`** — add `slug`/`icon` to the returned meta so it still satisfies `ServiceMeta`:

```ts
// serviceMetaFromDetail return object gains:
slug: sd.slug || '',
icon: (sd as { icon?: string }).icon || def.defaultMeta.icon,
```

- [ ] **Step 6: `npx tsc --noEmit`** — expect only remaining error: `service-skins-templated.tsx` layout record missing 'F'. Fixed next task. Commit — `feat: define six service page templates (A–F)`

---

## Task 3: Shared layout helpers

**Files:**
- Modify: `src/components/templates/service-template-layouts/shared.tsx`

**Interfaces:**
- Consumes: `ServiceLayoutProps` (existing), `ServiceMeta`, `SectionView`.
- Produces: `ServiceFacts({ meta })` (renders slug-agnostic quick facts row from meta — name/intro), a dark CTA variant `ServiceCtaDark`, and helper `sectionValue(values, sections, key)`.

Add small shared pieces the new layouts reuse (keep each layout file focused). Reuse existing `ServiceHero`, `ServiceCta`.

```tsx
// Append to shared.tsx
import { SectionView } from '../template-sections';
import type { SectionDef, TemplateValue } from '../../../lib/templates/types';

export const sectionByKey = (sections: SectionDef[], key: string) => sections.find((s) => s.key === key);
export const valueOf = (values: Record<string, TemplateValue>, sections: SectionDef[], key: string): TemplateValue => {
  const s = sectionByKey(sections, key);
  return values[key] ?? (s ? s.default : '');
};
export function RenderSection({ sections, values, k }: { sections: SectionDef[]; values: Record<string, TemplateValue>; k: string }) {
  const s = sectionByKey(sections, k);
  if (!s) return null;
  return <SectionView section={s} value={values[k] ?? s.default} />;
}
```

- [ ] **Step 1: Add the helpers above to `shared.tsx`.**
- [ ] **Step 2: `npx tsc --noEmit`** — same single pending error (registry). Commit — `feat: add shared service-layout section helpers`

---

## Task 4: ServiceLayout B — Sidebar

**Files:**
- Create: `src/components/templates/service-template-layouts/ServiceLayoutSidebar.tsx`
- Test: `src/components/templates/__tests__/service-layouts.test.tsx`

**Interfaces:**
- Consumes: `ServiceLayoutProps`, `ServiceHero`, `ServiceCta`, `RenderSection`, `valueOf`.
- Produces: `ServiceLayoutSidebar: FC<ServiceLayoutProps>`.

Design (spec table row B): compact hero → two-column `grid-cols-[320px_1fr] gap-16 items-start` with a `sticky top-24` white facts/CTA card in the aside and the stacked sections in the content column.

No per-layout render test (repo has no DOM-test stack — see Global Constraints). All six layouts are verified together by the pure-logic registry test in Task 9. Keep the `data-testid` on each layout's root wrapper anyway — a stable hook for future e2e and a cheap structural marker.

- [ ] **Step 1: Implement `ServiceLayoutSidebar.tsx`**

```tsx
import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import { ServiceCta, RenderSection, type ServiceLayoutProps } from './shared';

// Sidebar layout: compact hero + sticky facts/CTA aside beside the content column.
export function ServiceLayoutSidebar({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <div data-testid="svc-sidebar">
      <section className="relative h-[380px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/15 z-10" />
        {meta.heroImg && <img className="absolute inset-0 w-full h-full object-cover" src={meta.heroImg} alt={meta.heroTitle} />}
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 w-full">
          <span className="text-white/80 uppercase tracking-[0.2em] text-sm">{meta.name}</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white mt-2">{meta.heroTitle}</h1>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
        <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-[0_12px_40px_rgba(28,28,25,0.06)]">
            {meta.intro && <p className="text-on-surface-variant text-sm leading-relaxed mb-5">{meta.intro}</p>}
            <Link to="/contact" className="block text-center bg-primary text-on-primary py-4 rounded-lg font-bold">Get a Free Quote</Link>
            <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="mt-3 flex items-center justify-center gap-2 text-primary font-bold"><Icon name="call" /> {contact.phone}</a>
          </div>
        </aside>
        <div className="flex flex-col gap-12">
          {meta.introTitle && <h2 className="font-headline text-3xl font-bold">{meta.introTitle}</h2>}
          <RenderSection sections={sections} values={values} k="features" />
          <RenderSection sections={sections} values={values} k="approach" />
          <RenderSection sections={sections} values={values} k="ba" />
          <RenderSection sections={sections} values={values} k="showcase" />
          <div className="border-l-4 border-primary pl-6">
            <RenderSection sections={sections} values={values} k="quote" />
            <RenderSection sections={sections} values={values} k="author" />
          </div>
        </div>
      </section>
      <ServiceCta contact={contact} />
    </div>
  );
}
```

Each subsequent layout uses its own root `data-testid` (`svc-cinematic`, `svc-timeline`, `svc-bento`, `svc-minimal`).

- [ ] **Step 2: `npx tsc --noEmit`** passes for this file (registry wiring happens once in Task 9). Commit — `feat: add Sidebar service layout (B)`

---

## Task 5: ServiceLayout C — Cinematic (dark)

**Files:**
- Create: `src/components/templates/service-template-layouts/ServiceLayoutCinematic.tsx`

Design (row C): `bg-[#1c1c19] text-white` frame, centered title block, before/after pair with the AFTER tile ringed `ring-2 ring-primary`, a dark stats strip `bg-[#262522]`, centered CTA.

- [ ] **Step 1: Implement**

```tsx
import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import { RenderSection, type ServiceLayoutProps } from './shared';

// Cinematic layout: dark premium frame centered on before/after imagery.
export function ServiceLayoutCinematic({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <div data-testid="svc-cinematic" className="bg-[#1c1c19] text-white">
      <section className="pt-36 pb-14 px-5 sm:px-8 max-w-4xl mx-auto text-center">
        <span className="text-[#ffb4ab] uppercase tracking-[0.2em] text-sm">{meta.name}</span>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold mt-3">{meta.heroTitle}</h1>
        {meta.heroSub && <p className="text-white/70 mt-4">{meta.heroSub}</p>}
      </section>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        {/* before/after (dark) — reuse the pair renderer; AFTER emphasis via wrapper ring in CSS-less mode */}
        <div className="[&_figure:last-child]:ring-2 [&_figure:last-child]:ring-primary rounded-2xl">
          <RenderSection sections={sections} values={values} k="ba" />
        </div>
      </section>
      <section className="bg-[#262522] py-14 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <RenderSection sections={sections} values={values} k="features" />
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-6">Ready to get started?</h2>
        <Link to="/contact" className="inline-block bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold">Request a Free Quote</Link>
        <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="mt-4 flex items-center justify-center gap-2 text-white/80"><Icon name="call" /> {contact.phone}</a>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: `npx tsc --noEmit`** passes. Commit — `feat: add Cinematic service layout (C)`

---

## Task 6: ServiceLayout D — Process Timeline

**Files:**
- Create: `src/components/templates/service-template-layouts/ServiceLayoutTimeline.tsx`

Design (row D): 2-col hero, then a vertical timeline built from the `approach` items (rail `absolute left-[15px] w-0.5 bg-primary/25`, numbered nodes `w-8 h-8 rounded-full bg-primary text-on-primary`), then the standard `ServiceCta`.

- [ ] **Step 1: Implement** (map `approach` checklist items into numbered timeline steps)

```tsx
import { ServiceHero, ServiceCta, valueOf, type ServiceLayoutProps } from './shared';

export function ServiceLayoutTimeline({ meta, values, sections, contact }: ServiceLayoutProps) {
  const steps = (valueOf(values, sections, 'approach') as Array<Record<string, string>>).filter((s) => (s.t ?? '').trim());
  return (
    <div data-testid="svc-timeline">
      <ServiceHero meta={meta} />
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        {meta.introTitle && <h2 className="font-headline text-3xl font-bold mb-10">{meta.introTitle}</h2>}
        <div className="relative pl-12">
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-primary/25" />
          {steps.map((s, i) => (
            <div key={i} className="relative mb-12 last:mb-0">
              <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-extrabold">{i + 1}</div>
              <p className="text-on-surface font-medium">{s.t}</p>
            </div>
          ))}
        </div>
      </section>
      <ServiceCta contact={contact} />
    </div>
  );
}
```

- [ ] **Step 2: `npx tsc --noEmit`** passes. Commit — `feat: add Process Timeline service layout (D)`

---

## Task 7: ServiceLayout E — Bento Mosaic

**Files:**
- Create: `src/components/templates/service-template-layouts/ServiceLayoutBento.tsx`

Design (row E): simple hero, then a `grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4` bento built from `showcase` items (images) with a `col-span-2 row-span-2` feature tile and a red statement tile, then the `quote` testimonial band.

- [ ] **Step 1: Implement** (fills bento cells from showcase items; wide/tall spans by index)

```tsx
import { RenderSection, valueOf, type ServiceLayoutProps } from './shared';
import { ServiceHero } from './shared';

export function ServiceLayoutBento({ meta, values, sections, contact }: ServiceLayoutProps) {
  const cards = (valueOf(values, sections, 'showcase') as Array<Record<string, string>>).filter((c) => (c.img ?? '').trim());
  const span = (i: number) => (i === 0 ? 'col-span-2 row-span-2' : i % 3 === 1 ? 'col-span-2' : '');
  return (
    <div data-testid="svc-bento">
      <ServiceHero meta={meta} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {cards.map((c, i) => (
            <div key={i} className={'relative rounded-2xl overflow-hidden ' + span(i)}>
              <img className="w-full h-full object-cover" src={c.img} alt={c.title || ''} />
              {c.title && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><span className="text-white font-bold">{c.title}</span></div>}
            </div>
          ))}
          <div className="col-span-2 rounded-2xl bg-primary text-on-primary p-7 flex flex-col justify-center">
            <div className="font-headline text-3xl font-extrabold">{meta.name}</div>
            {meta.heroSub && <p className="mt-2 opacity-90">{meta.heroSub}</p>}
          </div>
        </div>
        <div className="mt-14">
          <RenderSection sections={sections} values={values} k="quote" />
          <RenderSection sections={sections} values={values} k="author" />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: `npx tsc --noEmit`** passes. Commit — `feat: add Bento Mosaic service layout (E)`

---

## Task 8: ServiceLayout F — Minimal Centered

**Files:**
- Create: `src/components/templates/service-template-layouts/ServiceLayoutMinimal.tsx`

Design (row F): white frame, narrow centered `max-w-[720px]` hero, wide `max-w-[1040px]` 16:9 image, `max-w-[680px]` prose (the `features` list + intro), ruled centered quote.

- [ ] **Step 1: Implement**

```tsx
import { ServiceCta, RenderSection, type ServiceLayoutProps } from './shared';

export function ServiceLayoutMinimal({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <div data-testid="svc-minimal" className="bg-surface">
      <article className="max-w-[720px] mx-auto px-5 sm:px-8 pt-28 text-center">
        <div className="text-primary uppercase tracking-[0.2em] text-xs">{meta.name}</div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mt-3">{meta.heroTitle}</h1>
        {meta.heroSub && <p className="text-on-surface-variant mt-4">{meta.heroSub}</p>}
      </article>
      {meta.heroImg && (
        <div className="max-w-[1040px] mx-auto px-5 sm:px-8 mt-12">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden"><img className="w-full h-full object-cover" src={meta.heroImg} alt={meta.heroTitle} /></div>
        </div>
      )}
      <article className="max-w-[680px] mx-auto px-5 sm:px-8 py-14 flex flex-col gap-10">
        {meta.intro && <p className="text-lg leading-8 text-on-surface-variant">{meta.intro}</p>}
        <RenderSection sections={sections} values={values} k="features" />
        <div className="border-y border-outline-variant/20 py-8 text-center italic">
          <RenderSection sections={sections} values={values} k="quote" />
          <RenderSection sections={sections} values={values} k="author" />
        </div>
      </article>
      <ServiceCta contact={contact} />
    </div>
  );
}
```

- [ ] **Step 2: `npx tsc --noEmit`** passes. Commit — `feat: add Minimal service layout (F)`

---

## Task 9: Wire the layout registry + prove all six render

**Files:**
- Modify: `src/components/templates/service-skins-templated.tsx`
- Test: `src/components/templates/__tests__/service-layouts.test.tsx` (from Task 4)

- [ ] **Step 1: Update the registry**

```tsx
import { ServiceLayoutClassic } from './service-template-layouts/ServiceLayoutClassic';
import { ServiceLayoutSidebar } from './service-template-layouts/ServiceLayoutSidebar';
import { ServiceLayoutCinematic } from './service-template-layouts/ServiceLayoutCinematic';
import { ServiceLayoutTimeline } from './service-template-layouts/ServiceLayoutTimeline';
import { ServiceLayoutBento } from './service-template-layouts/ServiceLayoutBento';
import { ServiceLayoutMinimal } from './service-template-layouts/ServiceLayoutMinimal';

export const serviceTemplateLayouts: Record<ServiceStyleId, LayoutComp> = {
  A: ServiceLayoutClassic, B: ServiceLayoutSidebar, C: ServiceLayoutCinematic,
  D: ServiceLayoutTimeline, E: ServiceLayoutBento, F: ServiceLayoutMinimal,
};

export const SERVICE_TEMPLATE_LAYOUT_META: { id: ServiceStyleId; name: string; ready: boolean }[] = [
  { id: 'A', name: 'Classic', ready: true }, { id: 'B', name: 'Sidebar', ready: true },
  { id: 'C', name: 'Cinematic', ready: true }, { id: 'D', name: 'Process Timeline', ready: true },
  { id: 'E', name: 'Bento Mosaic', ready: true }, { id: 'F', name: 'Minimal', ready: true },
];
```

- [ ] **Step 2: Write the pure-logic registry test** (`.test.ts`, node env — no rendering)

```ts
// src/components/templates/__tests__/service-template-layouts.test.ts
import { describe, it, expect } from 'vitest';
import { serviceTemplateLayouts, SERVICE_TEMPLATE_LAYOUT_META } from '../service-skins-templated';

describe('service template layout registry', () => {
  it('maps all six A–F ids to distinct layout components', () => {
    const ids = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
    for (const id of ids) expect(typeof serviceTemplateLayouts[id]).toBe('function');
    const comps = ids.map((id) => serviceTemplateLayouts[id]);
    expect(new Set(comps).size).toBe(6); // no two ids share a component (no Classic aliasing)
  });
  it('marks all six layouts ready', () => {
    expect(SERVICE_TEMPLATE_LAYOUT_META).toHaveLength(6);
    expect(SERVICE_TEMPLATE_LAYOUT_META.every((m) => m.ready)).toBe(true);
  });
});
```

- [ ] **Step 3: Run — expect PASS**

Run: `npx vitest run src/components/templates/__tests__/service-template-layouts.test.ts`

- [ ] **Step 4: Full build** — `npm run build`. Expected: PASS (Part 2 is complete and additive). Commit — `feat: wire six service page template layouts`

---

## Task 10: Verify Part 2 in the running app (manual)

- [ ] Start `npm run dev`. In `/admin` → **Service Pages**, apply the `serviceclassic`… note: the picker still shows the *old* per-service template editor (replaced in Part 1). For now, temporarily set a service's `page.templateId` to each of the six ids in `site-content.json` and load `/services/<slug>` to eyeball layouts A–F against the design table. Revert the temp edit. (This is a smoke check; the real picker lands in Part 1.)

---

# PART 1 — Services → Project Model (migration)

> Ordered so `npm run build` passes at every commit: (1) add card fields + migration without removing anything; (2) rewire public surfaces; (3) admin CRUD + wizard; (4) delete skins + slim types + JSON.

## Task 11: Add card fields to the service item (non-breaking)

**Files:**
- Modify: `src/lib/types.ts`

**Interfaces:**
- Produces: `ServiceDetail` gains `icon?: string`, `desc?: string`, `image?: string` (optional for now — filled by migration; fat fields stay until Task 20).

- [ ] **Step 1: Edit `ServiceDetail`** — add three optional card fields near the top:

```ts
export interface ServiceDetail {
  slug: string;
  name: string;
  icon?: string;   // card + menu icon (Material Symbol) — filled by migration
  desc?: string;   // card blurb (= heroSub) — filled by migration
  image?: string;  // card image (= heroImg) — filled by migration
  visible?: boolean;
  page?: ServicePage;
  // ...existing fat fields unchanged (still read by skins until Part 1 cleanup)
  heroTitle: string; heroSub: string; heroImg: string; /* …etc unchanged… */
}
```

- [ ] **Step 2: `npx tsc --noEmit`** — PASS (purely additive). Commit — `feat: add derived card fields to service item`

---

## Task 12: `migrateServices()` back-fill

**Files:**
- Create: `src/lib/migrate-services.ts`
- Test: `src/lib/__tests__/migrate-services.test.ts`
- Modify: `src/lib/content-defaults.ts`

**Interfaces:**
- Consumes: `ServiceDetail`, `serviceTemplates`, `serviceMetaFromDetail`, `seedValues`.
- Produces: `migrateServices(list: ServiceDetail[]): ServiceDetail[]` (idempotent — entries with `page` set are only card-field-filled, never re-seeded); `SERVICE_ICON: Record<string, string>` (slug → Material Symbol, the eight known services).

Legacy fat entry → `{ …, icon, desc, image, page }` where `page` is the `serviceclassic` template seeded from the fat fields (features/approach/ba/showcase/quote/author mapped from `features`/`midList`/before-after/`showcase`/`quote`/`quoteName`).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/migrate-services.test.ts
import { describe, it, expect } from 'vitest';
import { migrateServices } from '../migrate-services';
import type { ServiceDetail } from '../types';

const legacy = {
  slug: 'interior', name: 'Interior Painting',
  heroTitle: 'Interior', heroSub: 'Flawless interiors', heroImg: 'https://x/h.jpg',
  introTitle: 'What’s Included', introA: 'Intro a', introB: '',
  features: [{ icon: 'brush', title: 'Walls', desc: 'x' }],
  midEyebrow: '', midTitle: '', midImage: 'https://x/m.jpg', midParas: [], midList: [{ /* n/a */ }] as unknown as string[],
  beforeImg: 'https://x/b.jpg', afterImg: 'https://x/a.jpg',
  gallery: [], showcase: [{ title: 'S', blurb: 'b', img: 'https://x/s.jpg' }],
  quote: 'Great', quoteName: 'Jo', quoteSub: '',
} as unknown as ServiceDetail;

describe('migrateServices', () => {
  it('adds a serviceclassic page + card fields to a legacy entry', () => {
    const [m] = migrateServices([legacy]);
    expect(m.page?.templateId).toBe('serviceclassic');
    expect(m.icon).toBe('format_paint');     // from SERVICE_ICON['interior']
    expect(m.desc).toBe('Flawless interiors'); // = heroSub
    expect(m.image).toBe('https://x/h.jpg');   // = heroImg
    expect(m.page?.meta.slug).toBe('interior');
  });
  it('is idempotent — keeps an existing page', () => {
    const withPage = { ...legacy, page: { templateId: 'servicebento', meta: { ...({} as never) }, values: {} } } as unknown as ServiceDetail;
    const [m] = migrateServices([withPage]);
    expect(m.page?.templateId).toBe('servicebento'); // unchanged
    expect(m.icon).toBe('format_paint');             // card fields still filled
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (module missing)

Run: `npx vitest run src/lib/__tests__/migrate-services.test.ts`

- [ ] **Step 3: Implement `migrate-services.ts`**

```ts
import type { ServiceDetail } from './types';
import type { TemplateValue } from './templates/types';
import { serviceTemplates } from './templates/service-templates';
import { serviceMetaFromDetail } from './templates/service-prefill';

// Icons for the original eight services (formerly src/data/services.ts). Used to
// back-fill the card icon when migrating a legacy fat service entry.
export const SERVICE_ICON: Record<string, string> = {
  interior: 'format_paint', exterior: 'home_work', roof: 'roofing', stripping: 'cleaning_services',
  plastering: 'layers', wood: 'forest', building: 'construction', flooring: 'grid_on',
};

const val = (v: unknown): TemplateValue => (v as TemplateValue) ?? '';

// Build serviceclassic template values from a legacy fat service entry.
function valuesFromLegacy(sd: ServiceDetail): Record<string, TemplateValue> {
  return {
    features: val(sd.features),
    approach: (sd.midList ?? []).map((t) => ({ t: String(t) })),
    ba: { before: sd.beforeImg ?? '', after: sd.afterImg ?? '' },
    showcase: val(sd.showcase),
    quote: sd.quote ?? '',
    author: sd.quoteName ?? '',
  };
}

// Fill card fields + a serviceclassic page for any legacy entry missing `page`.
// Idempotent: entries that already have a page keep it; only card fields are ensured.
export function migrateServices(list: ServiceDetail[]): ServiceDetail[] {
  return list.map((sd) => {
    const icon = sd.icon || SERVICE_ICON[sd.slug] || 'design_services';
    const desc = sd.desc || sd.heroSub || '';
    const image = sd.image || sd.heroImg || '';
    if (sd.page) return { ...sd, icon, desc, image };
    const def = serviceTemplates.serviceclassic;
    const meta = serviceMetaFromDetail(sd, def); // now includes slug + icon
    return { ...sd, icon, desc, image, page: { templateId: 'serviceclassic', meta: { ...meta, icon }, values: valuesFromLegacy(sd) } };
  });
}
```

- [ ] **Step 4: Run — expect PASS**
- [ ] **Step 5: Call it from `withContentDefaults`**

```ts
// content-defaults.ts — after deepMerge, heal the services list
import { migrateServices } from './migrate-services';
export function withContentDefaults(partial: unknown): SiteContent {
  const merged = deepMerge(DEFAULT_CONTENT, partial);
  return { ...merged, serviceDetails: migrateServices(merged.serviceDetails ?? []) };
}
```

- [ ] **Step 6: `npm run build`** — PASS. Commit — `feat: back-fill legacy services into template pages at load`

---

## Task 13: ServiceDetailPage → template-only

**Files:**
- Modify: `src/pages/ServiceDetailPage.tsx`

Because `migrateServices` guarantees a `page`, drop the skin fallback. (Keep a defensive `Navigate` if a template id is somehow unknown.)

- [ ] **Step 1: Replace the body**

```tsx
import { Navigate, useParams } from 'react-router-dom';
import { useSiteContent } from '../lib/site-content-context';
import { serviceTemplates } from '../lib/templates/service-templates';
import { ServiceTemplateRenderer } from '../components/templates/ServiceTemplateRenderer';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { contact, serviceDetails } = useSiteContent();
  const s = serviceDetails.find((d) => d.slug === slug);
  if (!s || s.visible === false || !s.page) return <Navigate to="/services" replace />;
  const def = serviceTemplates[s.page.templateId];
  if (!def) return <Navigate to="/services" replace />;
  return <ServiceTemplateRenderer layout={def.layout} meta={s.page.meta} values={s.page.values} sections={def.sections} contact={contact} />;
}
```

- [ ] **Step 2: `npm run build`** — PASS (no longer imports `service-skins`/`serviceStyle`). Commit — `feat: render service detail pages template-only`

---

## Task 14: ServiceCard + ServicesPage grid from serviceDetails

**Files:**
- Modify: `src/components/cards/ServiceCard.tsx`, `src/pages/ServicesPage.tsx`

**Interfaces:**
- `ServiceCard` now takes `service: ServiceDetail` and reads `icon/name/desc` (features removed from the card — service content lives on the detail page).

- [ ] **Step 1: ServiceCard**

```tsx
import { Link } from 'react-router-dom';
import type { ServiceDetail } from '../../lib/types';
import { Icon } from '../ui/Icon';

export function ServiceCard({ service, subtitle }: { service: ServiceDetail; subtitle?: string }) {
  return (
    <Link to={`/services/${service.slug}`} className="block bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(28,28,25,0.06)] group hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon name={service.icon || 'design_services'} />
      </div>
      <h3 className="text-xl font-bold mb-3 font-headline">{service.name}</h3>
      <p className="text-on-surface-variant leading-relaxed mb-6">{subtitle ?? service.desc}</p>
      <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
        Learn more <Icon name="arrow_forward" className="text-base" />
      </span>
    </Link>
  );
}
```

- [ ] **Step 2: ServicesPage grid** — replace the `SERVICES`-based map (remove `import { SERVICES }`):

```tsx
{serviceDetails.filter((s) => s.visible !== false).map((s) => (
  <ServiceCard key={s.slug} service={s} subtitle={s.heroSub} />
))}
```

- [ ] **Step 3: `npm run build`** — PASS. Commit — `feat: source services grid + card from CMS list`

---

## Task 15: Footer + Header + ServicesDropdown derive from serviceDetails (flat)

**Files:**
- Modify: `src/components/layout/Footer.tsx`, `Header.tsx`, `ServicesDropdown.tsx`

- [ ] **Step 1: Footer** — replace `import { SERVICES }` with `useSiteContent().serviceDetails`, filter visible:

```tsx
const { contact, serviceDetails } = useSiteContent();
// …Services column:
{serviceDetails.filter((s) => s.visible !== false).map((s) => (
  <li key={s.slug}><Link to={`/services/${s.slug}`} className="text-slate-600 hover:text-primary transition-colors text-sm">{s.name}</Link></li>
))}
```

- [ ] **Step 2: ServicesDropdown** — flat list from `serviceDetails` (drop painting/speciality grouping + `SERVICE_LINKS`):

```tsx
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useSiteContent } from '../../lib/site-content-context';

export function ServicesDropdown() {
  const { serviceDetails } = useSiteContent();
  const shown = serviceDetails.filter((s) => s.visible !== false);
  return (
    <div className="relative group">
      <button className="flex items-center gap-0.5 text-slate-700 hover:text-primary transition-colors font-headline cursor-pointer bg-transparent border-none p-0 text-base">
        Services <Icon name="expand_more" className="text-base leading-none mt-0.5" />
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white rounded-xl shadow-2xl border border-slate-100 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
          {shown.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-red-50 hover:text-primary transition-colors font-headline">
              <Icon name={s.icon || 'design_services'} className="text-base" />{s.name}
            </Link>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-3">
          <Link to="/services" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors">
            <Icon name="grid_view" className="text-primary" />
            <div><div className="font-headline font-bold text-sm text-slate-700">All Services</div><div className="text-xs text-on-surface-variant">Browse the full range</div></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Header `MobileServices`** — replace `SERVICE_LINKS` flatten with `serviceDetails` (remove `SERVICE_LINKS` import + `slugFromServicePath`):

```tsx
function MobileServices({ onNavigate }: { onNavigate: () => void }) {
  const { serviceDetails } = useSiteContent();
  const links = serviceDetails.filter((s) => s.visible !== false);
  // …render each: to={`/services/${s.slug}`}, icon={s.icon || 'design_services'}, label={s.name}
}
```

(Read `Header.tsx:83-110` first; keep its existing markup, swap only the data source + `.map` fields. Remove now-unused `isServiceVisible`/`slugFromServicePath` imports there.)

- [ ] **Step 4: `npm run build`** — PASS. Commit — `feat: derive services menu + footer from CMS list`

---

## Task 16: HomePage "Our Services" cards from serviceDetails

**Files:**
- Modify: `src/pages/HomePage.tsx` (services block ~lines 295–370), `src/lib/types.ts` (`HomeServices`), `src/pages/admin/sections/HomeEditor.tsx`

- [ ] **Step 1: Read `HomePage.tsx:290-372`.** Replace the `services.cards.map(...)` block so cards come from visible `serviceDetails` (image ← `image`/`heroImg`, title ← `name`, desc ← `desc`/`heroSub`, link ← `/services/${slug}`). Keep the section heading + CTA from `services.title/ctaTitle/ctaText/ctaLabel`.

```tsx
{serviceDetails.filter((s) => s.visible !== false).slice(0, 6).map((s) => (
  <Link key={s.slug} to={`/services/${s.slug}`} className="/* keep existing card classes */">
    <img src={s.image || s.heroImg} alt={s.name} className="/* keep */" />
    <h3 className="/* keep */">{s.name}</h3>
    <p className="/* keep */">{s.desc || s.heroSub}</p>
  </Link>
))}
```

- [ ] **Step 2:** In `src/lib/types.ts`, drop `cards` from `HomeServices`:

```ts
export interface HomeServices { title: string; ctaTitle: string; ctaText: string; ctaLabel: string; }
```

- [ ] **Step 3:** In `HomeEditor.tsx`, remove the service-cards sub-editor (the block editing `services.cards`); keep title/CTA fields. (Read the file; delete only the cards `StringList`/`ItemCard` group.)
- [ ] **Step 4:** In `content-schema.ts`, delete the `hm.services?.cards` image-validation loop (lines ~55–57).
- [ ] **Step 5: `npm run build`** — PASS. Commit — `feat: homepage service cards derive from CMS list`

---

## Task 17: Admin store — service CRUD + serviceCompose slice

**Files:**
- Modify: `src/pages/admin/admin-content-store.tsx`, `src/pages/admin/useAdminContent.ts`
- Test: `src/pages/admin/__tests__/service-compose-reducer.test.ts`

**Interfaces:**
- Produces on the store API: `toggleService(slug)`, `deleteService(slug)`, `startServiceCompose()`, `pickServiceTemplate(id)`, `backServiceTemplates()`, `updateServiceComposeMeta(k,v)`, `updateServiceComposeValue(k,v)`, `editServiceComposed(slug)`, `publishServiceComposed()`. New state slice `serviceCompose: { step; templateId: ServiceTemplateId|null; meta: ServiceMeta|null; values|null; editingId: string|null }`.
- On publish, derive card fields from meta: `name←meta.name, icon←meta.icon, desc←meta.heroSub, image←meta.heroImg, slug←meta.slug` and store `page`.

- [ ] **Step 1: `useAdminContent.ts`** — drop `serviceStyle`; update `AdminSection`:

```ts
export type AdminSection = 'overview' | 'projects' | 'blog' | 'compose' | 'home' | 'about' | 'services' | 'serviceCompose' | 'areas' | 'contact' | 'privacy' | 'media' | 'settings';
// SiteContent: remove `serviceStyle: ServiceStyleId;` line and its import.
```

- [ ] **Step 2: Write the failing reducer test**

```ts
// src/pages/admin/__tests__/service-compose-reducer.test.ts
import { describe, it, expect } from 'vitest';
import { reducer, initState } from '../admin-content-store';

describe('service compose', () => {
  it('publishes a new service with derived card fields', () => {
    let s = initState();
    s = reducer(s, { t: 'SVC_COMPOSE_PICK', id: 'servicesidebar' });
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'slug', val: 'decks' });
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'name', val: 'Deck Staining' });
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'heroSub', val: 'Weatherproof decks' });
    s = reducer(s, { t: 'SVC_COMPOSE_PUBLISH', slug: 'decks' });
    const added = s.content.serviceDetails.find((x) => x.slug === 'decks')!;
    expect(added.name).toBe('Deck Staining');
    expect(added.desc).toBe('Weatherproof decks'); // = heroSub
    expect(added.page?.templateId).toBe('servicesidebar');
  });
});
```

- [ ] **Step 3: Run — expect FAIL**, then implement. Add to the store (mirror the project `compose` slice exactly, swapping `projectTemplates`→`serviceTemplates`, `ProjectMeta`→`ServiceMeta`, no `category`; key by `slug`). Key additions:

```ts
// AdminState:
serviceCompose: { step: 'pick' | 'build'; templateId: ServiceTemplateId | null; meta: ServiceMeta | null; values: Record<string, TemplateValue> | null; editingId: string | null };

// Action union: add
| { t: 'TOGGLE_SERVICE'; slug: string }
| { t: 'DELETE_SERVICE'; slug: string }
| { t: 'SVC_COMPOSE_START' } | { t: 'SVC_COMPOSE_PICK'; id: ServiceTemplateId } | { t: 'SVC_COMPOSE_BACK' }
| { t: 'SVC_COMPOSE_META'; key: keyof ServiceMeta; val: string } | { t: 'SVC_COMPOSE_VALUE'; key: string; val: TemplateValue }
| { t: 'SVC_COMPOSE_EDIT'; slug: string } | { t: 'SVC_COMPOSE_PUBLISH'; slug: string };

// reducer cases:
case 'TOGGLE_SERVICE': return { ...state, content: { ...state.content, serviceDetails: state.content.serviceDetails.map((x) => x.slug === a.slug ? { ...x, visible: x.visible === false } : x) }, dirty: true, toast: 'Visibility updated' };
case 'DELETE_SERVICE': return { ...state, content: { ...state.content, serviceDetails: state.content.serviceDetails.filter((x) => x.slug !== a.slug) }, dirty: true, toast: 'Deleted — click Save to publish' };
case 'SVC_COMPOSE_START': return { ...state, serviceCompose: { step: 'pick', templateId: null, meta: null, values: null, editingId: null } };
case 'SVC_COMPOSE_PICK': { const def = serviceTemplates[a.id]; return { ...state, serviceCompose: { step: 'build', templateId: a.id, meta: { ...def.defaultMeta }, values: seedValues(def.sections), editingId: null } }; }
case 'SVC_COMPOSE_BACK': return { ...state, serviceCompose: { step: 'pick', templateId: null, meta: null, values: null, editingId: null } };
case 'SVC_COMPOSE_META': return state.serviceCompose.meta ? { ...state, serviceCompose: { ...state.serviceCompose, meta: { ...state.serviceCompose.meta, [a.key]: a.val } } } : state;
case 'SVC_COMPOSE_VALUE': return state.serviceCompose.values ? { ...state, serviceCompose: { ...state.serviceCompose, values: { ...state.serviceCompose.values, [a.key]: a.val } } } : state;
case 'SVC_COMPOSE_EDIT': { const svc = state.content.serviceDetails.find((x) => x.slug === a.slug); if (!svc?.page) return state; return { ...state, serviceCompose: { step: 'build', templateId: svc.page.templateId, meta: { ...svc.page.meta }, values: clone(svc.page.values), editingId: svc.slug } }; }
case 'SVC_COMPOSE_PUBLISH': {
  const c = state.serviceCompose; if (!c.templateId || !c.meta || !c.values) return state;
  const page = { templateId: c.templateId, meta: c.meta, values: c.values };
  const fields = { slug: c.meta.slug, name: c.meta.name, icon: c.meta.icon, desc: c.meta.heroSub, image: c.meta.heroImg };
  const reset = { step: 'pick' as const, templateId: null, meta: null, values: null, editingId: null };
  if (c.editingId) { const id = c.editingId; const serviceDetails = state.content.serviceDetails.map((x) => x.slug === id ? { ...x, ...fields, page } : x); return { ...state, content: { ...state.content, serviceDetails }, dirty: true, serviceCompose: reset, toast: 'Service updated — click Save to publish' }; }
  const item = { ...fields, visible: true, page } as ServiceDetail;
  return { ...state, content: { ...state.content, serviceDetails: [item, ...state.content.serviceDetails] }, dirty: true, serviceCompose: reset, toast: 'Service added — click Save to publish' };
}

// initState(): add serviceCompose: { step: 'pick', templateId: null, meta: null, values: null, editingId: null }
// Remove: SET_SERVICE_STYLE, applyServiceTemplate, clearServiceTemplate, updateServicePageMeta, updateServicePageValue, updateServiceDetails, and their API entries + imports (serviceMetaFromDetail no longer needed here).
// API object: add the nine helpers dispatching the actions above.
```

- [ ] **Step 4: Run — expect PASS.** `npx vitest run src/pages/admin/__tests__/service-compose-reducer.test.ts`
- [ ] **Step 5: `npm run build`** — will FAIL until AdminPage/Sidebar stop referencing removed helpers + `servicePages`. That's Task 18. If splitting commits, do Steps 1–4 here and commit after Task 18 builds green. Commit (with Task 18) — `feat: add service CRUD + compose to admin store`

---

## Task 18: ServicesTable + service compose wizard UI + admin wiring

**Files:**
- Create: `src/pages/admin/sections/ServicesTable.tsx`, `service-compose/ServiceComposeWizard.tsx`, `ServiceTemplatePicker.tsx`, `ServiceTemplateForm.tsx`, `ServiceTemplatePreview.tsx`
- Modify: `src/pages/admin/AdminSidebar.tsx`, `AdminPage.tsx`

- [ ] **Step 1: ServicesTable** — clone `ProjectsTable` (reuse `VisPill`), columns thumbnail/name/slug/status/actions, header buttons "New from template":

```tsx
import { Icon } from '../../../components/ui/Icon';
import { VisPill } from './ProjectsTable';
import type { ServiceDetail } from '../../../lib/types';

interface Props { services: ServiceDetail[]; onToggle?: (slug: string) => void; onEdit?: (slug: string) => void; onDelete?: (slug: string) => void; onNewFromTemplate?: () => void; }
const COLS = 'grid grid-cols-[64px_minmax(150px,1fr)_150px_112px_112px] gap-3.5 min-w-[736px]';

export function ServicesTable({ services, onToggle, onEdit, onDelete, onNewFromTemplate }: Props) {
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl overflow-x-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee9e1] gap-2">
        <div className="font-bold text-[15px]">All Services</div>
        <button onClick={onNewFromTemplate} className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-lg font-bold text-[13px]">
          <Icon name="auto_awesome" className="text-[17px]" /> New from template
        </button>
      </div>
      <div className={COLS + ' px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#9b9488] border-b border-[#eee9e1]'}>
        <div /><div>Name</div><div>Slug</div><div>Status</div><div className="text-right">Actions</div>
      </div>
      {services.map((s) => (
        <div key={s.slug} className={COLS + ' px-5 py-3 items-center border-b border-[#f2eee7]'}>
          <div className="w-14 h-12 rounded-lg overflow-hidden bg-surface-container"><img src={s.image || s.heroImg} alt="" className="w-full h-full object-cover" /></div>
          <div className="font-bold text-sm truncate">{s.name}</div>
          <div className="text-xs text-[#8a8377]">/{s.slug}</div>
          <div><VisPill visible={s.visible !== false} onClick={onToggle ? () => onToggle(s.slug) : undefined} /></div>
          <div className="flex justify-end gap-2">
            <button onClick={onEdit ? () => onEdit(s.slug) : undefined} className="border border-[#e2ddd4] bg-white w-[34px] h-[34px] rounded-lg text-on-surface-variant" aria-label={'Edit ' + s.name}><Icon name="edit" className="text-lg" /></button>
            <button onClick={onDelete ? () => { if (window.confirm(`Delete "${s.name}"?`)) onDelete(s.slug); } : undefined} className="border border-[#e7c9c6] bg-white w-[34px] h-[34px] rounded-lg text-[#b94b40]" aria-label={'Delete ' + s.name}><Icon name="delete" className="text-lg" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: ServiceTemplatePicker** — clone `TemplatePicker` using `serviceTemplateList` + `ServiceTemplateId` (drop the inline preview panel for now; keep "Use this template"). Cards from `t.name/icon/desc/includes`.
- [ ] **Step 3: ServiceTemplateForm** — clone `TemplateForm` for `ServiceMeta`: a "Service details" card with `slug` (Field + inline warning text `Changing the slug changes this page's URL and breaks existing links.` shown when `editing`), `name`, `icon`, `heroTitle`, `heroSub`, `heroImg` (upload="image"), `introTitle`, `intro` (area) — then the shared `sections.map` block copied verbatim from `TemplateForm` (no `category`).
- [ ] **Step 4: ServiceTemplatePreview** — clone `TemplatePreview` using `ServiceTemplateRenderer` + `ServiceMeta`/`ServiceStyleId`.
- [ ] **Step 5: ServiceComposeWizard** — clone `ComposeWizard` using `serviceTemplates`, `store.serviceCompose`, the service helpers; header button label "Add service"/"Save changes"; pass `def.layout` to the preview.

```tsx
import { Icon } from '../../../../components/ui/Icon';
import { useAdminStore } from '../../admin-content-store';
import { serviceTemplates } from '../../../../lib/templates/service-templates';
import { ServiceTemplatePicker } from './ServiceTemplatePicker';
import { ServiceTemplateForm } from './ServiceTemplateForm';
import { ServiceTemplatePreview } from './ServiceTemplatePreview';

export function ServiceComposeWizard() {
  const store = useAdminStore();
  const c = store.state.serviceCompose;
  if (c.step === 'pick' || !c.templateId || !c.meta || !c.values) return <ServiceTemplatePicker onPick={store.pickServiceTemplate} />;
  const def = serviceTemplates[c.templateId];
  const editing = !!c.editingId;
  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <button onClick={store.backServiceTemplates} className="inline-flex items-center gap-1.5 border border-[#e2ddd4] bg-white rounded-lg px-3.5 py-2 text-sm font-bold"><Icon name="arrow_back" className="text-[18px]" /> {editing ? 'Cancel' : 'Templates'}</button>
        <div className="flex-1 min-w-0"><div className="font-headline font-extrabold">{editing ? 'Edit — ' : ''}{def.name}</div><div className="text-xs text-[#8a8377]">Fill the fields — the preview updates live.</div></div>
        <button onClick={store.publishServiceComposed} className="bg-primary text-white rounded-lg px-5 py-2.5 font-bold text-sm">{editing ? 'Save changes' : 'Add service'}</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-6 items-start">
        <ServiceTemplateForm meta={c.meta} values={c.values} sections={def.sections} onMeta={store.updateServiceComposeMeta} onValue={store.updateServiceComposeValue} editing={editing} />
        <ServiceTemplatePreview meta={c.meta} values={c.values} sections={def.sections} layout={def.layout} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: AdminSidebar** — replace the `servicePages` entry with two, mirroring projects:

```ts
{ key: 'services', label: 'Services', icon: 'design_services', count: content.serviceDetails.length },
{ key: 'serviceCompose', label: 'Service Templates', icon: 'dashboard_customize' },
```

- [ ] **Step 7: AdminPage** — add to `META`: `services: ['Services','Manage the services shown on your site']`, `serviceCompose: ['Service Templates','Pick a template and build a service page']`; remove `servicePages`. Swap the render:

```tsx
{section === 'services' && (
  <ServicesTable
    services={content.serviceDetails}
    onToggle={(slug) => store.toggleService(slug)}
    onEdit={(slug) => { store.editServiceComposed(slug); setSection('serviceCompose'); }}
    onDelete={(slug) => store.deleteService(slug)}
    onNewFromTemplate={() => { store.startServiceCompose(); setSection('serviceCompose'); }}
  />
)}
{section === 'serviceCompose' && <ServiceComposeWizard />}
```

Remove the `ServiceDetailsEditor` import + its `servicePages` render line.

- [ ] **Step 8: `npm run build`** — PASS. Commit — `feat: services CRUD table + compose wizard in admin`

---

## Task 19: Slug validation on publish

**Files:**
- Modify: `src/lib/content-schema.ts`
- Test: `src/lib/__tests__/service-slug-validation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { validateContent } from '../content-schema';
import { DEFAULT_CONTENT } from '../content-defaults';

const base = () => JSON.parse(JSON.stringify(DEFAULT_CONTENT));
describe('service slug validation', () => {
  it('rejects duplicate slugs', () => {
    const c = base();
    c.serviceDetails = [c.serviceDetails[0], { ...c.serviceDetails[0] }];
    expect(validateContent(c).some((e) => /[Dd]uplicate service/.test(e))).toBe(true);
  });
  it('rejects a bad slug format', () => {
    const c = base(); c.serviceDetails[0].slug = 'Bad Slug';
    expect(validateContent(c).some((e) => /slug/.test(e))).toBe(true);
  });
});
```

- [ ] **Step 2: Replace the `serviceDetails` validation block** (content-schema.ts lines ~60–73) with the template-item rules + drop the `serviceStyle` check:

```ts
if (Array.isArray(c.serviceDetails)) {
  const slugs = new Set<string>();
  c.serviceDetails.forEach((sd, i) => {
    const name = sd.name || sd.slug || `#${i + 1}`;
    if (!sd.slug?.trim()) errors.push(`Service ${name} is missing a slug.`);
    else if (!/^[a-z0-9-]+$/.test(sd.slug)) errors.push(`Service ${name} slug must be lowercase letters, numbers and hyphens.`);
    else if (slugs.has(sd.slug)) errors.push(`Duplicate service slug "${sd.slug}".`);
    else slugs.add(sd.slug);
    if (!sd.page) errors.push(`Service ${name} must be built from a template.`);
    else errors.push(...validateServicePage(sd.page, name));
  });
}
// (delete the old fat-field checks + the `serviceStyle` line entirely)
```

- [ ] **Step 3: Run tests — PASS.** `npm run build` — PASS. Commit — `feat: validate service slugs on publish`

---

## Task 20: Delete the skin system + slim types + migrate JSON

**Files:**
- Delete: `src/data/services.ts`, `src/components/services/{service-skins,ServiceSkinA,ServiceSkinB,BeforeAfter}.tsx`, `src/pages/admin/sections/{ServiceStyleEditor,ServiceDetailsEditor,ServiceTemplateEditor}.tsx`
- Modify: `src/lib/types.ts` (remove `Service`; slim `ServiceDetail`), `src/data/nav.ts` (remove `SERVICE_LINKS`), `src/content/site-content.json`
- Delete obsolete tests: `src/lib/templates/__tests__/service-prefill.test.ts` (if it asserts fat-field prefill — update instead if still valid), any skin test.

- [ ] **Step 1: Grep for lingering references** before deleting:

Run: `cd /Users/lamvh/src/thaiviet && grep -rnE "from '.*data/services'|SERVICE_LINKS|serviceStyle|ServiceStyleEditor|ServiceDetailsEditor|ServiceTemplateEditor|service-skins|ServiceSkin|components/services/BeforeAfter" src`
Expected after Tasks 13–19: references only inside the files being deleted. Fix any stray consumer first.

- [ ] **Step 2: Delete the files** listed above.
- [ ] **Step 3: Slim `ServiceDetail`** in `types.ts` to the final shape (make `page` required; drop fat fields + `ServiceFeature`/`ServiceShowcase` if unused elsewhere; remove `Service`):

```ts
export interface ServiceDetail {
  slug: string;
  name: string;
  icon: string;
  desc: string;
  image: string;
  visible?: boolean;
  page: ServicePage;
}
```

(Grep `ServiceFeature|ServiceShowcase|\bService\b` to confirm no other consumers before removing.)

- [ ] **Step 4: Migrate `site-content.json`** — for each `serviceDetails` entry: ensure `icon`/`desc`/`image` + a `page` (run the app once with the migration, copy the healed `serviceDetails` from a `console.log(JSON.stringify(migrateServices(bundled.serviceDetails)))` helper, or hand-edit using Task 12's mapping). Remove the top-level `"serviceStyle"` key and `home.services.cards`. Ensure every entry validates (Task 19 rules).
- [ ] **Step 5: Fix `service-prefill.ts` usage** — it's now only used by `migrate-services.ts`; keep it. Its `serviceMetaFromDetail(sd, def)` reads `sd.introA` etc. — since the slimmed type drops those, change the migration to read legacy fields via a `LegacyServiceDetail` interface local to `migrate-services.ts` (fat fields optional) so `migrateServices` still compiles against raw DB JSON:

```ts
// migrate-services.ts — type the input loosely, since it runs on pre-migration JSON
type Legacy = ServiceDetail & { heroSub?: string; heroImg?: string; introA?: string; features?: unknown; midList?: unknown[]; beforeImg?: string; afterImg?: string; showcase?: unknown; quote?: string; quoteName?: string };
export function migrateServices(list: Legacy[]): ServiceDetail[] { /* …unchanged logic… */ }
```

And `serviceMetaFromDetail` param type becomes `Legacy`/loosened accordingly (move it into `migrate-services.ts` or widen its signature). Delete `service-prefill.ts` if fully inlined.

- [ ] **Step 6: Run everything** — `npx vitest run` (all pass) then `npm run build` (PASS). Commit — `refactor: remove legacy service skin system; services are template-only`

---

## Task 21: Docs sync

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Update `README.md`: routes (services now CMS-CRUD, template-only), component tree (`ServicesTable`, `service-compose/*`, six `ServiceLayout*`), content-block map (services derive the grid/menu/footer/home-cards; `serviceStyle` + `home.services.cards` removed; `serviceDetails[]` is the CRUD list). Note the six service templates A–F in the Templates section.
- [ ] **Step 2:** No commit needed beyond staging (per git rule). Confirm `npm run build` still green.

---

## Self-Review (completed during authoring)

- **Spec coverage:** Part 1 decisions 1–7 → Tasks 11–21 (remove skins T20; CRUD T17–18; editable slugs T18/19; flat menu T15; home cards T16; duplicated wizard T17–18; slug warning T18 Step 3). Part 2 six layouts → Tasks 1–9. Migration path → T12. ✔
- **Type consistency:** `serviceCompose` action names (`SVC_COMPOSE_*`) used consistently T17–18; `serviceTemplateLayouts` keyed `ServiceStyleId` A–F T9; `ServiceMeta` gains `slug`/`icon` T1 and is consumed T2/T3/T17/T18. ✔
- **Placeholder scan:** layout tasks carry concrete JSX + class names from the design table; logic tasks carry full code. The one soft spot — `Header.tsx`/`HomePage.tsx` edits say "read first, swap data source" because their surrounding markup is long; the exact fields to swap are enumerated. ✔
- **Known risk:** `migrate-services.ts` runs on pre-migration JSON, so it's typed against a loosened `Legacy` shape (T20 Step 5) — do not type its input as the slimmed `ServiceDetail`.
