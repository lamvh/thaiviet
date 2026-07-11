import { useRef } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../components/ui/Icon"
import { VlogCard } from "../components/cards/VlogCard"
import { REVIEWS } from "../data/reels"
import { useSiteContent } from "../lib/site-content-context"

// Filled Material Symbol star used in the reviews section.
function Star() {
  return <Icon name="star" className="text-primary" filled />
}

export function HomePage() {
  const { home, projects, contact, serviceDetails } = useSiteContent()
  const {
    hero,
    trust,
    intro,
    video,
    services,
    whyChoose,
    featuredProjects,
    process,
    reviews,
    serviceAreas,
    cta,
  } = home
  const tel = "tel:" + contact.phone.replace(/\s/g, "")
  const featured = projects.filter((p) => p.visible !== false).slice(0, 4)

  const reviewsRef = useRef<HTMLDivElement>(null)
  const scrollReviews = (dir: number) => {
    const track = reviewsRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>(".snap-start")
    if (!card) return
    track.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" })
  }

  return (
    <>
      {/* Hero — top-aligned with nav clearance on mobile, centered on desktop */}
      <section className="relative min-h-[780px] flex items-start md:items-center pt-14 md:pt-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="ThaiViet Painting — New Zealand home"
            className="w-full h-full object-cover"
            src={hero.image}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full">
          <div className="max-w-2xl">
            <span className="mt-4 inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest rounded mb-6">
              {hero.badge}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] mb-6">
              {hero.titleLead}
              <br />
              <span className="text-primary">{hero.titleAccent}</span>
            </h1>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href={tel}
                className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
              >
                <Icon name="call" /> Call Now: {contact.phone}
              </a>
              <Link
                to="/contact"
                className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-3"
              >
                Get a Free Quote <Icon name="arrow_forward" />
              </Link>
            </div>
            {hero.certs.length > 0 && (
              <div className="pt-6 border-t border-outline-variant/30">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-4">
                  {hero.certLabel}
                </p>
                <div className="grid grid-cols-3 gap-4 items-center max-w-md">
                  {hero.certs.map((src, i) => (
                    <div key={i} className="flex justify-center">
                      <img
                        src={src}
                        alt="Certification"
                        className="max-h-20 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-surface-container-low py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trust.map((t, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon name={t.icon} />
                </div>
                <span className="font-headline font-bold text-sm tracking-tight">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="mb-4 text-primary font-bold uppercase tracking-[0.2em] text-sm">
                {intro.eyebrow}
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 leading-tight">
                {intro.title}
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-8">
                {intro.body}
              </p>
              <div className="mb-8">
                <div className="inline-block p-6 bg-surface-container-low rounded-xl">
                  <h4 className="font-headline font-bold text-primary text-3xl mb-1">
                    {intro.yearsValue}
                  </h4>
                  <p className="text-sm text-on-surface-variant font-medium">
                    {intro.yearsLabel}
                  </p>
                </div>
              </div>
              {/* Certificate section #2 temporarily hidden — kept in hero banner only.
              {intro.certs.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-4">
                    {intro.certLabel}
                  </p>
                  <div className="flex flex-wrap items-center gap-6">
                    {intro.certs.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Certification"
                        className="h-16 w-auto"
                      />
                    ))}
                  </div>
                </div>
              )}
              */}
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  alt="ThaiViet work vehicle at a residential project"
                  className="w-full h-full object-cover"
                  src={intro.image}
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <p className="italic text-on-surface-variant mb-4">
                  "{intro.testimonialQuote}"
                </p>
                <p className="font-bold text-sm">— {intro.testimonialBy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Video */}
      <section className="bg-surface pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <div className="inline-block mb-4 text-primary font-bold uppercase tracking-[0.2em] text-sm">
              {video.eyebrow}
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold leading-tight">
              {video.title}
            </h2>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black relative">
            <video
              className="w-full h-full object-cover"
              poster={video.poster}
              controls
              preload="metadata"
              playsInline
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-3 block">
                {reviews.eyebrow}
              </span>
              <h2 className="font-headline text-4xl font-bold mb-3">
                {reviews.title}
              </h2>
              <div className="flex items-center gap-1 text-primary">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span className="ml-2 font-bold text-on-surface">
                  {reviews.ratingLabel}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scrollReviews(-1)}
                aria-label="Previous review"
                className="w-12 h-12 rounded-full bg-surface-container-high hover:bg-primary hover:text-white text-on-surface flex items-center justify-center transition-colors active:scale-95"
              >
                <Icon name="chevron_left" />
              </button>
              <button
                onClick={() => scrollReviews(1)}
                aria-label="Next review"
                className="w-12 h-12 rounded-full bg-surface-container-high hover:bg-primary hover:text-white text-on-surface flex items-center justify-center transition-colors active:scale-95"
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>
        <div
          ref={reviewsRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 px-5 sm:px-5 sm:px-8 max-w-7xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.items.map((r, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-surface-container-low p-8 rounded-2xl"
            >
              <div className="flex gap-1 text-primary mb-5">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p className="text-on-surface leading-relaxed mb-6">
                "{r.quote}"
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/20">
                <div>
                  <p className="font-bold">{r.name}</p>
                  <p className="text-xs text-on-surface-variant">{r.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {REVIEWS.length > 0 && (
          <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-12">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <Icon name="play_circle" filled />
              <span className="font-bold uppercase tracking-[0.2em] text-sm">
                Video Reviews
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {REVIEWS.map((r) => (
                <VlogCard key={r.src} reel={r} ratio="16/9" padding="p-6" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Services Grid */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-headline text-4xl font-bold">
                {services.title}
              </h2>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-2 hover:underline"
              to="/services"
            >
              Explore All Services <Icon name="east" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceDetails
              .filter((s) => s.visible !== false)
              .slice(0, 6)
              .map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group block"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={s.image}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-headline text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </Link>
              ))}
            <div className="bg-primary p-8 rounded-2xl flex flex-col justify-center items-center text-center text-white">
              <h3 className="font-headline text-xl font-bold mb-3">
                {services.ctaTitle}
              </h3>
              <p className="mb-6 opacity-90 text-sm">{services.ctaText}</p>
              <Link
                to="/contact"
                className="bg-white text-primary px-6 py-2.5 rounded-lg font-bold hover:bg-surface transition-colors active:scale-95"
              >
                {services.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="py-24 bg-surface scroll-mt-[72px]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl font-bold mb-6">
              {whyChoose.title}
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              {whyChoose.intro}
            </p>
          </div>
          <h3 className="font-headline text-2xl font-bold text-center mb-8">
            {whyChoose.subtitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {whyChoose.bullets.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-surface-container-low p-5 rounded-xl"
              >
                <Icon name="check_circle" className="text-primary" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
          <p className="text-on-surface-variant max-w-3xl mx-auto text-center mt-10 leading-relaxed">
            {whyChoose.closing}
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-3 block">
                {featuredProjects.eyebrow}
              </span>
              <h2 className="font-headline text-4xl font-bold">
                {featuredProjects.title}
              </h2>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-2 hover:underline"
              to="/projects"
            >
              View All Projects <Icon name="east" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group block">
                <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-surface-container-high mb-4">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={p.image}
                    alt={p.title}
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary rounded">
                    {p.categoryLabel}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-on-surface-variant text-sm">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-surface-container-high overflow-hidden scroll-mt-[72px]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-16">
            <h2 className="font-headline text-4xl font-bold mb-4">
              {process.title}
            </h2>
            <p className="text-on-surface-variant">{process.subtitle}</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-6 left-0 w-full h-0.5 bg-outline-variant/30" />
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-6 gap-8">
              {process.steps.map((step, i) => (
                <div key={i} className="relative group flex md:block gap-5">
                  {/* Vertical connector between steps — mobile timeline only */}
                  {i < process.steps.length - 1 && (
                    <div
                      className="md:hidden absolute left-6 -translate-x-1/2 top-12 bottom-[-2rem] w-0.5 bg-outline-variant/30"
                      aria-hidden
                    />
                  )}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl md:mb-6 relative z-10 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <div className="pt-2.5 md:pt-0">
                    <h5 className="font-headline font-bold mb-2">
                      {step.title}
                    </h5>
                    <p className="text-sm text-on-surface-variant">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline text-4xl font-bold mb-6">
                {serviceAreas.title}
              </h2>
              <p className="text-on-surface-variant mb-10">
                {serviceAreas.intro}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {serviceAreas.areas.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon name="location_on" className="text-primary" />
                    <span className="font-semibold">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <div className="w-full h-full bg-surface-container-high relative flex items-center justify-center overflow-hidden">
                <img
                  alt="Greater Wellington service area map"
                  className="w-full h-full object-cover opacity-60 grayscale"
                  src={serviceAreas.mapImage}
                />
                <div className="absolute inset-0 bg-primary/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-6 py-4 rounded-xl shadow-2xl flex flex-col items-center gap-2 animate-bounce">
                    <Icon
                      name="location_on"
                      className="text-primary text-3xl"
                      filled
                    />
                    <span className="font-bold">{serviceAreas.mapLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-8">
            {cta.title}
          </h2>
          <p className="text-white/80 text-xl mb-12">{cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="bg-white text-primary px-10 py-5 rounded-lg font-bold text-xl shadow-2xl hover:bg-surface-bright transition-all active:scale-95"
            >
              {cta.primaryLabel}
            </Link>
            <a
              className="border-2 border-white/40 text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-white/10 transition-all active:scale-95"
              href={tel}
            >
              Call {contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
