import { useResume } from '../../store/ResumeContext';
import { qualityScore, runQualityChecklist } from '../../utils/qualityChecklist';

const STATUS_STYLES = {
  pass: { icon: '✓', color: 'text-primary', dot: 'bg-primary' },
  warn: { icon: '!', color: 'text-accent', dot: 'bg-accent' },
  fail: { icon: '×', color: 'text-danger', dot: 'bg-danger' },
} as const;

export function QualityPanel() {
  const { resume } = useResume();
  const checks = runQualityChecklist(resume);
  const score = qualityScore(checks);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 text-[15px] font-semibold text-primary">
          {score}
        </div>
        <p className="text-[12.5px] leading-snug text-ink-soft">
          A rule-based guide to common resume gaps — not a guarantee of ATS compatibility or a real recruiter's judgment.
        </p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {checks.map((c) => {
          const s = STATUS_STYLES[c.status];
          return (
            <li key={c.id} className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-paper-raised ${s.dot}`}>
                {s.icon}
              </span>
              <div>
                <div className="text-[13px] font-medium text-ink">{c.label}</div>
                <div className="text-[12px] text-ink-soft">{c.message}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
