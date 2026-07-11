import { describe, it, expect } from 'vitest';
import { isEmbedVideoUrl } from '../media-embed';

describe('isEmbedVideoUrl', () => {
  it('recognizes known third-party embed hosts', () => {
    expect(isEmbedVideoUrl('https://www.facebook.com/plugins/video.php?href=x')).toBe(true);
    expect(isEmbedVideoUrl('https://facebook.com/plugins/video.php')).toBe(true);
    expect(isEmbedVideoUrl('https://www.youtube.com/embed/abc123')).toBe(true);
    expect(isEmbedVideoUrl('https://player.vimeo.com/video/123')).toBe(true);
    expect(isEmbedVideoUrl('https://www.tiktok.com/embed/123')).toBe(true);
  });

  it('treats direct video files (e.g. Supabase Storage uploads) as non-embeds', () => {
    expect(isEmbedVideoUrl('https://xyzcompany.supabase.co/storage/v1/object/public/media/clip.mp4')).toBe(false);
    expect(isEmbedVideoUrl('https://example.com/videos/walkthrough.mp4')).toBe(false);
  });

  it('fails safe (non-embed) on malformed input', () => {
    expect(isEmbedVideoUrl('not a url')).toBe(false);
    expect(isEmbedVideoUrl('')).toBe(false);
  });
});
