import type { Hero, Contact, Project, Post, Homepage, Home, ServiceDetail, PrivacyPolicy } from '../../lib/types';

export interface SiteContent {
  hero: Hero;
  home: Home;         // landing page ("/") content
  homepage: Homepage; // about page ("/about") content — original key kept for content compatibility
  serviceDetails: ServiceDetail[]; // the CRUD list of services (one templated /services/<slug> page each)
  projects: Project[];
  posts: Post[];
  areas: string[];
  contact: Contact;
  privacy: PrivacyPolicy; // privacy policy page ("/privacy") content
}

export type AdminSection = 'overview' | 'projects' | 'blog' | 'compose' | 'home' | 'about' | 'services' | 'serviceCompose' | 'areas' | 'contact' | 'privacy' | 'media' | 'settings';

// The editable content store lives in admin-content-store.tsx (context + reducer with
// localStorage autosave). This module now only owns the shared shape types.
