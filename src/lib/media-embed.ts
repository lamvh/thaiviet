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

// The canonical, human-openable page for an embed URL. Facebook's plugin player
// (plugins/video.php) redirects iOS browsers to a player-less mobile page, so on
// phones we link out to the real video instead. FB plugin URLs wrap the real video
// URL in the `href` query param; other embeds already point at an openable page.
export function getEmbedWatchUrl(src: string): string {
  try {
    const url = new URL(src);
    if (url.pathname.includes('/plugins/video.php')) {
      return url.searchParams.get('href') ?? src;
    }
    return src;
  } catch {
    return src;
  }
}
