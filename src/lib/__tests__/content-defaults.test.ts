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

  // Temporary launch guard — delete alongside pinServiceImages once these three images
  // are handed back to the CMS.
  describe('pinned service images', () => {
    const PINNED = {
      interior: '/images/interior-painting.webp',
      exterior: '/images/exterior-painting.webp',
      roof: '/images/roof-maintenance.webp',
    };
    const bySlug = (c: { serviceDetails: { slug: string; image: string; page: { meta: { heroImg: string } } }[] }) =>
      Object.fromEntries(c.serviceDetails.map((s) => [s.slug, s]));

    it('overrides the stored image for the pinned services (card and hero alike)', () => {
      const stored = {
        serviceDetails: (['interior', 'exterior', 'roof'] as const).map((slug) => ({
          slug,
          name: slug,
          image: 'https://lh3.googleusercontent.com/aida-public/expired',
          heroImg: 'https://lh3.googleusercontent.com/aida-public/expired',
        })),
      };
      const services = bySlug(withContentDefaults(stored));
      for (const [slug, path] of Object.entries(PINNED)) {
        expect(services[slug].image).toBe(path);
        expect(services[slug].page.meta.heroImg).toBe(path);
      }
    });

    it('leaves a non-pinned service on its stored image', () => {
      const services = bySlug(
        withContentDefaults({
          serviceDetails: [{ slug: 'plastering', name: 'Plastering', image: 'https://cdn.example/plaster.webp' }],
        }),
      );
      expect(services.plastering.image).toBe('https://cdn.example/plaster.webp');
    });
  });
});
