import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { useSiteContent } from '../lib/site-content-context';
const IMG_PAINTER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS7XMYoRmBAFT9TmFpAzHxWc300tKxxnKbYLUdCYjgK-CPdSLCygVyy6bQe1RyWD9CpeapHOjZRasfFl03l9rktKFIoYmDTbS2LEWH7c3nFRiQsF_DiQLqq623eNF19ZfG9uGZBVFhR0Xfp22Ux8iLTFK6gkS29bQ99fOb5wEVs1AzMHxW85gZtLXz6fF4rLbRzPQgTNSI0nGyo_gzuIYSqz1n1MpIs7o4oKCFTL2YK0Rn8OKgHKVn-jLSLp8WhR9BFAX2QtefcaI';
const IMG_A = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB87cGgBk0YBR_tpvL7DxCNsbWCCOmDrDVDds7kso898HAHsbnGKovael_oEGhDU6Zr893QU77Rw4usGN-ma-ML6PVkE_BI4_gZVpwRBHm1J3zRwm0tdFTX4EQE9tkSoTgz10h3S1uR5guO5VV7qGeYI1LbRYLjTqFsgWPk7QfKvNyPr99T4B1VwfZhs0_GbK45CI9WVloJiU9RWedFrRyAMbaF80o17ZpVf_IHf1se8B4ywIhajKQi9mjF4rZzd4Yt-mbdvMtp8R8';
const IMG_B = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIB2Ay362v9lQAhDui7udTY0wpiUsgovjQAl8Ej5Rrke6jLEDfp_rnGzwwBKgK-1IQyzPIJw49f5rzAh4j0GEPogLcfSBc03dap5LSvgR8zWT1Pf8By1JwHuUL4cRKARXyzJv-j7qVlfY2D8vN1WVCcqwHSLqAfYvS1pZCoOrTCol3Z9EHLX_lkqVRcYHRs-Hv-tNIeCbOOEXf31IccceUUgLBk51rZMbzyEYSZDT0LHnluHTkQCnXSjL7ReVxFF4eqUURkMije44';
const IMG_PREP = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcPr08pEj_xAVLEbGISFwFFVKO7xC3Y6xA0LPKFa1cCY_iJg22Ihw6HyO8On3NC56We7Qjq889-zL8SrzI7LOtnCQPnOWRMSYzsUUjhOLbN5S0Ht9fdO0RSEs4SrFpnhqLkyoHWLIYHAIHDyoLgItRmaba0Z1wAnaJS76umiJ6P1oZNptIXzQfEUZQv1UNnNxqhUh62wpbfcTkV3msW0JUfo8CzowwsMoWuunwL9Z0mRD0vO5lJ90IUKDS2L4ppG1kO01IU994m8g';

const MISSION = [
  { icon: 'brush', title: 'Artisan Painting', desc: "Interior, exterior, and roof painting using premium coatings designed for Wellington's coastal conditions." },
  { icon: 'wallpaper', title: 'Master Wallpapering', desc: 'Seamless pattern matching and bubble-free installation for luxury interiors.' },
  { icon: 'home_repair_service', title: 'Total Solutions', desc: 'Comprehensive maintenance that safeguards your investment for decades to come.' },
];
const STATS = [
  { value: '95%', label: 'Referral Rate', desc: 'Our business thrives on word-of-mouth excellence.' },
  { value: '26+', label: 'Years Serving Wellington', desc: "Deep local knowledge of the capital's unique builds." },
  { value: '100%', label: 'Satisfaction Guarantee', desc: "We don't leave until you're absolutely delighted." },
  { value: 'Elite', label: 'Painter Network', desc: "Trusted by the city's leading architects." },
];

export function HomePage() {
  const { hero: HERO_CONTENT } = useSiteContent();
  return (
    <>
      <section className="relative h-[614px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img className="absolute inset-0 w-full h-full object-cover" src={HERO_CONTENT.image} alt="Modern Wellington living room" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-on-primary tracking-tight font-headline">{HERO_CONTENT.title}</h1>
          <p className="mt-4 text-xl text-on-primary/90 font-light max-w-2xl mx-auto">{HERO_CONTENT.subtitle}</p>
        </div>
      </section>

      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">Our Heritage</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-8 leading-tight font-headline">Your Home. <span className="text-primary-container">Our Care.</span></h2>
            <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed font-light">
              <p>As a Registered Master Painter and Eco-Decorator with multiple years of experience under his tool belt, Thai and his team have been transforming homes and businesses across the Wellington region.</p>
              <p>As the owner of ThaiViet Ltd, Thai leads a large team of tradesmen offering interior and exterior painting, plastering, cedar staining, wallpapering, water blasting, spray painting, and property maintenance. We stay true to our slogan: "Your home. Our Care." — treating every house as if it were our own.</p>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] bg-surface-container shadow-2xl rounded-lg overflow-hidden"><img className="w-full h-full object-cover" src={IMG_PAINTER} alt="Painter masking a window" /></div>
            <div className="absolute -bottom-8 -left-8 bg-primary text-on-primary p-8 rounded shadow-xl hidden lg:block max-w-xs"><p className="text-2xl font-bold italic">"Quality is not an act, it is a habit."</p></div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-surface-container-low">
        <Container>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold font-headline">Our Mission</h2>
            <p className="text-on-surface-variant mt-4 max-w-3xl mx-auto text-lg">With customer satisfaction as our highest priority, we aim to provide a service that exceeds your expectations every time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MISSION.map((m, i) => (
              <div key={m.title} className={'bg-surface-container-lowest p-10 rounded shadow-[0_12px_40px_rgba(28,28,25,0.06)] flex flex-col items-start transition-all hover:-translate-y-2 ' + (i === 1 ? 'md:mt-8' : '')}>
                <Icon name={m.icon} className="text-4xl text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4 font-headline">{m.title}</h3>
                <p className="text-on-surface-variant font-light">{m.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img className="rounded-lg h-64 w-full object-cover" src={IMG_A} alt="Professional painter" />
              <img className="rounded-lg h-64 w-full object-cover mt-8" src={IMG_B} alt="Mixing paint" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">Our People</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-8 font-headline">Highly Skilled Professionals</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-6 font-light">Our large team of tradesmen put the customer's needs first and work efficiently towards their deadlines. They arrive on site on time every morning, are friendly, professional, and respectful of your living environment.</p>
            <p className="text-lg text-on-surface-variant leading-relaxed font-light">We take pride in our punctuality, professional conduct, and the respectful way we treat your space. If you have any questions about the calibre of our work, we can provide you with a list of referees to get in touch with.</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-surface-container-high">
        <Container>
          <div className="bg-surface-container-lowest p-12 md:p-20 rounded shadow-lg flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 font-headline">Our Commitment to Preparation</h2>
              <p className="text-xl text-on-surface-variant font-light mb-8">A great finish is 90% preparation. We don't cut corners; we sand them, prime them, and ensure the foundation is perfect before a single drop of paint is applied.</p>
              <ul className="space-y-4">
                {['Rigorous Surface Cleaning & Degreasing', 'Expert Gap Filling & Surface Leveling', 'Multi-stage Sanding for Glass-smooth Finishes'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary" /><span className="font-medium">{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full"><img className="rounded-xl w-full aspect-video object-cover shadow-inner" src={IMG_PREP} alt="Sanding a wall" /></div>
          </div>
        </Container>
      </section>

      <section className="py-24 px-8 bg-surface">
        <Container>
          <h2 className="text-4xl font-bold text-center mb-20 font-headline">Why Wellington Trusts Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-5xl font-extrabold text-primary mb-4 font-headline">{s.value}</div>
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</p>
                <p className="mt-2 text-on-surface-variant font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto bg-primary rounded-2xl p-12 md:p-24 text-center text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-headline">Ready to Transform Your Space?</h2>
            <p className="text-xl md:text-2xl mb-12 font-light max-w-2xl mx-auto text-on-primary/90">Join the hundreds of satisfied Wellingtonians who trust ThaiViet Ltd for their home's care.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link to="/contact" className="bg-surface-container-lowest text-primary px-10 py-4 rounded font-bold text-lg hover:bg-surface-bright transition-all">Request a Site Visit</Link>
              <Link to="/projects" className="border-2 border-on-primary text-on-primary px-10 py-4 rounded font-bold text-lg hover:bg-on-primary hover:text-primary transition-all">Our Project Gallery</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
