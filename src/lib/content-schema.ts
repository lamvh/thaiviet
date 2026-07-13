import type { SiteContent } from '../pages/admin/useAdminContent';
import { validateProjectPage, validateServicePage } from './templates/validate-page';

const isHttps = (u: string | undefined) => /^https:\/\//i.test((u ?? '').trim());

// Validates the working copy before it is committed. tsc cannot catch these because
// the JSON is cast — this is the real correctness gate before publishing.
export function validateContent(c: SiteContent): string[] {
  const errors: string[] = [];

  if (!c.hero?.title?.trim()) errors.push('Hero headline is required.');
  if (!c.hero?.subtitle?.trim()) errors.push('Hero sub-headline is required.');
  if (!isHttps(c.hero?.image)) errors.push('Hero image must be an https:// URL.');

  const seen = new Set<string>();
  c.projects.forEach((p, i) => {
    const name = p.title || p.id || `#${i + 1}`;
    if (!p.id) errors.push(`Project ${name} is missing an id.`);
    else if (seen.has('p:' + p.id)) errors.push(`Duplicate project id "${p.id}".`);
    else seen.add('p:' + p.id);
    if (!p.title?.trim()) errors.push(`Project ${name} needs a title.`);
    if (!p.categoryLabel?.trim()) errors.push(`Project ${name} needs a category.`);
    if (!isHttps(p.image)) errors.push(`Project ${name} image must be an https:// URL.`);
    if (p.page) errors.push(...validateProjectPage(p.page, name));
  });

  c.posts.forEach((p, i) => {
    const name = p.title || p.id || `#${i + 1}`;
    if (!p.id) errors.push(`Post ${name} is missing an id.`);
    else if (seen.has('b:' + p.id)) errors.push(`Duplicate post id "${p.id}".`);
    else seen.add('b:' + p.id);
    if (!p.title?.trim()) errors.push(`Post ${name} needs a title.`);
    if (!p.readTime?.trim()) errors.push(`Post ${name} needs a read time.`);
    if (!isHttps(p.image)) errors.push(`Post ${name} image must be an https:// URL.`);
  });

  if (!c.contact?.phone?.trim()) errors.push('Contact phone is required.');
  if (!c.contact?.email?.trim()) errors.push('Contact email is required.');
  if (!Array.isArray(c.areas) || c.areas.length === 0) errors.push('At least one service area is required.');

  const hp = c.homepage;
  if (hp) {
    if (!isHttps(hp.heritage?.image)) errors.push('Heritage section image must be an https:// URL.');
    if (!isHttps(hp.people?.imageA)) errors.push('People section image (left) must be an https:// URL.');
    if (!isHttps(hp.people?.imageB)) errors.push('People section image (right) must be an https:// URL.');
    if (!isHttps(hp.preparation?.image)) errors.push('Preparation section image must be an https:// URL.');
  }

  const hm = c.home;
  if (hm) {
    if (!hm.hero?.titleLead?.trim() && !hm.hero?.titleAccent?.trim()) errors.push('Homepage hero headline is required.');
    if (!isHttps(hm.hero?.image)) errors.push('Homepage hero image must be an https:// URL.');
    if (!isHttps(hm.intro?.image)) errors.push('Homepage intro image must be an https:// URL.');
    // Video is optional (empty = no video section), but any set URL — direct file or
    // third-party embed — must be https:// or it is mixed-content-blocked in production.
    if (hm.video?.src?.trim() && !isHttps(hm.video.src)) errors.push('Homepage video URL must be an https:// URL.');
    if (hm.video?.poster?.trim() && !isHttps(hm.video.poster)) errors.push('Homepage video poster must be an https:// URL.');
    if (!isHttps(hm.serviceAreas?.mapImage)) errors.push('Homepage service-areas map image must be an https:// URL.');
  }

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

  const pv = c.privacy;
  if (pv) {
    if (!pv.title?.trim()) errors.push('Privacy policy title is required.');
    (pv.sections ?? []).forEach((s, i) => {
      if (!s.heading?.trim()) errors.push(`Privacy section #${i + 1} needs a heading.`);
    });
  }

  return errors;
}
