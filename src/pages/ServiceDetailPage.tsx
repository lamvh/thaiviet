import { Navigate, useParams } from 'react-router-dom';
import { useSiteContent } from '../lib/site-content-context';
import { serviceSkins } from '../components/services/service-skins';
import { serviceTemplates } from '../lib/templates/service-templates';
import { ServiceTemplateRenderer } from '../components/templates/ServiceTemplateRenderer';

// Thin dispatcher: a templated service renders through its template; otherwise the global
// serviceStyle selects which skin lays out the service content.
export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { contact, serviceDetails, serviceStyle } = useSiteContent();
  const s = serviceDetails.find((d) => d.slug === slug);

  // Unknown or hidden slug → back to the services list.
  if (!s || s.visible === false) return <Navigate to="/services" replace />;

  // Templated service → render its template; else fall back to the global skin.
  if (s.page) {
    const def = serviceTemplates[s.page.templateId];
    if (def) return <ServiceTemplateRenderer layout={def.layout} meta={s.page.meta} values={s.page.values} sections={def.sections} contact={contact} />;
  }

  const Skin = serviceSkins[serviceStyle] ?? serviceSkins.A;
  return <Skin s={s} contact={contact} />;
}
