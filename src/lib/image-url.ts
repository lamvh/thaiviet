// Shared rule for "is this image source safe to render on the live site?".
//
// Two sources are allowed:
//   1. https:// — remote media (Supabase Storage public URLs, third-party CDNs).
//   2. /path    — a root-relative asset served from our own origin, i.e. a file
//                 committed under public/. The CSP allows img-src 'self'.
//
// Everything else is rejected: http:// is mixed-content-blocked in production,
// protocol-relative //host/x silently inherits the scheme and points off-origin,
// and blob:/data:/bare filenames break the moment the page is reloaded or deployed.
export const isRenderableImageUrl = (u: string | undefined) => {
  const v = (u ?? '').trim();
  // `[^/]` after the leading slash keeps protocol-relative URLs out.
  return /^https:\/\//i.test(v) || /^\/[^/]/.test(v);
};

// Reused verbatim in validation messages so the rule reads the same everywhere.
export const IMAGE_URL_HINT = 'must be an https:// URL or a site path like /images/photo.webp.';
