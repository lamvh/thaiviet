import { describe, it, expect } from 'vitest';
import { isEmbedVideoUrl, getEmbedWatchUrl } from '../media-embed';

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

describe('getEmbedWatchUrl', () => {
  it('unwraps the real video URL from a Facebook plugin URL', () => {
    const src =
      'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fthaivietgroupltd%2Fvideos%2F1980282472456894%2F&show_text=false';
    expect(getEmbedWatchUrl(src)).toBe('https://www.facebook.com/thaivietgroupltd/videos/1980282472456894/');
  });

  it('unwraps Facebook reel URLs too', () => {
    const src =
      'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1069681567639588%2F&show_text=false';
    expect(getEmbedWatchUrl(src)).toBe('https://www.facebook.com/reel/1069681567639588/');
  });

  it('returns non-plugin embed URLs unchanged', () => {
    expect(getEmbedWatchUrl('https://www.youtube.com/embed/abc123')).toBe('https://www.youtube.com/embed/abc123');
  });

  it('returns the source unchanged when there is no href param or input is malformed', () => {
    expect(getEmbedWatchUrl('https://www.facebook.com/plugins/video.php')).toBe('https://www.facebook.com/plugins/video.php');
    expect(getEmbedWatchUrl('not a url')).toBe('not a url');
  });
});
