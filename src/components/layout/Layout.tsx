import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from './ChatWidget';

// Reset scroll to top whenever the route changes (e.g. opening a project detail).
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      {pathname !== '/' && <ChatWidget />}
    </div>
  );
}
