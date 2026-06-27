import type { ProjectDetail } from '../lib/types';

const U = 'https://images.unsplash.com/';
const G = 'https://lh3.googleusercontent.com/aida-public/';

// Facebook video embed for the on-site walkthrough
const fbVideo = (id: string) =>
  'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F' +
  id + '%2F&show_text=false';

// Rich case-study content keyed by project id. Projects without an entry fall
// back to their base fields (image, title, category, desc) on the detail page.
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'plimmerton-coastal': {
    location: 'Plimmerton, Porirua',
    service: 'Exterior Repaint & Weatherproofing',
    duration: '3 weeks',
    completed: '2024',
    heroImage: U + 'photo-1572120360610-d971b9d7767c?w=1200&q=80',
    intro:
      'A 1990s weatherboard home perched directly above the Plimmerton coastline — beautiful views, brutal exposure. Years of salt-laden wind had stripped the paint film and opened the timber to moisture.',
    challenge:
      'Salt spray and driving wind had degraded the previous coating, with flaking on the seaward elevation and early rot in two weatherboards.',
    solution:
      'Full wash-down and chloride treatment, scrape and sand back to sound substrate, replace the two damaged boards, then a 3-coat premium UV- and salt-resistant system.',
    result:
      'A weather-tight, low-sheen finish built to last in marine conditions — backed by our 5-year workmanship guarantee.',
    gallery: [
      U + 'photo-1572120360610-d971b9d7767c?w=900&q=80',
      U + 'photo-1600585154340-be6161a56a0c?w=900&q=80',
      G + 'AB6AXuBjp-mJO-OorLjQ6Sp3-95aiRBOIWGVuPrtxXKNrSDBWG-4pr7piJ3OqS9XjEM3ebCEcS-2mL5-_PlEEBpGyIiKcXnPANZBhYJ_-_5D7JTys6iQghsiHrF0XiXuxEO9GXY9p0TMmNkk7hO9S6t7SMjHI2xu1NTZGji2SQID_1LAe7_ylDgrtvsrpLDfNInPvvuWLPR49A5oloMlebHCCDVG7hwA7RB9sjOwMEcwY7vuy28PCXo9diH1nfUUs79CCWsNJgFGN6dMjZI',
    ],
    videoSrc: fbVideo('988170293658202'),
    testimonialQuote:
      "Our house has never looked better and it's holding up beautifully against the sea wind. The team was tidy, on time and genuinely cared.",
    testimonialBy: 'Sarah & Mark — Plimmerton',
  },
};
