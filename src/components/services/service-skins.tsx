import type { FC } from 'react';
import type { ServiceDetail, Contact, ServiceStyleId } from '../../lib/types';
import { ServiceSkinA } from './ServiceSkinA';
import { ServiceSkinB } from './ServiceSkinB';

type SkinComp = FC<{ s: ServiceDetail; contact: Contact }>;

// A + B ship now. C/D/E fall back to A until their renderers land.
export const serviceSkins: Record<ServiceStyleId, SkinComp> = {
  A: ServiceSkinA,
  B: ServiceSkinB,
  C: ServiceSkinA,
  D: ServiceSkinA,
  E: ServiceSkinA,
};

export const SERVICE_STYLE_META: { id: ServiceStyleId; name: string; desc: string; ready: boolean }[] = [
  { id: 'A', name: 'Editorial / Light', desc: 'Warm cream, magazine grid, before/after.', ready: true },
  { id: 'B', name: 'Cinematic / Dark', desc: 'Charcoal + gold, full-bleed hero.', ready: true },
  { id: 'C', name: 'Structured / Grid', desc: 'White, ruled borders, numbered tiles.', ready: false },
  { id: 'D', name: 'Soft / Minimal', desc: 'Airy, centred, rounded cards, pills.', ready: false },
  { id: 'E', name: 'Bold / Poster', desc: 'Big display type, colour blocks.', ready: false },
];
