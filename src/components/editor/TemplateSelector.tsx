import { useResume } from '../../store/ResumeContext';
import { TEMPLATE_LIST } from '../../store/templates';
import { TemplateThumb } from '../TemplateThumb';

export function TemplateSelector() {
  const { resume, dispatch } = useResume();

  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATE_LIST.map((t) => {
        const active = resume.templateId === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => dispatch({ type: 'SET_TEMPLATE', templateId: t.id })}
            aria-pressed={active}
            className={`group flex flex-col gap-2 rounded-lg border p-2.5 text-left transition ${
              active ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-ink-soft/40'
            }`}
          >
            <TemplateThumb tokens={t} />
            <div>
              <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                {t.name}
                {active && <span className="text-primary">✓</span>}
              </div>
              <p className="text-[11px] leading-snug text-ink-soft">{t.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
