import type { ServiceDetail } from './types';
import type { ServicePage, TemplateValue } from './templates/types';
import { serviceTemplates } from './templates/service-templates';
import { serviceMetaFromDetail } from './templates/service-prefill';

// Shape of a service entry as it may exist in the bundled JSON or an older DB row —
// before the slim, template-only model. The card fields + `page` are optional here and
// the legacy "fat" hero/intro/before-after fields are read to seed the first template.
export type LegacyServiceDetail = {
  slug: string;
  name: string;
  visible?: boolean;
  page?: ServicePage;
  icon?: string;
  desc?: string;
  image?: string;
  heroTitle?: string;
  heroSub?: string;
  heroImg?: string;
  introTitle?: string;
  introA?: string;
  introB?: string;
  features?: unknown;
  midTitle?: string;
  midImage?: string;
  midParas?: string[];
  midList?: unknown[];
  beforeImg?: string;
  afterImg?: string;
  gallery?: string[];
  showcase?: unknown;
  quote?: string;
  quoteName?: string;
  quoteSub?: string;
};

// Icons for the original eight services (formerly src/data/services.ts). Used to
// back-fill the card icon when migrating a legacy fat service entry.
export const SERVICE_ICON: Record<string, string> = {
  interior: 'format_paint', exterior: 'home_work', roof: 'roofing', stripping: 'cleaning_services',
  plastering: 'layers', wood: 'forest', building: 'construction', flooring: 'grid_on',
};

const val = (v: unknown): TemplateValue => (v as TemplateValue) ?? '';

// Build serviceclassic template values from a legacy fat service entry. Maps every legacy
// field onto a section so migrating stays lossless — the approach body (midTitle + midParas),
// the gallery (midImage + gallery URLs) and the quote attribution (quoteName + quoteSub) all
// survive the move to the template-only model.
function valuesFromLegacy(sd: LegacyServiceDetail): Record<string, TemplateValue> {
  const approachBody = [sd.midTitle, (sd.midParas ?? []).join('\n\n')].filter(Boolean).join('\n\n');
  const gallery = [
    { img: sd.midImage ?? '', cap: sd.midTitle ?? '' },
    ...(sd.gallery ?? []).map((g) => ({ img: g, cap: '' })),
  ].filter((x) => x.img);
  return {
    features: val(sd.features),
    approachBody,
    approach: (sd.midList ?? []).map((t) => ({ t: String(t) })),
    ba: { before: sd.beforeImg ?? '', after: sd.afterImg ?? '' },
    gallery,
    showcase: val(sd.showcase),
    quote: sd.quote ?? '',
    author: [sd.quoteName, sd.quoteSub].filter(Boolean).join(' · '),
  };
}

// Fill card fields + a serviceclassic page for any legacy entry missing `page`.
// Idempotent: entries that already have a page keep it; only card fields are ensured.
export function migrateServices(list: LegacyServiceDetail[]): ServiceDetail[] {
  return list.map((sd) => {
    const icon = sd.icon || SERVICE_ICON[sd.slug] || 'design_services';
    const desc = sd.desc || sd.heroSub || '';
    const image = sd.image || sd.heroImg || '';
    if (sd.page) {
      // Heal older pages whose meta predates slug/icon so the compose editor round-trips
      // the correct URL slug + card icon instead of blanking them on save. `meta` may be
      // absent on malformed/legacy rows — default it so this never throws (a throw here
      // is swallowed by the content load and leaves the whole site on the bundled fallback).
      const m = sd.page.meta ?? ({} as ServiceDetail['page']['meta']);
      const meta = { ...m, slug: m.slug || sd.slug, icon: m.icon || icon };
      return { slug: sd.slug, name: sd.name, visible: sd.visible, icon, desc, image, page: { ...sd.page, meta } };
    }
    const def = serviceTemplates.serviceclassic;
    const meta = serviceMetaFromDetail(sd, def); // now includes slug + icon
    return { slug: sd.slug, name: sd.name, visible: sd.visible, icon, desc, image, page: { templateId: 'serviceclassic', meta: { ...meta, icon }, values: valuesFromLegacy(sd) } };
  });
}
