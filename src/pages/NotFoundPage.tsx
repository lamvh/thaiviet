import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';

// Rendered for any unmatched public URL. Returning a real not-found screen (instead
// of silently showing the homepage) keeps mistyped links honest for users and search
// engines. Note: a static SPA host still returns HTTP 200 for the document — configure
// the host to serve this route with a 404 status if strict status codes are needed.
export function NotFoundPage() {
  return (
    <section className="px-5 sm:px-8 max-w-2xl mx-auto py-32 text-center">
      <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">404</span>
      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">Page not found</h1>
      <p className="text-lg text-on-surface-variant mb-10">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-bold hover:scale-95 transition-all"
      >
        <Icon name="home" /> Back to home
      </Link>
    </section>
  );
}
