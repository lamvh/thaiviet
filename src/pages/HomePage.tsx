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
      <section className="relative min-h-[780px] flex items-start md:items-center pt-14 pb-20 md:pt-0 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* The banner is a wide landscape shot with the house right of centre. On
              desktop the crop takes the full width, so centre it; on narrow screens
              cover crops the sides away, so bias the focal point right to keep the
              house in frame instead of only driveway. */}
          <img
            alt="Freshly painted and stained home overlooking the coast, New Zealand"
            className="w-full h-full object-cover object-[68%_center] md:object-center"
            src={hero.image}
            width={1376}
            height={768}
            fetchPriority="high"
            decoding="async"
          />
          {/* Dark scrim: the hero copy is light-on-photo, so the banner is held back
              behind the text and released over the subject. Vertical on mobile where
              the copy spans the full width, horizontal on desktop where it sits in
              the left column and the house should stay in full colour on the right. */}
          <div className="absolute inset-0 bg-gradient-to-b from-on-surface/80 via-on-surface/65 via-58% to-on-surface/25 md:bg-gradient-to-r md:from-on-surface/85 md:from-5% md:via-on-surface/55 md:via-38% md:to-transparent md:to-68%" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full">
          <div className="max-w-2xl">
            <span className="mt-4 inline-block px-3 py-1 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded mb-6">
              {hero.badge}
            </span>
            {/* The base brand red is too dark to sit on the scrim — primary-bright is
                the same hue lifted into legible range against the photo. */}
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              {hero.titleLead}
              <br />
              <span className="text-primary-bright">{hero.titleAccent}</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-lg">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-10">
              <a
                href={tel}
                className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Icon name="call" /> Call Now: {contact.phone}
              </a>
              <Link
                to="/contact"
                className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Get a Free Quote <Icon name="arrow_forward" />
              </Link>
            </div>
            {hero.certs.length > 0 && (
              <div className="pt-6 border-t border-white/25">
                <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-4">
                  {hero.certLabel}
                </p>
                {/* The certification marks are dark artwork on transparent PNGs, so on
                    the dark scrim each one sits on its own light chip to stay visible. */}
                <div className="grid grid-cols-3 gap-3 items-center max-w-md">
                  {hero.certs.map((src, i) => (
                    <div key={i} className="flex justify-center bg-white/90 rounded-lg px-3 py-2">
                      <img
                        src={src}
                        alt="Certification"
                        className="max-h-16 w-auto object-contain"
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
      {/* Floating card that overlaps the hero's bottom edge, tying the banner to the
          content below instead of a flat full-width strip. */}
      <section className="relative z-20 -mt-12 md:-mt-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl shadow-xl shadow-on-surface/5 ring-1 ring-on-surface/5 divide-on-surface/5 md:divide-x">
            {trust.map((t, i) => (
              <div key={i} className="flex items-center gap-4 group p-5 md:px-7 md:py-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon name={t.icon} />
                </div>
                <span className="font-headline font-bold text-sm leading-snug tracking-tight">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="mb-4 text-primary font-bold uppercase tracking-[0.2em] text-sm">
                {intro.eyebrow}
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 leading-tight">
                {intro.title}
              </h2>
              <p className="text-lg lg:text-xl text-on-surface-variant leading-relaxed mb-8">
                {intro.body}
              </p>
              <div className="mb-8 flex items-center gap-4 pl-5 border-l-4 border-primary">
                <span className="font-headline font-extrabold text-primary text-5xl leading-none">
                  {intro.yearsValue}
                </span>
                <span className="text-sm text-on-surface-variant font-semibold uppercase tracking-wider max-w-[8rem] leading-snug">
                  {intro.yearsLabel}
                </span>
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
            <div className="lg:col-span-5 relative isolate">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  alt="ThaiViet work vehicle at a residential project"
                  className="w-full h-full object-cover"
                  src={intro.image}
                />
              </div>
              {/* Brand-red offset frame behind the photo */}
              <div className="absolute -top-4 -right-4 w-2/3 h-2/3 rounded-2xl border-2 border-primary/20 -z-10 hidden sm:block" aria-hidden />
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <Icon name="format_quote" className="text-primary text-4xl mb-2 block" filled />
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
            <div className="flex justify-end gap-3">
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
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scroll-px-5 sm:scroll-px-8 pt-2 pb-8 px-5 sm:px-8 max-w-7xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.items.map((r, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col bg-white p-8 rounded-2xl ring-1 ring-on-surface/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex gap-0.5 text-primary">
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </div>
                <Icon name="format_quote" className="text-primary/15 text-5xl leading-none" filled />
              </div>
              <p className="text-on-surface leading-relaxed mb-6 flex-1">
                "{r.quote}"
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/30">
                {/* Initial avatar — reviews carry no photo, so the first letter
                    of the reviewer's name gives each card a face. */}
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-headline font-bold flex items-center justify-center shrink-0" aria-hidden>
                  {r.name.trim().charAt(0).toUpperCase()}
                </div>
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
                  className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-on-surface/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={s.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="relative p-6 pt-9 flex-1 flex flex-col">
                    {/* Service icon badge straddling the photo edge */}
                    <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Icon name={s.icon} />
                    </div>
                    <h3 className="font-headline text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-5 flex-1">
                      {s.desc}
                    </p>
                    <span className="text-primary font-bold text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                      Learn more <Icon name="east" className="text-lg" />
                    </span>
                  </div>
                </Link>
              ))}
            {/* Full-width banner so it never sits orphaned alone on the last row */}
            <div className="md:col-span-2 lg:col-span-3 relative overflow-hidden bg-primary rounded-2xl p-8 md:px-12 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" aria-hidden />
              <div className="absolute right-24 -bottom-24 w-48 h-48 rounded-full bg-white/5" aria-hidden />
              <div className="relative">
                <h3 className="font-headline text-2xl font-bold mb-2">
                  {services.ctaTitle}
                </h3>
                <p className="opacity-90">{services.ctaText}</p>
              </div>
              <Link
                to="/contact"
                className="relative shrink-0 self-start md:self-auto bg-white text-primary px-7 py-3.5 rounded-lg font-bold hover:bg-surface transition-colors active:scale-95 flex items-center gap-2"
              >
                {services.ctaLabel} <Icon name="arrow_forward" />
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
                className="flex items-center gap-4 bg-white p-5 rounded-xl ring-1 ring-on-surface/5 shadow-sm hover:ring-primary/30 hover:shadow-md transition-all"
              >
                <span className="shrink-0 w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <Icon name="check" className="text-xl" />
                </span>
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
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-headline font-extrabold text-xl md:mb-6 relative z-10 ring-[6px] ring-surface-container-high shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="font-headline text-4xl font-bold mb-6">
                {serviceAreas.title}
              </h2>
              <p className="text-on-surface-variant mb-10">
                {serviceAreas.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                {serviceAreas.areas.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white pl-3 pr-4 py-2 rounded-full ring-1 ring-on-surface/5 shadow-sm hover:ring-primary/40 transition-all"
                  >
                    <Icon name="location_on" className="text-primary text-xl" filled />
                    <span className="font-semibold text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[280px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <div className="w-full h-full bg-surface-container-high relative flex items-center justify-center overflow-hidden">
                <img
                  alt="Greater Wellington service area map"
                  className="w-full h-full object-cover opacity-60 grayscale"
                  src={serviceAreas.mapImage}
                />
                <div className="absolute inset-0 bg-primary/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Pulsing pin — a calm "you are here" cue instead of a bouncing card */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="relative flex w-14 h-14">
                      <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping motion-reduce:animate-none" />
                      <span className="relative w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl shadow-primary/40">
                        <Icon name="location_on" className="text-3xl" filled />
                      </span>
                    </span>
                    <span className="bg-white px-4 py-2 rounded-full shadow-xl font-bold text-sm">
                      {serviceAreas.mapLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary-container via-primary to-[#8a000e] relative overflow-hidden">
        {/* Soft decorative rings for depth on the flat brand red */}
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full border-[40px] border-white/5" aria-hidden />
        <div className="absolute -right-32 -bottom-40 w-[28rem] h-[28rem] rounded-full bg-white/5" aria-hidden />
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-8">
            {cta.title}
          </h2>
          <p className="text-white/80 text-lg sm:text-xl mb-12">{cta.subtitle}</p>
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
