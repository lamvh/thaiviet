import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { CTASection } from '../components/ui/CTASection';

// Interior Painting service page (/services/interior). Hardcoded per the approved design;
// content can be moved into the CMS later. Header + Footer come from <Layout>.

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFIVxAWkyuyJKwXUYqIR3iz2ttS1KGU3GazGzibFfN2_DQ5cG7q7KOonVor3L5Z9mxdUbXGRt5AKcnSLwQcrbQCuo7JiqJRnNoOVE4Le-lr9-Au3ukfZiRer7Sa7iwCSajQlCIcJDk6BrlJ7SEvxfN0jOwvhxLvY_kZ8vXEgPdNcROW9I0b6Rok8Qan0cRJ9VKzryqsB7HkRZ2qiUEe2gDwhAN6qidWDYHs_Kf6yDLO_9-ZuEwGsbgN7J6I008N0bqTJwaVBsa22o';

const INCLUDED = [
  { icon: 'format_paint', title: 'Walls & Ceilings', desc: 'Even, roller-perfect coverage with crisp, hand-cut lines where wall meets ceiling and trim.' },
  { icon: 'crop_16_9', title: 'Trim, Skirting & Architraves', desc: 'Glass-smooth enamel finishes on skirting boards, door frames and window reveals.' },
  { icon: 'door_front', title: 'Doors & Cabinetry', desc: 'Spray-smooth refinishing for interior doors, built-ins and kitchen cabinetry — a fresh look without a full renovation.' },
  { icon: 'wallpaper', title: 'Feature & Accent Walls', desc: 'Deep, true colour on statement walls — perfectly masked and bleed-free at every edge.' },
  { icon: 'layers', title: 'Plaster & GIB Repair', desc: 'Cracks, dings and patchy plaster made good and stopped to a Level 4–5 finish before paint.' },
  { icon: 'eco', title: 'Low-VOC & Eco Options', desc: 'As registered Eco-Decorators we offer low-odour, low-VOC paints that are kinder to your family and home.' },
];

const PREP = [
  'Furniture moved, floors & fittings protected',
  'Holes filled, cracks repaired, surfaces sanded',
  'Spotless, dust-free clean-up every evening',
];

const GALLERY = [
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&q=80',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
];

const SHOWCASE = [
  { title: 'Modern Villa Refresh — Karori', desc: 'Precision interior detailing and feature wall.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFIVxAWkyuyJKwXUYqIR3iz2ttS1KGU3GazGzibFfN2_DQ5cG7q7KOonVor3L5Z9mxdUbXGRt5AKcnSLwQcrbQCuo7JiqJRnNoOVE4Le-lr9-Au3ukfZiRer7Sa7iwCSajQlCIcJDk6BrlJ7SEvxfN0jOwvhxLvY_kZ8vXEgPdNcROW9I0b6Rok8Qan0cRJ9VKzryqsB7HkRZ2qiUEe2gDwhAN6qidWDYHs_Kf6yDLO_9-ZuEwGsbgN7J6I008N0bqTJwaVBsa22o' },
  { title: 'Wellington CBD Office', desc: 'High-traffic durable finishes for corporate HQ.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { title: 'Newtown Apartment Repaint', desc: 'Full interior repaint between tenancies.', image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80' },
];

const eyebrow = 'text-primary font-bold tracking-widest text-sm uppercase';
const h2 = 'mt-4 mb-6 font-headline text-4xl md:text-[44px] font-extrabold leading-[1.1]';
const lead = 'text-lg text-on-surface-variant leading-relaxed font-light';

export function InteriorPaintingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.2))' }} />
        <img className="absolute inset-0 w-full h-full object-cover" src={HERO_IMG} alt="Freshly painted modern Wellington living room interior" />
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-5">
              <Link to="/services" className="hover:text-white">Services</Link>
              <Icon name="chevron_right" className="text-base" />
              <span className="text-inverse-primary">Interior Painting</span>
            </div>
            <span className="text-inverse-primary font-bold tracking-[0.2em] text-sm uppercase block mb-4">Interior Painting</span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">A flawless finish, room by room.</h1>
            <p className="mt-6 text-xl text-white/90 font-light leading-relaxed">From a single feature wall to a whole-home repaint, we deliver dust-free preparation and a smooth, hard-wearing finish that lifts every room — all backed by our 5-year workmanship guarantee.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/contact" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:brightness-110 transition-all">Get a Free Quote</Link>
              <a href="tel:0273478018" className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg"><Icon name="call" /> 027 347 8018</a>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
          <div>
            <span className={eyebrow}>What's Included</span>
            <h2 className={h2}>Every surface inside your home, beautifully finished.</h2>
            <p className={lead + ' mb-6'}>Whether you're refreshing one tired room or repainting an entire house, our team treats your home like our own. We move and protect your furniture, mask every edge, and keep the site tidy from the first day to the last.</p>
            <p className={lead}>A great finish is 90% preparation — so we fill, sand and prime properly before a single drop of colour goes on.</p>
            <div className="mt-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant/20">
              <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4"><Icon name="verified" className="text-primary text-lg" /> Our preparation promise</h3>
              <ul className="flex flex-col gap-3">
                {PREP.map((p) => (
                  <li key={p} className="flex items-center gap-3 font-medium"><Icon name="check_circle" className="text-primary text-lg" /> {p}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INCLUDED.map((c) => (
              <div key={c.title} className="bg-white p-7 rounded-xl shadow-[0_12px_40px_rgba(28,28,25,0.06)] transition-transform hover:-translate-y-2">
                <Icon name={c.icon} className="text-3xl text-primary" />
                <h3 className="mt-4 mb-2 font-headline text-lg font-bold">{c.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-light">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colour & paint */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"><img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=900&q=80" alt="Paint colour swatches and fan decks" /></div>
            <div className="absolute -bottom-8 -right-8 bg-primary text-white p-7 rounded-2xl shadow-xl max-w-[256px] hidden md:block">
              <Icon name="palette" className="text-3xl mb-2 block" />
              <p className="text-lg font-bold leading-snug">In-home colour consultation included with every full repaint.</p>
            </div>
          </div>
          <div>
            <span className={eyebrow}>Colour &amp; Paint</span>
            <h2 className={h2}>Not sure on colour? We'll help you choose.</h2>
            <p className={lead + ' mb-6'}>Choosing a colour is the hardest part — so we make it easy. We'll bring sample pots and fan decks to your home, look at how the light falls through the day, and help you land on tones that suit your space and stick to your budget.</p>
            <p className={lead + ' mb-8'}>We work with New Zealand's leading paint systems and only apply premium interior-grade products built to wash, wear and last.</p>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4">Premium paint partners</h3>
            <div className="flex flex-wrap gap-3">
              {['Resene', 'Dulux', 'Wattyl'].map((b) => (
                <span key={b} className="px-5 py-2.5 bg-white rounded-full font-headline font-bold shadow-sm">{b}</span>
              ))}
              <span className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full font-headline font-bold shadow-sm"><Icon name="eco" className="text-primary text-lg" /> Low-VOC &amp; Eco</span>
            </div>
          </div>
        </div>
      </section>

      {/* Before & after */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span className={eyebrow}>The Difference</span>
            <h2 className={h2 + ' mb-0'}>See the transformation</h2>
            <p className="mt-4 text-on-surface-variant max-w-xl mx-auto text-lg font-light">A recent Wellington interior repaint — before on the left, after on the right.</p>
          </div>
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
            <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80" alt="Living room after repaint" />
            <div className="absolute inset-0" style={{ clipPath: 'inset(0 45% 0 0)' }}><img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80" alt="Living room before repaint" /></div>
            <span className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">Before</span>
            <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">After</span>
            <div className="absolute top-0 bottom-0 left-[55%] -translate-x-1/2 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-primary"><Icon name="drag_indicator" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {GALLERY.map((src) => (
              <div key={src} className="aspect-square rounded-xl overflow-hidden"><img className="w-full h-full object-cover" src={src} alt="Interior repaint detail" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* Project showcase */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <span className={eyebrow}>Recent Work</span>
            <h2 className={h2 + ' mb-0'}>Interior transformations across Wellington</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHOWCASE.map((p) => (
              <article key={p.title} className="relative rounded-2xl overflow-hidden group h-80 shadow-[0_12px_40px_rgba(28,28,25,0.06)]">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={p.image} alt={p.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="inline-block bg-white/15 backdrop-blur text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">Interior Painting</span>
                  <h3 className="font-headline text-xl font-bold text-white">{p.title}</h3>
                  <p className="text-white/80 text-sm mt-1 font-light">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">View all projects <Icon name="arrow_forward" className="text-lg" /></Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
