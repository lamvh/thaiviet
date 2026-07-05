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
