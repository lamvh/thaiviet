import { describe, it, expect } from 'vitest';
import { withContentDefaults, DEFAULT_CONTENT } from '../content-defaults';

describe('withContentDefaults / deepMerge', () => {
  it('falls back to the default when a stored field is null (never leaks null to consumers)', () => {
    // A legacy DB row with an explicit null must not defeat the bundled default —
    // consumers call .replace/.map on these and would crash on null.
    const merged = withContentDefaults({ contact: { phone: null } });
    expect(merged.contact.phone).toBe(DEFAULT_CONTENT.contact.phone);
    expect(merged.contact.phone).not.toBeNull();
  });

  it('keeps a real empty string (intentional clear) rather than falling back', () => {
    const merged = withContentDefaults({ contact: { hours: '' } });
    expect(merged.contact.hours).toBe('');
  });

  it('preserves a DB-only key absent from the bundled default (no silent drop)', () => {
    const merged = withContentDefaults({ contact: { phone: '021', extraNote: 'keep me' } }) as unknown as {
      contact: Record<string, unknown>;
    };
    expect(merged.contact.extraNote).toBe('keep me');
    expect(merged.contact.phone).toBe('021');
  });

  it('replaces arrays wholesale from the stored value', () => {
    const merged = withContentDefaults({ areas: ['Only One'] });
    expect(merged.areas).toEqual(['Only One']);
  });
});
