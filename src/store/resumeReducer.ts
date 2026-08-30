import type { ContactInfo, CustomSectionItem, PhotoData, ResumeData, ResumeSettings, TemplateId } from '../types/resume';
import { DENSITY_PRESETS, clampSettings } from '../utils/settingsPresets';

// Names of the array fields on ResumeData that hold "repeatable entry"
// objects (as opposed to plain string arrays like technicalSkills).
export type ListField = 'education' | 'experience' | 'internships' | 'projects' | 'certifications' | 'awards' | 'languages';
export type StringListField = 'technicalSkills' | 'softSkills' | 'achievements';

export type ResumeAction =
  | { type: 'SET_CONTACT'; field: keyof ContactInfo; value: string }
  | { type: 'SET_PHOTO'; value: PhotoData | null }
  | { type: 'SET_PHOTO_ADJUSTMENT'; patch: Partial<Pick<PhotoData, 'zoom' | 'offsetX' | 'offsetY' | 'shape'>> }
  | { type: 'SET_SUMMARY'; value: string }
  | { type: 'LIST_ADD'; list: ListField; entry: unknown }
  | { type: 'LIST_UPDATE'; list: ListField; id: string; patch: Record<string, unknown> }
  | { type: 'LIST_REMOVE'; list: ListField; id: string }
  | { type: 'LIST_REORDER'; list: ListField; fromIndex: number; toIndex: number }
  | { type: 'STRING_LIST_SET'; list: StringListField; values: string[] }
  | { type: 'CUSTOM_SECTION_ADD'; heading: string }
  | { type: 'CUSTOM_SECTION_REMOVE'; sectionId: string }
  | { type: 'CUSTOM_SECTION_RENAME'; sectionId: string; heading: string }
  | { type: 'CUSTOM_SECTION_ITEM_ADD'; sectionId: string; item: CustomSectionItem }
  | { type: 'CUSTOM_SECTION_ITEM_UPDATE'; sectionId: string; itemId: string; patch: Partial<CustomSectionItem> }
  | { type: 'CUSTOM_SECTION_ITEM_REMOVE'; sectionId: string; itemId: string }
  | { type: 'SECTION_TOGGLE_VISIBLE'; sectionId: string }
  | { type: 'SECTION_RENAME'; sectionId: string; label: string }
  | { type: 'SECTION_REORDER'; fromIndex: number; toIndex: number }
  | { type: 'SET_TEMPLATE'; templateId: TemplateId }
  | { type: 'SET_SETTING'; patch: Partial<ResumeSettings> }
  | { type: 'APPLY_DENSITY_PRESET'; preset: 'compact' | 'balanced' | 'spacious' }
  | { type: 'LOAD'; data: ResumeData }
  | { type: 'RESET'; data: ResumeData };

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'SET_CONTACT':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };

    case 'SET_PHOTO':
      return { ...state, photo: action.value };

    case 'SET_PHOTO_ADJUSTMENT':
      return state.photo ? { ...state, photo: { ...state.photo, ...action.patch } } : state;

    case 'SET_SUMMARY':
      return { ...state, summary: action.value };

    case 'LIST_ADD':
      return { ...state, [action.list]: [...(state[action.list] as unknown[]), action.entry] };

    case 'LIST_UPDATE':
      return {
        ...state,
        [action.list]: (state[action.list] as Array<{ id: string }>).map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item
        ),
      };

    case 'LIST_REMOVE':
      return {
        ...state,
        [action.list]: (state[action.list] as Array<{ id: string }>).filter((item) => item.id !== action.id),
      };

    case 'LIST_REORDER':
      return { ...state, [action.list]: reorder(state[action.list] as unknown[], action.fromIndex, action.toIndex) };

    case 'STRING_LIST_SET':
      return { ...state, [action.list]: action.values };

    case 'CUSTOM_SECTION_ADD': {
      const sectionId = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      return {
        ...state,
        customSections: [...state.customSections, { id: sectionId, heading: action.heading, items: [] }],
        sectionOrder: [
          ...state.sectionOrder,
          { id: sectionId, kind: 'custom', label: action.heading, visible: true, customSectionId: sectionId },
        ],
      };
    }

    case 'CUSTOM_SECTION_REMOVE':
      return {
        ...state,
        customSections: state.customSections.filter((s) => s.id !== action.sectionId),
        sectionOrder: state.sectionOrder.filter((s) => s.customSectionId !== action.sectionId),
      };

    case 'CUSTOM_SECTION_RENAME':
      return {
        ...state,
        customSections: state.customSections.map((s) => (s.id === action.sectionId ? { ...s, heading: action.heading } : s)),
        sectionOrder: state.sectionOrder.map((s) =>
          s.customSectionId === action.sectionId ? { ...s, label: action.heading } : s
        ),
      };

    case 'CUSTOM_SECTION_ITEM_ADD':
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId ? { ...s, items: [...s.items, action.item] } : s
        ),
      };

    case 'CUSTOM_SECTION_ITEM_UPDATE':
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, items: s.items.map((i) => (i.id === action.itemId ? { ...i, ...action.patch } : i)) }
            : s
        ),
      };

    case 'CUSTOM_SECTION_ITEM_REMOVE':
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId ? { ...s, items: s.items.filter((i) => i.id !== action.itemId) } : s
        ),
      };

    case 'SECTION_TOGGLE_VISIBLE':
      return {
        ...state,
        sectionOrder: state.sectionOrder.map((s) => (s.id === action.sectionId ? { ...s, visible: !s.visible } : s)),
      };

    case 'SECTION_RENAME':
      return {
        ...state,
        sectionOrder: state.sectionOrder.map((s) => (s.id === action.sectionId ? { ...s, label: action.label } : s)),
      };

    case 'SECTION_REORDER':
      return { ...state, sectionOrder: reorder(state.sectionOrder, action.fromIndex, action.toIndex) };

    case 'SET_TEMPLATE':
      return { ...state, templateId: action.templateId };

    case 'SET_SETTING':
      return { ...state, settings: clampSettings({ ...state.settings, ...action.patch, density: 'custom' }) };

    case 'APPLY_DENSITY_PRESET':
      return {
        ...state,
        settings: clampSettings({ ...state.settings, ...DENSITY_PRESETS[action.preset], density: action.preset }),
      };

    case 'LOAD':
    case 'RESET':
      return action.data;

    default:
      return state;
  }
}
