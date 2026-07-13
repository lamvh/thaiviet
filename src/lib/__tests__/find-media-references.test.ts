import { describe, it, expect } from 'vitest';
import { findMediaReferences } from '../find-media-references';
import type { SiteContent } from '../../pages/admin/useAdminContent';

const content = {
  hero: { image: 'https://cdn/x/logo.png' },
  home: { video: { src: 'https://cdn/x/clip.mp4', poster: 'https://cdn/x/logo.png' } },
  projects: [
    { id: 'p1', image: 'https://cdn/x/logo.png' },
    { id: 'p2', image: 'https://cdn/x/other.jpg' },
  ],
  areas: ['Wellington'],
} as unknown as SiteContent;

describe('findMediaReferences', () => {
  it('finds every breadcrumb path that references a URL', () => {
    const refs = findMediaReferences(content, 'https://cdn/x/logo.png');
    expect(refs).toContain('hero.image');
    expect(refs).toContain('home.video.poster');
    expect(refs).toContain('projects[0].image');
    expect(refs).toHaveLength(3);
  });

  it('matches even when the reference carries a cache-buster query string', () => {
    const withBust = { hero: { image: 'https://cdn/x/logo.png?v=42' } } as unknown as SiteContent;
    expect(findMediaReferences(withBust, 'https://cdn/x/logo.png')).toEqual(['hero.image']);
  });

  it('returns empty when nothing references the URL', () => {
    expect(findMediaReferences(content, 'https://cdn/x/unused.png')).toEqual([]);
    expect(findMediaReferences(content, '')).toEqual([]);
  });
});
