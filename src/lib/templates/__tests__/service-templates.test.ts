import { describe, it, expect } from 'vitest';
import { serviceTemplateList, serviceTemplates } from '../service-templates';

describe('serviceTemplateList', () => {
  it('has unique ids', () => {
    const ids = serviceTemplateList.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every template has a layout and at least one section', () => {
    for (const t of serviceTemplateList) {
      expect(t.layout).toBeTruthy();
      expect(t.sections.length).toBeGreaterThan(0);
    }
  });
  it('the map is keyed by id', () => {
    expect(serviceTemplates.serviceclassic.name).toBe('Classic Service');
  });
});
