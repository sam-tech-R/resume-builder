import type { DensityPreset, ResumeSettings } from '../types/resume';

export const SETTINGS_RANGES = {
  fontSizeScale: { min: 0.9, max: 1.15, step: 0.01 },
  headingScale: { min: 0.9, max: 1.3, step: 0.02 },
  lineSpacing: { min: 1.0, max: 1.5, step: 0.02 },
  sectionSpacing: { min: 0.7, max: 1.5, step: 0.02 },
} as const;

export function clampSettings(s: ResumeSettings): ResumeSettings {
  const c = (v: number, r: { min: number; max: number }) => Math.min(r.max, Math.max(r.min, v));
  return {
    ...s,
    fontSizeScale: c(s.fontSizeScale, SETTINGS_RANGES.fontSizeScale),
    headingScale: c(s.headingScale, SETTINGS_RANGES.headingScale),
    lineSpacing: c(s.lineSpacing, SETTINGS_RANGES.lineSpacing),
    sectionSpacing: c(s.sectionSpacing, SETTINGS_RANGES.sectionSpacing),
  };
}

export const DENSITY_PRESETS: Record<Exclude<DensityPreset, 'custom'>, Omit<ResumeSettings, 'fontFamily' | 'density'>> = {
  compact: { fontSizeScale: 0.95, headingScale: 0.95, lineSpacing: 1.12, sectionSpacing: 0.78, margin: 'narrow' },
  balanced: { fontSizeScale: 1, headingScale: 1, lineSpacing: 1.25, sectionSpacing: 1, margin: 'normal' },
  spacious: { fontSizeScale: 1.06, headingScale: 1.12, lineSpacing: 1.4, sectionSpacing: 1.3, margin: 'wide' },
};

export const MARGIN_PX: Record<ResumeSettings['margin'], number> = {
  narrow: 28,
  normal: 40,
  wide: 56,
};

// react-pdf ships the 14 base PDF fonts, so these map 1:1 with no embedding
// needed — guarantees identical rendering everywhere and stays ATS-safe.
export const PDF_FONT_FAMILY: Record<ResumeSettings['fontFamily'], { regular: string; bold: string }> = {
  helvetica: { regular: 'Helvetica', bold: 'Helvetica-Bold' },
  times: { regular: 'Times-Roman', bold: 'Times-Bold' },
  courier: { regular: 'Courier', bold: 'Courier-Bold' },
};

export const CSS_FONT_FAMILY: Record<ResumeSettings['fontFamily'], string> = {
  helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  times: "'Times New Roman', Times, serif",
  courier: "'Courier New', Courier, monospace",
};

export const defaultSettings: ResumeSettings = {
  fontFamily: 'helvetica',
  ...DENSITY_PRESETS.balanced,
  density: 'balanced',
};
