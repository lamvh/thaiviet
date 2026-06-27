import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-20 px-8 bg-primary text-on-primary text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-6">Ready to Transform Your Space?</h2>
        <p className="text-on-primary/80 text-lg mb-10">Get a free, no-obligation quote from Wellington's trusted painting experts.</p>
        <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-surface-bright transition-all shadow-xl inline-block">Get a Free Quote</Link>
      </div>
    </section>
  );
}
