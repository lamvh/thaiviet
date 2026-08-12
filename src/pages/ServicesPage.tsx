import { Link } from "react-router-dom"
import { Icon } from "../components/ui/Icon"
import { Container } from "../components/ui/Container"
import { ServiceCard } from "../components/cards/ServiceCard"
import { useSiteContent } from "../lib/site-content-context"

export function ServicesPage() {
  const { serviceDetails } = useSiteContent()
  return (
    <>
      <section className="py-24 px-5 sm:px-8 bg-surface-container-low">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">
                Our Painting & Renovation Services
              </h2>
              <p className="text-on-surface-variant">
                From interior and exterior painting to plastering, roof coatings
                and timber staining, we deliver durable, high-quality finishes
                for homes across the Wellington region — backed by our 5-year
                workmanship guarantee.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold whitespace-nowrap">
              <span>Expert NZ Standards</span>
              <Icon name="verified" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceDetails
              .filter((s) => s.visible !== false)
              .map((s) => (
                <ServiceCard key={s.slug} service={s} subtitle={s.desc} />
              ))}
          </div>
        </Container>
      </section>

      <section className="py-24 bg-surface-container-low px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-primary mb-8">
            <Icon name="format_quote" className="text-5xl" filled />
          </div>
          <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 text-on-surface">
            "ThaiViet Ltd transformed our 1920s bungalow with absolute
            professionalism. The attention to detail in the plastering and the
            paint finish was beyond our expectations. They treated our home with
            immense respect and delivered on time."
          </p>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-lg font-headline">
              David Richardson
            </h4>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">
              Homeowner, Eastbourne
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto bg-primary rounded-3xl p-12 md:p-20 relative z-10 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-on-primary mb-8 tracking-tight font-headline">
            Ready to Reimagine Your Home?
          </h2>
          <p className="text-primary-fixed-dim text-lg md:text-xl max-w-2xl mb-12">
            Contact our expert team today for a comprehensive on-site
            consultation and a detailed, no-obligation quote tailored to your
            residential project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="bg-white text-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-surface-bright transition-all shadow-xl"
            >
              Get Your Free Quote
            </Link>
            <a
              href="tel:0273478018"
              className="bg-transparent border-2 border-on-primary text-on-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
            >
              Call Our Specialist
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
