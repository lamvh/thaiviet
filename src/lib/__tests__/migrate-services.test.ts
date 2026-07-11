import { describe, it, expect } from 'vitest';
import { migrateServices, type LegacyServiceDetail } from '../migrate-services';
import type { ServiceDetail } from '../types';
import type { ServiceMeta, TemplateValue } from '../templates/types';
import bundled from '../../content/site-content.json';

const legacy = {
  slug: 'interior', name: 'Interior Painting',
  heroTitle: 'Interior', heroSub: 'Flawless interiors', heroImg: 'https://x/h.jpg',
  introTitle: 'What’s Included', introA: 'Intro a', introB: '',
  features: [{ icon: 'brush', title: 'Walls', desc: 'x' }],
  midEyebrow: '', midTitle: '', midImage: 'https://x/m.jpg', midParas: [], midList: [{ /* n/a */ }] as unknown as string[],
  beforeImg: 'https://x/b.jpg', afterImg: 'https://x/a.jpg',
  gallery: [], showcase: [{ title: 'S', blurb: 'b', img: 'https://x/s.jpg' }],
  quote: 'Great', quoteName: 'Jo', quoteSub: '',
} as unknown as ServiceDetail;

describe('migrateServices', () => {
  it('adds a serviceclassic page + card fields to a legacy entry', () => {
    const [m] = migrateServices([legacy]);
    expect(m.page?.templateId).toBe('serviceclassic');
    expect(m.icon).toBe('format_paint');     // from SERVICE_ICON['interior']
    expect(m.desc).toBe('Flawless interiors'); // = heroSub
    expect(m.image).toBe('https://x/h.jpg');   // = heroImg
    expect(m.page?.meta.slug).toBe('interior');
  });
  it('is idempotent — keeps an existing page', () => {
    const withPage = { ...legacy, page: { templateId: 'servicebento', meta: {} as ServiceMeta, values: {} } } as unknown as ServiceDetail;
    const [m] = migrateServices([withPage]);
    expect(m.page?.templateId).toBe('servicebento'); // unchanged
    expect(m.icon).toBe('format_paint');             // card fields still filled
  });

  it('migrates a legacy "fat" service losslessly (roof: approach body + gallery + quote sub)', () => {
    const details = (bundled as { serviceDetails: LegacyServiceDetail[] }).serviceDetails;
    const roof = details.find((d) => d.slug === 'roof');
    expect(roof).toBeDefined();
    expect(roof?.page).toBeUndefined(); // roof is a legacy entry without a page

    const migrated = migrateServices(details);
    const m = migrated.find((d) => d.slug === 'roof');
    const vals = m?.page?.values as Record<string, TemplateValue>;

    // approach body (midTitle + midParas) survives as a non-empty string
    const approachBody = vals.approachBody as string;
    expect(typeof approachBody).toBe('string');
    expect(approachBody.length).toBeGreaterThan(0);
    expect(approachBody).toContain(roof!.midTitle!);

    // gallery keeps midImage + every legacy gallery URL, none dropped
    const gallery = vals.gallery as Array<Record<string, string>>;
    expect(Array.isArray(gallery)).toBe(true);
    expect(gallery.length).toBe(1 + (roof!.gallery?.length ?? 0));
    expect(gallery[0].img).toBe(roof!.midImage);

    // quote attribution combines name + sub
    expect(vals.author).toBe(`${roof!.quoteName} · ${roof!.quoteSub}`);

    // intro merges introA + introB (nothing dropped)
    expect(m?.page?.meta.intro).toContain(roof!.introB!);
  });
});
