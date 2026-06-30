import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { ServicesDropdown } from './ServicesDropdown';
import { FacebookIcon } from './FacebookIcon';
import { NAV_ITEMS } from '../../data/nav';
import { useSiteContent } from '../../lib/site-content-context';

const LOGO = 'https://project.vinapage.com/thaivietconz/images/logo.webp';

export function Header() {
  const { contact } = useSiteContent();
  const [open, setOpen] = useState(false);
  const linkBase = 'transition-colors font-headline';
  const navClass = ({ isActive }: { isActive: boolean }) =>
    linkBase + ' ' + (isActive ? 'text-primary font-bold' : 'text-slate-700 hover:text-primary');

  return (
    <header className="fixed top-0 w-full z-50 glass-nav shadow-[0_12px_40px_rgba(28,28,25,0.06)]">
      <nav className="max-w-full flex justify-between items-center px-8 py-4">
        <Link to="/"><img src={LOGO} alt="ThaiViet Ltd" className="h-12 w-auto" /></Link>

        <div className="hidden lg:flex items-center gap-7">
          <NavLink to="/" end className={navClass}>About</NavLink>
          <ServicesDropdown />
          {NAV_ITEMS.filter((n) => n.to !== '/').map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>{n.label}</NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a className="hidden sm:inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:text-primary hover:bg-surface-container-low rounded-lg transition-all active:scale-95" href={contact.facebook} target="_blank" rel="noopener" aria-label="Facebook"><FacebookIcon className="w-5 h-5" /></a>
          <a className="hidden sm:flex text-slate-700 font-semibold px-4 py-2 hover:bg-surface-container-low rounded-lg transition-all active:scale-95" href={'tel:' + contact.phone.replace(/\s/g, '')}>Call Now</a>
          <Link to="/contact" className="hidden lg:inline-flex bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">Get a Free Quote</Link>
          <button className="lg:hidden text-on-surface p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu"><Icon name="menu" className="text-2xl" /></button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col bg-surface border-t border-outline-variant/15 lg:hidden">
          <MobileLink to="/" onClick={() => setOpen(false)}>Home</MobileLink>
          {NAV_ITEMS.map((n) => (
            <MobileLink key={n.to + n.label} to={n.to} onClick={() => setOpen(false)}>{n.label}</MobileLink>
          ))}
          <a className="mx-8 mt-4 mb-4 block bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-center shadow-lg shadow-primary/20" href={'tel:' + contact.phone.replace(/\s/g, '')}>Call {contact.phone}</a>
        </div>
      )}
    </header>
  );
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <NavLink to={to} end={to === '/'} onClick={onClick} className="px-8 py-3 text-on-surface hover:bg-surface-container-low transition-colors font-headline border-b border-outline-variant/10">
      {children}
    </NavLink>
  );
}
