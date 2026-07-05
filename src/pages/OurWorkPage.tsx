import { Container } from '../components/ui/Container';
import { CTASection } from '../components/ui/CTASection';
import { VlogCard } from '../components/cards/VlogCard';
import { REELS } from '../data/reels';
import { useSiteContent } from '../lib/site-content-context';

// "Our Work" page (/our-work) — the service videos & reels gallery, split out of the blog
// into its own page. Same display structure (heading + reels grid) as before.
export function OurWorkPage() {
  const { contact } = useSiteContent();
  return (
    <>
      <section className="pt-20 pb-16 px-8 bg-gradient-to-br from-surface-container-low to-surface text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Our Work in Action</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-6 text-on-surface">Service Videos &amp; Reels</h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">Follow <a href={contact.facebook} target="_blank" rel="noopener" className="font-bold text-primary hover:underline">Thaiviet Ltd</a> on Facebook to stay up to date with our latest projects, ongoing renovations, and completed transformations. Discover the quality and attention to detail that set us apart.</p>
        </div>
      </section>

      <Container className="py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {REELS.map((r) => <VlogCard key={r.src} reel={r} />)}
        </div>
      </Container>

      <CTASection />
    </>
  );
}
