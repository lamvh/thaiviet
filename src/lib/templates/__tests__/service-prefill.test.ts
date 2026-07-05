import { describe, it, expect } from 'vitest';
import { serviceMetaFromDetail } from '../service-prefill';
import { serviceTemplates } from '../service-templates';
import type { ServiceDetail } from '../../types';

const sd = { slug: 'interior', name: 'Interior Painting', heroTitle: 'Interior Painting',
  heroSub: 'Sub', heroImg: 'https://x/y.jpg', introTitle: 'Whats included', introA: 'A', introB: 'B',
  features: [], midEyebrow: '', midTitle: '', midImage: '', midParas: [], midList: [],
  beforeImg: '', afterImg: '', gallery: [], showcase: [] } as unknown as ServiceDetail;

describe('serviceMetaFromDetail', () => {
  it('prefills hero + intro from the existing service', () => {
    const meta = serviceMetaFromDetail(sd, serviceTemplates.serviceclassic);
    expect(meta.heroTitle).toBe('Interior Painting');
    expect(meta.heroImg).toBe('https://x/y.jpg');
    expect(meta.intro).toBe('A'); // first intro paragraph
    expect(meta.name).toBe('Interior Painting');
  });
});
