import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { useSiteContent } from '../lib/site-content-context';
import { PROJECT_DETAILS } from '../data/project-details';

export function ProjectDetailPage() {
  const { projects: PROJECTS } = useSiteContent();
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find((p) => p.id === id);

  // Hidden projects must not be reachable by direct link.
  if (!project || project.visible === false) {
    return (
      <Container className="py-32 text-center">
        <h1 className="font-headline text-3xl font-bold mb-4">Project not found</h1>
        <p className="text-on-surface-variant mb-8">The project you're looking for doesn't exist or has moved.</p>
        <Link to="/projects" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold inline-flex items-center gap-2 hover:scale-95 transition-all">
          <Icon name="arrow_back" /> All Projects
        </Link>
      </Container>
    );
  }

  // Rich case-study content if available; otherwise fall back to base fields.
  const d = id ? PROJECT_DETAILS[id] : undefined;
  const heroImage = d?.heroImage ?? project.image;
  const intro = d?.intro ?? project.desc;
  const facts = d && [
    { label: 'Location', value: d.location },
    { label: 'Service', value: d.service },
    { label: 'Duration', value: d.duration },
    { label: 'Completed', value: d.completed },
  ];
  const story = d && [
    { title: 'The Challenge', text: d.challenge },
    { title: 'Our Solution', text: d.solution },
    { title: 'The Result', text: d.result },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[460px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img className="absolute inset-0 w-full h-full object-cover" src={heroImage} alt={project.title} />
        <div className="relative z-20 max-w-7xl mx-auto px-8 pb-12 w-full">
          <Link to="/projects" className="inline-flex items-center gap-1 text-white/90 text-sm font-semibold mb-4 hover:text-white transition-colors">
            <Icon name="arrow_back" className="text-base" /> All Projects
          </Link>
          <span className="block text-inverse-primary font-bold uppercase tracking-[0.2em] text-sm mb-2">{project.categoryLabel}</span>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white tracking-tight">{project.title}</h1>
        </div>
      </section>

      {/* Facts + intro + story */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        {facts && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-outline-variant/30">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{f.label}</div>
                <div className="font-headline font-bold text-lg">{f.value}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-2xl leading-relaxed font-light mt-12 max-w-4xl text-on-surface">{intro}</p>

        {story && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {story.map((s) => (
              <div key={s.title}>
                <div className="w-10 h-1 bg-primary mb-4" />
                <h3 className="font-headline text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery */}
      {d?.gallery && d.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 pt-3 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.gallery.map((src, i) => (
              <div key={src} className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low">
                <img className="w-full h-full object-cover" src={src} alt={project.title + ' ' + (i + 1)} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video walkthrough */}
      {d?.videoSrc && (
        <section className="max-w-3xl mx-auto px-8 pt-3 pb-12">
          <div className="text-center mb-6">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">On Site</span>
            <h2 className="font-headline text-3xl font-bold mt-2">Watch the Walkthrough</h2>
          </div>
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg">
            <iframe className="absolute inset-0 w-full h-full border-none" src={d.videoSrc} scrolling="no" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" title={'Walkthrough — ' + project.title} />
          </div>
        </section>
      )}

      {/* Testimonial */}
      {d?.testimonialQuote && (
        <section className="bg-surface-container-low py-20 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-primary mb-6"><Icon name="format_quote" className="text-5xl" filled /></div>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">"{d.testimonialQuote}"</p>
            {d.testimonialBy && <p className="font-headline font-bold">{d.testimonialBy}</p>}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">Want a finish like this?</h2>
        <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Tell us about your place and we'll give you an honest, no-obligation quote.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-95 transition-all">Request a Free Quote</Link>
          <Link to="/projects" className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-surface-container-high transition-all">Browse More Work</Link>
        </div>
      </section>
    </>
  );
}
