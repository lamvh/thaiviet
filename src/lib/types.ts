import type { ProjectPage, ServicePage } from './templates/types';
export type { ProjectPage, ProjectMeta, ProjectTemplateId, ProjectTemplateDef, SectionDef, TemplateValue, ServiceStyleId, ProjectStyleId, ServiceMeta, ServicePage, ServiceTemplateId, ServiceTemplateDef } from './templates/types';

export type ProjectCategory =
  | 'interior' | 'exterior' | 'roof' | 'stripping'
  | 'plastering' | 'wood' | 'building' | 'flooring';

export interface NavItem { label: string; to: string; }

// A service is a CRUD-able CMS item: card fields (icon/desc/image derived from its
// template meta) plus a required templated detail page. The public grid, menu, footer
// and homepage cards all derive from this list.
export interface ServiceDetail {
  slug: string;
  name: string;
  icon: string;   // card + menu icon (Material Symbol)
  desc: string;   // card blurb (= page hero subtitle)
  image: string;  // card image (= page hero image)
  visible?: boolean; // false = temporarily hidden from the site, menu and homepage (defaults to visible)
  page: ServicePage; // templated detail content (/services/<slug>)
}

export interface Project {
  id: string;
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  desc: string;
  image: string;
  visible?: boolean;
  page?: ProjectPage; // templated detail content (present when created via the compose wizard)
}

export interface Hero { title: string; subtitle: string; image: string; }

export interface Contact { phone: string; email: string; facebook: string; messenger: string; hours: string; }

// Privacy policy page ("/privacy") content — a title + intro, an ordered list of
// sections (each with paragraphs and optional bullet points), and a closing note.
export interface PrivacySection { heading: string; paragraphs: string[]; bullets: string[]; }
export interface PrivacyPolicy {
  title: string;
  intro: string;
  sections: PrivacySection[];
  contactHeading: string;
  contactIntro: string;
  closing: string;
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
export interface HomeServices { title: string; ctaTitle: string; ctaText: string; ctaLabel: string; }
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
