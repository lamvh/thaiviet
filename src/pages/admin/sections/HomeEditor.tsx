import { useAdminStore } from '../admin-content-store';
import type { Home } from '../../../lib/types';
import { Card, Field, StringList, ItemCard, AddButton } from './homepage-editor-primitives';

// Full editor for the landing page ("/") content. Each control patches one slice of the
// `home` object through the store's updateHome(updater) helper. Featured Projects pulls
// live from the Projects section, so only its heading text is editable here.
export function HomeEditor() {
  const { state, updateHome } = useAdminStore();
  const hm = state.content.home;

  // Patch one object block (hero, intro, video, …) by merging a partial into it.
  function patch<K extends keyof Home>(block: K, partial: Partial<Home[K]>) {
    updateHome((h) => ({ ...h, [block]: { ...h[block], ...partial } }));
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <Card title="Hero — “Your Home. Our Care.”">
        <Field label="Badge" value={hm.hero.badge} onChange={(v) => patch('hero', { badge: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title (lead)" value={hm.hero.titleLead} onChange={(v) => patch('hero', { titleLead: v })} />
          <Field label="Title (accent)" value={hm.hero.titleAccent} onChange={(v) => patch('hero', { titleAccent: v })} />
        </div>
        <Field label="Subtitle" area value={hm.hero.subtitle} onChange={(v) => patch('hero', { subtitle: v })} />
        <Field label="Background image URL" value={hm.hero.image} onChange={(v) => patch('hero', { image: v })} />
        <Field label="Certifications label" value={hm.hero.certLabel} onChange={(v) => patch('hero', { certLabel: v })} />
        <StringList label="Certification image URLs" items={hm.hero.certs} onChange={(certs) => patch('hero', { certs })} />
      </Card>

      <Card title="Trust indicators" hint="The four badges shown under the hero.">
        {hm.trust.map((t, i) => (
          <ItemCard key={i} onRemove={() => updateHome((h) => ({ ...h, trust: h.trust.filter((_, j) => j !== i) }))}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon (Material Symbol)" value={t.icon} onChange={(v) => updateHome((h) => ({ ...h, trust: h.trust.map((x, j) => (j === i ? { ...x, icon: v } : x)) }))} />
              <Field label="Label" value={t.label} onChange={(v) => updateHome((h) => ({ ...h, trust: h.trust.map((x, j) => (j === i ? { ...x, label: v } : x)) }))} />
            </div>
          </ItemCard>
        ))}
        <AddButton label="Add indicator" onClick={() => updateHome((h) => ({ ...h, trust: [...h.trust, { icon: 'verified', label: 'New indicator' }] }))} />
      </Card>

      <Card title="Intro — company overview">
        <Field label="Eyebrow" value={hm.intro.eyebrow} onChange={(v) => patch('intro', { eyebrow: v })} />
        <Field label="Title" value={hm.intro.title} onChange={(v) => patch('intro', { title: v })} />
        <Field label="Body" area value={hm.intro.body} onChange={(v) => patch('intro', { body: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Years value" value={hm.intro.yearsValue} onChange={(v) => patch('intro', { yearsValue: v })} />
          <Field label="Years label" value={hm.intro.yearsLabel} onChange={(v) => patch('intro', { yearsLabel: v })} />
        </div>
        {/* Certificate fields temporarily hidden — section #2 removed from the homepage, kept in hero banner only.
        <Field label="Certifications label" value={hm.intro.certLabel} onChange={(v) => patch('intro', { certLabel: v })} />
        <StringList label="Certification image URLs" items={hm.intro.certs} onChange={(certs) => patch('intro', { certs })} />
        */}
        <Field label="Image URL" value={hm.intro.image} onChange={(v) => patch('intro', { image: v })} />
        <Field label="Testimonial quote" area value={hm.intro.testimonialQuote} onChange={(v) => patch('intro', { testimonialQuote: v })} />
        <Field label="Testimonial attribution" value={hm.intro.testimonialBy} onChange={(v) => patch('intro', { testimonialBy: v })} />
      </Card>

      <Card title="Intro video">
        <Field label="Eyebrow" value={hm.video.eyebrow} onChange={(v) => patch('video', { eyebrow: v })} />
        <Field label="Title" value={hm.video.title} onChange={(v) => patch('video', { title: v })} />
        <Field label="Poster image URL" value={hm.video.poster} onChange={(v) => patch('video', { poster: v })} />
        <Field label="Video URL (mp4)" value={hm.video.src} onChange={(v) => patch('video', { src: v })} />
      </Card>

      <Card title="Featured services" hint="The service cards grid.">
        <Field label="Section title" value={hm.services.title} onChange={(v) => patch('services', { title: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA card title" value={hm.services.ctaTitle} onChange={(v) => patch('services', { ctaTitle: v })} />
          <Field label="CTA button label" value={hm.services.ctaLabel} onChange={(v) => patch('services', { ctaLabel: v })} />
        </div>
        <Field label="CTA card text" area value={hm.services.ctaText} onChange={(v) => patch('services', { ctaText: v })} />
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377]">Service cards</label>
        {hm.services.cards.map((c, i) => (
          <ItemCard key={i} onRemove={() => patch('services', { cards: hm.services.cards.filter((_, j) => j !== i) })}>
            <Field label="Image URL" value={c.image} onChange={(v) => patch('services', { cards: hm.services.cards.map((x, j) => (j === i ? { ...x, image: v } : x)) })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title" value={c.title} onChange={(v) => patch('services', { cards: hm.services.cards.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="Tag" value={c.tag} onChange={(v) => patch('services', { cards: hm.services.cards.map((x, j) => (j === i ? { ...x, tag: v } : x)) })} />
            </div>
            <Field label="Description" area value={c.desc} onChange={(v) => patch('services', { cards: hm.services.cards.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
          </ItemCard>
        ))}
        <AddButton label="Add service card" onClick={() => patch('services', { cards: [...hm.services.cards, { image: '', title: 'New service', desc: '', tag: '' }] })} />
      </Card>

      <Card title="Why choose us">
        <Field label="Title" value={hm.whyChoose.title} onChange={(v) => patch('whyChoose', { title: v })} />
        <Field label="Intro" area value={hm.whyChoose.intro} onChange={(v) => patch('whyChoose', { intro: v })} />
        <Field label="Subtitle" value={hm.whyChoose.subtitle} onChange={(v) => patch('whyChoose', { subtitle: v })} />
        <StringList label="Bullets" items={hm.whyChoose.bullets} onChange={(bullets) => patch('whyChoose', { bullets })} />
        <Field label="Closing paragraph" area value={hm.whyChoose.closing} onChange={(v) => patch('whyChoose', { closing: v })} />
      </Card>

      <Card title="Featured projects" hint="Cards come from the Projects section — only the heading is edited here.">
        <Field label="Eyebrow" value={hm.featuredProjects.eyebrow} onChange={(v) => patch('featuredProjects', { eyebrow: v })} />
        <Field label="Title" value={hm.featuredProjects.title} onChange={(v) => patch('featuredProjects', { title: v })} />
      </Card>

      <Card title="Our process">
        <Field label="Title" value={hm.process.title} onChange={(v) => patch('process', { title: v })} />
        <Field label="Subtitle" area value={hm.process.subtitle} onChange={(v) => patch('process', { subtitle: v })} />
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377]">Steps</label>
        {hm.process.steps.map((s, i) => (
          <ItemCard key={i} onRemove={() => patch('process', { steps: hm.process.steps.filter((_, j) => j !== i) })}>
            <Field label="Title" value={s.title} onChange={(v) => patch('process', { steps: hm.process.steps.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
            <Field label="Description" area value={s.desc} onChange={(v) => patch('process', { steps: hm.process.steps.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
          </ItemCard>
        ))}
        <AddButton label="Add step" onClick={() => patch('process', { steps: [...hm.process.steps, { title: 'New step', desc: '' }] })} />
      </Card>

      <Card title="Customer reviews">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow" value={hm.reviews.eyebrow} onChange={(v) => patch('reviews', { eyebrow: v })} />
          <Field label="Title" value={hm.reviews.title} onChange={(v) => patch('reviews', { title: v })} />
        </div>
        <Field label="Rating label" value={hm.reviews.ratingLabel} onChange={(v) => patch('reviews', { ratingLabel: v })} />
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377]">Reviews</label>
        {hm.reviews.items.map((r, i) => (
          <ItemCard key={i} onRemove={() => patch('reviews', { items: hm.reviews.items.filter((_, j) => j !== i) })}>
            <Field label="Quote" area value={r.quote} onChange={(v) => patch('reviews', { items: hm.reviews.items.map((x, j) => (j === i ? { ...x, quote: v } : x)) })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" value={r.name} onChange={(v) => patch('reviews', { items: hm.reviews.items.map((x, j) => (j === i ? { ...x, name: v } : x)) })} />
              <Field label="Meta" value={r.meta} onChange={(v) => patch('reviews', { items: hm.reviews.items.map((x, j) => (j === i ? { ...x, meta: v } : x)) })} />
            </div>
          </ItemCard>
        ))}
        <AddButton label="Add review" onClick={() => patch('reviews', { items: [...hm.reviews.items, { quote: '', name: 'New client', meta: '' }] })} />
      </Card>

      <Card title="Service areas">
        <Field label="Title" value={hm.serviceAreas.title} onChange={(v) => patch('serviceAreas', { title: v })} />
        <Field label="Intro" area value={hm.serviceAreas.intro} onChange={(v) => patch('serviceAreas', { intro: v })} />
        <StringList label="Areas" items={hm.serviceAreas.areas} onChange={(areas) => patch('serviceAreas', { areas })} />
        <Field label="Map image URL" value={hm.serviceAreas.mapImage} onChange={(v) => patch('serviceAreas', { mapImage: v })} />
        <Field label="Map label" value={hm.serviceAreas.mapLabel} onChange={(v) => patch('serviceAreas', { mapLabel: v })} />
      </Card>

      <Card title="Call to action (bottom)">
        <Field label="Title" value={hm.cta.title} onChange={(v) => patch('cta', { title: v })} />
        <Field label="Subtitle" area value={hm.cta.subtitle} onChange={(v) => patch('cta', { subtitle: v })} />
        <Field label="Primary button label" value={hm.cta.primaryLabel} onChange={(v) => patch('cta', { primaryLabel: v })} />
      </Card>
    </div>
  );
}
