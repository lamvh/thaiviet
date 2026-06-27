import type { Reel } from '../lib/types';

const fb = (id: string, kind: 'reel' | 'video') =>
  'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F' +
  (kind === 'reel' ? 'reel%2F' : 'thaivietgroupltd%2Fvideos%2F') + id + '%2F&show_text=false';

export const REVIEWS: Reel[] = [
  { src: fb('1980282472456894', 'video'), label: 'Customer Review', title: 'A Happy Customer Shares Their Experience' },
  { src: fb('205806125883154', 'video'), label: 'Customer Review', title: 'Client Testimonial' },
];

export const REELS: Reel[] = [
  { src: fb('1069681567639588', 'reel'), label: 'Customer Feedback' },
  { src: fb('957873085919574', 'reel'), label: 'Customer Feedback' },
  { src: fb('996085776276181', 'reel'), label: 'Sanding Floor' },
  { src: fb('2782776648803785', 'reel'), label: 'Interior Paint' },
  { src: fb('840885235342270', 'reel'), label: 'Interior Paint' },
  { src: fb('1067851558359889', 'reel'), label: 'Interior Plaster' },
  { src: fb('1303536428169252', 'reel'), label: 'Paint Stripping' },
  { src: fb('2053683362055662', 'reel'), label: 'Paint Stripping' },
  { src: fb('988170293658202', 'reel'), label: 'Exterior Paint' },
  { src: fb('1301331505094578', 'reel'), label: 'Exterior Paint' },
  { src: fb('1884344388832015', 'reel'), label: 'Exterior & Roof Paint' },
  { src: fb('1651970202853935', 'reel'), label: 'Preparation' },
  { src: fb('1508456983819753', 'reel'), label: 'Scaffolding' },
  { src: fb('723073373537434', 'reel'), label: 'Chemical Wash' },
  { src: fb('624309313726205', 'reel'), label: 'Interior & Exterior Paint' },
  { src: fb('617894451135787', 'reel'), label: 'Renovation', title: 'Farm House' },
  { src: fb('608777572042972', 'reel'), label: 'Renovation', title: 'House' },
  { src: fb('1861983644607661', 'reel'), label: 'Renovation', title: 'Farm House' },
  { src: fb('637899315246865', 'reel'), label: 'Renovation', title: 'School' },
  { src: fb('672021368486319', 'reel'), label: 'Roof Painting' },
];
