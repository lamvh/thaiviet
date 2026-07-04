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

// ---- Landing page ("/") content blocks (editable from the admin "Homepage" section) ----
// Note: the `Homepage` interface above powers the /about page (it predates this landing
// page and keeps its original data key to avoid migrating existing published content).
// This `Home` interface powers the marketing landing page at "/".

export interface HomeHeroBlock {
  badge: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  image: string;
  certLabel: string;
  certs: string[];
}
export interface TrustItem { icon: string; label: string; }
export interface HomeIntro {
  eyebrow: string;
  title: string;
  body: string;
  yearsValue: string;
  yearsLabel: string;
  certLabel: string;
  certs: string[];
  image: string;
  testimonialQuote: string;
  testimonialBy: string;
}
export interface HomeVideo { eyebrow: string; title: string; poster: string; src: string; }
export interface HomeServiceCard { image: string; title: string; desc: string; tag: string; }
export interface HomeServices { title: string; ctaTitle: string; ctaText: string; ctaLabel: string; cards: HomeServiceCard[]; }
export interface HomeWhyChoose { title: string; intro: string; subtitle: string; bullets: string[]; closing: string; }
export interface HomeFeaturedProjects { eyebrow: string; title: string; }
export interface ProcessStep { title: string; desc: string; }
export interface HomeProcess { title: string; subtitle: string; steps: ProcessStep[]; }
export interface Review { quote: string; name: string; meta: string; }
export interface HomeReviews { eyebrow: string; title: string; ratingLabel: string; items: Review[]; }
export interface HomeServiceAreas { title: string; intro: string; areas: string[]; mapImage: string; mapLabel: string; }
export interface HomeLandingCta { title: string; subtitle: string; primaryLabel: string; }

export interface Home {
  hero: HomeHeroBlock;
  trust: TrustItem[];
  intro: HomeIntro;
  video: HomeVideo;
  services: HomeServices;
  whyChoose: HomeWhyChoose;
  featuredProjects: HomeFeaturedProjects;
  process: HomeProcess;
  reviews: HomeReviews;
  serviceAreas: HomeServiceAreas;
  cta: HomeLandingCta;
}
