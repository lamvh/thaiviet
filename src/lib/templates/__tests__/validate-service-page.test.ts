import { describe, it, expect } from 'vitest';
import { validateServicePage } from '../validate-page';
import type { ServicePage } from '../types';

const base: ServicePage = {
  templateId: 'serviceclassic',
  meta: { slug: 'interior', icon: 'format_paint', name: 'Interior', heroTitle: 'Interior Painting', heroSub: 'x',
    heroImg: 'https://x/y.jpg', introTitle: "What's included", intro: 'hi' },
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
