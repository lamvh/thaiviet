import { describe, it, expect } from 'vitest';
import { validateContent } from '../content-schema';
import { DEFAULT_CONTENT } from '../content-defaults';

const base = () => JSON.parse(JSON.stringify(DEFAULT_CONTENT));

describe('service slug validation', () => {
  it('accepts the bundled default services', () => {
    expect(validateContent(DEFAULT_CONTENT)).toEqual([]);
  });
  it('rejects duplicate slugs', () => {
    const c = base();
    c.serviceDetails = [c.serviceDetails[0], { ...c.serviceDetails[0] }];
    expect(validateContent(c).some((e: string) => /[Dd]uplicate service/.test(e))).toBe(true);
  });
  it('rejects a bad slug format', () => {
    const c = base();
    c.serviceDetails[0].slug = 'Bad Slug';
    expect(validateContent(c).some((e: string) => /slug/.test(e))).toBe(true);
  });
});
