import { Navigate, useParams } from 'react-router-dom';
import { useSiteContent } from '../lib/site-content-context';
import { serviceTemplates } from '../lib/templates/service-templates';
import { ServiceTemplateRenderer } from '../components/templates/ServiceTemplateRenderer';

// Every service is guaranteed a `page` by migrateServices() at load time, so this
// dispatcher only needs to render the template — no skin fallback.
export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { contact, serviceDetails } = useSiteContent();
  const s = serviceDetails.find((d) => d.slug === slug);
  if (!s || s.visible === false || !s.page) return <Navigate to="/services" replace />;
  const def = serviceTemplates[s.page.templateId];
  if (!def) return <Navigate to="/services" replace />;
  return <ServiceTemplateRenderer layout={def.layout} meta={s.page.meta} values={s.page.values} sections={def.sections} contact={contact} />;
}
