import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { useContactForm } from '../hooks/useContactForm';
import { useSiteContent } from '../lib/site-content-context';

const field = 'w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/30 transition-all text-on-surface';
const label = 'text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1';
const TRUST = ['MASTER PAINTERS', 'QUALITY ASSURED', '5-YEAR WARRANTY', 'FULLY INSURED'];

export function ContactPage() {
  const { areas: AREAS, contact: CONTACT } = useSiteContent();
  const { toast, submitting, submit } = useContactForm();
  const cols = [AREAS.slice(0, 11), AREAS.slice(11, 22), AREAS.slice(22)];

  return (
    <>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3.5 rounded-xl font-semibold text-white shadow-lg" style={{ background: toast.ok ? '#16a34a' : '#ba0013' }}>
          {(toast.ok ? '✓ ' : '✕ ') + toast.message}
        </div>
      )}

      <section className="pt-20 pb-12 px-8 text-center bg-gradient-to-br from-surface-container-low to-surface">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Get In Touch</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 text-on-surface">Contact Us</h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">Tell us about your project and we'll get back to you with a free, no-obligation quote.</p>
        </div>
      </section>

      <section className="bg-surface-container-low py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="bg-surface-container-lowest p-8 sm:p-10 lg:p-14 rounded-xl shadow-[0_12px_40px_rgba(28,28,25,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <h2 className="text-3xl font-headline font-bold mb-8">Get a Free Quote</h2>
              <form className="space-y-6" onSubmit={submit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className={label}>Full Name *</label><input name="name" type="text" placeholder="John Doe" className={field} required /></div>
                  <div className="space-y-2"><label className={label}>Email Address *</label><input name="email" type="email" placeholder="john@example.com" className={field} required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className={label}>Phone Number</label><input name="phone" type="tel" placeholder={CONTACT.phone} className={field} /></div>
                  <div className="space-y-2"><label className={label}>Service Type</label>
                    <select name="service" className={field + ' appearance-none'}>
                      <option>Residential Painting</option><option>Commercial Painting</option><option>Exterior Specialist</option><option>Interior Refresh</option><option>Other Services</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2"><label className={label}>Project Address</label><input name="address" type="text" placeholder="123 Street Name, Porirua" className={field} /></div>
                <div className="space-y-2"><label className={label}>Your Message *</label><textarea name="message" rows={4} placeholder="Tell us about your project goals..." className={field + ' resize-none'} required /></div>
                <button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary-container text-on-primary py-5 rounded-lg font-bold text-lg transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 active:scale-[0.98] disabled:opacity-70">
                  {submitting ? 'Sending...' : <>Send Request <Icon name="send" /></>}
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-12 py-6">
              <div className="space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Direct Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                  <div className="flex items-start gap-6 group"><div className="bg-surface-container-highest p-4 rounded-xl group-hover:bg-primary/10 transition-colors"><Icon name="call" className="text-primary text-3xl" /></div><div><p className="text-on-surface-variant text-xs font-bold uppercase mb-1">Call Us</p><a className="text-2xl font-headline font-bold hover:text-primary transition-colors" href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>{CONTACT.phone}</a></div></div>
                  <div className="flex items-start gap-6 group"><div className="bg-surface-container-highest p-4 rounded-xl group-hover:bg-primary/10 transition-colors"><Icon name="mail" className="text-primary text-3xl" /></div><div><p className="text-on-surface-variant text-xs font-bold uppercase mb-1">Email Support</p><a className="text-2xl font-headline font-bold hover:text-primary transition-colors" href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></div></div>
                </div>
              </div>
              <div className="bg-surface-container-highest/50 p-8 rounded-xl border border-outline-variant/10">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-4 flex items-center gap-2"><Icon name="schedule" className="text-sm" /> Business Hours</h3>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/10"><span className="font-medium">Monday - Friday</span><span className="text-primary font-bold">{CONTACT.hours}</span></div>
                <div className="flex justify-between items-center py-3"><span className="text-on-surface-variant">Public Holidays</span><span className="text-on-surface-variant font-medium">By Appointment</span></div>
              </div>
              <div className="flex items-center gap-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Follow Our Work</h3>
                <a className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg" href={CONTACT.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-24">
        <div className="mb-12">
          <h2 className="text-4xl font-headline font-bold mb-4">Areas of Service</h2>
          <p className="text-on-surface-variant">Although we are primarily based in Porirua we also provide painting and household solutions to the following areas:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3">
          {cols.map((col, i) => (
            <ul key={i} className="space-y-3">
              {col.map((area) => (
                <li key={area} className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full" /><span className="text-on-surface">{area}</span></li>
              ))}
            </ul>
          ))}
        </div>
      </Container>

      <section className="bg-surface py-20 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
          {TRUST.map((t) => <div key={t} className="font-headline font-extrabold text-lg md:text-2xl tracking-tighter">{t}</div>)}
        </div>
      </section>
    </>
  );
}
