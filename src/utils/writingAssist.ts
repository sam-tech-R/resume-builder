/**
 * Rule-based writing assistance — 100% local, no network, no external AI
 * service. It only rewrites text the user has already written; it never adds
 * facts, companies, numbers or achievements that aren't in the input.
 * Everything comes back as a suggestion the user can accept, edit or dismiss.
 */

/** Common texting/chat abbreviations → plain professional English. */
const ABBREVIATIONS: [RegExp, string][] = [
  [/\bu\b/gi, 'you'],
  [/\bur\b/gi, 'your'],
  [/\bplz\b/gi, 'please'],
  [/\bpls\b/gi, 'please'],
  [/\bbcoz\b/gi, 'because'],
  [/\bbcz\b/gi, 'because'],
  [/\bcuz\b/gi, 'because'],
  [/\bdnt\b/gi, "don't"],
  [/\bdidnt\b/gi, "didn't"],
  [/\bdont\b/gi, "don't"],
  [/\bcant\b/gi, "can't"],
  [/\bwont\b/gi, "won't"],
  [/\bthru\b/gi, 'through'],
  [/\basap\b/gi, 'as soon as possible'],
];

/**
 * Meaning-preserving phrase upgrades: weak/filler phrasing → stronger,
 * equally truthful equivalents. Applied case-insensitively.
 */
const PHRASE_UPGRADES: [RegExp, string][] = [
  [/\bin order to\b/g, 'to'],
  [/\bmade use of\b/g, 'used'],
  [/\butilized\b/g, 'used'],
  [/\bwas responsible for managing\b/g, 'managed'],
  [/\bwas responsible for leading\b/g, 'led'],
  [/\bwas responsible for creating\b/g, 'created'],
  [/\bwas responsible for building\b/g, 'built'],
  [/\bwas responsible for testing\b/g, 'tested'],
  [/\bwas responsible for designing\b/g, 'designed'],
  [/\bresponsible for managing\b/g, 'managed'],
  [/\bresponsible for leading\b/g, 'led'],
  [/\bresponsible for organizing\b/g, 'organized'],
  [/\btook part in\b/g, 'participated in'],
  [/\bhelped in building\b/g, 'helped build'],
  [/\bhelped in developing\b/g, 'helped develop'],
  [/\bworked on the development of\b/g, 'developed'],
  [/\bworked on the design of\b/g, 'designed'],
  [/\bworked on the creation of\b/g, 'created'],
  [/\bduring the period of\b/g, 'during'],
  [/\bat this point in time\b/g, 'currently'],
  [/\ba lot of\b/g, 'considerable'],
  [/\bduties included\b/g, 'key responsibilities were'],
];

/** Capitalize the first letter of every sentence in the text. */
function sentenceCase(text: string): string {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_m, prefix: string, letter: string) => prefix + letter.toUpperCase());
}

/** Clean up spacing and punctuation without changing the words. */
function tidy(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ +\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

export interface Suggestion {
  /** Improved text, ready to replace the original (still editable). */
  text: string;
  /** Human-readable list of what was changed, for the review UI. */
  notes: string[];
}

/**
 * Improve a single bullet point or short line. Meaning-preserving:
 * punctuation, spacing, sentence case, chat abbreviations and a curated set
 * of weak-phrase upgrades ("was responsible for managing" → "managed").
 */
export function improveLine(raw: string): Suggestion {
  const notes: string[] = [];
  let text = tidy(raw);
  if (!text) return { text: raw, notes: [] };

  for (const [pattern, replacement] of ABBREVIATIONS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, (match) => (match[0] === match[0].toUpperCase() ? replacement[0].toUpperCase() + replacement.slice(1) : replacement));
      notes.push('Expanded informal abbreviations');
      break;
    }
  }

  for (const [pattern, replacement] of PHRASE_UPGRADES) {
    if (pattern.test(text)) {
      text = text.replace(pattern, (match) => (match[0] === match[0].toUpperCase() ? replacement[0].toUpperCase() + replacement.slice(1) : replacement));
      notes.push('Replaced weak filler phrasing');
      break;
    }
  }

  const before = text;
  text = sentenceCase(text);
  if (text !== before) notes.push('Capitalized sentences');

  // Bullets read best without a trailing period when they're one sentence;
  // leave multi-sentence lines alone.
  const sentenceCount = (text.match(/[.!?](\s|$)/g) ?? []).length;
  if (sentenceCount === 1 && text.endsWith('.')) {
    text = text.slice(0, -1);
    notes.push('Removed trailing period');
  }

  if (notes.length === 0) {
    notes.push('Already reads well — no safe rewrites found. Tip: start with an action verb and add a number where you can.');
  }
  return { text, notes: [...new Set(notes)] };
}

/**
 * Turn a rough multi-sentence description (one big paragraph) into separate
 * bullet-style lines. Splits on sentence boundaries; words are never added,
 * removed or rephrased beyond `improveLine` cleanup.
 */
export function bulletizeDescription(raw: string): Suggestion {
  const cleaned = tidy(raw);
  if (!cleaned) return { text: raw, notes: [] };

  const sentences = cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => improveLine(s).text.replace(/[.;]$/, ''));

  if (sentences.length <= 1) {
    return {
      text: raw,
      notes: ['Write 2–3 sentences describing what you did, how, and the result — then this can split them into bullets.'],
    };
  }
  return {
    text: sentences.join('\n'),
    notes: [`Split into ${sentences.length} bullet points`, 'Each line cleaned and capitalized'],
  };
}

/**
 * Suggest a professional summary composed *only* from details already
 * present in the user's resume (title, education, skills, roles, projects).
 * Returns null when there isn't enough source material to work with.
 */
export function suggestSummary(resume: {
  contact: { title: string };
  education: { degree: string; field: string; institution: string }[];
  experience: { role: string; company: string }[];
  projects: { name: string }[];
  technicalSkills: string[];
  softSkills: string[];
}): string | null {
  const { contact } = resume;
  const parts: string[] = [];

  const who =
    contact.title.trim() ||
    (resume.education[0]
      ? `${[resume.education[0].degree, resume.education[0].field].filter(Boolean).join(' in ') || 'student'} student at ${resume.education[0].institution}`
      : '');
  if (!who) return null;

  const skills = [...resume.technicalSkills, ...resume.softSkills].filter(Boolean);
  if (skills.length > 0) {
    parts.push(`with hands-on experience in ${skills.slice(0, 4).join(', ')}`);
  }
  const orgs = [...resume.experience.map((e) => e.company).filter(Boolean), ...resume.projects.map((p) => p.name).filter(Boolean)];
  if (orgs.length > 0) {
    parts.push(`through work on ${orgs.slice(0, 3).join(', ')}`);
  }

  const sentence1 = `${who}${parts.length ? ' ' + parts.join(' ') : ''}.`.replace(/\s+/g, ' ').trim();
  const sentence2 = orgs.length
    ? 'Looking to apply these skills in a full-time role where I can keep learning and contribute from day one.'
    : 'Eager to apply these skills in a challenging internship or full-time role.';

  const result = `${sentence1} ${sentence2}`;
  return result.length > 40 ? result : null;
}

/** Phrases that usually signal vague, filler-heavy writing. */
const VAGUE_PATTERNS: [RegExp, string][] = [
  [/\bworked on\b/i, 'Name what you specifically built or did'],
  [/\bhelped with\b/i, 'State your specific contribution'],
  [/\bwas part of\b/i, 'Describe your own role, not the team\'s'],
  [/\bresponsible for\b/i, 'Use a strong verb: managed, led, built, designed'],
  [/\bvarious\b/i, 'Name the actual things'],
  [/\bduties included\b/i, 'Lead with achievements, not duties'],
  [/\binvolved in\b/i, 'Describe your specific contribution'],
  [/\bet cetera\b/i, 'List the important items instead'],
];

export interface WeakWordingHit {
  hint: string;
}

/** Find vague/filler phrases in a piece of text. */
export function findWeakWording(text: string): WeakWordingHit[] {
  return VAGUE_PATTERNS.filter(([p]) => p.test(text)).map(([, hint]) => ({ hint }));
}

