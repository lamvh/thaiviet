import type { ServiceMeta, ServiceTemplateDef } from './types';
import type { LegacyServiceDetail } from '../migrate-services';

// Seed a template's meta from a legacy service's content so migrating a fat entry is
// lossless where fields map directly (hero + intro).
export function serviceMetaFromDetail(sd: LegacyServiceDetail, def: ServiceTemplateDef): ServiceMeta {
  return {
    slug: sd.slug || '',
    icon: sd.icon || def.defaultMeta.icon,
    name: sd.name || def.defaultMeta.name,
    heroTitle: sd.heroTitle || def.defaultMeta.heroTitle,
    heroSub: sd.heroSub || def.defaultMeta.heroSub,
    heroImg: sd.heroImg || def.defaultMeta.heroImg,
    introTitle: sd.introTitle || def.defaultMeta.introTitle,
    intro: [sd.introA, sd.introB].filter(Boolean).join('\n\n') || def.defaultMeta.intro,
  };
}
