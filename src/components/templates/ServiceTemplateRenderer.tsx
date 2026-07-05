import type { Contact, ServiceStyleId } from '../../lib/types';
import type { ServiceMeta, SectionDef, TemplateValue } from '../../lib/templates/types';
import { serviceTemplateLayouts } from './service-skins-templated';

// Thin dispatcher: the service template's layout selects which skin lays out the content.
export function ServiceTemplateRenderer({ layout = 'A', ...props }: {
  layout?: ServiceStyleId; meta: ServiceMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; contact: Contact;
}) {
  const Layout = serviceTemplateLayouts[layout] ?? serviceTemplateLayouts.A;
  return <Layout {...props} />;
}
