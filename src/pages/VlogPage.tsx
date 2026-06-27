import { Container } from '../components/ui/Container';
import { CTASection } from '../components/ui/CTASection';
import { VlogCard } from '../components/cards/VlogCard';
import { REVIEWS, REELS } from '../data/reels';

function Heading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-10">
      <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-3 block">{eyebrow}</span>
      <h2 className="font-headline text-3xl font-bold text-on-surface">{title}</h2>
      <p className="text-on-surface-variant mt-3 max-w-2xl mx-auto">{sub}</p>
    </div>
  );
}

export function VlogPage() {
  return (
    <>
      <section className="pt-20 pb-16 px-8 bg-gradient-to-br from-surface-container-low to-surface text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Project Walkthroughs</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-6 text-on-surface">ThaiViet Vlog</h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">Step inside the homes we've transformed across the Wellington region — short, on-site walkthroughs straight from the job.</p>
        </div>
      </section>
      <Container className="py-16">
        <Heading eyebrow="Customer Feedback" title="Customer Reviews" sub="Real video reviews from Wellington homeowners — straight from our Facebook page." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {REVIEWS.map((r) => <VlogCard key={r.src} reel={r} ratio="16/9" padding="p-6" />)}
        </div>
        <div className="mt-20">
          <Heading eyebrow="Our Work in Action" title="Service Videos & Reels" sub="Short clips of our painting, plastering, roofing and renovation work across the Wellington region." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {REELS.map((r) => <VlogCard key={r.src} reel={r} />)}
          </div>
        </div>
      </Container>
      <CTASection />
    </>
  );
}
