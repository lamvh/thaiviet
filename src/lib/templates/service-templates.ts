import type { ServiceTemplateDef, ServiceTemplateId, SectionDef } from './types';

// Shared across all six layouts — the layout only re-arranges this content, never
// changes what it is (mirrors the classic Skin A section set so migrating a legacy
// service page stays visually lossless regardless of which layout it lands on).
const SERVICE_SECTIONS: SectionDef[] = [
  { key: 'features', kind: 'repeat', style: 'features', title: 'Feature cards', itemLabel: 'Feature', addLabel: 'Add feature',
    fields: [{ key: 'icon', label: 'Icon (Material Symbol)' }, { key: 'title', label: 'Title' }, { key: 'desc', label: 'Description', area: true }],
    default: [
      { icon: 'check_circle', title: 'Feature one', desc: 'What it means for the customer.' },
      { icon: 'check_circle', title: 'Feature two', desc: 'What it means for the customer.' },
    ] },
  { key: 'approachBody', kind: 'text', style: 'rule', title: 'Approach detail', heading: 'Our approach',
    label: 'Approach paragraph', area: true, default: '' },
  { key: 'approach', kind: 'repeat', style: 'approach', title: 'Approach section', itemLabel: 'Point', addLabel: 'Add point',
    fields: [{ key: 't', label: 'Checklist item' }],
    default: [{ t: 'We prepare every surface properly.' }, { t: 'We leave the site clean each day.' }] },
  { key: 'ba', kind: 'pair', style: 'beforeafter', title: 'Before & After',
    fields: [{ key: 'before', label: 'Before image URL' }, { key: 'after', label: 'After image URL' }],
    default: { before: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=700&q=80', after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80' } },
  { key: 'gallery', kind: 'repeat', style: 'gallery', title: 'Gallery', itemLabel: 'Photo', addLabel: 'Add photo',
    fields: [{ key: 'img', label: 'Image URL' }, { key: 'cap', label: 'Caption' }],
    default: [] },
  { key: 'showcase', kind: 'repeat', style: 'showcase', title: 'Project showcase', itemLabel: 'Card', addLabel: 'Add card',
    fields: [{ key: 'title', label: 'Title' }, { key: 'blurb', label: 'Blurb', area: true }, { key: 'img', label: 'Image URL' }],
    default: [{ title: 'Recent project', blurb: 'A short blurb.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' }] },
  { key: 'quote', kind: 'text', style: 'quote', title: 'Testimonial', heading: 'Client quote', label: 'Testimonial quote', area: true,
    default: 'They did a fantastic job — tidy, on time and a flawless finish.' },
  { key: 'author', kind: 'text', style: 'author', title: 'Quote attribution', label: 'Who said it', area: false,
    default: 'A happy homeowner' },
];

const baseMeta = (over: Partial<ServiceTemplateDef['defaultMeta']> = {}) => ({
  slug: '', icon: 'design_services', name: 'New Service',
  heroTitle: 'Service Title', heroSub: 'Short hero subtitle.',
  heroImg: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
  introTitle: 'What’s Included', intro: 'A short introduction to the service.',
  ...over,
});

export const serviceTemplateList: ServiceTemplateDef[] = [
  { id: 'serviceclassic', name: 'Classic', icon: 'design_services', layout: 'A',
    desc: 'Hero, what’s included, approach, before/after, showcase and testimonial.',
    includes: ['Hero', 'Features', 'Approach', 'Before/After', 'Showcase'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicesidebar', name: 'Sidebar', icon: 'view_sidebar', layout: 'B',
    desc: 'Compact hero with a sticky facts + quote sidebar next to the content column.',
    includes: ['Compact hero', 'Sticky facts', 'Approach', 'Before/After'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicecinematic', name: 'Cinematic', icon: 'dark_mode', layout: 'C',
    desc: 'Dark, premium magazine treatment focused on before/after pairs and a stat strip.',
    includes: ['Dark hero', 'Before/After', 'Stats', 'CTA'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicetimeline', name: 'Process Timeline', icon: 'timeline', layout: 'D',
    desc: 'Split hero then a vertical numbered process timeline and a red CTA band.',
    includes: ['Split hero', 'Timeline', 'CTA band'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'servicebento', name: 'Bento Mosaic', icon: 'grid_view', layout: 'E',
    desc: 'A bento tile grid mixing images, a red statement tile and stat tiles.',
    includes: ['Simple hero', 'Bento grid', 'Testimonial'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
  { id: 'serviceminimal', name: 'Minimal', icon: 'article', layout: 'F',
    desc: 'A calm, narrow centered reading column with a wide hero image.',
    includes: ['Centered hero', 'Wide image', 'Prose', 'Quote'],
    defaultMeta: baseMeta(), sections: SERVICE_SECTIONS },
];

export const serviceTemplates: Record<ServiceTemplateId, ServiceTemplateDef> =
  Object.fromEntries(serviceTemplateList.map((t) => [t.id, t])) as Record<ServiceTemplateId, ServiceTemplateDef>;
