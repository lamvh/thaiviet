# Service Template System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let service detail pages be built from a template catalog (pick a template, fill data) like projects — reusing the project-template engine, replacing the `serviceDetails + skin` render gradually.

**Architecture:** Add `page?: ServicePage` to `ServiceDetail`. `/services/:slug` renders `page` through `ServiceTemplateRenderer` (dispatch by the template's `layout` skin), else falls back to the existing `serviceSkins[serviceStyle]`. Reuse `SectionDef`/`SectionView` (extended with 3 service styles). Starter Layout A reproduces Skin A so migrating a service is visually lossless. Admin applies a template to an existing service in-context (Service Pages editor).

**Tech Stack:** React 18 + TypeScript (strict), Vite, Tailwind, Vitest (node env, pure-logic tests), Supabase-backed CMS merged over `site-content.json`.

## Global Constraints

- **Git:** Do NOT auto-commit. Leave changes as working-tree edits for the user to commit (project rule in `CLAUDE.md`). The `Commit` steps below are reference messages for when the user asks — stage/commit only on request.
- **Build gate:** `npm run build` (runs `tsc` strict + `vite build`) MUST pass; a change is not done until it does.
- **Tests:** `npx vitest run` — tests live in `src/**/*.test.ts`, `environment: 'node'`, **pure logic only** (no component rendering / RTL). Do not add RTL/jsdom.
- **Content keys:** never rename a content key without a migration path; DB rows are merged over `site-content.json` via `withContentDefaults`. New fields must be optional/back-compatible.
- **Images:** every user-facing image URL must be validated `https://` at publish (see `content-schema.ts` / `validate-page.ts` patterns).
- **Naming:** components PascalCase (`ServiceLayoutClassic.tsx`); modules kebab/lowercase (`service-templates.ts`). No plan/phase refs in code comments.
- **Reuse:** mirror the project-template equivalents — `src/lib/templates/project-templates.ts`, `src/components/templates/ProjectTemplateRenderer.tsx`, `project-skins.tsx`, `project-layouts/`, `validate-page.ts`, the compose wizard under `src/pages/admin/sections/compose/`.

---

## File Structure

**Create:**
- `src/lib/templates/service-templates.ts` — `serviceTemplateList` + `serviceTemplates` map (starter template, layout A).
- `src/components/templates/service-template-layouts/shared.tsx` — `ServiceLayoutProps`, hero, CTA, helpers.
- `src/components/templates/service-template-layouts/ServiceLayoutClassic.tsx` — Layout A (reproduces Skin A).
- `src/components/templates/service-skins-templated.tsx` — `serviceTemplateLayouts` registry + `SERVICE_TEMPLATE_LAYOUT_META`.
- `src/components/templates/ServiceTemplateRenderer.tsx` — thin dispatcher.
- `src/lib/templates/__tests__/validate-service-page.test.ts`, `service-templates.test.ts`, `service-prefill.test.ts`.

**Modify:**
- `src/lib/templates/types.ts` — `ServiceMeta`, `ServicePage`, `ServiceTemplateId`, `ServiceTemplateDef`; extend `SectionStyle`.
- `src/lib/types.ts` — add `page?: ServicePage` to `ServiceDetail`; re-export new types.
- `src/components/templates/template-sections.tsx` — add `features` / `approach` / `showcase` render branches.
- `src/lib/templates/validate-page.ts` — add `validateServicePage`.
- `src/lib/content-schema.ts` — validate each service `page`.
- `src/pages/ServiceDetailPage.tsx` — render priority (`page` → renderer).
- `src/pages/admin/sections/ServiceDetailsEditor.tsx` — "Use a template" flow.
- `src/pages/admin/admin-content-store.tsx` — service-page actions + prefill helper.
- `src/content/site-content.json` — migrate `interior` + `exterior`.
- `README.md` — document the system.

---

## Task 1: Service page types + validator

**Files:**
- Modify: `src/lib/templates/types.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/templates/validate-page.ts`
- Test: `src/lib/templates/__tests__/validate-service-page.test.ts`

**Interfaces:**
- Produces: `ServiceMeta`, `ServicePage`, `ServiceTemplateId`, `ServiceTemplateDef` types; `validateServicePage(page: ServicePage, name: string): string[]`.

- [ ] **Step 1: Add types to `src/lib/templates/types.ts`**

Extend the `SectionStyle` union and add the service types (append near the existing project template types):

```typescript
export type SectionStyle =
  | 'rule' | 'quote' | 'author' | 'plain'   // text
  | 'beforeafter'                            // pair
  | 'steps' | 'gallery' | 'highlights'       // repeat
  | 'features' | 'approach' | 'showcase';    // repeat — service styles

export interface ServiceMeta {
  name: string; heroTitle: string; heroSub: string;
  heroImg: string; introTitle: string; intro: string;
}

export type ServiceTemplateId = 'serviceclassic';

export interface ServicePage {
  templateId: ServiceTemplateId;
  meta: ServiceMeta;
  values: Record<string, TemplateValue>;
}

export interface ServiceTemplateDef {
  id: ServiceTemplateId;
  name: string;
  icon: string;
  desc: string;
  includes: string[];
  layout: ServiceStyleId;         // which templated layout renders it (starter = 'A')
  defaultMeta: ServiceMeta;
  sections: SectionDef[];
}
```

- [ ] **Step 2: Re-export from `src/lib/types.ts` and add `page` to `ServiceDetail`**

In the top `export type { ... } from './templates/types';` line add `ServiceMeta, ServicePage, ServiceTemplateId, ServiceTemplateDef`. Then add the optional field:

```typescript
export interface ServiceDetail {
  slug: string;
  name: string;
  visible?: boolean;
  page?: ServicePage; // templated detail content (present when a template is applied)
  // ...rest unchanged
```

Also `import type { ProjectPage, ServicePage } from './templates/types';` is not needed — the re-export line already brings the names into scope for consumers; `ServiceDetail.page` uses `ServicePage` which must be imported for local use. Add to the existing `import type { ProjectPage } from './templates/types';` line: `import type { ProjectPage, ServicePage } from './templates/types';`.

- [ ] **Step 3: Write the failing test** — `src/lib/templates/__tests__/validate-service-page.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { validateServicePage } from '../validate-page';
import type { ServicePage } from '../types';

const base: ServicePage = {
  templateId: 'serviceclassic',
  meta: { name: 'Interior', heroTitle: 'Interior Painting', heroSub: 'x',
    heroImg: 'https://x/y.jpg', introTitle: 'What\'s included', intro: 'hi' },
  values: {},
};

describe('validateServicePage', () => {
  it('passes a well-formed page', () => {
    expect(validateServicePage(base, 'Interior')).toEqual([]);
  });
  it('flags a missing hero title', () => {
    const p = { ...base, meta: { ...base.meta, heroTitle: '' } };
    expect(validateServicePage(p, 'Interior')).toContain('Service Interior needs a hero title.');
  });
  it('flags a non-https hero image', () => {
    const p = { ...base, meta: { ...base.meta, heroImg: 'http://x/y.jpg' } };
    expect(validateServicePage(p, 'Interior')).toContain('Service Interior hero image must be an https:// URL.');
  });
  it('flags an unknown template', () => {
    const p = { ...base, templateId: 'nope' as ServicePage['templateId'] };
    expect(validateServicePage(p, 'Interior')[0]).toContain('unknown template');
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/lib/templates/__tests__/validate-service-page.test.ts`
Expected: FAIL — `validateServicePage` is not exported.

- [ ] **Step 5: Implement `validateServicePage` in `src/lib/templates/validate-page.ts`**

Add below the existing `validateProjectPage` (reuse the same `isHttps` + section-image checks, keyed off the service catalog):

```typescript
import { serviceTemplates } from './service-templates';
// ...existing imports/isHttps...

export function validateServicePage(page: ServicePage, name: string): string[] {
  const errors: string[] = [];
  const def = serviceTemplates[page.templateId];
  if (!def) { errors.push(`Service ${name} uses an unknown template "${page.templateId}".`); return errors; }
  if (!page.meta?.heroTitle?.trim()) errors.push(`Service ${name} needs a hero title.`);
  if (!isHttps(page.meta?.heroImg)) errors.push(`Service ${name} hero image must be an https:// URL.`);
  for (const s of def.sections) {
    const v: TemplateValue | undefined = page.values?.[s.key];
    if (s.style === 'beforeafter' && v && typeof v === 'object' && !Array.isArray(v)) {
      if (!isHttps(v.before)) errors.push(`Service ${name} before image must be an https:// URL.`);
      if (!isHttps(v.after)) errors.push(`Service ${name} after image must be an https:// URL.`);
    }
    if ((s.style === 'gallery' || s.style === 'showcase' || s.style === 'features') && Array.isArray(v)) {
      v.forEach((it, i) => {
        const url = it.img;
        if (url !== undefined && url !== '' && !isHttps(url)) errors.push(`Service ${name} ${s.style} image #${i + 1} must be an https:// URL.`);
      });
    }
  }
  return errors;
}
```

Add `import type { ServicePage } from './types';` to the top (alongside `ProjectPage`).

> Note: this imports `serviceTemplates` from Task 2. Implement Task 2's file before running Step 6, or stub `serviceTemplates` as `{}` temporarily — Task 2 replaces it. Recommended: do Task 2 Step 1 (create the file) before this step.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/lib/templates/__tests__/validate-service-page.test.ts`
Expected: PASS (4 tests). Then `npm run build` — Expected: `✓ built`.

- [ ] **Step 7: Commit** (only if user asks)

```bash
git add src/lib/templates/types.ts src/lib/types.ts src/lib/templates/validate-page.ts src/lib/templates/__tests__/validate-service-page.test.ts
git commit -m "feat: add service page types + validation"
```

---

## Task 2: Service template catalog (starter template, Layout A)

**Files:**
- Create: `src/lib/templates/service-templates.ts`
- Test: `src/lib/templates/__tests__/service-templates.test.ts`

**Interfaces:**
- Consumes: `ServiceTemplateDef`, `ServiceTemplateId`, `SectionDef` (Task 1).
- Produces: `serviceTemplateList: ServiceTemplateDef[]`, `serviceTemplates: Record<ServiceTemplateId, ServiceTemplateDef>`.

- [ ] **Step 1: Create `src/lib/templates/service-templates.ts`**

One starter template `serviceclassic` (layout `A`). Its `sections[]` express the Skin-A body: features grid, approach block, before/after + gallery, showcase, testimonial. `meta` holds hero + intro.

```typescript
import type { ServiceTemplateDef, ServiceTemplateId } from './types';

export const serviceTemplateList: ServiceTemplateDef[] = [
  {
    id: 'serviceclassic', name: 'Classic Service', icon: 'design_services',
    desc: 'The standard service page: hero, what’s included, approach, before/after and showcase.',
    includes: ['Hero', 'Features', 'Approach', 'Before/After', 'Showcase', 'Testimonial'],
    layout: 'A',
    defaultMeta: {
      name: 'New Service', heroTitle: 'Service Title', heroSub: 'Short hero subtitle.',
      heroImg: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
      introTitle: 'What’s Included', intro: 'A short introduction to the service.',
    },
    sections: [
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
    ],
  },
];

export const serviceTemplates: Record<ServiceTemplateId, ServiceTemplateDef> =
  Object.fromEntries(serviceTemplateList.map((t) => [t.id, t])) as Record<ServiceTemplateId, ServiceTemplateDef>;
```

- [ ] **Step 2: Write the failing test** — `src/lib/templates/__tests__/service-templates.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { serviceTemplateList, serviceTemplates } from '../service-templates';

describe('serviceTemplateList', () => {
  it('has unique ids', () => {
    const ids = serviceTemplateList.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every template has a layout and at least one section', () => {
    for (const t of serviceTemplateList) {
      expect(t.layout).toBeTruthy();
      expect(t.sections.length).toBeGreaterThan(0);
    }
  });
  it('the map is keyed by id', () => {
    expect(serviceTemplates.serviceclassic.name).toBe('Classic Service');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/templates/__tests__/service-templates.test.ts`
Expected: PASS (3 tests). Re-run Task 1 test — Expected: PASS.

- [ ] **Step 4: Commit** (only if user asks)

```bash
git add src/lib/templates/service-templates.ts src/lib/templates/__tests__/service-templates.test.ts
git commit -m "feat: add service template catalog"
```

---

## Task 3: Extend `SectionView` with service styles

**Files:**
- Modify: `src/components/templates/template-sections.tsx`

**Interfaces:**
- Consumes: `SectionDef` styles `features`/`approach`/`showcase` (Task 1).
- Produces: rendering for those three repeat styles (used by Task 4).

No unit test (component render; repo has no RTL). Verified by `npm run build` + manual.

- [ ] **Step 1: Add three branches in `SectionView`**

In the `repeat` section of `template-sections.tsx` (after the existing `gallery` / `highlights` / `steps` branches, before the final `steps` return), add:

```tsx
  if (s.style === 'features') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((it, i) => (
          <div key={i} className="flex gap-4">
            <Icon name={it.icon || 'check_circle'} className="text-primary text-2xl flex-none" />
            <div>
              <h4 className="font-headline font-bold">{it.title}</h4>
              {it.desc && <p className="text-on-surface-variant text-sm leading-relaxed mt-1">{it.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (s.style === 'showcase') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <figure key={i} className="rounded-xl overflow-hidden bg-surface-container-low">
            {it.img && <img className="w-full aspect-[4/3] object-cover" src={it.img} alt={it.title || ''} loading="lazy" />}
            <figcaption className="p-4">
              <div className="font-headline font-bold text-sm">{it.title}</div>
              {it.blurb && <p className="text-on-surface-variant text-sm mt-1">{it.blurb}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }
  if (s.style === 'approach') {
    return (
      <ul className="space-y-3 max-w-2xl">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary text-lg" /><span className="font-medium">{it.t}</span></li>
        ))}
      </ul>
    );
  }
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `✓ built` (no type errors — `features`/`approach`/`showcase` are valid `SectionStyle`s from Task 1).

- [ ] **Step 3: Commit** (only if user asks)

```bash
git add src/components/templates/template-sections.tsx
git commit -m "feat: render service section styles"
```

---

## Task 4: Service template layout + registry + renderer

**Files:**
- Create: `src/components/templates/service-template-layouts/shared.tsx`
- Create: `src/components/templates/service-template-layouts/ServiceLayoutClassic.tsx`
- Create: `src/components/templates/service-skins-templated.tsx`
- Create: `src/components/templates/ServiceTemplateRenderer.tsx`

**Interfaces:**
- Consumes: `ServiceMeta`, `SectionDef`, `Contact`, `serviceTemplateLayouts`, `SectionView`.
- Produces: `ServiceTemplateRenderer` component `{ layout?: ServiceStyleId; meta: ServiceMeta; values; sections; contact }`.

Verified by `npm run build` + manual (Task 5 mounts it).

- [ ] **Step 1: Create `shared.tsx`** (hero + CTA + props)

```tsx
import { Link } from 'react-router-dom';
import { Icon } from '../../ui/Icon';
import type { Contact } from '../../../lib/types';
import type { ServiceMeta, SectionDef, TemplateValue } from '../../../lib/templates/types';

export interface ServiceLayoutProps {
  meta: ServiceMeta;
  values: Record<string, TemplateValue>;
  sections: SectionDef[];
  contact: Contact;
}

export function ServiceHero({ meta }: { meta: ServiceMeta }) {
  return (
    <section className="relative min-h-[420px] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-black/45 z-10" />
      {meta.heroImg && <img className="absolute inset-0 w-full h-full object-cover" src={meta.heroImg} alt={meta.heroTitle} />}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 pb-12 w-full">
        <Link to="/services" className="inline-flex items-center gap-1 text-white/90 text-sm font-semibold mb-4 hover:text-white transition-colors">
          <Icon name="arrow_back" className="text-base" /> All Services
        </Link>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white tracking-tight">{meta.heroTitle}</h1>
        {meta.heroSub && <p className="text-white/85 text-lg mt-3 max-w-2xl">{meta.heroSub}</p>}
      </div>
    </section>
  );
}

export function ServiceCta({ contact }: { contact: Contact }) {
  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
      <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">Ready to get started?</h2>
      <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Tell us about your place and we’ll give you an honest, no-obligation quote.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/contact" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-95 transition-all">Request a Free Quote</Link>
        <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-surface-container-high transition-all inline-flex items-center justify-center gap-2"><Icon name="call" /> {contact.phone}</a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `ServiceLayoutClassic.tsx`** (Layout A)

```tsx
import { ServiceHero, ServiceCta, type ServiceLayoutProps } from './shared';
import { SectionView } from '../template-sections';

// Layout A — reproduces the Skin A service page: hero, intro, then each section stacked.
export function ServiceLayoutClassic({ meta, values, sections, contact }: ServiceLayoutProps) {
  return (
    <>
      <ServiceHero meta={meta} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        {(meta.introTitle?.trim() || meta.intro?.trim()) && (
          <div className="max-w-3xl mb-12">
            {meta.introTitle?.trim() && <h2 className="font-headline text-3xl font-bold mb-4">{meta.introTitle}</h2>}
            {meta.intro?.trim() && <p className="text-lg text-on-surface-variant leading-relaxed">{meta.intro}</p>}
          </div>
        )}
        <div className="flex flex-col gap-14">
          {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>
      <ServiceCta contact={contact} />
    </>
  );
}
```

- [ ] **Step 3: Create `service-skins-templated.tsx`** (registry)

```tsx
import type { FC } from 'react';
import type { ServiceStyleId } from '../../lib/types';
import type { ServiceLayoutProps } from './service-template-layouts/shared';
import { ServiceLayoutClassic } from './service-template-layouts/ServiceLayoutClassic';

type LayoutComp = FC<ServiceLayoutProps>;

// Global templated-service layouts. Only A ships now (reproduces Skin A). Future
// client designs add layouts and flip their `ready` flag.
export const serviceTemplateLayouts: Record<ServiceStyleId, LayoutComp> = {
  A: ServiceLayoutClassic,
  B: ServiceLayoutClassic,
  C: ServiceLayoutClassic,
  D: ServiceLayoutClassic,
  E: ServiceLayoutClassic,
};

export const SERVICE_TEMPLATE_LAYOUT_META: { id: ServiceStyleId; name: string; ready: boolean }[] = [
  { id: 'A', name: 'Classic', ready: true },
  { id: 'B', name: 'Layout B', ready: false },
  { id: 'C', name: 'Layout C', ready: false },
  { id: 'D', name: 'Layout D', ready: false },
  { id: 'E', name: 'Layout E', ready: false },
];
```

- [ ] **Step 4: Create `ServiceTemplateRenderer.tsx`** (dispatcher)

```tsx
import type { Contact, ServiceStyleId } from '../../lib/types';
import type { ServiceMeta, SectionDef, TemplateValue } from '../../lib/templates/types';
import { serviceTemplateLayouts } from './service-skins-templated';

export function ServiceTemplateRenderer({ layout = 'A', ...props }: {
  layout?: ServiceStyleId; meta: ServiceMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; contact: Contact;
}) {
  const Layout = serviceTemplateLayouts[layout] ?? serviceTemplateLayouts.A;
  return <Layout {...props} />;
}
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `✓ built`.

- [ ] **Step 6: Commit** (only if user asks)

```bash
git add src/components/templates/service-template-layouts src/components/templates/service-skins-templated.tsx src/components/templates/ServiceTemplateRenderer.tsx
git commit -m "feat: add templated service renderer + classic layout"
```

---

## Task 5: Wire render priority in `ServiceDetailPage`

**Files:**
- Modify: `src/pages/ServiceDetailPage.tsx`

**Interfaces:**
- Consumes: `serviceTemplates` (Task 2), `ServiceTemplateRenderer` (Task 4).

- [ ] **Step 1: Update `ServiceDetailPage.tsx`**

```tsx
import { Navigate, useParams } from 'react-router-dom';
import { useSiteContent } from '../lib/site-content-context';
import { serviceSkins } from '../components/services/service-skins';
import { serviceTemplates } from '../lib/templates/service-templates';
import { ServiceTemplateRenderer } from '../components/templates/ServiceTemplateRenderer';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { contact, serviceDetails, serviceStyle } = useSiteContent();
  const s = serviceDetails.find((d) => d.slug === slug);

  // Unknown or hidden slug → back to the services list.
  if (!s || s.visible === false) return <Navigate to="/services" replace />;

  // Templated service → render its template; else fall back to the global skin.
  if (s.page) {
    const def = serviceTemplates[s.page.templateId];
    if (def) return <ServiceTemplateRenderer layout={def.layout} meta={s.page.meta} values={s.page.values} sections={def.sections} contact={contact} />;
  }

  const Skin = serviceSkins[serviceStyle] ?? serviceSkins.A;
  return <Skin s={s} contact={contact} />;
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `✓ built`.

- [ ] **Step 3: Commit** (only if user asks)

```bash
git add src/pages/ServiceDetailPage.tsx
git commit -m "feat: render templated service pages"
```

---

## Task 6: Validate service pages at publish

**Files:**
- Modify: `src/lib/content-schema.ts`

- [ ] **Step 1: Call `validateServicePage` per service**

In `validateContent`, inside the existing `if (Array.isArray(c.serviceDetails)) { c.serviceDetails.forEach((sd, i) => { ... }) }` loop, after the existing checks add:

```typescript
      if (sd.page) errors.push(...validateServicePage(sd.page, sd.name || sd.slug || `#${i + 1}`));
```

Add the import at the top: change `import { validateProjectPage } from './templates/validate-page';` to `import { validateProjectPage, validateServicePage } from './templates/validate-page';`.

- [ ] **Step 2: Build + tests**

Run: `npm run build && npx vitest run`
Expected: `✓ built`; all tests PASS.

- [ ] **Step 3: Commit** (only if user asks)

```bash
git add src/lib/content-schema.ts
git commit -m "feat: validate service pages before publish"
```

---

## Task 7: Admin — apply a template to a service

**Files:**
- Modify: `src/pages/admin/admin-content-store.tsx`
- Modify: `src/pages/admin/sections/ServiceDetailsEditor.tsx`
- Test: `src/lib/templates/__tests__/service-prefill.test.ts`

**Interfaces:**
- Produces: `serviceMetaFromDetail(sd: ServiceDetail, def: ServiceTemplateDef): ServiceMeta` (pure, prefills hero/intro from existing service content); store helpers `applyServiceTemplate(index, templateId)`, `clearServiceTemplate(index)`, `updateServicePageMeta(index, key, val)`, `updateServicePageValue(index, key, val)`.

- [ ] **Step 1: Write the failing test** — `src/lib/templates/__tests__/service-prefill.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { serviceMetaFromDetail } from '../service-prefill';
import { serviceTemplates } from '../service-templates';
import type { ServiceDetail } from '../types';

const sd = { slug: 'interior', name: 'Interior Painting', heroTitle: 'Interior Painting',
  heroSub: 'Sub', heroImg: 'https://x/y.jpg', introTitle: 'Whats included', introA: 'A', introB: 'B',
  features: [], midEyebrow: '', midTitle: '', midImage: '', midParas: [], midList: [],
  beforeImg: '', afterImg: '', gallery: [], showcase: [] } as unknown as ServiceDetail;

describe('serviceMetaFromDetail', () => {
  it('prefills hero + intro from the existing service', () => {
    const meta = serviceMetaFromDetail(sd, serviceTemplates.serviceclassic);
    expect(meta.heroTitle).toBe('Interior Painting');
    expect(meta.heroImg).toBe('https://x/y.jpg');
    expect(meta.intro).toBe('A'); // first intro paragraph
    expect(meta.name).toBe('Interior Painting');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/templates/__tests__/service-prefill.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/templates/service-prefill.ts`**

```typescript
import type { ServiceDetail } from '../types';
import type { ServiceMeta, ServiceTemplateDef } from './types';

// Seed a template's meta from an existing service's content so applying a template
// is lossless where fields map directly.
export function serviceMetaFromDetail(sd: ServiceDetail, def: ServiceTemplateDef): ServiceMeta {
  return {
    name: sd.name || def.defaultMeta.name,
    heroTitle: sd.heroTitle || def.defaultMeta.heroTitle,
    heroSub: sd.heroSub || def.defaultMeta.heroSub,
    heroImg: sd.heroImg || def.defaultMeta.heroImg,
    introTitle: sd.introTitle || def.defaultMeta.introTitle,
    intro: sd.introA || def.defaultMeta.intro,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/templates/__tests__/service-prefill.test.ts`
Expected: PASS.

- [ ] **Step 5: Add store helpers in `admin-content-store.tsx`**

These operate on `serviceDetails[index]` via the existing `updateServiceDetails` reducer (no new action type needed). Add to `StoreApi` and the `api` object:

```typescript
  // in StoreApi interface:
  applyServiceTemplate: (index: number, templateId: ServiceTemplateId) => void;
  clearServiceTemplate: (index: number) => void;
  updateServicePageMeta: (index: number, key: keyof ServiceMeta, val: string) => void;
  updateServicePageValue: (index: number, key: string, val: TemplateValue) => void;
```

```typescript
  // in api object (reuse updateServiceDetails + seedValues + serviceMetaFromDetail):
  applyServiceTemplate: (index, templateId) => dispatch({ t: 'UPDATE_SERVICE_DETAILS', serviceDetails:
    state.content.serviceDetails.map((sd, j) => j === index
      ? { ...sd, page: { templateId, meta: serviceMetaFromDetail(sd, serviceTemplates[templateId]), values: seedValues(serviceTemplates[templateId].sections) } }
      : sd) }),
  clearServiceTemplate: (index) => dispatch({ t: 'UPDATE_SERVICE_DETAILS', serviceDetails:
    state.content.serviceDetails.map((sd, j) => { if (j !== index) return sd; const { page, ...rest } = sd; return rest; }) }),
  updateServicePageMeta: (index, key, val) => dispatch({ t: 'UPDATE_SERVICE_DETAILS', serviceDetails:
    state.content.serviceDetails.map((sd, j) => j === index && sd.page ? { ...sd, page: { ...sd.page, meta: { ...sd.page.meta, [key]: val } } } : sd) }),
  updateServicePageValue: (index, key, val) => dispatch({ t: 'UPDATE_SERVICE_DETAILS', serviceDetails:
    state.content.serviceDetails.map((sd, j) => j === index && sd.page ? { ...sd, page: { ...sd.page, values: { ...sd.page.values, [key]: val } } } : sd) }),
```

Add imports: `import { serviceTemplates } from '../../lib/templates/service-templates';`, `import { serviceMetaFromDetail } from '../../lib/templates/service-prefill';`, `import { seedValues } from '../../lib/templates/seed';` (seed may already be imported), and `ServiceMeta, ServiceTemplateId` to the type imports.

- [ ] **Step 6: Add the "Use a template" UI in `ServiceDetailsEditor.tsx`**

Below the existing "Page visibility" card, before the classic `<Card title={s.name}>`, insert a template control. When `s.page` is absent: template picker cards (from `serviceTemplateList`) + "Use". When present: reuse `TemplateForm` (from `compose/TemplateForm`) bound to the store helpers, plus a "Remove template" button. Full block:

```tsx
{/* Template selector / editor */}
{!s.page ? (
  <div className="bg-white border border-[#eae6df] rounded-2xl p-6">
    <h3 className="font-headline text-base font-bold mb-1">Use a template</h3>
    <p className="text-xs text-[#8a8377] mb-4">Rebuild this service page from a template. The current hero/intro prefill in; you can edit everything after.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {serviceTemplateList.map((t) => (
        <button key={t.id} onClick={() => applyServiceTemplate(i, t.id)}
          className="text-left p-4 rounded-xl border-2 border-[#eae6df] hover:border-primary transition-colors">
          <div className="flex items-center gap-2"><Icon name={t.icon} className="text-primary text-xl" /><span className="font-bold text-sm">{t.name}</span></div>
          <p className="text-xs text-[#8a8377] mt-1">{t.desc}</p>
        </button>
      ))}
    </div>
  </div>
) : (
  <div className="flex flex-col gap-5">
    <div className="flex items-center justify-between bg-white border border-[#eae6df] rounded-2xl px-5 py-4">
      <div>
        <div className="font-headline font-bold text-sm">Template: {serviceTemplates[s.page.templateId]?.name}</div>
        <div className="text-xs text-[#8a8377]">This service renders from a template. Edit the fields below.</div>
      </div>
      <button onClick={() => clearServiceTemplate(i)} className="text-sm font-bold text-primary border border-primary/40 rounded-lg px-3 py-2 hover:bg-primary/5">Remove template</button>
    </div>
    <TemplateForm
      meta={{ title: s.page.meta.heroTitle, category: '', location: '', duration: '', year: '', cover: s.page.meta.heroImg, intro: s.page.meta.intro }}
      values={s.page.values}
      sections={serviceTemplates[s.page.templateId].sections}
      onMeta={() => { /* service meta uses the dedicated fields below */ }}
      onValue={(k, v) => updateServicePageValue(i, k, v)}
      category={'interior'}
      onCategory={() => {}}
    />
  </div>
)}
```

> Note on the form: `TemplateForm` is built for `ProjectMeta`. To avoid coupling, render the **service meta fields** (name/heroTitle/heroSub/heroImg/introTitle/intro) with plain `Field`s wired to `updateServicePageMeta(i, key, val)` **instead of** passing meta through `TemplateForm`. Concretely, replace the `<TemplateForm .../>` above with: a `Card title="Hero & intro"` containing six `Field`s (each `onChange={(v) => updateServicePageMeta(i, '<key>', v)}`), followed by one `Card` per section rendering the section fields wired to `updateServicePageValue`. Mirror the field/section rendering already in `compose/TemplateForm.tsx` (its `sections.map(...)` block) but source values from `s.page.values` and write via `updateServicePageValue`. This keeps service meta and project meta decoupled.

Add imports to `ServiceDetailsEditor.tsx`: `import { serviceTemplateList, serviceTemplates } from '../../../lib/templates/service-templates';`, `import { Icon } from '../../../components/ui/Icon';`, and destructure the new store helpers from `useAdminStore()`.

- [ ] **Step 7: Build + tests**

Run: `npm run build && npx vitest run`
Expected: `✓ built`; all tests PASS.

- [ ] **Step 8: Manual verification**

Run `npm run dev`, open `/admin/servicePages`. For a service with no template: pick "Classic Service" → fields prefill → the live site `/services/<slug>` renders via the template. "Remove template" reverts to the skin. Confirm publish (Save) succeeds (no validation errors).

- [ ] **Step 9: Commit** (only if user asks)

```bash
git add src/pages/admin/admin-content-store.tsx src/pages/admin/sections/ServiceDetailsEditor.tsx src/lib/templates/service-prefill.ts src/lib/templates/__tests__/service-prefill.test.ts
git commit -m "feat: apply service templates from the admin editor"
```

---

## Task 8: Migrate `interior` + `exterior`

**Files:**
- Modify: `src/content/site-content.json`

- [ ] **Step 1: Add a `page` to the `interior` service entry**

In `serviceDetails[]`, find the `interior` object and add a `page` key (keep all existing fields — the skin fallback stays valid if a future template is removed). Port its content into the template shape:

```json
"page": {
  "templateId": "serviceclassic",
  "meta": {
    "name": "Interior Painting",
    "heroTitle": "<copy interior.heroTitle>",
    "heroSub": "<copy interior.heroSub>",
    "heroImg": "<copy interior.heroImg>",
    "introTitle": "<copy interior.introTitle>",
    "intro": "<copy interior.introA>"
  },
  "values": {
    "features": [ /* copy interior.features → [{icon,title,desc}] */ ],
    "approach": [ /* interior.midList → [{ "t": "<item>" }] */ ],
    "ba": { "before": "<interior.beforeImg>", "after": "<interior.afterImg>" },
    "showcase": [ /* interior.showcase → [{title,blurb,img}] */ ],
    "quote": "<interior.quote or a default>",
    "author": "<interior.quoteName or a default>"
  }
}
```

Use the **actual** values already in the `interior` object (copy them verbatim). Repeat for `exterior`.

- [ ] **Step 2: Build + verify JSON**

Run: `npm run build`
Expected: `✓ built` (the JSON is cast to `SiteContent`; `tsc` validates the import).

- [ ] **Step 3: Manual parity check**

Run `npm run dev`. Compare `/services/interior` and `/services/exterior` before vs after (git stash toggle). Layout A should match Skin A closely — hero, intro, features, before/after, showcase, testimonial present. Note any gaps; adjust section content/order in `service-templates.ts` if needed.

- [ ] **Step 4: Commit** (only if user asks)

```bash
git add src/content/site-content.json
git commit -m "feat: migrate interior + exterior services to templates"
```

---

## Task 9: Docs + final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document the system in `README.md`**

Under the Templates section add a bullet mirroring the project-detail one:

```markdown
- **Service templates** — `src/lib/templates/service-templates.ts` + `src/components/templates/service-template-layouts/`. A service (`serviceDetails[].page?`) can be built from a template; `/services/:slug` renders `page` via `ServiceTemplateRenderer` (dispatch by `template.layout`), else falls back to the `serviceStyle` skin. Apply a template per service in admin → **Service Pages** → "Use a template". Starter template `serviceclassic` (Layout A) reproduces Skin A so migration is lossless. **Add a template** = append to `serviceTemplateList`; **add a layout** = create `ServiceLayout<X>.tsx`, map it in `serviceTemplateLayouts`, flip `ready` in `SERVICE_TEMPLATE_LAYOUT_META`.
```

Update the `serviceDetails[]` content-block bullet to mention `page`.

- [ ] **Step 2: Full build + test sweep**

Run: `npm run build && npx vitest run`
Expected: `✓ built`; all tests PASS.

- [ ] **Step 3: Commit** (only if user asks)

```bash
git add README.md
git commit -m "docs: document the service template system"
```

---

## Self-Review (done at authoring)

- **Spec coverage:** rendering priority (T5) · data model/types (T1) · section styles (T3) · catalog + starter (T2) · layout/renderer (T4) · admin fork-a (T7) · validation (T6) · migration interior+exterior (T8) · tests (T1,T2,T7) · docs (T9). All spec sections mapped.
- **Placeholders:** none — the only `<copy ...>` markers are in Task 8, which intentionally instructs copying **existing verbatim JSON values** from the same file (data migration, not code logic).
- **Type consistency:** `ServicePage`/`ServiceMeta`/`ServiceTemplateId`/`ServiceTemplateDef` defined in T1, consumed unchanged in T2/T4/T5/T6/T7; `serviceTemplateLayouts` keyed by `ServiceStyleId` in T4, used in T4's renderer; store helper names in T7 match their `StoreApi` declarations.

## Open questions
- None blocking. Migration targets assumed interior + exterior (per spec).
