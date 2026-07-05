import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { ServiceCard } from '../components/cards/ServiceCard';
import { SERVICES } from '../data/services';
import { useSiteContent } from '../lib/site-content-context';

const GALLERY = [
  { span: 'md:col-span-8', title: 'Khandallah Modern Restoration', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjp-mJO-OorLjQ6Sp3-95aiRBOIWGVuPrtxXKNrSDBWG-4pr7piJ3OqS9XjEM3ebCEcS-2mL5-_PlEEBpGyIiKcXnPANZBhYJ_-_5D7JTys6iQghsiHrF0XiXuxEO9GXY9p0TMmNkk7hO9S6t7SMjHI2xu1NTZGji2SQID_1LAe7_ylDgrtvsrpLDfNInPvvuWLPR49A5oloMlebHCCDVG7hwA7RB9sjOwMEcwY7vuy28PCXo9diH1nfUUs79CCWsNJgFGN6dMjZI' },
  { span: 'md:col-span-4', title: 'Wadestown Interior Refresh', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEuPZUp5836dj4bMyNgbK7vGCO3uYEyniYImUAhQQ3nKuK3wEGwbOHwpjNbFLhJ4tHLaSRQ_NTqe0hIjkpuG6_AiMAfec2J_-UfbyLeyDSYYCAHF7bF__QhF7vD2BaBWwp_4CyoIRDp_6sbsD1EAmPuzGr4bzRBK7NmiN2DPdCbIFMWK8izqkP-8AN5TlbLeqqh0Kd__YqnKCrDtCqtEMq1bS0uZbY_YIuh2KkJxvKSdF6FxJuEGZwBCutEQ8oiN8SE2gVUx_L-DM' },
  { span: 'md:col-span-4', title: 'Lower Hutt Roof Protection', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLD3_2Jv6NJPmYLYJB0xrOhNB87Zg70hs4SpdLXr_P8pIVDv63m_Wf5TPHC2Od1dkzU3Nhm63OueBnDkasSHUQciszYoTfqNN8LB3jat9FSYda-i48ILwAkjj6jxJojov26kQQC8KjwGWADgSrzdRRlhIyqOZK5OVkHELUzB4cVnvxVMCf_48qsgBQ4tbGRt2DHW4hkIAo5UTPfd4Y9FK3Mn0yxXtC3N6lFujUOi0j6c7ZBklaNK82EkV9n173jfRXfDTsINQmndQ' },
  { span: 'md:col-span-8', title: 'Thorndon Feature Wall', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR4KcelQl1n7C37HIUOd4HzTac20iGeyZeAoO_FoeiCFtKcL88lRtu5nV1zPURXBU_FM3v3vp-41cpJ94j5xmxknPIaRToiacwbFYGKa0byGYPQdRyJPxiJnDot2HuQGnj2_Kd68mMpNi-Lv3n5M8MtDOXDA920T_HI6Nb7f-x0Me32fTduVzoNGhjxXCpRftAUmCBPNt1QD5JV9w_UofoEWc4-10TLJrwoykFrktMaw1I-bmUw20RMwg9bDPhqnnpp_O-cw3NNK8' },
];

export function ServicesPage() {
  const { serviceDetails } = useSiteContent();
  return (
    <>
      <section className="py-24 px-8 bg-surface-container-low">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Our Painting & Decorating Services</h2>
              <p className="text-on-surface-variant">From interior and exterior painting to plastering, roof coatings and timber staining, we deliver durable, high-quality finishes for homes across the Wellington region — backed by our 5-year workmanship guarantee.</p>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold whitespace-nowrap"><span>Expert NZ Standards</span><Icon name="verified" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} service={s} subtitle={serviceDetails.find((d) => d.slug === s.slug)?.heroSub} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 px-8 overflow-hidden">
        <Container>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center font-headline">Transforming Homes</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:h-[800px]">
            {GALLERY.map((g) => (
              <div key={g.title} className={'rounded-xl overflow-hidden relative group h-64 md:h-auto ' + g.span}>
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={g.img} alt={g.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-white font-bold">{g.title}</p></div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 bg-surface-container-low px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-primary mb-8"><Icon name="format_quote" className="text-5xl" filled /></div>
          <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 text-on-surface">"ThaiViet Ltd transformed our 1920s bungalow with absolute professionalism. The attention to detail in the plastering and the paint finish was beyond our expectations. They treated our home with immense respect and delivered on time."</p>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-lg font-headline">David Richardson</h4>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Homeowner, Eastbourne</p>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto bg-primary rounded-3xl p-12 md:p-20 relative z-10 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-on-primary mb-8 tracking-tight font-headline">Ready to Reimagine Your Home?</h2>
          <p className="text-primary-fixed-dim text-lg md:text-xl max-w-2xl mb-12">Contact our expert team today for a comprehensive on-site consultation and a detailed, no-obligation quote tailored to your residential project.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact" className="bg-white text-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-surface-bright transition-all shadow-xl">Get Your Free Quote</Link>
            <a href="tel:0273478018" className="bg-transparent border-2 border-on-primary text-on-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/10 transition-all">Call Our Specialist</a>
          </div>
        </div>
      </section>
    </>
  );
}
