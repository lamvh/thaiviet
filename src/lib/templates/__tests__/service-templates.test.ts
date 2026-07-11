import { describe, it, expect } from 'vitest';
import { serviceTemplateList, serviceTemplates } from '../service-templates';

const LAYOUTS = ['A', 'B', 'C', 'D', 'E', 'F'];

describe('service templates', () => {
  it('defines one template per layout A–F', () => {
    expect(serviceTemplateList).toHaveLength(6);
    expect(serviceTemplateList.map((t) => t.layout).sort()).toEqual(LAYOUTS);
  });
  it('every template has slug + icon in defaultMeta and the shared sections', () => {
    for (const t of serviceTemplateList) {
      expect(typeof t.defaultMeta.slug).toBe('string');
      expect(typeof t.defaultMeta.icon).toBe('string');
      expect(t.sections.map((s) => s.key)).toEqual(['features', 'approachBody', 'approach', 'ba', 'gallery', 'showcase', 'quote', 'author']);
    }
  });
  it('registry is keyed by id', () => {
    for (const t of serviceTemplateList) expect(serviceTemplates[t.id]).toBe(t);
  });
});
