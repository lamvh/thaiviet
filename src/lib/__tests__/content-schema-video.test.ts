import { describe, it, expect } from 'vitest';
import { validateContent } from '../content-schema';
import { DEFAULT_CONTENT } from '../content-defaults';
import type { SiteContent } from '../../pages/admin/useAdminContent';

const clone = (): SiteContent => JSON.parse(JSON.stringify(DEFAULT_CONTENT));

describe('validateContent — homepage video URL scheme', () => {
  it('rejects a non-https homepage video URL (mixed content in production)', () => {
    const c = clone();
    c.home.video.src = 'http://insecure.example/clip.mp4';
    expect(validateContent(c)).toContain('Homepage video URL must be an https:// URL.');
  });

  it('rejects a non-https homepage video poster', () => {
    const c = clone();
    c.home.video.poster = 'http://insecure.example/poster.jpg';
    expect(validateContent(c)).toContain('Homepage video poster must be an https:// URL.');
  });

  it('allows an empty video (no video section) and an https embed URL', () => {
    const c = clone();
    c.home.video.src = '';
    expect(validateContent(c)).not.toContain('Homepage video URL must be an https:// URL.');
    c.home.video.src = 'https://www.youtube.com/embed/abc';
    expect(validateContent(c)).not.toContain('Homepage video URL must be an https:// URL.');
  });
});
