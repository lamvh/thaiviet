import type { SectionDef, TemplateValue } from './types';

export function cloneTemplateValue(v: TemplateValue): TemplateValue {
  if (typeof v === 'string') return v;
  return JSON.parse(JSON.stringify(v)) as TemplateValue;
}

// Build the initial editable values for a template: each section's default, deep-cloned
// so the admin's edits never mutate the shared template definition.
export function seedValues(sections: SectionDef[]): Record<string, TemplateValue> {
  const out: Record<string, TemplateValue> = {};
  for (const s of sections) out[s.key] = cloneTemplateValue(s.default);
  return out;
}
