import type { ResumeData, SectionMeta } from '../types/resume';
import { defaultSettings } from '../utils/settingsPresets';

export const defaultSectionOrder: SectionMeta[] = [
  { id: 'summary', kind: 'summary', label: 'Profile Summary', visible: true },
  { id: 'experience', kind: 'experience', label: 'Work Experience', visible: true },
  { id: 'internships', kind: 'internships', label: 'Internships', visible: false },
  { id: 'projects', kind: 'projects', label: 'Projects', visible: true },
  { id: 'education', kind: 'education', label: 'Education', visible: true },
  { id: 'technicalSkills', kind: 'technicalSkills', label: 'Technical Skills', visible: true },
  { id: 'softSkills', kind: 'softSkills', label: 'Soft Skills', visible: false },
  { id: 'certifications', kind: 'certifications', label: 'Certifications', visible: false },
  { id: 'achievements', kind: 'achievements', label: 'Achievements', visible: false },
  { id: 'awards', kind: 'awards', label: 'Awards', visible: false },
  { id: 'languages', kind: 'languages', label: 'Languages', visible: false },
];

export const defaultResume: ResumeData = {
  contact: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  photo: null,
  summary: '',
  education: [],
  experience: [],
  internships: [],
  projects: [],
  technicalSkills: [],
  softSkills: [],
  certifications: [],
  achievements: [],
  languages: [],
  awards: [],
  customSections: [],
  sectionOrder: defaultSectionOrder,
  templateId: 'classic',
  settings: defaultSettings,
};
