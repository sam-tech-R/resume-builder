// Core data model for the whole app. Every form, the live preview, and the
// PDF renderer all read from this single shape — that's what keeps the
// on-screen preview and the exported PDF in sync.

export interface ContactInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface InternshipEntry extends ExperienceEntry {}

export interface ProjectEntry {
  id: string;
  name: string;
  link: string;
  techStack: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  heading: string;
  items: CustomSectionItem[];
}

// Every built-in section can be shown/hidden and reordered. "kind" tells the
// preview/PDF renderer which component to use; "id" is what SectionManager
// drags/reorders and toggles.
export type SectionKind =
  | 'summary'
  | 'education'
  | 'experience'
  | 'internships'
  | 'projects'
  | 'technicalSkills'
  | 'softSkills'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'awards'
  | 'custom';

export interface SectionMeta {
  id: string; // stable id, e.g. "education" or "custom-<uuid>"
  kind: SectionKind;
  label: string; // editable heading shown on the resume
  visible: boolean;
  customSectionId?: string; // links to CustomSection when kind === 'custom'
}

// Photo is stored as the resized source image plus a pan/zoom/shape
// "adjustment" rather than a pre-cropped bitmap. This lets the preview apply
// the crop live with a CSS transform (cheap, reversible) while the PDF
// exporter bakes the same adjustment into a raster image at export time
// (see utils/photoBake.ts) — one source of truth, two renderers.
export interface PhotoData {
  src: string; // base64 data URL, resized on upload
  zoom: number; // 1 = fit, up to ~3
  offsetX: number; // -50..50, percent of frame width
  offsetY: number; // -50..50, percent of frame height
  shape: 'circle' | 'square';
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'professional';

export type DensityPreset = 'compact' | 'balanced' | 'spacious' | 'custom';

export interface ResumeSettings {
  fontFamily: 'helvetica' | 'times' | 'courier';
  fontSizeScale: number; // 0.9 - 1.15
  headingScale: number; // 0.9 - 1.3
  lineSpacing: number; // 1.0 - 1.5
  sectionSpacing: number; // 0.7 - 1.5
  margin: 'narrow' | 'normal' | 'wide';
  density: DensityPreset;
  // Optional override for the template's accent color. null/undefined means
  // "use whatever the template defines" — keeps templates as the default
  // while letting users nudge the look without breaking ATS-safe styling.
  accentColor?: string | null;
}

export interface ResumeData {
  contact: ContactInfo;
  photo: PhotoData | null;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  internships: InternshipEntry[];
  projects: ProjectEntry[];
  technicalSkills: string[];
  softSkills: string[];
  certifications: CertificationEntry[];
  achievements: string[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
  customSections: CustomSection[];
  sectionOrder: SectionMeta[];
  templateId: TemplateId;
  settings: ResumeSettings;
}
