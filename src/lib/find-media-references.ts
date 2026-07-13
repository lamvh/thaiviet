import type { SiteContent } from '../pages/admin/useAdminContent';

// Walk the CMS content tree and return human-readable breadcrumb paths of every
// string leaf that points at `url`. Used before deleting a media file so the admin
// is warned when the file is still referenced (deleting it would 404 those pages).
//
// Matches the bare URL and the URL with any query string stripped (media URLs are
// stored plain, but a cache-buster like `?v=123` may appear on some references).
export function findMediaReferences(content: SiteContent, url: string): string[] {
  if (!url) return [];
  const target = stripQuery(url);
  const hits: string[] = [];

  const walk = (node: unknown, path: string) => {
    if (typeof node === 'string') {
      if (node === url || stripQuery(node) === target) hits.push(path || '(root)');
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${path}[${i}]`));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        walk(v, path ? `${path}.${k}` : k);
      }
    }
  };

  walk(content, '');
  return hits;
}

function stripQuery(u: string): string {
  const i = u.indexOf('?');
  return i === -1 ? u : u.slice(0, i);
}
