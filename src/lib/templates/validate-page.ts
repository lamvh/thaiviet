import type { ProjectPage, ServicePage, TemplateValue } from './types';
import { projectTemplates } from './project-templates';
import { serviceTemplates } from './service-templates';
import { isRenderableImageUrl, IMAGE_URL_HINT } from '../image-url';

// Validates a templated project page: known template, https cover, every image-URL
// sub-field (before/after images, gallery images) https, and every substantive body
// paragraph (a `rule`-style text section) non-empty.
export function validateProjectPage(page: ProjectPage, name: string): string[] {
  const errors: string[] = [];
  const def = projectTemplates[page.templateId];
  if (!def) { errors.push(`Project ${name} uses an unknown template "${page.templateId}".`); return errors; }
  if (!page.meta?.title?.trim()) errors.push(`Project ${name} needs a title.`);
  if (!isRenderableImageUrl(page.meta?.cover)) errors.push(`Project ${name} cover image ` + IMAGE_URL_HINT);

  for (const s of def.sections) {
    const v: TemplateValue | undefined = page.values?.[s.key];
    if (s.style === 'beforeafter' && v && typeof v === 'object' && !Array.isArray(v)) {
      if (!isRenderableImageUrl(v.before)) errors.push(`Project ${name} before image ` + IMAGE_URL_HINT);
      if (!isRenderableImageUrl(v.after)) errors.push(`Project ${name} after image ` + IMAGE_URL_HINT);
    }
    if (s.style === 'gallery' && Array.isArray(v)) {
      v.forEach((it, i) => { if (!isRenderableImageUrl(it.img)) errors.push(`Project ${name} gallery photo #${i + 1} ` + IMAGE_URL_HINT); });
    }
    if (s.kind === 'text' && s.style === 'rule') {
      const text = typeof v === 'string' ? v : '';
      if (!text.trim()) errors.push(`Project ${name} — "${s.title}" is required.`);
    }
  }
  return errors;
}

// Validates a templated service page: known template, https hero image, and every
// image-URL sub-field (before/after, showcase/features/gallery images) https.
export function validateServicePage(page: ServicePage, name: string): string[] {
  const errors: string[] = [];
  const def = serviceTemplates[page.templateId];
  if (!def) { errors.push(`Service ${name} uses an unknown template "${page.templateId}".`); return errors; }
  if (!page.meta?.heroTitle?.trim()) errors.push(`Service ${name} needs a hero title.`);
  if (!isRenderableImageUrl(page.meta?.heroImg)) errors.push(`Service ${name} hero image ` + IMAGE_URL_HINT);

  for (const s of def.sections) {
    const v: TemplateValue | undefined = page.values?.[s.key];
    if (s.style === 'beforeafter' && v && typeof v === 'object' && !Array.isArray(v)) {
      if (!isRenderableImageUrl(v.before)) errors.push(`Service ${name} before image ` + IMAGE_URL_HINT);
      if (!isRenderableImageUrl(v.after)) errors.push(`Service ${name} after image ` + IMAGE_URL_HINT);
    }
    if ((s.style === 'gallery' || s.style === 'showcase' || s.style === 'features') && Array.isArray(v)) {
      v.forEach((it, i) => {
        const url = it.img;
        if (url !== undefined && url !== '' && !isRenderableImageUrl(url)) errors.push(`Service ${name} ${s.style} image #${i + 1} ` + IMAGE_URL_HINT);
      });
    }
  }
  return errors;
}
