export type ProjectCategory =
  | 'interior' | 'exterior' | 'roof' | 'stripping'
  | 'plastering' | 'wood' | 'building' | 'flooring';

export interface NavItem { label: string; to: string; }

export interface Service { icon: string; title: string; desc: string; features: string[]; }

export interface Project {
  id: string;
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  desc: string;
  image: string;
}

export interface ProjectDetail {
  location: string;
  service: string;
  duration: string;
  completed: string;
  heroImage: string;
  intro: string;
  challenge: string;
  solution: string;
  result: string;
  gallery: string[];
  videoSrc?: string;
  testimonialQuote?: string;
  testimonialBy?: string;
}

export interface Post { category: string; title: string; excerpt: string; image: string; date: string; readTime: string; }

export interface Reel { src: string; label: string; title?: string; }
