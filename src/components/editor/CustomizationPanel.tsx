import { useResume } from '../../store/ResumeContext';
import type { ResumeSettings } from '../../types/resume';
import { SETTINGS_RANGES } from '../../utils/settingsPresets';

const FONT_OPTIONS: { value: ResumeSettings['fontFamily']; label: string }[] = [
  { value: 'helvetica', label: 'Sans (Helvetica)' },
  { value: 'times', label: 'Serif (Times)' },
  { value: 'courier', label: 'Mono (Courier)' },
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
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  range: { min: number; max: number; step: number };
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[12px] font-medium text-ink">
        <span>{label}</span>
        <span className="text-ink-soft">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
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
              className={`flex-1 rounded-md border px-2 py-1.5 text-[12.5px] font-medium transition ${
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
              className={`flex-1 rounded-md border px-2 py-1.5 text-[12.5px] font-medium transition ${
                settings.margin === m.value ? 'border-primary bg-primary text-paper-raised' : 'border-border text-ink hover:bg-paper'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <Slider
        label="Font size"
        value={settings.fontSizeScale}
        range={SETTINGS_RANGES.fontSizeScale}
        onChange={(v) => dispatch({ type: 'SET_SETTING', patch: { fontSizeScale: v } })}
      />
      <Slider
        label="Heading size"
        value={settings.headingScale}
        range={SETTINGS_RANGES.headingScale}
        onChange={(v) => dispatch({ type: 'SET_SETTING', patch: { headingScale: v } })}
      />
      <Slider
        label="Line spacing"
        value={settings.lineSpacing}
        range={SETTINGS_RANGES.lineSpacing}
        onChange={(v) => dispatch({ type: 'SET_SETTING', patch: { lineSpacing: v } })}
      />
      <Slider
        label="Section spacing"
        value={settings.sectionSpacing}
        range={SETTINGS_RANGES.sectionSpacing}
        onChange={(v) => dispatch({ type: 'SET_SETTING', patch: { sectionSpacing: v } })}
      />
    </div>
  );
}
