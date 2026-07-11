import { describe, it, expect } from 'vitest';
import { serviceMetaFromDetail } from '../service-prefill';
import { serviceTemplates } from '../service-templates';
import type { LegacyServiceDetail } from '../../migrate-services';

const sd: LegacyServiceDetail = { slug: 'interior', name: 'Interior Painting', heroTitle: 'Interior Painting',
  heroSub: 'Sub', heroImg: 'https://x/y.jpg', introTitle: 'Whats included', introA: 'A',
  features: [], midList: [], beforeImg: '', afterImg: '', showcase: [] };

describe('serviceMetaFromDetail', () => {
  it('prefills hero + intro from the existing service', () => {
    const meta = serviceMetaFromDetail(sd, serviceTemplates.serviceclassic);
    expect(meta.heroTitle).toBe('Interior Painting');
    expect(meta.heroImg).toBe('https://x/y.jpg');
    expect(meta.intro).toBe('A'); // first intro paragraph
    expect(meta.name).toBe('Interior Painting');
    expect(meta.slug).toBe('interior');
    expect(meta.icon).toBe(serviceTemplates.serviceclassic.defaultMeta.icon); // sd has no icon yet
  });
});
