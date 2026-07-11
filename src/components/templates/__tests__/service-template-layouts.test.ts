import { describe, it, expect } from 'vitest';
import { serviceTemplateLayouts, SERVICE_TEMPLATE_LAYOUT_META } from '../service-skins-templated';

describe('service template layout registry', () => {
  it('maps all six A–F ids to distinct layout components', () => {
    const ids = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
    for (const id of ids) expect(typeof serviceTemplateLayouts[id]).toBe('function');
    const comps = ids.map((id) => serviceTemplateLayouts[id]);
    expect(new Set(comps).size).toBe(6); // no two ids share a component (no Classic aliasing)
  });
  it('marks all six layouts ready', () => {
    expect(SERVICE_TEMPLATE_LAYOUT_META).toHaveLength(6);
    expect(SERVICE_TEMPLATE_LAYOUT_META.every((m) => m.ready)).toBe(true);
  });
});
