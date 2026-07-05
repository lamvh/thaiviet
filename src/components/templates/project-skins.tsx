import type { FC } from 'react';
import type { ProjectStyleId } from '../../lib/types';
import type { ProjectLayoutProps } from './project-layouts/shared';
import { ProjectLayoutClassic } from './project-layouts/ProjectLayoutClassic';
import { ProjectLayoutSidebar } from './project-layouts/ProjectLayoutSidebar';
import { ProjectLayoutBeforeAfter } from './project-layouts/ProjectLayoutBeforeAfter';
import { ProjectLayoutBento } from './project-layouts/ProjectLayoutBento';
import { ProjectLayoutMinimal } from './project-layouts/ProjectLayoutMinimal';

type LayoutComp = FC<ProjectLayoutProps>;

// Global layout style → the skin that re-lays-out the same templated project content.
// D has no design yet and falls back to the classic layout (see PROJECT_STYLE_META).
export const projectLayouts: Record<ProjectStyleId, LayoutComp> = {
  A: ProjectLayoutClassic,
  B: ProjectLayoutSidebar,
  C: ProjectLayoutBeforeAfter,
  D: ProjectLayoutClassic,
  E: ProjectLayoutBento,
  F: ProjectLayoutMinimal,
};

export const PROJECT_STYLE_META: { id: ProjectStyleId; name: string; desc: string; ready: boolean }[] = [
  { id: 'A', name: 'Classic / Full-width', desc: 'Hero, facts strip, then sections stacked in one column.', ready: true },
  { id: 'B', name: 'Sidebar', desc: 'Sticky facts card + quote CTA beside the content.', ready: true },
  { id: 'C', name: 'Before / After focus', desc: 'Leads with the transformation in a featured band.', ready: true },
  { id: 'D', name: 'Editorial / Magazine', desc: 'Ruled columns and pull quotes.', ready: false },
  { id: 'E', name: 'Bento mosaic', desc: 'Facts + sections tiled into a card mosaic.', ready: true },
  { id: 'F', name: 'Minimal centered', desc: 'Narrow, centred reading column with lots of air.', ready: true },
];
