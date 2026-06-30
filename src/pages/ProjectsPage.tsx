import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { ProjectCard } from '../components/cards/ProjectCard';
import { ProjectFilter } from '../components/ProjectFilter';
import { useSiteContent } from '../lib/site-content-context';

const SPOTLIGHT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg2DbjF7-sjzLgsi7oE40Av1IK52MRlizgK3CETMIRsQORqAoED0rjteha24wHqXiHI57FzuwJKPUFNoHPVUNdNX4JE2Orbo7ngj_KhWtEAnrmiZxTomyoSiiTyiPCVEi2X4YMidx4SR8kMxuAIBC6h-u_hLSQO0J0C-O1_MwlzQ_9LtY5uyNCTAkJdv4x-Cq9gB64kjnhNUVN3glxnyqeEIufAtxLiEhoFl_NKm1k2O5PhDECoK5c6gtCxJH-gB5HuQwKN6i4-zw';

export function ProjectsPage() {
  const { projects: PROJECTS } = useSiteContent();
  const [filter, setFilter] = useState('all');
  const visible = useMemo(() => {
    const shown = PROJECTS.filter((p) => p.visible !== false);
    return filter === 'all' ? shown : shown.filter((p) => p.category === filter);
  }, [filter, PROJECTS]);

  return (
    <>
      <section className="pt-12 px-8 max-w-7xl mx-auto mb-12">
        <ProjectFilter active={filter} onChange={setFilter} />
      </section>

      <section className="px-8 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
        {visible.length === 0 && <p className="text-center text-on-surface-variant py-16">No projects in this category yet — check back soon.</p>}
      </section>

      <section className="bg-surface-container-low py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10"><img className="w-full h-full object-cover" src={SPOTLIGHT} alt="Heritage restoration" /></div>
              <div className="absolute -top-12 -left-12 text-surface-container-highest opacity-20 select-none"><Icon name="brush" className="text-[12rem]" /></div>
            </div>
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Major Transformation</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight font-headline">Heritage Restoration: The Thorndon Project</h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Restoring a 1920s heritage home required more than just paint; it required surgical precision. We stripped decades of failing layers to reveal the original craftsmanship, followed by a 5-step premium protective system.</p>
              <ul className="space-y-4 mb-10">
                {['Lead-based paint safe removal', 'Specialized timber preservation', 'High-gloss finish on ornate moldings'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><Icon name="check_circle" className="text-primary text-xl" /><span className="font-medium">{t}</span></li>
                ))}
              </ul>
              <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:scale-95 transition-all">View Case Study <Icon name="arrow_forward" /></button>
            </div>
          </div>
        </Container>
      </section>

      <section className="px-8 max-w-4xl mx-auto py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 font-headline">Ready to start your transformation?</h2>
        <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">Whether it's a single room or a commercial complex, we bring the same level of mastery to every project.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-95 transition-all">Request a Free Quote</Link>
          <button onClick={() => setFilter('all')} className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-surface-container-high transition-all">Browse More Work</button>
        </div>
      </section>
    </>
  );
}
