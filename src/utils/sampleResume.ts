import type { ResumeData } from '../types/resume';
import { defaultSectionOrder } from '../store/defaultResume';
import { defaultSettings } from './settingsPresets';

export const sampleResume: ResumeData = {
  contact: {
    fullName: 'Alex Morgan',
    title: 'Product Designer',
    email: 'alex.morgan@email.com',
    phone: '+1 512 555 0148',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: '',
    portfolio: 'alexmorgan.design',
  },
  photo: null,
  summary:
    'Product designer with 5 years of experience shipping consumer-facing web and mobile products. Focused on turning ambiguous problems into simple, tested interfaces.',
  education: [
    {
      id: 's-edu-1',
      institution: 'University of Texas at Austin',
      degree: 'B.F.A.',
      field: 'Design',
      location: 'Austin, TX',
      startDate: '2015',
      endDate: '2019',
      gpa: '',
      description: '',
    },
  ],
  experience: [
    {
      id: 's-exp-1',
      company: 'Northbeam',
      role: 'Senior Product Designer',
      location: 'Remote',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led redesign of the onboarding flow, increasing activation by 23%',
        'Built and maintained a component library used across 6 product teams',
      ],
    },
    {
      id: 's-exp-2',
      company: 'Fielder Co.',
      role: 'Product Designer',
      location: 'Austin, TX',
      startDate: 'Jul 2019',
      endDate: 'Dec 2021',
      current: false,
      bullets: ['Designed and shipped a redesigned checkout flow that reduced drop-off by 15%'],
    },
  ],
  internships: [],
  projects: [],
  technicalSkills: ['Figma', 'Design Systems', 'HTML/CSS', 'User Research'],
  softSkills: ['Communication', 'Cross-functional collaboration'],
  certifications: [],
  achievements: [],
  languages: [],
  awards: [],
  customSections: [],
  sectionOrder: defaultSectionOrder,
  templateId: 'classic',
  settings: defaultSettings,
};
