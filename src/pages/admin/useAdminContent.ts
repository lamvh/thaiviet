import type { Hero, Contact, Project, Post, Homepage, Home } from '../../lib/types';

export interface SiteContent {
  hero: Hero;
  home: Home;         // landing page ("/") content
  homepage: Homepage; // about page ("/about") content — original key kept for content compatibility
  projects: Project[];
  posts: Post[];
  areas: string[];
  contact: Contact;
}

export type AdminSection = 'overview' | 'projects' | 'blog' | 'home' | 'about' | 'areas' | 'contact' | 'settings';

// The editable content store lives in admin-content-store.tsx (context + reducer with
// localStorage autosave). This module now only owns the shared shape types.
