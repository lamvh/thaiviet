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

  // Temporary launch guard — delete alongside rewriteRetiredBanner once the live row
  // no longer references the retired external banner.
  describe('retired banner rewrite', () => {
    const RETIRED = 'https://project.vinapage.com/thaivietconz/images/banner.png';

    it('rewrites the retired banner URL wherever the stored row still uses it', () => {
      const merged = withContentDefaults({
        home: { hero: { image: RETIRED }, video: { poster: RETIRED } },
      });
      expect(merged.home.hero.image).toBe('/images/hero-banner.webp');
      expect(merged.home.video.poster).toBe('/images/hero-banner.webp');
    });

    it('leaves any other stored image untouched', () => {
      const merged = withContentDefaults({ home: { hero: { image: 'https://cdn.example/new.webp' } } });
      expect(merged.home.hero.image).toBe('https://cdn.example/new.webp');
    });
  });

  it('lets the stored row own every service image (uploaded from admin, never overridden)', () => {
    const services = withContentDefaults({
      serviceDetails: [{ slug: 'interior', name: 'Interior Painting', image: 'https://storage.example/interior.webp' }],
    }).serviceDetails;
    expect(services[0].image).toBe('https://storage.example/interior.webp');
  });
});
