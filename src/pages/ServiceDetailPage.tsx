import { Navigate, useParams } from 'react-router-dom';
import { useSiteContent } from '../lib/site-content-context';
import { serviceSkins } from '../components/services/service-skins';

// Thin dispatcher: the global serviceStyle selects which skin lays out the service content.
export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { contact, serviceDetails, serviceStyle } = useSiteContent();
  const s = serviceDetails.find((d) => d.slug === slug);

  // Unknown slug → back to the services list.
  if (!s) return <Navigate to="/services" replace />;

  const Skin = serviceSkins[serviceStyle] ?? serviceSkins.A;
  return <Skin s={s} contact={contact} />;
}
