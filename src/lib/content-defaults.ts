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

// Fill any gaps in a (possibly partial / legacy) content object with bundled defaults,
// then heal the services list — old DB rows predate the templated service pages, so
// every load back-fills card fields + a default template rather than rejecting the row.
export function withContentDefaults(partial: unknown): SiteContent {
  const merged = deepMerge(DEFAULT_CONTENT, partial);
  return { ...merged, serviceDetails: migrateServices(merged.serviceDetails ?? []) };
}
