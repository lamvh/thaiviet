import type { Contact, ProjectStyleId } from '../../lib/types';
import type { ProjectMeta, SectionDef, TemplateValue } from '../../lib/templates/types';
import { projectLayouts } from './project-skins';

// Thin dispatcher: each template declares its own detail-page layout skin; every skin
// receives the same meta/values/sections/contact. Defaults to the classic layout (A).
export function ProjectTemplateRenderer({ layout = 'A', ...props }: {
  layout?: ProjectStyleId; meta: ProjectMeta; values: Record<string, TemplateValue>; sections: SectionDef[]; contact: Contact;
}) {
  const Layout = projectLayouts[layout] ?? projectLayouts.A;
  return <Layout {...props} />;
}
