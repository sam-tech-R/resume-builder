import { useState } from 'react';
import { useResume } from '../../store/ResumeContext';
import { findMissingKeywords } from '../../utils/keywordMatch';
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
      <KeywordMatcher />
    </div>
  );
}

/**
 * Optional job-description tailoring: paste a JD, see which meaningful terms
 * don't appear anywhere in your resume. Runs entirely in the browser.
 */
function KeywordMatcher() {
  const { resume } = useResume();
  const [jd, setJd] = useState('');
  const [open, setOpen] = useState(false);

  const missing = jd.trim().length > 60 ? findMissingKeywords(jd, resume) : [];

  return (
    <div className="rounded-md border border-border p-3">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between text-left">
        <span className="text-[13px] font-medium text-ink">Match against a job description</span>
        <span className={`text-[12px] text-ink-soft transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      <p className="mt-1 text-[11.5px] text-ink-soft">
        Paste a job posting and we'll list terms missing from your resume. Nothing leaves your device.
      </p>
      {open && (
        <div className="mt-2.5 flex flex-col gap-2">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={5}
            placeholder="Paste the job description here (responsibilities, requirements, skills)…"
            aria-label="Job description"
            className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-[13px] text-ink focus:border-primary"
          />
          {jd.trim().length > 60 && (
            <div>
              {missing.length === 0 ? (
                <p className="text-[12.5px] font-medium text-primary">No obvious keyword gaps found — good coverage.</p>
              ) : (
                <>
                  <p className="text-[12px] font-medium text-ink">Terms not yet in your resume:</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {missing.map((k) => (
                      <span key={k} className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[12px] text-ink">
                        {k}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-ink-soft">
                    Only add the ones that genuinely match your experience — never keyword-stuff.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

