import { describe, it, expect } from 'vitest';
import { validateProjectPage } from '../validate-page';
import type { ProjectPage } from '../types';

const base: ProjectPage = {
  templateId: 'beforeafter',
  meta: { title: 'T', category: 'C', location: 'L', duration: 'D', year: 'Y',
    cover: 'https://x/c.jpg', intro: 'i' },
  values: { ba: { before: 'https://x/b.jpg', after: 'https://x/a.jpg' }, result: 'A crisp result.' },
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
  it('rejects an empty required body section', () => {
    const bad = { ...base, values: { ...base.values, result: '   ' } };
    expect(validateProjectPage(bad, 'T').some((e) => /required/i.test(e))).toBe(true);
  });
});
