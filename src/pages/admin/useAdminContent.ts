import type { Hero, Contact, Project, Post, Homepage, Home, ServiceDetail, ServiceStyleId, PrivacyPolicy } from '../../lib/types';

export interface SiteContent {
  hero: Hero;
  home: Home;         // landing page ("/") content
  homepage: Homepage; // about page ("/about") content — original key kept for content compatibility
  serviceDetails: ServiceDetail[]; // one entry per service detail page (/services/<slug>)
  serviceStyle: ServiceStyleId; // global service-page layout style
  projects: Project[];
  posts: Post[];
  areas: string[];
  contact: Contact;
  privacy: PrivacyPolicy; // privacy policy page ("/privacy") content
}

export type AdminSection = 'overview' | 'projects' | 'blog' | 'compose' | 'home' | 'about' | 'servicePages' | 'areas' | 'contact' | 'privacy' | 'media' | 'settings';

// The editable content store lives in admin-content-store.tsx (context + reducer with
// localStorage autosave). This module now only owns the shared shape types.
