import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from './ChatWidget';

// Reset scroll to top on route change, or scroll to the hash target when the
// URL carries one (e.g. footer "Process" link → /#process). The target section
// may mount a frame after the route changes when arriving from another page, so
// we retry briefly until it exists. `scroll-mt` on the section handles the
// fixed-header offset.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    let frames = 0;
    let raf = 0;
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (frames++ < 20) {
        raf = requestAnimationFrame(scrollToTarget);
      }
    };
    scrollToTarget();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      {/* Floating Messenger button on every page, including the home page. */}
      <ChatWidget />
    </div>
  );
}
