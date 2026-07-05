import type { ServiceTemplateDef, ServiceTemplateId } from './types';

// Service page templates (mirror projectTemplateList). Starter `serviceclassic` (layout A)
// reproduces the Skin A service page so migrating a service is visually lossless.
export const serviceTemplateList: ServiceTemplateDef[] = [
  {
    id: 'serviceclassic', name: 'Classic Service', icon: 'design_services',
    desc: 'The standard service page: hero, what’s included, approach, before/after and showcase.',
    includes: ['Hero', 'Features', 'Approach', 'Before/After', 'Showcase', 'Testimonial'],
    layout: 'A',
    defaultMeta: {
      name: 'New Service', heroTitle: 'Service Title', heroSub: 'Short hero subtitle.',
      heroImg: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
      introTitle: 'What’s Included', intro: 'A short introduction to the service.',
    },
    sections: [
      { key: 'features', kind: 'repeat', style: 'features', title: 'Feature cards', itemLabel: 'Feature', addLabel: 'Add feature',
        fields: [{ key: 'icon', label: 'Icon (Material Symbol)' }, { key: 'title', label: 'Title' }, { key: 'desc', label: 'Description', area: true }],
        default: [
          { icon: 'check_circle', title: 'Feature one', desc: 'What it means for the customer.' },
          { icon: 'check_circle', title: 'Feature two', desc: 'What it means for the customer.' },
        ] },
      { key: 'approach', kind: 'repeat', style: 'approach', title: 'Approach section', itemLabel: 'Point', addLabel: 'Add point',
        fields: [{ key: 't', label: 'Checklist item' }],
        default: [{ t: 'We prepare every surface properly.' }, { t: 'We leave the site clean each day.' }] },
      { key: 'ba', kind: 'pair', style: 'beforeafter', title: 'Before & After',
        fields: [{ key: 'before', label: 'Before image URL' }, { key: 'after', label: 'After image URL' }],
        default: { before: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=700&q=80', after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80' } },
      { key: 'showcase', kind: 'repeat', style: 'showcase', title: 'Project showcase', itemLabel: 'Card', addLabel: 'Add card',
        fields: [{ key: 'title', label: 'Title' }, { key: 'blurb', label: 'Blurb', area: true }, { key: 'img', label: 'Image URL' }],
        default: [{ title: 'Recent project', blurb: 'A short blurb.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' }] },
      { key: 'quote', kind: 'text', style: 'quote', title: 'Testimonial', heading: 'Client quote', label: 'Testimonial quote', area: true,
        default: 'They did a fantastic job — tidy, on time and a flawless finish.' },
      { key: 'author', kind: 'text', style: 'author', title: 'Quote attribution', label: 'Who said it', area: false,
        default: 'A happy homeowner' },
    ],
  },
];

export const serviceTemplates: Record<ServiceTemplateId, ServiceTemplateDef> =
  Object.fromEntries(serviceTemplateList.map((t) => [t.id, t])) as Record<ServiceTemplateId, ServiceTemplateDef>;
