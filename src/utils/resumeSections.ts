import type { ResumeData, SectionMeta } from '../types/resume';

/**
 * Both the on-screen preview and the PDF renderer walk this same list so
 * that what you see while editing is exactly what ends up in the export.
 */
export function getVisibleSections(resume: ResumeData): SectionMeta[] {
  return resume.sectionOrder.filter((s) => {
    if (!s.visible) return false;
    // A built-in section with no content yet is skipped so the resume
    // doesn't show empty headings while the user is still filling it in.
    switch (s.kind) {
      case 'summary':
        return resume.summary.trim().length > 0;
      case 'education':
        return resume.education.length > 0;
      case 'experience':
        return resume.experience.length > 0;
      case 'internships':
        return resume.internships.length > 0;
      case 'projects':
        return resume.projects.length > 0;
      case 'technicalSkills':
        return resume.technicalSkills.length > 0;
      case 'softSkills':
        return resume.softSkills.length > 0;
      case 'certifications':
        return resume.certifications.length > 0;
      case 'achievements':
        return resume.achievements.length > 0;
      case 'languages':
        return resume.languages.length > 0;
      case 'awards':
        return resume.awards.length > 0;
      case 'custom': {
        const cs = resume.customSections.find((c) => c.id === s.customSectionId);
        return !!cs && cs.items.length > 0;
      }
      default:
        return false;
    }
  });
}

export function dateRange(start: string, end: string): string {
  if (!start && !end) return '';
  if (start && !end) return start;
  return `${start} – ${end}`;
}
