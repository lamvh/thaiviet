import type { NavItem } from '../lib/types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

// `to` points each service at its dedicated detail page (/services/<slug>).
export const SERVICE_LINKS = {
  painting: [
    { icon: 'format_paint', label: 'Interior Painting', to: '/services/interior' },
    { icon: 'home_work', label: 'Exterior Painting', to: '/services/exterior' },
    { icon: 'roofing', label: 'Roof Painting', to: '/services/roof' },
  ],
  speciality: [
    { icon: 'cleaning_services', label: 'Paint Stripping', to: '/services/stripping' },
    { icon: 'layers', label: 'Plastering & GIB Stopping', to: '/services/plastering' },
    { icon: 'forest', label: 'Wood Staining', to: '/services/wood' },
    { icon: 'construction', label: 'Building Work', to: '/services/building' },
    { icon: 'grid_on', label: 'Flooring', to: '/services/flooring' },
  ],
};
