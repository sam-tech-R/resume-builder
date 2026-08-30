import type { TemplateId } from '../types/resume';

/**
 * Every template stays single-column with the same semantic reading order
 * (name → contact → sections in the user's chosen order) — only the visual
 * treatment changes. This is what keeps all four templates ATS-safe while
 * still looking genuinely different from one another.
 */
export interface TemplateTokens {
  id: TemplateId;
  name: string;
  description: string;
  accent: string; // hex, used sparingly (name underline, dates, dividers)
  nameColor: string;
  headingStyle: 'underline' | 'bar' | 'plain' | 'boxed';
  headingCase: 'upper' | 'title';
  headingTracking: number; // letter-spacing in pt-ish units, scaled by settings
  dividerWeight: number; // 0 = none
  fontDefault: 'helvetica' | 'times' | 'courier';
  nameWeight: 'bold' | 'normal';
  photoAlign: 'left' | 'right';
}

export const TEMPLATES: Record<TemplateId, TemplateTokens> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Serif, traditional. Best for conservative fields — law, finance, academia.',
    accent: '#3a3a3a',
    nameColor: '#111111',
    headingStyle: 'underline',
    headingCase: 'upper',
    headingTracking: 0.6,
    dividerWeight: 1,
    fontDefault: 'times',
    nameWeight: 'bold',
    photoAlign: 'right',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean sans-serif with a quiet accent. Best for tech and startup roles.',
    accent: '#1f3a3d',
    nameColor: '#14171f',
    headingStyle: 'bar',
    headingCase: 'upper',
    headingTracking: 0.8,
    dividerWeight: 0,
    fontDefault: 'helvetica',
    nameWeight: 'bold',
    photoAlign: 'left',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Quiet and spacious. Best for students and freshers — content does the talking.',
    accent: '#6b6b6b',
    nameColor: '#1a1a1a',
    headingStyle: 'plain',
    headingCase: 'title',
    headingTracking: 0.2,
    dividerWeight: 0,
    fontDefault: 'helvetica',
    nameWeight: 'normal',
    photoAlign: 'left',
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Boxed labels, strong hierarchy. Best for experienced candidates and managers.',
    accent: '#8a5a1f',
    nameColor: '#14171f',
    headingStyle: 'boxed',
    headingCase: 'upper',
    headingTracking: 0.5,
    dividerWeight: 0,
    fontDefault: 'helvetica',
    nameWeight: 'bold',
    photoAlign: 'right',
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);
