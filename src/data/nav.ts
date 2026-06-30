import type { NavItem } from '../lib/types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

// `to` overrides the default /services target for services that have a dedicated page.
export const SERVICE_LINKS = {
  painting: [
    { icon: 'format_paint', label: 'Interior Painting', to: '/services/interior' },
    { icon: 'home_work', label: 'Exterior Painting' },
    { icon: 'roofing', label: 'Roof Painting' },
  ],
  speciality: [
    { icon: 'cleaning_services', label: 'Paint Stripping' },
    { icon: 'layers', label: 'Plastering & GIB Stopping' },
    { icon: 'forest', label: 'Wood Staining' },
    { icon: 'construction', label: 'Building Work' },
    { icon: 'grid_on', label: 'Flooring' },
  ],
};
