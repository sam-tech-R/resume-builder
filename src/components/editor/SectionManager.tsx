import { useResume } from '../../store/ResumeContext';
import { TextInput } from '../ui/FormControls';
import { Toggle } from '../ui/Toggle';

/**
 * Compact section manager: reorder, show/hide and rename any section.
 * Used in the wizard's Customize step and available from the full editor.
 */
export function SectionManager() {
  const { resume, dispatch } = useResume();

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= resume.sectionOrder.length) return;
    dispatch({ type: 'SECTION_REORDER', fromIndex: index, toIndex: to });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="mb-1 text-[12.5px] text-ink-soft">
        Drag-free reordering — arrange sections the way recruiters in your field expect to read them.
      </p>
      {resume.sectionOrder.map((section, index) => (
        <div key={section.id} className="flex items-center gap-2 rounded-md border border-border bg-paper-raised px-2.5 py-1.5">
          <div className="flex flex-col">
            <button
              type="button"
              aria-label={`Move ${section.label} up`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
              className="rounded px-1 text-[10px] leading-none text-ink-soft hover:bg-paper hover:text-ink disabled:opacity-25"
            >
              ▲
            </button>
            <button
              type="button"
              aria-label={`Move ${section.label} down`}
              disabled={index === resume.sectionOrder.length - 1}
              onClick={() => move(index, 1)}
              className="rounded px-1 text-[10px] leading-none text-ink-soft hover:bg-paper hover:text-ink disabled:opacity-25"
            >
              ▼
            </button>
          </div>
          <TextInput
            value={section.label}
            onChange={(e) => dispatch({ type: 'SECTION_RENAME', sectionId: section.id, label: e.target.value })}
            aria-label={`Rename section ${section.label}`}
            className="min-w-0 flex-1 border-transparent bg-transparent px-1 py-0.5 text-[13px] font-medium focus:border-primary"
          />
          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] text-ink-soft sm:inline">{section.visible ? 'Shown' : 'Hidden'}</span>
            <Toggle
              checked={section.visible}
              onChange={() => dispatch({ type: 'SECTION_TOGGLE_VISIBLE', sectionId: section.id })}
              label={`${section.visible ? 'Hide' : 'Show'} ${section.label} on resume`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
