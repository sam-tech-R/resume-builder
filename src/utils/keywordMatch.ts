import type { ResumeData } from '../types/resume';

/**
 * Lightweight, fully client-side job-description keyword matching.
 * Extracts meaningful terms from a pasted job description and reports which
 * ones don't appear anywhere in the resume. Deliberately simple (tokenize +
 * stopwords + singular/plural folding) — it's a tailoring aid, not a score.
 */

const STOPWORDS = new Set(
  `a an and are as at be by for from has have how in is it its of on or that the to was were will with you your our we they their this these those what when where which who whom why would should could can may might must shall do does did done not no nor but if then than so such about into over under again further once here there all any both each few more most other some own same too very just also job role work working candidate candidates applicant applicants experience experiences year years strong good great excellent ability able skills skill knowledge required requirement requirements responsibilities responsibility preferred plus must nice team teams company companies role based position looking join help support ensure across using use used etc via per within able including include includes`
    .split(/\s+/)
    .filter(Boolean)
);

function normalize(word: string): string {
  const w = word.toLowerCase();
  // Very light stemming: fold simple plural/gerund forms together.
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#./-]+/)
    .filter((t) => t.length >= 2 && t.length <= 30)
    .map(normalize);
}

/** Terms found in the JD that are missing from the resume. */
export function findMissingKeywords(jobDescription: string, resume: ResumeData, limit = 12): string[] {
  const jdTokens = tokenize(jobDescription);
  if (jdTokens.length === 0) return [];

  const resumeText = [
    resume.contact.title,
    resume.summary,
    resume.education.map((e) => [e.degree, e.field, e.description].join(' ')).join(' '),
    resume.experience.map((e) => [e.role, e.company, e.bullets.join(' ')].join(' ')).join(' '),
    resume.internships.map((e) => [e.role, e.company, e.bullets.join(' ')].join(' ')).join(' '),
    resume.projects.map((p) => [p.name, p.techStack, p.bullets.join(' ')].join(' ')).join(' '),
    resume.technicalSkills.join(' '),
    resume.softSkills.join(' '),
    resume.certifications.map((c) => c.name).join(' '),
    resume.achievements.join(' '),
  ]
    .join(' ')
    .toLowerCase();

  const resumeTokens = new Set(tokenize(resumeText));

  // Count frequency in the JD to rank importance; skip generic stopwords.
  const counts = new Map<string, number>();
  for (const token of jdTokens) {
    if (STOPWORDS.has(token) || STOPWORDS.has(token.replace(/s$/, ''))) continue;
    if (/^\d+$/.test(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  const missing = [...counts.entries()]
    .filter(([token]) => !resumeTokens.has(token))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([token]) => token);

  return missing;
}
