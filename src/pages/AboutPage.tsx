import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { useSiteContent } from '../lib/site-content-context';

export function AboutPage() {
  const { hero, homepage } = useSiteContent();
  const { heritage, mission, people, preparation, stats, cta } = homepage;

  return (
    <>
      <section className="relative min-h-[614px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img className="absolute inset-0 w-full h-full object-cover" src={hero.image} alt="Modern Wellington living room" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-on-primary tracking-tight font-headline">{hero.title}</h1>
          <p className="mt-4 text-xl text-on-primary/90 font-light max-w-2xl mx-auto">{hero.subtitle}</p>
        </div>
      </section>

      <section className="py-24 px-5 sm:px-8 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">{heritage.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-8 leading-tight font-headline">{heritage.titleLead} <span className="text-primary-container">{heritage.titleAccent}</span></h2>
            <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed font-light">
              {heritage.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] bg-surface-container shadow-2xl rounded-lg overflow-hidden"><img className="w-full h-full object-cover" src={heritage.image} alt="Painter masking a window" /></div>
            <div className="absolute -bottom-8 -left-8 bg-primary text-on-primary p-8 rounded shadow-xl hidden lg:block max-w-xs"><p className="text-2xl font-bold italic">"{heritage.quote}"</p></div>
          </div>
        </div>
      </section>

      <section className="py-24 px-5 sm:px-8 bg-surface-container-low">
        <Container>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold font-headline">{mission.title}</h2>
            <p className="text-on-surface-variant mt-4 max-w-3xl mx-auto text-lg">{mission.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission.cards.map((m, i) => (
              <div key={i} className={'bg-surface-container-lowest p-10 rounded shadow-[0_12px_40px_rgba(28,28,25,0.06)] flex flex-col items-start transition-all hover:-translate-y-2 ' + (i === 1 ? 'md:mt-8' : '')}>
                <Icon name={m.icon} className="text-4xl text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4 font-headline">{m.title}</h3>
                <p className="text-on-surface-variant font-light">{m.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 px-5 sm:px-8 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img className="rounded-lg h-64 w-full object-cover" src={people.imageA} alt="Professional painter" />
              <img className="rounded-lg h-64 w-full object-cover mt-8" src={people.imageB} alt="Mixing paint" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">{people.eyebrow}</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-8 font-headline">{people.title}</h2>
            <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed font-light">
              {people.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-5 sm:px-8 bg-surface-container-high">
        <Container>
          <div className="bg-surface-container-lowest p-12 md:p-20 rounded shadow-lg flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 font-headline">{preparation.title}</h2>
              <p className="text-xl text-on-surface-variant font-light mb-8">{preparation.intro}</p>
              <ul className="space-y-4">
                {preparation.bullets.map((t, i) => (
                  <li key={i} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary" /><span className="font-medium">{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full"><img className="rounded-xl w-full aspect-video object-cover shadow-inner" src={preparation.image} alt="Sanding a wall" /></div>
          </div>
        </Container>
      </section>

      <section className="py-24 px-5 sm:px-8 bg-surface">
        <Container>
          <h2 className="text-4xl font-bold text-center mb-20 font-headline">{stats.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {stats.items.map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-extrabold text-primary mb-4 font-headline">{s.value}</div>
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</p>
                <p className="mt-2 text-on-surface-variant font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto bg-primary rounded-2xl p-12 md:p-24 text-center text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-headline">{cta.title}</h2>
            <p className="text-xl md:text-2xl mb-12 font-light max-w-2xl mx-auto text-on-primary/90">{cta.subtitle}</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link to={cta.primaryTo} className="bg-surface-container-lowest text-primary px-10 py-4 rounded font-bold text-lg hover:bg-surface-bright transition-all">{cta.primaryLabel}</Link>
              <Link to={cta.secondaryTo} className="border-2 border-on-primary text-on-primary px-10 py-4 rounded font-bold text-lg hover:bg-on-primary hover:text-primary transition-all">{cta.secondaryLabel}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
