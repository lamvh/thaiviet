import type { FC } from 'react';
import type { ServiceStyleId } from '../../lib/types';
import type { ServiceLayoutProps } from './service-template-layouts/shared';
import { ServiceLayoutClassic } from './service-template-layouts/ServiceLayoutClassic';
import { ServiceLayoutSidebar } from './service-template-layouts/ServiceLayoutSidebar';
import { ServiceLayoutCinematic } from './service-template-layouts/ServiceLayoutCinematic';
import { ServiceLayoutTimeline } from './service-template-layouts/ServiceLayoutTimeline';
import { ServiceLayoutBento } from './service-template-layouts/ServiceLayoutBento';
import { ServiceLayoutMinimal } from './service-template-layouts/ServiceLayoutMinimal';

type LayoutComp = FC<ServiceLayoutProps>;

// Global templated-service layouts — the full A–F family from the design.
export const serviceTemplateLayouts: Record<ServiceStyleId, LayoutComp> = {
  A: ServiceLayoutClassic, B: ServiceLayoutSidebar, C: ServiceLayoutCinematic,
  D: ServiceLayoutTimeline, E: ServiceLayoutBento, F: ServiceLayoutMinimal,
};

// Section keys each layout ACTUALLY renders — the source of truth for gating the compose
// editor so hidden blocks aren't shown as fillable fields. Must match each layout's JSX:
// switching layouts keeps the underlying values, this only controls which editor cards show.
export const LAYOUT_SECTIONS: Record<ServiceStyleId, string[]> = {
  A: ['features', 'approachBody', 'approach', 'ba', 'gallery', 'showcase', 'quote', 'author'],
  B: ['features', 'approachBody', 'approach', 'ba', 'gallery', 'showcase', 'quote', 'author'],
  C: ['ba', 'features'],
  D: ['approach'],
  E: ['showcase', 'quote', 'author'],
  F: ['features', 'quote', 'author'],
};

export const SERVICE_TEMPLATE_LAYOUT_META: { id: ServiceStyleId; name: string; ready: boolean }[] = [
  { id: 'A', name: 'Classic', ready: true }, { id: 'B', name: 'Sidebar', ready: true },
  { id: 'C', name: 'Cinematic', ready: true }, { id: 'D', name: 'Process Timeline', ready: true },
  { id: 'E', name: 'Bento Mosaic', ready: true }, { id: 'F', name: 'Minimal', ready: true },
];
