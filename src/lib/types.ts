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
  visible?: boolean;
}

export interface Hero { title: string; subtitle: string; image: string; }

export interface Contact { phone: string; email: string; facebook: string; messenger: string; hours: string; }

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

export interface Post { id: string; category: string; title: string; excerpt: string; image: string; date: string; readTime: string; visible?: boolean; }

export interface Reel { src: string; label: string; title?: string; }

// ---- Homepage content blocks (all editable from the admin "Homepage" section) ----

export interface MissionCard { icon: string; title: string; desc: string; }
export interface Stat { value: string; label: string; desc: string; }

// "Your Home. Our Care." — titleLead + titleAccent render as one line, accent coloured.
export interface HomeHeritage { eyebrow: string; titleLead: string; titleAccent: string; paragraphs: string[]; image: string; quote: string; }
export interface HomeMission { title: string; subtitle: string; cards: MissionCard[]; }
export interface HomePeople { eyebrow: string; title: string; paragraphs: string[]; imageA: string; imageB: string; }
export interface HomePreparation { title: string; intro: string; bullets: string[]; image: string; }
export interface HomeStats { title: string; items: Stat[]; }
export interface HomeCta { title: string; subtitle: string; primaryLabel: string; primaryTo: string; secondaryLabel: string; secondaryTo: string; }

export interface Homepage {
  heritage: HomeHeritage;
  mission: HomeMission;
  people: HomePeople;
  preparation: HomePreparation;
  stats: HomeStats;
  cta: HomeCta;
}
