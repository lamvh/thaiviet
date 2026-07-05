// Shared template-registry types. Field-kind model extracted from the dashboard design's
// composeTemplatesData(): a template is meta + an ordered list of typed sections.
import type { ProjectCategory } from '../types';

export type TemplateValue = string | Record<string, string> | Array<Record<string, string>>;

export interface FieldDef { key: string; label: string; area?: boolean }

export type SectionKind = 'text' | 'pair' | 'repeat';
export type SectionStyle =
  | 'rule' | 'quote' | 'author' | 'plain'   // text
  | 'beforeafter'                            // pair
  | 'steps' | 'gallery' | 'highlights';      // repeat

export interface SectionDef {
  key: string;
  kind: SectionKind;
  style: SectionStyle;
  title: string;        // admin form group label
  heading?: string;     // public heading (text kinds)
  label?: string;       // single-field label (text kinds)
  area?: boolean;       // textarea vs input
  fields?: FieldDef[];  // pair / repeat sub-fields
  itemLabel?: string;   // repeat: singular noun
  addLabel?: string;    // repeat: add-button label
  default: TemplateValue;
}

export interface ProjectMeta {
  title: string; category: string; location: string;
  duration: string; year: string; cover: string; intro: string;
}

export type ProjectTemplateId =
  | 'casestudy' | 'beforeafter' | 'timeline' | 'photostory' | 'spotlight'
  | 'sidebar' | 'beforeafterfocus' | 'bento' | 'minimal';

export interface ProjectPage {
  templateId: ProjectTemplateId;
  meta: ProjectMeta;
  values: Record<string, TemplateValue>;
}

export interface ProjectTemplateDef {
  id: ProjectTemplateId;
  name: string;
  icon: string;          // Material Symbols name for the picker card
  desc: string;
  includes: string[];    // picker card chips
  categoryValue: ProjectCategory; // gallery-filter enum for projects made from this template
  layout?: ProjectStyleId; // detail-page layout skin for this template (defaults to 'A' / classic)
  defaultMeta: ProjectMeta;
  sections: SectionDef[];
}

export type ServiceStyleId = 'A' | 'B' | 'C' | 'D' | 'E';

// Global layout style for templated project-detail pages. A is the classic full-width
// layout; the others re-lay-out the same project content (facts, intro, sections) in a
// different arrangement — mirrors the ServiceStyleId picker.
export type ProjectStyleId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
