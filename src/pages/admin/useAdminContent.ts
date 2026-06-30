import type { Hero, Contact, Project, Post, Homepage } from '../../lib/types';

export interface SiteContent {
  hero: Hero;
  homepage: Homepage;
  projects: Project[];
  posts: Post[];
  areas: string[];
  contact: Contact;
}

export type AdminSection = 'overview' | 'projects' | 'blog' | 'home' | 'areas' | 'contact' | 'settings';

// The editable content store lives in admin-content-store.tsx (context + reducer with
// localStorage autosave). This module now only owns the shared shape types.
