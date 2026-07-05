import type { ProjectPage, ServicePage, TemplateValue } from './types';
import { projectTemplates } from './project-templates';
import { serviceTemplates } from './service-templates';

const isHttps = (u: string | undefined) => /^https:\/\//i.test((u ?? '').trim());

// Validates a templated project page: known template, https cover, every image-URL
// sub-field (before/after images, gallery images) https, and every substantive body
// paragraph (a `rule`-style text section) non-empty.
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
