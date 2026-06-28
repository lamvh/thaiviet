import type { Project } from '../lib/types';
import content from '../content/site-content.json';

// Editable project gallery — sourced from site-content.json (managed via /admin).
export const PROJECTS: Project[] = content.projects as unknown as Project[];

export const PROJECT_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'interior', label: 'Interior Painting' },
  { value: 'exterior', label: 'Exterior Painting' },
  { value: 'roof', label: 'Roof Painting' },
  { value: 'stripping', label: 'Paint Stripping' },
  { value: 'plastering', label: 'Plastering & GIB Stopping' },
  { value: 'wood', label: 'Wood Staining' },
  { value: 'building', label: 'Building Work' },
  { value: 'flooring', label: 'Flooring' },
];
