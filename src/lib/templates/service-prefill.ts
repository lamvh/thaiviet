import type { ServiceDetail } from '../types';
import type { ServiceMeta, ServiceTemplateDef } from './types';

// Seed a template's meta from an existing service's content so applying a template is
// lossless where fields map directly (hero + intro).
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
