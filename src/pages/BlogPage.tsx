import { Container } from '../components/ui/Container';
import { CTASection } from '../components/ui/CTASection';
import { BlogCard } from '../components/cards/BlogCard';
import { useSiteContent } from '../lib/site-content-context';

export function BlogPage() {
  const { posts: POSTS } = useSiteContent();
  return (
    <>
      <section className="pt-20 pb-16 px-8 bg-gradient-to-br from-surface-container-low to-surface text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Tips & Insights</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-6 text-on-surface">Painting & Decorating Blog</h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">Expert advice, colour trends, and home improvement tips from the team at Thai Viet Ltd.</p>
        </div>
      </section>

      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {POSTS.filter((p) => p.visible !== false).map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      </Container>

      <CTASection />
    </>
  );
}
