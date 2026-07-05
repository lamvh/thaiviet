import type { FC } from 'react';
import type { ServiceStyleId } from '../../lib/types';
import type { ServiceLayoutProps } from './service-template-layouts/shared';
import { ServiceLayoutClassic } from './service-template-layouts/ServiceLayoutClassic';

type LayoutComp = FC<ServiceLayoutProps>;

// Global templated-service layouts. Only A ships now (the starter layout). Future client
// designs add layouts and flip their `ready` flag in SERVICE_TEMPLATE_LAYOUT_META.
export const serviceTemplateLayouts: Record<ServiceStyleId, LayoutComp> = {
  A: ServiceLayoutClassic,
  B: ServiceLayoutClassic,
  C: ServiceLayoutClassic,
  D: ServiceLayoutClassic,
  E: ServiceLayoutClassic,
};

export const SERVICE_TEMPLATE_LAYOUT_META: { id: ServiceStyleId; name: string; ready: boolean }[] = [
  { id: 'A', name: 'Classic', ready: true },
  { id: 'B', name: 'Layout B', ready: false },
  { id: 'C', name: 'Layout C', ready: false },
  { id: 'D', name: 'Layout D', ready: false },
  { id: 'E', name: 'Layout E', ready: false },
];
