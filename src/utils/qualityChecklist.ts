import type { ResumeData } from '../types/resume';

export interface QualityCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

function wordCount(resume: ResumeData): number {
  const bulletWords = (arr: { bullets: string[] }[]) => arr.flatMap((e) => e.bullets).join(' ');
  const text = [
    resume.summary,
    bulletWords(resume.experience),
    bulletWords(resume.internships),
    bulletWords(resume.projects),
    resume.achievements.join(' '),
  ].join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasMeasurableAchievement(resume: ResumeData): boolean {
  const allBullets = [...resume.experience, ...resume.internships, ...resume.projects].flatMap((e) => e.bullets);
  const numberPattern = /\d/;
  return allBullets.some((b) => numberPattern.test(b)) || resume.achievements.some((a) => numberPattern.test(a));
}

/**
 * A small set of rule-of-thumb checks — presence and basic shape, not a
 * parse-accuracy or keyword-matching engine. Deliberately conservative about
 * what it claims.
 */
export function runQualityChecklist(resume: ResumeData): QualityCheck[] {
  const { contact } = resume;
  const checks: QualityCheck[] = [];

  const contactOk = Boolean(contact.fullName && contact.email && (contact.phone || contact.location));
  checks.push({
    id: 'contact',
    label: 'Contact information',
    status: contactOk ? 'pass' : 'fail',
    message: contactOk ? 'Name, email, and a way to reach you are filled in.' : 'Add your name, email, and phone or location.',
  });

  checks.push({
    id: 'summary',
    label: 'Profile summary',
    status: resume.summary.trim().length > 40 ? 'pass' : resume.summary.trim().length > 0 ? 'warn' : 'fail',
    message:
      resume.summary.trim().length > 40
        ? 'Summary gives a quick overview of your background.'
        : resume.summary.trim().length > 0
          ? 'Summary is quite short — a sentence or two more would help.'
          : 'Add a 2–4 sentence summary at the top of your resume.',
  });

  const hasExperienceOrProjects = resume.experience.length > 0 || resume.projects.length > 0 || resume.internships.length > 0;
  checks.push({
    id: 'experience',
    label: 'Experience or projects',
    status: hasExperienceOrProjects ? 'pass' : 'fail',
    message: hasExperienceOrProjects
      ? 'You have at least one experience, internship, or project entry.'
      : 'Add at least one work experience, internship, or project.',
  });

  checks.push({
    id: 'education',
    label: 'Education',
    status: resume.education.length > 0 ? 'pass' : 'warn',
    message: resume.education.length > 0 ? 'Education section is filled in.' : 'Add your education, even if still in progress.',
  });

  const hasSkills = resume.technicalSkills.length > 0 || resume.softSkills.length > 0;
  checks.push({
    id: 'skills',
    label: 'Skills',
    status: hasSkills ? 'pass' : 'fail',
    message: hasSkills ? 'At least one skills section is filled in.' : 'List a few technical or soft skills.',
  });

  const words = wordCount(resume);
  checks.push({
    id: 'length',
    label: 'Resume length',
    status: words >= 80 ? 'pass' : words >= 30 ? 'warn' : 'fail',
    message:
      words >= 80
        ? 'Good amount of detail across your summary and entries.'
        : words >= 30
          ? 'A bit thin — a few more bullet points would strengthen it.'
          : 'Your resume is very short. Add more detail to your entries.',
  });

  const measurable = hasMeasurableAchievement(resume);
  checks.push({
    id: 'measurable',
    label: 'Measurable achievements',
    status: measurable ? 'pass' : 'warn',
    message: measurable
      ? 'At least one bullet includes a number or metric.'
      : 'Try adding a number to a bullet (e.g. "reduced load time by 40%").',
  });

  return checks;
}

export function qualityScore(checks: QualityCheck[]): number {
  const weight = { pass: 1, warn: 0.5, fail: 0 };
  const total = checks.reduce((sum, c) => sum + weight[c.status], 0);
  return Math.round((total / checks.length) * 100);
}
