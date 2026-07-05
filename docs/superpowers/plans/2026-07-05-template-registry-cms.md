# ThaiViet Template-Registry CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admin staff build project detail pages from a picked template (compose wizard) and select a global service-page layout style, then reskin the public Home page — all editable from `/admin` and published through the existing Supabase blob.

**Architecture:** Two code-defined registries over the existing single `SiteContent` blob. (1) **Project templates**: 5 data-only template definitions (`sections[]`) driving ONE generic renderer, ONE generic form, ONE live preview. (2) **Service skins**: a global `serviceStyle` id selecting one of several layout components over the unchanged `ServiceDetail` data. Both add-only, back-compatible via `withContentDefaults`. Home is a one-off reskin.

**Tech Stack:** React 18 + TypeScript (strict) + Vite + Tailwind + react-router-dom 6 + Supabase. **New dev dependency: Vitest** (logic unit tests only; no runtime/bundle impact).

## Global Constraints

- **No data migration / no key renames.** All new content keys are additive; `withContentDefaults` (`src/lib/content-defaults.ts`) back-fills them for old DB rows. (spec §5, §8)
- **Every image/cover URL must be `https://`** — validated in `content-schema.ts` (existing `isHttps` pattern). (spec §9)
- **Files stay under ~200 lines**; split renderer vs. section wiring; one file per skin. (spec §4.3)
- **Content-change sync rule (CLAUDE.md):** any new page/section content that the client edits MUST be wired into `/admin` AND reflected in `README.md`/`docs/`. Definition of done = code + docs + dashboard.
- **Do NOT commit unless the user asks** (user global rule). Steps below include `git commit` for the subagent-driven flow; if the user has not authorized commits, stage nothing and leave working-tree edits — skip every commit step and note it.
- **Verification gate = `npm run build`** (`tsc` strict + `vite build`) must pass for every task. Pure-logic tasks additionally use `npm test` (Vitest). UI-visual tasks additionally require a manual `npm run dev` check with the stated expected observation.
- **Service skins shipped now: A (current layout) + B (Cinematic/Dark).** C/D/E are registry entries marked "coming soon" only. (spec §2, §12)
- **Legacy projects stay on the static `data/project-details.ts` fallback** — not converted. (spec §8, §12)
- **Project template copy/field defaults are taken verbatim** from the design's `composeTemplatesData()` (claude.ai project `5923c23a-5fef-4b8c-99b9-2e74cdd09651`, file `ThaiViet Dashboard.dc.html`, readable via the `DesignSync` tool — the exact defaults are reproduced in Task 3).
- **Sequencing:** template system (Tasks 1–8) first, then Home reskin (Task 9). (spec §12)

---

## File Structure

**Create:**
- `src/lib/templates/types.ts` — `TemplateValue`, `SectionDef`, `ProjectMeta`, `ProjectTemplateId`, `ProjectTemplateDef`, `ServiceStyleId`, seeding + validation helpers' types.
- `src/lib/templates/project-templates.ts` — the 5 project template definitions (data only) + `projectTemplateList` + `projectTemplates` map + `seedValues()`.
- `src/lib/templates/seed.ts` — `seedValues(sections)` and `emptyMetaFrom()` pure helpers (imported by store + tests).
- `src/lib/templates/__tests__/seed.test.ts` — Vitest for `seedValues`.
- `src/lib/templates/__tests__/validate-page.test.ts` — Vitest for `validateProjectPage`.
- `src/components/templates/ProjectTemplateRenderer.tsx` — generic renderer that walks `sections[]`.
- `src/components/templates/template-sections.tsx` — per-kind section sub-renderers (text/pair/repeat).
- `src/pages/admin/sections/compose/ComposeWizard.tsx` — 2-step wizard shell.
- `src/pages/admin/sections/compose/TemplatePicker.tsx` — step 1 card grid.
- `src/pages/admin/sections/compose/TemplateForm.tsx` — step 2 generic form from `sections[]`.
- `src/pages/admin/sections/compose/TemplatePreview.tsx` — step 2 live preview (wraps the renderer).
- `src/pages/admin/sections/ServiceStyleEditor.tsx` — global style selector (5 cards).
- `src/components/services/service-skins.tsx` — `serviceSkins` registry map.
- `src/components/services/ServiceSkinA.tsx` — current layout extracted.
- `src/components/services/ServiceSkinB.tsx` — Cinematic/Dark, ported from design.
- `vitest.config.ts` — Vitest config (jsdom not required for pure-logic tests → node env).

**Modify:**
- `src/lib/types.ts` — extend `Project` with `page?`, re-export template types.
- `src/pages/admin/useAdminContent.ts` — add `serviceStyle` to `SiteContent`; add `'compose'` to `AdminSection`.
- `src/content/site-content.json` — add `"serviceStyle": "A"`.
- `src/lib/content-schema.ts` — validate `serviceStyle` + each `project.page`.
- `src/pages/admin/admin-content-store.tsx` — compose state, `setServiceStyle`, `addProjectFromTemplate`, `updateProjectPage`.
- `src/pages/ProjectDetailPage.tsx` — dispatch to template renderer when `project.page` present.
- `src/pages/ServiceDetailPage.tsx` — dispatch to `serviceSkins[serviceStyle]`.
- `src/pages/admin/AdminSidebar.tsx` — add "Create content" nav entry.
- `src/pages/admin/AdminPage.tsx` — add `compose` to `META` + render branch; add "New from template" entry point.
- `src/pages/admin/sections/ServiceDetailsEditor.tsx` — mount `ServiceStyleEditor` at top.
- `src/pages/HomePage.tsx` — reskin (Task 9).
- `package.json` — `"test": "vitest run"`, devDeps `vitest`, `@testing-library/react` (optional, unused for pure-logic).
- `README.md` — routes/components/content-block map (Task 10).

---

## Task 1: Foundation — Vitest, template types, `serviceStyle` field, defaults

**Files:**
- Create: `vitest.config.ts`, `src/lib/templates/types.ts`
- Modify: `package.json`, `src/lib/types.ts:39-47` (Project), `src/pages/admin/useAdminContent.ts:3-12`, `src/content/site-content.json`
- Test: `src/lib/templates/__tests__/seed.test.ts` (added in Task 2; here just prove the harness runs)

**Interfaces:**
- Produces:
  - `type TemplateValue = string | Record<string, string> | Array<Record<string, string>>`
  - `interface FieldDef { key: string; label: string; area?: boolean }`
  - `interface SectionDef { key: string; kind: 'text' | 'pair' | 'repeat'; style: 'rule' | 'quote' | 'author' | 'plain' | 'beforeafter' | 'steps' | 'gallery' | 'highlights'; title: string; heading?: string; label?: string; area?: boolean; fields?: FieldDef[]; itemLabel?: string; addLabel?: string; default: TemplateValue }`
  - `interface ProjectMeta { title: string; category: string; location: string; duration: string; year: string; cover: string; intro: string }`
  - `type ProjectTemplateId = 'casestudy' | 'beforeafter' | 'timeline' | 'photostory' | 'spotlight'`
  - `interface ProjectPage { templateId: ProjectTemplateId; meta: ProjectMeta; values: Record<string, TemplateValue> }`
  - `type ServiceStyleId = 'A' | 'B' | 'C' | 'D' | 'E'`
  - `SiteContent.serviceStyle: ServiceStyleId`; `Project.page?: ProjectPage`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` added to devDependencies, no peer errors.

- [ ] **Step 2: Add the test script**

In `package.json` `scripts`, add after `"preview"`:
```json
"test": "vitest run"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create `src/lib/templates/types.ts`**

```ts
// Shared template-registry types. Field-kind model extracted from the dashboard design's
// composeTemplatesData(): a template is meta + an ordered list of typed sections.

export type TemplateValue = string | Record<string, string> | Array<Record<string, string>>;

export interface FieldDef { key: string; label: string; area?: boolean }

export type SectionKind = 'text' | 'pair' | 'repeat';
export type SectionStyle =
  | 'rule' | 'quote' | 'author' | 'plain'   // text
  | 'beforeafter'                            // pair
  | 'steps' | 'gallery' | 'highlights';      // repeat

export interface SectionDef {
  key: string;
  kind: SectionKind;
  style: SectionStyle;
  title: string;        // admin form group label
  heading?: string;     // public heading (text kinds)
  label?: string;       // single-field label (text kinds)
  area?: boolean;       // textarea vs input
  fields?: FieldDef[];  // pair / repeat sub-fields
  itemLabel?: string;   // repeat: singular noun
  addLabel?: string;    // repeat: add-button label
  default: TemplateValue;
}

export interface ProjectMeta {
  title: string; category: string; location: string;
  duration: string; year: string; cover: string; intro: string;
}

export type ProjectTemplateId = 'casestudy' | 'beforeafter' | 'timeline' | 'photostory' | 'spotlight';

export interface ProjectPage {
  templateId: ProjectTemplateId;
  meta: ProjectMeta;
  values: Record<string, TemplateValue>;
}

export interface ProjectTemplateDef {
  id: ProjectTemplateId;
  name: string;
  icon: string;          // Material Symbols name for the picker card
  desc: string;
  includes: string[];    // picker card chips
  defaultMeta: ProjectMeta;
  sections: SectionDef[];
}

export type ServiceStyleId = 'A' | 'B' | 'C' | 'D' | 'E';
```

- [ ] **Step 5: Extend `Project` and re-export template types in `src/lib/types.ts`**

At the top of `src/lib/types.ts` add:
```ts
import type { ProjectPage } from './templates/types';
export type { ProjectPage, ProjectMeta, ProjectTemplateId, ProjectTemplateDef, SectionDef, TemplateValue, ServiceStyleId } from './templates/types';
```
Change the `Project` interface (currently `src/lib/types.ts:39-47`) to add one field:
```ts
export interface Project {
  id: string;
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  desc: string;
  image: string;
  visible?: boolean;
  page?: ProjectPage; // templated detail content (present when created via the compose wizard)
}
```

- [ ] **Step 6: Add `serviceStyle` to `SiteContent` + `AdminSection`**

In `src/pages/admin/useAdminContent.ts`:
```ts
import type { Hero, Contact, Project, Post, Homepage, Home, ServiceDetail, ServiceStyleId } from '../../lib/types';

export interface SiteContent {
  hero: Hero;
  home: Home;
  homepage: Homepage;
  serviceDetails: ServiceDetail[];
  serviceStyle: ServiceStyleId; // global service-page layout style
  projects: Project[];
  posts: Post[];
  areas: string[];
  contact: Contact;
}

export type AdminSection = 'overview' | 'projects' | 'blog' | 'compose' | 'home' | 'about' | 'servicePages' | 'areas' | 'contact' | 'settings';
```

- [ ] **Step 7: Add the default to bundled content**

In `src/content/site-content.json`, add a top-level key (any position):
```json
"serviceStyle": "A",
```

- [ ] **Step 8: Verify build + test harness**

Run:
```bash
npm run build && npm test
```
Expected: build PASSES (tsc strict happy with the new types since `serviceStyle` now exists in the JSON default). `npm test` reports "No test files found" is acceptable at this step, OR passes once Task 2's test exists. If tsc complains `serviceStyle` missing on any `SiteContent` literal, fix that literal.

- [ ] **Step 9: Commit** (skip if commits not authorized)

```bash
git add -A
git commit -m "feat: add template-registry types, serviceStyle field, vitest harness"
```

---

## Task 2: `seedValues` + `emptyMetaFrom` pure helpers (TDD)

**Files:**
- Create: `src/lib/templates/seed.ts`, `src/lib/templates/__tests__/seed.test.ts`

**Interfaces:**
- Produces:
  - `function seedValues(sections: SectionDef[]): Record<string, TemplateValue>` — deep-clones each section's `default` keyed by `section.key`.
  - `function cloneTemplateValue(v: TemplateValue): TemplateValue` — deep clone (string as-is, object/array copied).

- [ ] **Step 1: Write the failing test**

`src/lib/templates/__tests__/seed.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { seedValues } from '../seed';
import type { SectionDef } from '../types';

const sections: SectionDef[] = [
  { key: 'result', kind: 'text', style: 'rule', title: 'Result', default: 'done' },
  { key: 'ba', kind: 'pair', style: 'beforeafter', title: 'B/A',
    fields: [{ key: 'before', label: 'B' }, { key: 'after', label: 'A' }],
    default: { before: 'b.jpg', after: 'a.jpg' } },
  { key: 'phases', kind: 'repeat', style: 'steps', title: 'Phases',
    fields: [{ key: 'h', label: 'H' }], default: [{ h: 'one' }, { h: 'two' }] },
];

describe('seedValues', () => {
  it('keys each default by section key', () => {
    const v = seedValues(sections);
    expect(v.result).toBe('done');
    expect(v.ba).toEqual({ before: 'b.jpg', after: 'a.jpg' });
    expect(v.phases).toEqual([{ h: 'one' }, { h: 'two' }]);
  });

  it('deep-clones so edits do not mutate the template default', () => {
    const v = seedValues(sections);
    (v.ba as Record<string, string>).before = 'CHANGED';
    (v.phases as Array<Record<string, string>>)[0].h = 'CHANGED';
    // Re-seed and confirm the template defaults are untouched.
    const fresh = seedValues(sections);
    expect((fresh.ba as Record<string, string>).before).toBe('b.jpg');
    expect((fresh.phases as Array<Record<string, string>>)[0].h).toBe('one');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../seed'`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/templates/seed.ts`:
```ts
import type { SectionDef, TemplateValue, ProjectMeta } from './types';

export function cloneTemplateValue(v: TemplateValue): TemplateValue {
  if (typeof v === 'string') return v;
  return JSON.parse(JSON.stringify(v)) as TemplateValue;
}

// Build the initial editable values for a template: each section's default, deep-cloned
// so the admin's edits never mutate the shared template definition.
export function seedValues(sections: SectionDef[]): Record<string, TemplateValue> {
  const out: Record<string, TemplateValue> = {};
  for (const s of sections) out[s.key] = cloneTemplateValue(s.default);
  return out;
}

export function emptyMetaFrom(meta: ProjectMeta): ProjectMeta {
  return { ...meta };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit** (skip if commits not authorized)

```bash
git add src/lib/templates/seed.ts src/lib/templates/__tests__/seed.test.ts
git commit -m "feat: add seedValues template helper with clone safety"
```

---

## Task 3: The 5 project template definitions (data)

**Files:**
- Create: `src/lib/templates/project-templates.ts`

**Interfaces:**
- Consumes: `SectionDef`, `ProjectMeta`, `ProjectTemplateDef`, `ProjectTemplateId` from `./types`.
- Produces:
  - `const projectTemplateList: ProjectTemplateDef[]` (ordered for the picker)
  - `const projectTemplates: Record<ProjectTemplateId, ProjectTemplateDef>`

> Copy defaults verbatim from the design's `composeTemplatesData()`. Reproduced below.

- [ ] **Step 1: Create `src/lib/templates/project-templates.ts`**

```ts
import type { ProjectTemplateDef, ProjectTemplateId } from './types';

// Template definitions extracted verbatim from the dashboard design (composeTemplatesData()).
// Data only — one generic renderer/form interprets `sections`.
export const projectTemplateList: ProjectTemplateDef[] = [
  {
    id: 'casestudy', name: 'Case Study', icon: 'workspace_premium',
    desc: 'The full story of a job: challenge, solution and result.',
    includes: ['Facts', 'Challenge', 'Solution', 'Result', 'Quote'],
    defaultMeta: {
      title: 'Plimmerton Coastal Home', category: 'Exterior Painting',
      location: 'Plimmerton, Porirua', duration: '3 weeks', year: '2024',
      cover: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=900&q=80',
      intro: 'A 1990s weatherboard home perched above the Plimmerton coastline — beautiful views, brutal salt-wind exposure. Here is how we made it weather-tight again.',
    },
    sections: [
      { key: 'challenge', kind: 'text', style: 'rule', title: 'The Challenge', heading: 'The Challenge', label: 'The challenge', area: true,
        default: 'Salt spray and driving wind had degraded the previous coating, with flaking on the seaward elevation and early rot in two weatherboards.' },
      { key: 'solution', kind: 'text', style: 'rule', title: 'Our Solution', heading: 'Our Solution', label: 'Our solution', area: true,
        default: 'Full wash-down and chloride treatment, scrape and sand back to sound substrate, replace damaged boards, then a 3-coat UV- and salt-resistant system.' },
      { key: 'result', kind: 'text', style: 'rule', title: 'The Result', heading: 'The Result', label: 'The result', area: true,
        default: 'A weather-tight, low-sheen finish built to last in marine conditions — backed by our 5-year workmanship guarantee.' },
      { key: 'quote', kind: 'text', style: 'quote', title: 'Client quote', heading: 'Client quote', label: 'Testimonial quote', area: true,
        default: "Our house has never looked better and it's holding up beautifully against the sea wind. The team was tidy, on time and genuinely cared." },
      { key: 'author', kind: 'text', style: 'author', title: 'Quote attribution', label: 'Who said it', area: false,
        default: 'Sarah & Mark — Plimmerton' },
    ],
  },
  {
    id: 'beforeafter', name: 'Before & After', icon: 'compare',
    desc: 'Lead with the transformation — two images side by side.',
    includes: ['Facts', 'Before / After', 'Result', 'Quote'],
    defaultMeta: {
      title: 'Modern Villa Refresh — Karori', category: 'Interior Painting',
      location: 'Karori, Wellington', duration: '2 weeks', year: '2024',
      cover: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900&q=80',
      intro: 'A character villa due for a modern interior refresh — tired walls, yellowed trim and dated colours throughout the living spaces.',
    },
    sections: [
      { key: 'ba', kind: 'pair', style: 'beforeafter', title: 'Before & After',
        fields: [{ key: 'before', label: 'Before image URL' }, { key: 'after', label: 'After image URL' }],
        default: { before: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=700&q=80', after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80' } },
      { key: 'result', kind: 'text', style: 'rule', title: 'The Result', heading: 'The Result', label: 'The result', area: true,
        default: 'Crisp, even walls and glass-smooth trim — a calm, modern interior that still respects the villa’s character.' },
      { key: 'quote', kind: 'text', style: 'quote', title: 'Client quote', heading: 'Client quote', label: 'Testimonial quote', area: true,
        default: 'They treated our home with so much respect — drop sheets everywhere, spotless each evening. The feature wall is exactly what we hoped for.' },
      { key: 'author', kind: 'text', style: 'author', title: 'Quote attribution', label: 'Who said it', area: false,
        default: 'The Nguyen Family — Karori' },
    ],
  },
  {
    id: 'timeline', name: 'Process Timeline', icon: 'timeline',
    desc: 'Show how the job unfolded, phase by phase.',
    includes: ['Facts', 'Phases', 'Result'],
    defaultMeta: {
      title: 'Whitby Family Home Roof', category: 'Roof Painting',
      location: 'Whitby, Porirua', duration: '4 days', year: '2025',
      cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
      intro: 'A full roof restoration delivered in four tidy days — no mess, fixed price, and a finish built to shrug off Wellington weather.',
    },
    sections: [
      { key: 'phases', kind: 'repeat', style: 'steps', title: 'How it went', itemLabel: 'Phase', addLabel: 'Add phase',
        fields: [{ key: 'h', label: 'Phase title' }, { key: 'b', label: 'What we did', area: true }],
        default: [
          { h: 'Inspect & quote', b: 'Walked the roof, checked fixings and flashings, and gave a clear fixed-price quote.' },
          { h: 'Wash & prep', b: 'Soft-washed off lichen and chalking, treated rust spots and re-secured loose screws.' },
          { h: 'Prime & coat', b: 'Applied a rust-inhibiting primer, then two coats of premium roof membrane in the chosen colour.' },
          { h: 'Clean up & check', b: 'Cleared gutters, removed all debris and walked the result with the owner.' },
        ] },
      { key: 'result', kind: 'text', style: 'rule', title: 'The Result', heading: 'The Result', label: 'The result', area: true,
        default: 'A sharp, protected roof finished in two working days — lifting the whole street appeal of the home.' },
    ],
  },
  {
    id: 'photostory', name: 'Photo Story', icon: 'collections',
    desc: 'An image-led gallery with short captions.',
    includes: ['Facts', 'Gallery', 'Closing'],
    defaultMeta: {
      title: 'Whitby Cedar Deck & Pergola', category: 'Wood Staining',
      location: 'Whitby, Porirua', duration: '1 week', year: '2024',
      cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
      intro: 'Cedar staining with full surface prep — restoring the natural grain and protecting the timber for years of outdoor living.',
    },
    sections: [
      { key: 'gallery', kind: 'repeat', style: 'gallery', title: 'Gallery', itemLabel: 'Photo', addLabel: 'Add photo',
        fields: [{ key: 'img', label: 'Image URL' }, { key: 'cap', label: 'Caption' }],
        default: [
          { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', cap: 'Weathered cedar before prep' },
          { img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', cap: 'Sanded back and ready to stain' },
          { img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', cap: 'Rich finished stain, grain restored' },
        ] },
      { key: 'closing', kind: 'text', style: 'plain', title: 'Closing note', heading: 'The finish', label: 'Closing paragraph', area: true,
        default: 'Two coats of premium oil-based stain bring out the warmth of the cedar and seal it against the elements.' },
    ],
  },
  {
    id: 'spotlight', name: 'Quick Spotlight', icon: 'bolt',
    desc: 'A short highlight reel — key facts and wins.',
    includes: ['Facts', 'Highlights', 'Quote'],
    defaultMeta: {
      title: 'Lower Hutt New Build', category: 'Plastering & GIB Stopping',
      location: 'Lower Hutt', duration: '2 weeks', year: '2025',
      cover: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=900&q=80',
      intro: 'Full GIB stopping and skim across a new build, finished to a flawless Level 5 and handed over ready for paint.',
    },
    sections: [
      { key: 'highlights', kind: 'repeat', style: 'highlights', title: 'Highlights', itemLabel: 'Highlight', addLabel: 'Add highlight',
        fields: [{ key: 't', label: 'Highlight' }],
        default: [
          { t: 'Whole-house GIB stopping and jointing' },
          { t: 'Level 5 skim on feature walls and ceilings' },
          { t: 'Dust-managed sanding, site left spotless' },
          { t: 'Delivered on schedule, ready for painters' },
        ] },
      { key: 'quote', kind: 'text', style: 'quote', title: 'Client quote', heading: 'Client quote', label: 'Testimonial quote', area: true,
        default: 'Walls came up perfectly flat — you can see the difference once the light hits them. Faultless work.' },
      { key: 'author', kind: 'text', style: 'author', title: 'Quote attribution', label: 'Who said it', area: false,
        default: 'Group home builder — Lower Hutt' },
    ],
  },
];

export const projectTemplates: Record<ProjectTemplateId, ProjectTemplateDef> =
  Object.fromEntries(projectTemplateList.map((t) => [t.id, t])) as Record<ProjectTemplateId, ProjectTemplateDef>;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS. If tsc flags a `sections[].default` shape mismatch, confirm `pair` defaults are objects and `repeat` defaults are arrays.

- [ ] **Step 3: Commit** (skip if commits not authorized)

```bash
git add src/lib/templates/project-templates.ts
git commit -m "feat: add 5 project template definitions from design"
```

---

## Task 4: Section sub-renderers + generic `ProjectTemplateRenderer`

**Files:**
- Create: `src/components/templates/template-sections.tsx`, `src/components/templates/ProjectTemplateRenderer.tsx`

**Interfaces:**
- Consumes: `ProjectMeta`, `SectionDef`, `TemplateValue` from `../../lib/templates/types`; `Contact` from `../../lib/types`; `Icon` from `../ui/Icon`.
- Produces:
  - `function SectionView({ section, value }: { section: SectionDef; value: TemplateValue }): JSX.Element`
  - `function ProjectTemplateRenderer({ meta, values, sections, contact }: { meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; contact: Contact }): JSX.Element`

- [ ] **Step 1: Create `src/components/templates/template-sections.tsx`**

```tsx
import { Icon } from '../ui/Icon';
import type { SectionDef, TemplateValue } from '../../lib/templates/types';

const asStr = (v: TemplateValue): string => (typeof v === 'string' ? v : '');
const asObj = (v: TemplateValue): Record<string, string> => (typeof v === 'object' && !Array.isArray(v) ? v as Record<string, string> : {});
const asArr = (v: TemplateValue): Array<Record<string, string>> => (Array.isArray(v) ? v : []);

// Renders one section of a project template by its kind/style. Public + preview share this.
export function SectionView({ section: s, value }: { section: SectionDef; value: TemplateValue }) {
  if (s.kind === 'text') {
    const text = asStr(value);
    if (!text.trim()) return null;
    if (s.style === 'quote') {
      return (
        <blockquote className="max-w-3xl mx-auto text-center my-4">
          <Icon name="format_quote" className="text-primary text-4xl" filled />
          <p className="text-2xl md:text-3xl font-medium leading-relaxed mt-4">"{text}"</p>
        </blockquote>
      );
    }
    if (s.style === 'author') {
      return <p className="text-center font-headline font-bold mt-3">{text}</p>;
    }
    // rule / plain
    return (
      <div className="max-w-3xl">
        {s.style === 'rule' && <div className="w-10 h-1 bg-primary mb-4" />}
        {s.heading && <h3 className="font-headline text-xl font-bold mb-3">{s.heading}</h3>}
        <p className="text-on-surface-variant leading-relaxed">{text}</p>
      </div>
    );
  }

  if (s.kind === 'pair') {
    const o = asObj(value);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['before', 'Before'], ['after', 'After']].map(([k, lbl]) => (
          <figure key={k} className="relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-container-low">
            {o[k] && <img className="w-full h-full object-cover" src={o[k]} alt={lbl} loading="lazy" />}
            <figcaption className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{lbl}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  // repeat
  const items = asArr(value);
  if (s.style === 'gallery') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <figure key={i} className="rounded-xl overflow-hidden bg-surface-container-low">
            {it.img && <img className="w-full aspect-[4/3] object-cover" src={it.img} alt={it.cap || ''} loading="lazy" />}
            {it.cap && <figcaption className="p-3 text-sm text-on-surface-variant">{it.cap}</figcaption>}
          </figure>
        ))}
      </div>
    );
  }
  if (s.style === 'highlights') {
    return (
      <ul className="space-y-3 max-w-2xl">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary text-lg" /><span className="font-medium">{it.t}</span></li>
        ))}
      </ul>
    );
  }
  // steps
  return (
    <ol className="space-y-6 max-w-3xl">
      {items.map((it, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex-none w-9 h-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">{i + 1}</span>
          <div>
            <h4 className="font-headline text-lg font-bold">{it.h}</h4>
            {it.b && <p className="text-on-surface-variant leading-relaxed mt-1">{it.b}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 2: Create `src/components/templates/ProjectTemplateRenderer.tsx`**

```tsx
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import type { Contact } from '../../lib/types';
import type { ProjectMeta, SectionDef, TemplateValue } from '../../lib/templates/types';
import { SectionView } from './template-sections';

// One renderer for every project template — differs only by the sections it walks.
export function ProjectTemplateRenderer({
  meta, values, sections, contact,
}: { meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; contact: Contact }) {
  const facts = [
    { label: 'Location', value: meta.location },
    { label: 'Duration', value: meta.duration },
    { label: 'Year', value: meta.year },
    { label: 'Service', value: meta.category },
  ].filter((f) => f.value?.trim());

  return (
    <>
      <section className="relative h-[460px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-black/45 z-10" />
        {meta.cover && <img className="absolute inset-0 w-full h-full object-cover" src={meta.cover} alt={meta.title} />}
        <div className="relative z-20 max-w-7xl mx-auto px-8 pb-12 w-full">
          <Link to="/projects" className="inline-flex items-center gap-1 text-white/90 text-sm font-semibold mb-4 hover:text-white transition-colors">
            <Icon name="arrow_back" className="text-base" /> All Projects
          </Link>
          <span className="block text-inverse-primary font-bold uppercase tracking-[0.2em] text-sm mb-2">{meta.category}</span>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white tracking-tight">{meta.title}</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        {facts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-outline-variant/30">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{f.label}</div>
                <div className="font-headline font-bold text-lg">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        {meta.intro?.trim() && <p className="text-2xl leading-relaxed font-light mt-12 max-w-4xl text-on-surface">{meta.intro}</p>}
        <div className="mt-14 flex flex-col gap-12">
          {sections.map((s) => <SectionView key={s.key} section={s} value={values[s.key] ?? s.default} />)}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">Want a finish like this?</h2>
        <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Tell us about your place and we'll give you an honest, no-obligation quote.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-95 transition-all">Request a Free Quote</Link>
          <a href={'tel:' + contact.phone.replace(/\s/g, '')} className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-surface-container-high transition-all inline-flex items-center justify-center gap-2"><Icon name="call" /> {contact.phone}</a>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. (If `Icon` prop `filled` type errors, check `src/components/ui/Icon.tsx` — it accepts `filled`, per ServiceDetailPage usage.)

- [ ] **Step 4: Commit** (skip if commits not authorized)

```bash
git add src/components/templates/
git commit -m "feat: add data-driven project template renderer"
```

---

## Task 5: `ProjectDetailPage` dispatch to template renderer

**Files:**
- Modify: `src/pages/ProjectDetailPage.tsx:24-40` (insert dispatch before the static-fallback block)

**Interfaces:**
- Consumes: `project.page` (`ProjectPage`), `projectTemplates`, `ProjectTemplateRenderer`.

- [ ] **Step 1: Add the template branch**

In `src/pages/ProjectDetailPage.tsx`, add imports:
```ts
import { projectTemplates } from '../lib/templates/project-templates';
import { ProjectTemplateRenderer } from '../components/templates/ProjectTemplateRenderer';
```
Immediately after the `if (!project || project.visible === false)` guard block (currently ends `src/pages/ProjectDetailPage.tsx:23`), insert:
```tsx
  // Templated project (created via the compose wizard) → render its template.
  if (project.page) {
    const def = projectTemplates[project.page.templateId];
    if (def) {
      return <ProjectTemplateRenderer meta={project.page.meta} values={project.page.values} sections={def.sections} contact={contact} />;
    }
  }
```
Add `contact` to the destructure at the top of the component:
```ts
const { projects: PROJECTS, contact } = useSiteContent();
```
Legacy projects (no `page`) keep the existing static `PROJECT_DETAILS` fallback below — unchanged.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Manual check**

Run: `npm run dev`. Temporarily add a `page` to one project in `src/content/site-content.json` (e.g. `"page": { "templateId": "casestudy", "meta": {…}, "values": {…} }` using Task 3 defaults) and visit `/projects/<id>`.
Expected: the case-study template renders (hero, facts, Challenge/Solution/Result, quote). Then REVERT the temporary JSON edit.

- [ ] **Step 4: Commit** (skip if commits not authorized)

```bash
git add src/pages/ProjectDetailPage.tsx
git commit -m "feat: render templated projects via the template registry"
```

---

## Task 6: `validateProjectPage` + wire into `validateContent` (TDD)

**Files:**
- Create: `src/lib/templates/validate-page.ts`, `src/lib/templates/__tests__/validate-page.test.ts`
- Modify: `src/lib/content-schema.ts`

**Interfaces:**
- Produces: `function validateProjectPage(page: ProjectPage, name: string): string[]`
- Consumes in `content-schema.ts`: iterate `c.projects`, call `validateProjectPage(p.page, name)` when present; validate `c.serviceStyle`.

- [ ] **Step 1: Write the failing test**

`src/lib/templates/__tests__/validate-page.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateProjectPage } from '../validate-page';
import type { ProjectPage } from '../types';

const base: ProjectPage = {
  templateId: 'beforeafter',
  meta: { title: 'T', category: 'C', location: 'L', duration: 'D', year: 'Y',
    cover: 'https://x/c.jpg', intro: 'i' },
  values: { ba: { before: 'https://x/b.jpg', after: 'https://x/a.jpg' } },
};

describe('validateProjectPage', () => {
  it('accepts a valid before/after page', () => {
    expect(validateProjectPage(base, 'T')).toEqual([]);
  });
  it('rejects a non-https cover', () => {
    const bad = { ...base, meta: { ...base.meta, cover: 'http://x/c.jpg' } };
    expect(validateProjectPage(bad, 'T').some((e) => /cover/i.test(e))).toBe(true);
  });
  it('rejects a non-https before/after image', () => {
    const bad = { ...base, values: { ba: { before: 'ftp://x', after: 'https://x/a.jpg' } } };
    expect(validateProjectPage(bad, 'T').length).toBeGreaterThan(0);
  });
  it('rejects an unknown templateId', () => {
    const bad = { ...base, templateId: 'nope' as ProjectPage['templateId'] };
    expect(validateProjectPage(bad, 'T').some((e) => /template/i.test(e))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../validate-page'`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/templates/validate-page.ts`:
```ts
import type { ProjectPage, TemplateValue } from './types';
import { projectTemplates } from './project-templates';

const isHttps = (u: string | undefined) => /^https:\/\//i.test((u ?? '').trim());

// Validates a templated project page: known template, https cover, and every image-URL
// sub-field (before/after images, gallery images) https. Text fields are not required here.
export function validateProjectPage(page: ProjectPage, name: string): string[] {
  const errors: string[] = [];
  const def = projectTemplates[page.templateId];
  if (!def) { errors.push(`Project ${name} uses an unknown template "${page.templateId}".`); return errors; }
  if (!page.meta?.title?.trim()) errors.push(`Project ${name} needs a title.`);
  if (!isHttps(page.meta?.cover)) errors.push(`Project ${name} cover image must be an https:// URL.`);

  for (const s of def.sections) {
    const v: TemplateValue | undefined = page.values?.[s.key];
    if (s.style === 'beforeafter' && v && typeof v === 'object' && !Array.isArray(v)) {
      if (!isHttps(v.before)) errors.push(`Project ${name} before image must be an https:// URL.`);
      if (!isHttps(v.after)) errors.push(`Project ${name} after image must be an https:// URL.`);
    }
    if (s.style === 'gallery' && Array.isArray(v)) {
      v.forEach((it, i) => { if (!isHttps(it.img)) errors.push(`Project ${name} gallery photo #${i + 1} must be an https:// URL.`); });
    }
  }
  return errors;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire into `validateContent`**

In `src/lib/content-schema.ts`, add the import at top:
```ts
import { validateProjectPage } from './templates/validate-page';
```
Inside the existing `c.projects.forEach((p, i) => { … })` loop (after the image check at `src/lib/content-schema.ts:22`), add:
```ts
    if (p.page) errors.push(...validateProjectPage(p.page, name));
```
After the projects loop, add a `serviceStyle` guard:
```ts
  if (!['A', 'B', 'C', 'D', 'E'].includes(c.serviceStyle)) errors.push('Service style must be one of A–E.');
```

- [ ] **Step 6: Verify build + test**

Run: `npm run build && npm test`
Expected: both PASS.

- [ ] **Step 7: Commit** (skip if commits not authorized)

```bash
git add src/lib/templates/validate-page.ts src/lib/templates/__tests__/validate-page.test.ts src/lib/content-schema.ts
git commit -m "feat: validate templated project pages and serviceStyle on publish"
```

---

## Task 7: Compose wizard (picker → form → live preview) + store actions + admin wiring

**Files:**
- Create: `src/pages/admin/sections/compose/ComposeWizard.tsx`, `TemplatePicker.tsx`, `TemplateForm.tsx`, `TemplatePreview.tsx`
- Modify: `src/pages/admin/admin-content-store.tsx`, `src/pages/admin/AdminSidebar.tsx:8-18`, `src/pages/admin/AdminPage.tsx:22-32` (META) and render branch, `src/pages/admin/sections/ProjectsTable.tsx` (optional "New from template" button)

**Interfaces:**
- Store produces:
  - `compose: { step: 'pick' | 'build'; templateId: ProjectTemplateId | null; meta: ProjectMeta | null; values: Record<string, TemplateValue> | null }` in `AdminState`
  - `startCompose(): void` — reset to `{ step: 'pick', … null }`
  - `pickTemplate(id: ProjectTemplateId): void` — seed meta+values, step → 'build'
  - `backToTemplates(): void`
  - `updateComposeMeta(key: keyof ProjectMeta, val: string): void`
  - `updateComposeValue(key: string, val: TemplateValue): void`
  - `publishComposed(): void` — append a `Project` with `page`, then navigate to projects section (toast)
- Wizard consumes those + `projectTemplateList`, `ProjectTemplateRenderer`.

- [ ] **Step 1: Add compose state + actions to the store**

In `src/pages/admin/admin-content-store.tsx`:
- Import: `import type { ProjectMeta, ProjectTemplateId, TemplateValue } from '../../lib/types'; import { projectTemplates } from '../../lib/templates/project-templates'; import { seedValues } from '../../lib/templates/seed';`
- Add to `AdminState`:
```ts
  compose: { step: 'pick' | 'build'; templateId: ProjectTemplateId | null; meta: ProjectMeta | null; values: Record<string, TemplateValue> | null };
```
- Initialise in `initState()`: `compose: { step: 'pick', templateId: null, meta: null, values: null },`
- Add `Action` variants:
```ts
  | { t: 'COMPOSE_START' }
  | { t: 'COMPOSE_PICK'; id: ProjectTemplateId }
  | { t: 'COMPOSE_BACK' }
  | { t: 'COMPOSE_META'; key: keyof ProjectMeta; val: string }
  | { t: 'COMPOSE_VALUE'; key: string; val: TemplateValue }
  | { t: 'COMPOSE_PUBLISH'; id: string }
```
- Add reducer cases:
```ts
    case 'COMPOSE_START':
      return { ...state, compose: { step: 'pick', templateId: null, meta: null, values: null } };
    case 'COMPOSE_PICK': {
      const def = projectTemplates[a.id];
      return { ...state, compose: { step: 'build', templateId: a.id, meta: { ...def.defaultMeta }, values: seedValues(def.sections) } };
    }
    case 'COMPOSE_BACK':
      return { ...state, compose: { step: 'pick', templateId: null, meta: null, values: null } };
    case 'COMPOSE_META':
      return state.compose.meta ? { ...state, compose: { ...state.compose, meta: { ...state.compose.meta, [a.key]: a.val } } } : state;
    case 'COMPOSE_VALUE':
      return state.compose.values ? { ...state, compose: { ...state.compose, values: { ...state.compose.values, [a.key]: a.val } } } : state;
    case 'COMPOSE_PUBLISH': {
      const c = state.compose;
      if (!c.templateId || !c.meta || !c.values) return state;
      const proj: Project = {
        id: a.id, category: 'interior', categoryLabel: c.meta.category || 'Project',
        title: c.meta.title, desc: c.meta.intro, image: c.meta.cover, visible: true,
        page: { templateId: c.templateId, meta: c.meta, values: c.values },
      };
      return { ...state, content: { ...state.content, projects: [proj, ...state.content.projects] }, dirty: true, compose: { step: 'pick', templateId: null, meta: null, values: null }, toast: 'Project added — click Save to publish' };
    }
```
- Add helpers to `StoreApi` + `api`:
```ts
  startCompose: () => dispatch({ t: 'COMPOSE_START' }),
  pickTemplate: (id) => dispatch({ t: 'COMPOSE_PICK', id }),
  backToTemplates: () => dispatch({ t: 'COMPOSE_BACK' }),
  updateComposeMeta: (key, val) => dispatch({ t: 'COMPOSE_META', key, val }),
  updateComposeValue: (key, val) => dispatch({ t: 'COMPOSE_VALUE', key, val }),
  publishComposed: () => dispatch({ t: 'COMPOSE_PUBLISH', id: uniqueId('p', state.content.projects.map((x) => x.id)) }),
```
(Add matching signatures to the `StoreApi` interface. `Project` type is already imported at top of the file.)

- [ ] **Step 2: Create `TemplatePicker.tsx`**

```tsx
import { Icon } from '../../../../components/ui/Icon';
import { projectTemplateList } from '../../../../lib/templates/project-templates';
import type { ProjectTemplateId } from '../../../../lib/types';

export function TemplatePicker({ onPick }: { onPick: (id: ProjectTemplateId) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-headline text-lg font-extrabold">Choose a template</h2>
        <p className="text-sm text-[#8a8377] mt-1">Pick a layout to start from — you can edit every word before publishing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectTemplateList.map((t) => (
          <button key={t.id} onClick={() => onPick(t.id)} className="text-left bg-white border border-[#eae6df] rounded-2xl p-5 hover:border-primary transition-colors">
            <Icon name={t.icon} className="text-primary text-3xl mb-3" />
            <div className="font-headline font-bold text-base">{t.name}</div>
            <p className="text-sm text-[#8a8377] mt-1 mb-3">{t.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.includes.map((x) => <span key={x} className="text-[11px] font-bold bg-[#f4f2ee] text-[#8a8377] px-2 py-1 rounded-full">{x}</span>)}
            </div>
            <div className="flex items-center gap-1 text-primary font-bold text-sm mt-4">Use this template <Icon name="arrow_forward" className="text-[17px]" /></div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `TemplateForm.tsx`** (generic form from `sections[]` + meta, reusing editor primitives)

```tsx
import { Card, Field, ItemCard, AddButton } from '../homepage-editor-primitives';
import type { ProjectMeta, SectionDef, TemplateValue } from '../../../../lib/types';

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
  meta, values, sections, onMeta, onValue,
}: {
  meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[];
  onMeta: (k: keyof ProjectMeta, v: string) => void; onValue: (k: string, v: TemplateValue) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Card title="Project details" hint="The header facts shown at the top of the page.">
        <Field label="Title" value={meta.title} onChange={(v) => onMeta('title', v)} />
        <Field label="Category" value={meta.category} onChange={(v) => onMeta('category', v)} />
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
```

- [ ] **Step 4: Create `TemplatePreview.tsx`** (scaled live preview reusing the renderer)

```tsx
import { MemoryRouter } from 'react-router-dom';
import { useSiteContent } from '../../../../lib/site-content-context';
import { ProjectTemplateRenderer } from '../../../../components/templates/ProjectTemplateRenderer';
import type { ProjectMeta, SectionDef, TemplateValue } from '../../../../lib/types';

// Live preview = the real public renderer, wrapped so its <Link>s resolve, scaled to fit.
export function TemplatePreview({ meta, values, sections }: { meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[] }) {
  const { contact } = useSiteContent();
  return (
    <div className="sticky top-4 border border-[#eae6df] rounded-2xl overflow-hidden bg-white">
      <div className="text-[11px] font-bold uppercase tracking-widest text-[#8a8377] px-4 py-2 border-b border-[#eae6df] bg-[#faf8f4]">Live preview</div>
      <div className="h-[620px] overflow-auto">
        <div className="origin-top-left scale-[0.62] w-[161%]">
          <MemoryRouter>
            <ProjectTemplateRenderer meta={meta} values={values} sections={sections} contact={contact} />
          </MemoryRouter>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `ComposeWizard.tsx`** (shell)

```tsx
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
```

- [ ] **Step 6: Register the section (sidebar + META + render + entry point)**

In `src/pages/admin/AdminSidebar.tsx`, add to `nav` after the `blog` entry:
```ts
    { key: 'compose', label: 'Create content', icon: 'add_circle' },
```
In `src/pages/admin/AdminPage.tsx`:
- Import: `import { ComposeWizard } from './sections/compose/ComposeWizard';`
- Add to `META`:
```ts
  compose: ['Create content', 'Pick a template and build a new project page'],
```
- Add render branch (near the projects branch):
```tsx
          {section === 'compose' && <ComposeWizard />}
```
- Reset the wizard when navigating in: change `setSection` so selecting `compose` calls `store.startCompose()` first. Simplest: in the `compose` render branch, the wizard already defaults to `pick` on mount via store state; no extra wiring needed. (Optional: add a "New from template" button in `ProjectsTable` that calls `setSection('compose')`.)

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: PASS. Resolve any relative-import depth errors (`compose/` files are 4 levels under `src/` → `../../../../` to reach `src/components` and `src/lib`).

- [ ] **Step 8: Manual check**

Run: `npm run dev` → `/admin/compose`.
Expected: template picker shows 5 cards → pick "Before & After" → form (left) with Project details + B/A image fields + Result + Quote + attribution, live preview (right) updating as you type → "Add project" returns to compose/projects and the new project appears in the Projects list. Publish (Save) persists it; visiting `/projects/<newid>` renders the template.

- [ ] **Step 9: Commit** (skip if commits not authorized)

```bash
git add src/pages/admin/sections/compose/ src/pages/admin/admin-content-store.tsx src/pages/admin/AdminSidebar.tsx src/pages/admin/AdminPage.tsx
git commit -m "feat: add compose wizard for templated project pages"
```

---

## Task 8: Service skins (A + B) + global style selector + dispatch

**Files:**
- Create: `src/components/services/service-skins.tsx`, `ServiceSkinA.tsx`, `ServiceSkinB.tsx`, `src/pages/admin/sections/ServiceStyleEditor.tsx`
- Modify: `src/pages/ServiceDetailPage.tsx`, `src/pages/admin/sections/ServiceDetailsEditor.tsx`

**Interfaces:**
- Produces:
  - `const serviceSkins: Record<ServiceStyleId, FC<{ s: ServiceDetail; contact: Contact }>>` (A + B implemented; C/D/E fall back to A at render, "coming soon" in the picker)
  - `const SERVICE_STYLE_META: { id: ServiceStyleId; name: string; desc: string; ready: boolean }[]`

- [ ] **Step 1: Extract the current layout into `ServiceSkinA.tsx`**

Move the entire JSX return of the current `ServiceDetailPage` (`src/pages/ServiceDetailPage.tsx`, including the local `BeforeAfter` component) into a new component:
```tsx
// src/components/services/ServiceSkinA.tsx  — "Editorial / Light" (the original layout)
import type { ServiceDetail, Contact } from '../../lib/types';
// … move BeforeAfter + the full markup here, taking { s, contact } as props …
export function ServiceSkinA({ s, contact }: { s: ServiceDetail; contact: Contact }) { /* current markup */ }
```
(Keep every class and section identical — this is a lift, not a redesign.)

- [ ] **Step 2: Create `ServiceSkinB.tsx`** — port the "Cinematic / Dark" style from the design

> Source: claude.ai project `5923c23a-…`, `ThaiViet Dashboard.dc.html`, service-style preview `B` (bg `#141412`, accent gold `#c9a24b`, full-bleed hero, ink `#f4f1ea`). Read it with `DesignSync get_file` at implementation time and port the section layout. Same `ServiceDetail` fields as skin A; only the visual treatment differs (dark background, gold accents, full-bleed hero, different section order allowed).

```tsx
// src/components/services/ServiceSkinB.tsx — "Cinematic / Dark"
import type { ServiceDetail, Contact } from '../../lib/types';
export function ServiceSkinB({ s, contact }: { s: ServiceDetail; contact: Contact }) {
  // Port from design B. Must render: hero (heroTitle/heroSub/heroImg), features, midImage/midTitle/midParas/midList,
  // before/after (beforeImg/afterImg + gallery), showcase, optional quote, CTA. Dark palette (#141412 / #c9a24b / #f4f1ea).
  return (/* ported markup */);
}
```

- [ ] **Step 3: Create the registry `service-skins.tsx`**

```tsx
import type { FC } from 'react';
import type { ServiceDetail, Contact, ServiceStyleId } from '../../lib/types';
import { ServiceSkinA } from './ServiceSkinA';
import { ServiceSkinB } from './ServiceSkinB';

type SkinComp = FC<{ s: ServiceDetail; contact: Contact }>;

// A + B ship now. C/D/E fall back to A until their renderers land (spec §12).
export const serviceSkins: Record<ServiceStyleId, SkinComp> = {
  A: ServiceSkinA, B: ServiceSkinB, C: ServiceSkinA, D: ServiceSkinA, E: ServiceSkinA,
};

export const SERVICE_STYLE_META: { id: ServiceStyleId; name: string; desc: string; ready: boolean }[] = [
  { id: 'A', name: 'Editorial / Light', desc: 'Warm cream, magazine grid, before/after.', ready: true },
  { id: 'B', name: 'Cinematic / Dark', desc: 'Charcoal + gold, full-bleed hero.', ready: true },
  { id: 'C', name: 'Structured / Grid', desc: 'White, ruled borders, numbered tiles.', ready: false },
  { id: 'D', name: 'Soft / Minimal', desc: 'Airy, centred, rounded cards, pills.', ready: false },
  { id: 'E', name: 'Bold / Poster', desc: 'Big display type, colour blocks.', ready: false },
];
```

- [ ] **Step 4: Make `ServiceDetailPage` a dispatcher**

Replace the body of `src/pages/ServiceDetailPage.tsx` with:
```tsx
import { Navigate, useParams } from 'react-router-dom';
import { useSiteContent } from '../lib/site-content-context';
import { serviceSkins } from '../components/services/service-skins';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { contact, serviceDetails, serviceStyle } = useSiteContent();
  const s = serviceDetails.find((d) => d.slug === slug);
  if (!s) return <Navigate to="/services" replace />;
  const Skin = serviceSkins[serviceStyle] ?? serviceSkins.A;
  return <Skin s={s} contact={contact} />;
}
```

- [ ] **Step 5: Create `ServiceStyleEditor.tsx`** (global selector)

```tsx
import { Icon } from '../../../components/ui/Icon';
import { useAdminStore } from '../admin-content-store';
import { SERVICE_STYLE_META } from '../../../components/services/service-skins';

export function ServiceStyleEditor() {
  const store = useAdminStore();
  const current = store.state.content.serviceStyle;
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6">
      <h3 className="font-headline text-base font-bold">Service page layout</h3>
      <p className="text-xs text-[#8a8377] mt-1 mb-4">Choose the template used for all service detail pages. The same content is re-laid-out in the chosen style.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICE_STYLE_META.map((t) => {
          const selected = current === t.id;
          return (
            <button key={t.id} disabled={!t.ready} onClick={() => store.setServiceStyle(t.id)}
              className={'text-left p-4 rounded-xl border-2 transition-colors ' + (selected ? 'border-primary' : 'border-[#eae6df]') + (t.ready ? ' hover:border-primary' : ' opacity-50 cursor-not-allowed')}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Style {t.id} · {t.name}</span>
                {selected && <Icon name="check_circle" className="text-primary text-lg" />}
              </div>
              <p className="text-xs text-[#8a8377] mt-1">{t.desc}</p>
              {!t.ready && <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8377]">Coming soon</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Add `setServiceStyle` to the store**

In `src/pages/admin/admin-content-store.tsx`: add action `{ t: 'SET_SERVICE_STYLE'; id: ServiceStyleId }`, reducer case `return { ...state, content: { ...state.content, serviceStyle: a.id }, dirty: true, toast: 'Layout style updated — click Save to publish' };`, helper `setServiceStyle: (id) => dispatch({ t: 'SET_SERVICE_STYLE', id })`, and import `ServiceStyleId` from `../../lib/types`. Add its signature to `StoreApi`.

- [ ] **Step 7: Mount the selector in the Service Pages section**

In `src/pages/admin/sections/ServiceDetailsEditor.tsx`, import and render `<ServiceStyleEditor />` at the very top of the section's returned markup, above the per-service editors.

- [ ] **Step 8: Verify build + manual**

Run: `npm run build`
Expected: PASS.
Run: `npm run dev` → `/admin/servicePages`: the style selector shows A–E (C/D/E disabled). Select B → Save → visit a `/services/:slug` page: it renders in the dark cinematic style. Select A → renders the original layout unchanged.

- [ ] **Step 9: Commit** (skip if commits not authorized)

```bash
git add src/components/services/ src/pages/ServiceDetailPage.tsx src/pages/admin/sections/ServiceStyleEditor.tsx src/pages/admin/sections/ServiceDetailsEditor.tsx src/pages/admin/admin-content-store.tsx
git commit -m "feat: add service-page layout styles (A + B) with global selector"
```

---

## Task 9: Home page reskin

**Files:**
- Modify: `src/pages/HomePage.tsx` (and, only if the new design adds sections, `src/lib/types.ts` `Home`, `src/content/site-content.json`, `src/pages/admin/sections/HomeEditor.tsx`, `src/lib/content-schema.ts`)

- [ ] **Step 1: Read the design**

Use `DesignSync get_file` on project `5923c23a-…`, path `ThaiViet Home.dc.html`. Produce a section list and compare to the current `Home` schema (`src/lib/types.ts:134-146`: hero, trust, intro, video, services, whyChoose, featuredProjects, process, reviews, serviceAreas, cta).

- [ ] **Step 2: Decide schema impact**

- If the new design's sections map to the existing `Home` fields → **reskin markup only** in `HomePage.tsx`, no schema change.
- If it adds a section/field → extend `Home` + `site-content.json` default + `HomeEditor` + (image) validation, following the CLAUDE.md sync rule. **Do not rename existing `home.*` keys.**

- [ ] **Step 3: Re-implement `HomePage.tsx` to match the design**

Port the design's markup, keeping all copy/image bindings pointing at `useSiteContent().home.*` so the page stays admin-editable. Keep `featuredProjects` reading from `projects` (per README note).

- [ ] **Step 4: Verify build + manual**

Run: `npm run build`
Expected: PASS.
Run: `npm run dev` → `/`: matches `ThaiViet Home.dc.html`; every text/image still edits from `/admin/home`.

- [ ] **Step 5: Commit** (skip if commits not authorized)

```bash
git add src/pages/HomePage.tsx src/lib/types.ts src/content/site-content.json src/pages/admin/sections/HomeEditor.tsx src/lib/content-schema.ts
git commit -m "feat: reskin home page to new design"
```

---

## Task 10: Docs + final verification

**Files:**
- Modify: `README.md`; add/update relevant `docs/` files.

- [ ] **Step 1: Update `README.md`**

- Component tree: add `components/templates/` (ProjectTemplateRenderer, template-sections), `components/services/` (ServiceSkinA/B, service-skins), `pages/admin/sections/compose/*`, `ServiceStyleEditor`.
- Routes/content-block map: note projects can carry a templated `page`; service pages have a global `serviceStyle`; admin sections gain **Create content** (compose wizard) and the **Service page layout** selector.
- Add a short "Templates" subsection: how to add a new project template (append to `project-templates.ts`) and a new service skin (add a component + register in `service-skins.tsx` + flip `ready: true`).

- [ ] **Step 2: Full verification**

Run: `npm run build && npm test`
Expected: build PASS (tsc strict + vite build), all Vitest logic tests PASS.

- [ ] **Step 3: Manual smoke of the whole flow**

Run: `npm run dev`. Verify in one pass:
1. `/admin/compose`: create a "Photo Story" project, edit gallery captions, watch preview, add it, Save.
2. `/projects/<newid>`: renders the photo-story template.
3. `/admin/servicePages`: switch style A↔B, Save, confirm `/services/:slug` changes.
4. `/`: new Home design, still editable from `/admin/home`.
5. An existing legacy project detail page still renders (static fallback) unchanged.

- [ ] **Step 4: Commit** (skip if commits not authorized)

```bash
git add README.md docs/
git commit -m "docs: document template registry, compose wizard, service styles"
```

---

## Self-Review (completed against the spec)

- **Spec §4.1 service skins** → Task 8 (A+B + selector + dispatch; C/D/E registry entries, deferred). ✓
- **Spec §4.2 project registry (5 templates, section kinds text/pair/repeat)** → Tasks 3 (data), 4 (renderer + section kinds), 7 (form). ✓
- **Spec §4.2 renderer reused for public + preview** → Task 4 renderer, Task 7 `TemplatePreview` wraps it. ✓
- **Spec §5 data model (Project.page, serviceStyle)** → Task 1. ✓
- **Spec §6 rendering dispatch** → Task 5 (projects), Task 8 (services). ✓
- **Spec §7 admin wiring (compose, style editor, store, sidebar/META)** → Tasks 7, 8. ✓
- **Spec §8 back-compat / legacy fallback** → Task 1 defaults + Task 5 keeps static fallback. ✓
- **Spec §9 validation & publish** → Task 6. ✓
- **Spec §10 phases / §12 decisions (A+B only, no legacy convert, template-first)** → task order + Global Constraints. ✓
- **Spec §2 Home reskin** → Task 9. ✓
- **CLAUDE.md docs+dashboard sync** → Task 10 + admin wiring in every content task. ✓
- **Placeholder scan:** design-derived visuals (ServiceSkinB Step 2, Home Task 9) are explicit "port from `DesignSync get_file`" steps with the exact source + field contract — intentional, since inventing pixel markup would be wrong. All logic/data/wiring steps carry complete code. ✓
- **Type consistency:** `seedValues`, `projectTemplates`, `ProjectPage`, `serviceStyle`, `serviceSkins`, `compose` action names are used identically across tasks. ✓
