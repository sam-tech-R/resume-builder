import type { ResumeData } from '../types/resume';
import { defaultSectionOrder } from '../store/defaultResume';
import { defaultSettings } from './settingsPresets';

/**
 * Clearly fictional Indian example resume shown in the preview before the
 * user starts typing. Every name, college, company and number here is
 * invented for illustration only.
 */
export const sampleResume: ResumeData = {
  contact: {
    fullName: 'Ananya Sharma',
    title: 'B.Tech CSE Student · Aspiring Software Engineer',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    linkedin: 'linkedin.com/in/ananya-sharma',
    github: 'github.com/ananya-sharma',
    portfolio: '',
  },
  photo: null,
  summary:
    'Final-year Computer Science student with a strong foundation in data structures, algorithms and web development. Built and shipped three academic and personal projects in React and Node.js, including a campus placement portal used by 200+ students. Looking for a software engineering role where I can contribute to real products from day one.',
  education: [
    {
      id: 's-edu-1',
      institution: 'RV College of Engineering, Bengaluru',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      location: 'Bengaluru',
      startDate: '2022',
      endDate: '2026',
      gpa: '8.7 / 10 CGPA',
      description: 'Relevant coursework: Data Structures, DBMS, Operating Systems, Machine Learning.',
    },
    {
      id: 's-edu-2',
      institution: 'Kendriya Vidyalaya, Pune',
      degree: 'Class XII (CBSE)',
      field: 'Science (PCM with Computer Science)',
      location: 'Pune',
      startDate: '2020',
      endDate: '2022',
      gpa: '92%',
      description: '',
    },
  ],
  experience: [
    {
      id: 's-exp-1',
      company: 'NimbusWorks Technologies Pvt. Ltd.',
      role: 'Software Development Intern',
      location: 'Bengaluru (Hybrid)',
      startDate: 'May 2025',
      endDate: 'Jul 2025',
      current: false,
      bullets: [
        'Built 4 reusable React components now used across the company\'s internal dashboard',
        'Wrote 30+ unit tests for the billing module, taking coverage from 55% to 81%',
      ],
    },
  ],
  internships: [],
  projects: [
    {
      id: 's-proj-1',
      name: 'CampusLink — Placement Portal',
      link: 'github.com/ananya-sharma/campuslink',
      techStack: 'React, Node.js, MongoDB',
      startDate: 'Aug 2024',
      endDate: 'Dec 2024',
      bullets: [
        'Developed a placement portal used by 200+ students across 3 departments',
        'Implemented resume shortlisting with role-based access for placement cells',
      ],
    },
    {
      id: 's-proj-2',
      name: 'Sahayak — Expense Tracker',
      link: '',
      techStack: 'Flutter, Firebase',
      startDate: 'Jan 2024',
      endDate: 'Mar 2024',
      bullets: ['Built an offline-first expense tracker with UPI-style category tagging'],
    },
  ],
  technicalSkills: ['Java', 'Python', 'React', 'Node.js', 'MongoDB', 'Git & GitHub', 'SQL'],
  softSkills: ['Teamwork', 'Communication', 'Problem solving'],
  certifications: [],
  achievements: ['Smart India Hackathon 2024 — college-level finalist'],
  languages: [],
  awards: [],
  customSections: [],
  sectionOrder: defaultSectionOrder,
  templateId: 'classic',
  settings: defaultSettings,
};
