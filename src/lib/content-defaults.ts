import type { SiteContent } from '../pages/admin/useAdminContent';
import bundled from '../content/site-content.json';
import { migrateServices, type LegacyServiceDetail } from './migrate-services';

// Bundled JSON is the complete, always-valid shape. The DB row may be older than the
// current schema (e.g. saved before the homepage blocks existed), so every remote load
// is merged over these defaults — missing keys fall back instead of rendering undefined.
// The bundled services are still the legacy "fat" shape, so heal them here too — this
// keeps DEFAULT_CONTENT (and therefore initState) valid template-only services without
// hand-migrating the JSON blob.
export const DEFAULT_CONTENT = {
  ...(bundled as Record<string, unknown>),
  serviceDetails: migrateServices((bundled as { serviceDetails: LegacyServiceDetail[] }).serviceDetails),
} as unknown as SiteContent;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Recursive merge: objects merge key-by-key; arrays and primitives from `over` replace
// `base` wholesale (we never want to splice default array items into edited lists).
function deepMerge<T>(base: T, over: unknown): T {
  // null/undefined never override a default — fall back so consumers never receive a
  // null where the bundled shape has a real value (which would crash .map/.replace).
  // An empty string / empty array is a real, intentional value and still overrides.
  if (over === undefined || over === null) return base;
  if (!isPlainObject(base) || !isPlainObject(over)) return over as T;
  const out: Record<string, unknown> = { ...base };
  // Union of keys so a field saved in the DB but absent from the bundled default
  // (a newer schema field) is preserved instead of silently dropped on every load.
  for (const key of new Set([...Object.keys(base as Record<string, unknown>), ...Object.keys(over)])) {
    out[key] = deepMerge((base as Record<string, unknown>)[key], over[key]);
  }
  return out as T;
}

// TEMPORARY — remove once the live content row has been republished.
// The stored row still points at a retired banner on an external host. Because the
// row wins over the bundled default, the site loaded the new banner and then swapped
// back to the old one the moment the remote content arrived. Until the row is fixed,
// rewrite that one dead URL to the bundled asset on every load.
//
// This is a targeted find-and-replace on the retired URL, not a forced value: any
// other image an editor picks passes through untouched. Admin loads through the same
// path, so the corrected URL is what the next Publish writes back — after that this
// block is dead code and both constants can go.
const RETIRED_BANNER_URL = 'https://project.vinapage.com/thaivietconz/images/banner.png';
const BUNDLED_BANNER_PATH = '/images/hero-banner.webp';

function rewriteRetiredBanner<T>(node: T): T {
  if (typeof node === 'string') {
    return (node === RETIRED_BANNER_URL ? BUNDLED_BANNER_PATH : node) as T;
  }
  if (Array.isArray(node)) return node.map(rewriteRetiredBanner) as T;
  if (isPlainObject(node)) {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) out[key] = rewriteRetiredBanner(value);
    return out as T;
  }
  return node;
}

// Fill any gaps in a (possibly partial / legacy) content object with bundled defaults,
// then heal the services list — old DB rows predate the templated service pages, so
// every load back-fills card fields + a default template rather than rejecting the row.
export function withContentDefaults(partial: unknown): SiteContent {
  const merged = deepMerge(DEFAULT_CONTENT, rewriteRetiredBanner(partial));
  return { ...merged, serviceDetails: migrateServices(merged.serviceDetails ?? []) };
}
