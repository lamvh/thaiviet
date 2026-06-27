import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from './ChatWidget';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
