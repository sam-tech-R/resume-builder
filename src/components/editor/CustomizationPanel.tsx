import { useResume } from '../../store/ResumeContext';
import type { ResumeSettings } from '../../types/resume';
import { ACCENT_PALETTE, SETTINGS_RANGES } from '../../utils/settingsPresets';

const FONT_OPTIONS: { value: ResumeSettings['fontFamily']; label: string }[] = [
  { value: 'helvetica', label: 'Sans — Helvetica (modern, safe)' },
  { value: 'times', label: 'Serif — Times (traditional)' },
  { value: 'courier', label: 'Mono — Courier (technical)' },
];

const PRESETS: { value: 'compact' | 'balanced' | 'spacious'; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'spacious', label: 'Spacious' },
];

const MARGIN_OPTIONS: { value: ResumeSettings['margin']; label: string }[] = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
];

function Slider({
  label,
  value,
  onChange,
  range,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  range: { min: number; max: number; step: number };
  format?: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[12px] font-medium text-ink">
        <span>{label}</span>
        <span className="text-ink-soft">{format ? format(value) : value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label={label}
      />
    </label>
  );
}


export function CustomizationPanel() {
  const { resume, dispatch } = useResume();
  const { settings } = resume;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="mb-1.5 block text-[13px] font-medium text-ink">Density preset</span>
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => dispatch({ type: 'APPLY_DENSITY_PRESET', preset: p.value })}
              aria-pressed={settings.density === p.value}
              className={`min-h-[36px] flex-1 rounded-md border px-2 py-1.5 text-[12.5px] font-medium transition ${
                settings.density === p.value ? 'border-primary bg-primary text-paper-raised' : 'border-border text-ink hover:bg-paper'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink">Font</span>
        <select
          value={settings.fontFamily}
          onChange={(e) => dispatch({ type: 'SET_SETTING', patch: { fontFamily: e.target.value as ResumeSettings['fontFamily'] } })}
          className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-[14px] text-ink focus:border-primary"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-1.5 block text-[13px] font-medium text-ink">Margins</span>
        <div className="flex gap-1.5">
          {MARGIN_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => dispatch({ type: 'SET_SETTING', patch: { margin: m.value } })}
              aria-pressed={settings.margin === m.value}
              className={`min-h-[36px] flex-1 rounded-md border px-2 py-1.5 text-[12.5px] font-medium transition ${
                settings.margin === m.value ? 'border-primary bg-primary text-paper-raised' : 'border-border text-ink hover:bg-paper'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11.5px] text-ink-soft">Narrow fits the most content — the usual choice for one-page Indian resumes.</p>
      </div>

      <AccentPicker />
      <Sliders />
    </div>
  );
}

function AccentPicker() {
  const { resume, dispatch } = useResume();
  const { settings } = resume;
  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-medium text-ink">Accent color</span>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_SETTING', patch: { accentColor: null } })}
          aria-pressed={!settings.accentColor}
          className={`flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition ${
            !settings.accentColor ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-soft hover:bg-paper'
          }`}
        >
          <span className="h-3.5 w-3.5 rounded-full border border-border" aria-hidden="true" />
          Template default
        </button>
        {ACCENT_PALETTE.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => dispatch({ type: 'SET_SETTING', patch: { accentColor: c.value } })}
            aria-pressed={settings.accentColor === c.value}
            aria-label={`Accent color: ${c.label}`}
            title={c.label}
            className={`h-8 w-8 rounded-full border-2 transition ${
              settings.accentColor === c.value ? 'border-ink' : 'border-transparent hover:border-border'
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
    </div>
  );
}


function Sliders() {
  const { resume, dispatch } = useResume();
  const { settings } = resume;
  const patch = (p: Partial<ResumeSettings>) => dispatch({ type: 'SET_SETTING', patch: p });
  return (
    <>
      <Slider
        label="Font size"
        value={settings.fontSizeScale}
        range={SETTINGS_RANGES.fontSizeScale}
        onChange={(v) => patch({ fontSizeScale: v })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
      <Slider
        label="Heading size"
        value={settings.headingScale}
        range={SETTINGS_RANGES.headingScale}
        onChange={(v) => patch({ headingScale: v })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
      <Slider
        label="Line spacing"
        value={settings.lineSpacing}
        range={SETTINGS_RANGES.lineSpacing}
        onChange={(v) => patch({ lineSpacing: v })}
      />
      <Slider
        label="Section spacing"
        value={settings.sectionSpacing}
        range={SETTINGS_RANGES.sectionSpacing}
        onChange={(v) => patch({ sectionSpacing: v })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
    </>
  );
}

