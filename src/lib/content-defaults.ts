import type { SiteContent } from '../pages/admin/useAdminContent';
import bundled from '../content/site-content.json';

// Bundled JSON is the complete, always-valid shape. The DB row may be older than the
// current schema (e.g. saved before the homepage blocks existed), so every remote load
// is merged over these defaults — missing keys fall back instead of rendering undefined.
export const DEFAULT_CONTENT = bundled as unknown as SiteContent;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Recursive merge: objects merge key-by-key; arrays and primitives from `over` replace
// `base` wholesale (we never want to splice default array items into edited lists).
function deepMerge<T>(base: T, over: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(over)) return (over === undefined ? base : (over as T));
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base as Record<string, unknown>)) {
    out[key] = deepMerge((base as Record<string, unknown>)[key], over[key]);
  }
  return out as T;
}

// Fill any gaps in a (possibly partial / legacy) content object with bundled defaults.
export function withContentDefaults(partial: unknown): SiteContent {
  return deepMerge(DEFAULT_CONTENT, partial);
}
