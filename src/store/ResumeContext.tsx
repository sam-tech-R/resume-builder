import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import type { ResumeData } from '../types/resume';
import { defaultResume } from './defaultResume';
import { resumeReducer, type ResumeAction } from './resumeReducer';

const STORAGE_KEY = 'resume-builder:draft:v1';

function loadInitialState(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultResume;
    const parsed = JSON.parse(raw) as Partial<ResumeData> & { photo?: unknown; template?: unknown };

    // Photo shape changed from a plain string to a { src, zoom, offset, shape }
    // object. A draft saved before that change can't be reused as-is, so drop
    // it rather than crash the renderer — everything else in the draft is
    // still safe to keep.
    const photo = parsed.photo && typeof parsed.photo === 'object' ? (parsed.photo as ResumeData['photo']) : null;

    return {
      ...defaultResume,
      ...parsed,
      contact: { ...defaultResume.contact, ...parsed.contact },
      settings: { ...defaultResume.settings, ...parsed.settings },
      templateId: parsed.templateId ?? defaultResume.templateId,
      photo,
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
