import type { ServiceDetail } from './types';

// A service is visible unless its serviceDetails entry is explicitly hidden. The
// serviceDetails array (keyed by slug) is the single source of truth for service
// visibility — every public surface (grid, detail, nav menu, homepage) filters through it.
export function isServiceVisible(details: ServiceDetail[], slug: string): boolean {
  const d = details.find((x) => x.slug === slug);
  return d ? d.visible !== false : true;
}

// Nav links store the route (`/services/<slug>`); pull the slug back out to check visibility.
export function slugFromServicePath(to: string): string {
  return to.split('/').pop() ?? '';
}
