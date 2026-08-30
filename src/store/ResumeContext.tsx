import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import type { PhotoData, ResumeData } from '../types/resume';
import { defaultResume } from './defaultResume';
import { resumeReducer, type ResumeAction } from './resumeReducer';

const STORAGE_KEY = 'resume-builder:draft:v1';

function loadInitialState(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultResume;
    const parsed = JSON.parse(raw) as Partial<ResumeData>;

    // A draft saved by an older version (or corrupted storage) must never
    // crash the editor. Every field is validated back to a safe value and
    // any sections missing from an old draft are merged in from the defaults.
    const photo =
      parsed.photo && typeof parsed.photo === 'object' && typeof (parsed.photo as PhotoData).src === 'string'
        ? (parsed.photo as PhotoData)
        : null;

    const asArray = <T,>(value: unknown, fallback: T[]): T[] => (Array.isArray(value) ? (value as T[]) : fallback);

    const sectionOrder = asArray(parsed.sectionOrder, defaultResume.sectionOrder)
      .filter((s) => s && typeof s.id === 'string' && typeof s.kind === 'string')
      .map((s) => ({ ...s, visible: s.visible !== false, label: typeof s.label === 'string' ? s.label : s.id }));
    // Merge in any built-in sections the old draft didn't know about.
    for (const def of defaultResume.sectionOrder) {
      if (!sectionOrder.some((s) => s.id === def.id)) sectionOrder.push(def);
    }

    return {
      ...defaultResume,
      ...parsed,
      contact: { ...defaultResume.contact, ...parsed.contact },
      settings: { ...defaultResume.settings, ...parsed.settings },
      templateId: parsed.templateId ?? defaultResume.templateId,
      photo,
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      education: asArray(parsed.education, []),
      experience: asArray(parsed.experience, []),
      internships: asArray(parsed.internships, []),
      projects: asArray(parsed.projects, []),
      technicalSkills: asArray(parsed.technicalSkills, []),
      softSkills: asArray(parsed.softSkills, []),
      certifications: asArray(parsed.certifications, []),
      achievements: asArray(parsed.achievements, []),
      languages: asArray(parsed.languages, []),
      awards: asArray(parsed.awards, []),
      customSections: asArray(parsed.customSections, []),
      sectionOrder,
    };
  } catch {
    return defaultResume;
  }
}

type SaveStatus = 'saved' | 'saving' | 'idle';

interface ResumeContextValue {
  resume: ResumeData;
  dispatch: React.Dispatch<ResumeAction>;
  clearDraft: () => void;
  saveStatus: SaveStatus;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, dispatch] = useReducer(resumeReducer, undefined, loadInitialState);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    setSaveStatus('saving');
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
        setSaveStatus('saved');
      } catch {
        // localStorage can throw in private-browsing/quota-exceeded cases.
        // Losing auto-save silently is preferable to crashing the editor.
        setSaveStatus('idle');
      }
    }, 400); // small debounce so rapid typing doesn't thrash localStorage/UI
    return () => clearTimeout(t);
  }, [resume]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET', data: defaultResume });
  };

  const value = useMemo(() => ({ resume, dispatch, clearDraft, saveStatus }), [resume, saveStatus]);

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within a ResumeProvider');
  return ctx;
}
