// Video sources are either a third-party embeddable player page (Facebook/YouTube/
// Vimeo/TikTok — needs an <iframe> host page to play) or a direct video file, which is
// what every Storage upload produces. Detecting which one a URL is lets one video
// component render both correctly instead of forcing every caller to track the source.
const EMBED_HOSTS = ['facebook.com', 'youtube.com', 'youtube-nocookie.com', 'vimeo.com', 'tiktok.com'];

export function isEmbedVideoUrl(src: string): boolean {
  try {
    const host = new URL(src).hostname.replace(/^www\./, '');
    return EMBED_HOSTS.some((h) => host === h || host.endsWith('.' + h));
  } catch {
    return false;
  }
}
