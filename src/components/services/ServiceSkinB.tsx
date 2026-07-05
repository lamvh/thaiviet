import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { BeforeAfter } from './BeforeAfter';
import type { ServiceDetail, Contact } from '../../lib/types';

// "Cinematic / Dark" — a premium dark-magazine restyle of the service detail page.
// Renders the exact same ServiceDetail fields as ServiceSkinA; only the visual
// treatment differs (charcoal background, gold accents, full-bleed hero).
const INK = '#f4f1ea';
const MUTED = '#a8a29a';
const GOLD = '#c9a24b';
const BG = '#141412';
const SURFACE = '#1e1e1b';
const BORDER = '#2c2c28';

export function ServiceSkinB({ s, contact }: { s: ServiceDetail; contact: Contact }) {
  const tel = 'tel:' + contact.phone.replace(/\s/g, '');

  return (
    <div style={{ backgroundColor: BG, color: INK }}>
      {/* Hero — full-bleed with dark gradient overlay */}
      <section className="relative min-h-[640px] flex items-end overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" alt={s.name} src={s.heroImg} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141412] via-[#141412]/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold mb-6" style={{ color: MUTED }}>
              <Link to="/services" className="hover:text-[#f4f1ea] transition-colors">Services</Link>
              <Icon name="chevron_right" className="text-base" />
              <span style={{ color: GOLD }}>{s.name}</span>
            </div>
            <span className="font-bold tracking-[0.25em] text-xs uppercase mb-5 block" style={{ color: GOLD }}>{s.name}</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline leading-[1.05]">{s.heroTitle}</h1>
            <p className="mt-6 text-lg md:text-xl font-light leading-relaxed" style={{ color: MUTED }}>{s.heroSub}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="px-8 py-4 rounded-lg font-bold text-lg text-center transition-all hover:brightness-110 active:scale-95" style={{ backgroundColor: GOLD, color: BG }}>Get a Free Quote</Link>
              <a href={tel} className="border px-8 py-4 rounded-lg font-bold text-lg text-center flex items-center justify-center gap-2 transition-all hover:bg-white/10" style={{ borderColor: BORDER }}>
                <Icon name="call" /> {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="font-bold tracking-[0.25em] text-xs uppercase" style={{ color: GOLD }}>What's Included</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-5 mb-6 leading-tight font-headline">{s.introTitle}</h2>
            <p className="text-lg leading-relaxed font-light mb-6" style={{ color: MUTED }}>{s.introA}</p>
            <p className="text-lg leading-relaxed font-light" style={{ color: MUTED }}>{s.introB}</p>
            <div className="mt-8 rounded-xl p-6 border" style={{ backgroundColor: SURFACE, borderColor: BORDER }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: MUTED }}>
                <Icon name="verified" className="text-lg text-[#c9a24b]" /> Our promise
              </h3>
              <ul className="space-y-3">
                {s.midList.map((t) => (
                  <li key={t} className="flex items-center gap-3"><Icon name="check_circle" className="text-lg text-[#c9a24b]" /><span className="font-medium">{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {s.features.map((f) => (
                <div key={f.title} className="p-7 rounded-xl border transition-all hover:-translate-y-1" style={{ backgroundColor: SURFACE, borderColor: BORDER }}>
                  <Icon name={f.icon} className="text-3xl mb-4 text-[#c9a24b]" />
                  <h3 className="text-lg font-bold mb-2 font-headline">{f.title}</h3>
                  <p className="font-light text-sm leading-relaxed" style={{ color: MUTED }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-28 px-5 sm:px-8 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: BORDER }}>
              <img className="w-full h-full object-cover" alt={s.name} src={s.midImage} />
            </div>
            <div className="absolute -bottom-8 -right-8 p-7 rounded-xl shadow-xl hidden md:block max-w-[16rem]" style={{ backgroundColor: GOLD, color: BG }}>
              <Icon name="verified" className="text-3xl mb-2" />
              <p className="text-lg font-bold leading-snug">5-year workmanship guarantee on every job.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="font-bold tracking-[0.25em] text-xs uppercase" style={{ color: GOLD }}>{s.midEyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-5 mb-6 leading-tight font-headline">{s.midTitle}</h2>
            {s.midParas.map((p, i) => <p key={i} className="text-lg leading-relaxed font-light mb-6" style={{ color: MUTED }}>{p}</p>)}
            <ul className="space-y-3 mt-2">
              {s.midList.map((t) => (
                <li key={t} className="flex items-center gap-3"><Icon name="check_circle" className="text-lg text-[#c9a24b]" /><span className="font-medium">{t}</span></li>
              ))}
            </ul>
            {s.paintPartners && s.paintPartners.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: MUTED }}>Premium paint partners</h3>
                <div className="flex flex-wrap gap-3">
                  {s.paintPartners.map((b) => (
                    <span key={b} className="px-5 py-2.5 rounded-full font-headline font-bold border" style={{ backgroundColor: SURFACE, borderColor: BORDER }}>{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-28 px-5 sm:px-8 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-bold tracking-[0.25em] text-xs uppercase" style={{ color: GOLD }}>The Difference</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-5 font-headline">See the transformation</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg font-light" style={{ color: MUTED }}>Drag the slider to reveal the before and after.</p>
          </div>
          <BeforeAfter before={s.beforeImg} after={s.afterImg} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {s.gallery.map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border" style={{ borderColor: BORDER }}>
                <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" alt="" src={src} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-28 px-5 sm:px-8 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="font-bold tracking-[0.25em] text-xs uppercase" style={{ color: GOLD }}>Recent Work</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-5 font-headline">{s.name} across Wellington</h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all whitespace-nowrap" style={{ color: GOLD }}>
              View all projects <Icon name="arrow_forward" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {s.showcase.map((c) => (
              <Link key={c.title} to="/projects" className="group relative overflow-hidden rounded-2xl aspect-[4/5] border shadow-md hover:shadow-2xl transition-all duration-500 block" style={{ borderColor: BORDER }}>
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110" src={c.img} alt={c.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <span className="absolute top-5 left-5 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full" style={{ backgroundColor: GOLD, color: BG }}>{s.name}</span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-headline text-xl font-bold leading-tight mb-2">{c.title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: MUTED }}>{c.blurb}</p>
                  <div className="flex items-center gap-2 text-sm font-bold" style={{ color: GOLD }}>View Project <Icon name="arrow_forward" className="text-base" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      {s.quote && (
        <section className="py-28 px-5 sm:px-8 border-t" style={{ borderColor: BORDER }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8" style={{ color: GOLD }}><Icon name="format_quote" className="text-5xl" filled /></div>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-10">"{s.quote}"</p>
            <div className="flex flex-col items-center">
              <h4 className="font-bold text-lg font-headline">{s.quoteName}</h4>
              <p className="text-sm uppercase tracking-widest" style={{ color: MUTED }}>{s.quoteSub}</p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 px-5 sm:px-8 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-7xl mx-auto rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border" style={{ backgroundColor: SURFACE, borderColor: BORDER }}>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight font-headline">Ready to get started?</h2>
            <p className="text-xl md:text-2xl mb-12 font-light max-w-2xl mx-auto" style={{ color: MUTED }}>Tell us about your project and we'll come to you with honest advice and a free, no-obligation quote.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-xl hover:brightness-110" style={{ backgroundColor: GOLD, color: BG }}>Get Your Free Quote</Link>
              <a href={tel} className="border-2 px-10 py-5 rounded-lg font-bold text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2" style={{ borderColor: GOLD, color: INK }}>
                <Icon name="call" /> Call {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
