import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { BeforeAfter } from './BeforeAfter';
import type { ServiceDetail, Contact } from '../../lib/types';

// "Editorial / Light" — the original service detail page layout, lifted verbatim into a
// skin component so it can be swapped via the global service-page style selector.
export function ServiceSkinA({ s, contact }: { s: ServiceDetail; contact: Contact }) {
  const tel = 'tel:' + contact.phone.replace(/\s/g, '');

  return (
    <>
      {/* Hero */}
      <section className="relative h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20 z-10" />
        <img className="absolute inset-0 w-full h-full object-cover" alt={s.name} src={s.heroImg} />
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-5"><Link to="/services" className="hover:text-white transition-colors">Services</Link><Icon name="chevron_right" className="text-base" /><span className="text-primary-fixed-dim">{s.name}</span></div>
            <span className="text-primary-fixed-dim font-bold tracking-[0.2em] text-sm uppercase mb-4 block">{s.name}</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight font-headline leading-[1.05]">{s.heroTitle}</h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 font-light leading-relaxed">{s.heroSub}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all text-center">Get a Free Quote</Link>
              <a href={tel} className="bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all text-center flex items-center justify-center gap-2"><Icon name="call" /> {contact.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">What's Included</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight font-headline">{s.introTitle}</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed font-light mb-6">{s.introA}</p>
            <p className="text-lg text-on-surface-variant leading-relaxed font-light">{s.introB}</p>
            <div className="mt-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4 flex items-center gap-2"><Icon name="verified" className="text-primary text-lg" /> Our promise</h3>
              <ul className="space-y-3">
                {s.midList.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-on-surface"><Icon name="check_circle" className="text-primary text-lg" /><span className="font-medium">{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {s.features.map((f) => (
                <div key={f.title} className="bg-surface-container-lowest p-7 rounded-xl shadow-[0_12px_40px_rgba(28,28,25,0.06)] transition-all hover:-translate-y-1">
                  <Icon name={f.icon} className="text-3xl text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2 font-headline">{f.title}</h3>
                  <p className="text-on-surface-variant font-light text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"><img className="w-full h-full object-cover" alt={s.name} src={s.midImage} /></div>
            <div className="absolute -bottom-8 -right-8 bg-primary text-on-primary p-7 rounded-xl shadow-xl hidden md:block max-w-[16rem]"><Icon name="verified" className="text-3xl mb-2" /><p className="text-lg font-bold leading-snug">5-year workmanship guarantee on every job.</p></div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">{s.midEyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight font-headline">{s.midTitle}</h2>
            {s.midParas.map((p, i) => <p key={i} className="text-lg text-on-surface-variant leading-relaxed font-light mb-6">{p}</p>)}
            <ul className="space-y-3 mt-2">
              {s.midList.map((t) => (
                <li key={t} className="flex items-center gap-3 text-on-surface"><Icon name="check_circle" className="text-primary text-lg" /><span className="font-medium">{t}</span></li>
              ))}
            </ul>
            {s.paintPartners && s.paintPartners.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4">Premium paint partners</h3>
                <div className="flex flex-wrap gap-3">
                  {s.paintPartners.map((b) => (
                    <span key={b} className="px-5 py-2.5 bg-white rounded-full font-headline font-bold shadow-sm">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">The Difference</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 font-headline">See the transformation</h2>
            <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto text-lg font-light">Drag the slider to reveal the before and after.</p>
          </div>
          <BeforeAfter before={s.beforeImg} after={s.afterImg} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {s.gallery.map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-surface-container-low"><img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" alt="" src={src} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl"><span className="text-primary font-bold tracking-widest text-sm uppercase">Recent Work</span><h2 className="text-3xl md:text-4xl font-extrabold mt-4 font-headline">{s.name} across Wellington</h2></div>
            <Link to="/projects" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all whitespace-nowrap">View all projects <Icon name="arrow_forward" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {s.showcase.map((c) => (
              <Link key={c.title} to="/projects" className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-surface-container-low shadow-md hover:shadow-2xl transition-all duration-500 block">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110" src={c.img} alt={c.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <span className="absolute top-5 left-5 bg-white/95 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary rounded-full">{s.name}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-headline text-xl font-bold leading-tight mb-2">{c.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{c.blurb}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-white">View Project <Icon name="arrow_forward" className="text-base" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      {s.quote && (
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-primary mb-8"><Icon name="format_quote" className="text-5xl" filled /></div>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 text-on-surface">"{s.quote}"</p>
            <div className="flex flex-col items-center"><h4 className="font-bold text-lg font-headline">{s.quoteName}</h4><p className="text-on-surface-variant text-sm uppercase tracking-widest">{s.quoteSub}</p></div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto bg-primary rounded-3xl p-12 md:p-20 text-center text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight font-headline">Ready to get started?</h2>
            <p className="text-xl md:text-2xl mb-12 font-light max-w-2xl mx-auto text-on-primary/90">Tell us about your project and we'll come to you with honest advice and a free, no-obligation quote.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-white text-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-surface-bright transition-all shadow-xl">Get Your Free Quote</Link>
              <a href={tel} className="bg-transparent border-2 border-on-primary text-on-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"><Icon name="call" /> Call {contact.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
