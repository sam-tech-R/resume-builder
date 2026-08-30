import { useEffect, useMemo, useRef, useState } from 'react';
import { useResume } from '../../../store/ResumeContext';
import { buildSteps } from './content';
import { stepDone } from './steps';

const STEP_STORAGE_KEY = 'resume-builder:step';

function loadStep(): number {
  try {
    const raw = sessionStorage.getItem(STEP_STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * Guided, step-by-step resume creation. All data lives in the shared
 * ResumeContext, so moving between steps (or leaving and coming back) never
 * loses anything. Any step can be revisited from the progress dots.
 */
export function Wizard({ onOpenFullEditor }: { onOpenFullEditor: () => void }) {
  const { resume } = useResume();
  const steps = useMemo(() => buildSteps(resume), [resume]);
  const [current, setCurrent] = useState(loadStep);
  const bodyRef = useRef<HTMLDivElement>(null);

  const index = Math.min(current, steps.length - 1);
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;
  const done = stepDone(resume, steps, index);

  // Scroll back to the top of the step body whenever the step changes.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setCurrent(clamped);
    try {
      sessionStorage.setItem(STEP_STORAGE_KEY, String(clamped));
    } catch {
      /* private browsing — step memory is a nicety, not a requirement */
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Progress header */}
      <div className="shrink-0 border-b border-border bg-paper-raised px-3 pb-2.5 pt-3 sm:px-5">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Step {index + 1} of {steps.length}
                {step.optional && !done ? ' · optional' : ''}
              </p>
              <h2 className="truncate font-display text-[17px] font-semibold text-ink">{step.title}</h2>
            </div>
            <button
              type="button"
              onClick={onOpenFullEditor}
              className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-[12px] font-medium text-ink-soft transition hover:border-ink-soft/40 hover:text-ink"
              title="Edit everything in one view"
            >
              All sections
            </button>
          </div>
          <nav aria-label="Resume steps" className="mt-2.5 flex items-center gap-1.5">
            {steps.map((s, i) => {
              const isCurrent = i === index;
              const isDone = stepDone(resume, steps, i);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className="group flex min-w-0 flex-1 flex-col gap-1"
                >
                  <span
                    className={`h-1.5 w-full rounded-full transition-colors ${
                      isCurrent ? 'bg-primary' : isDone ? 'bg-primary/40' : 'bg-border group-hover:bg-ink-soft/40'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Step body */}
      <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-4 text-[13.5px] leading-relaxed text-ink-soft">{step.subtitle}</p>
          {step.render()}
        </div>
      </div>

      {/* Sticky footer nav — thumb-reachable on mobile */}
      <div className="shrink-0 border-t border-border bg-paper-raised/95 px-3 py-3 backdrop-blur sm:px-5">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={isFirst}
            className="rounded-md px-4 py-2.5 text-[14px] font-medium text-ink-soft transition hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-0"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            {step.optional && !isLast && (
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="rounded-md px-3 py-2.5 text-[13px] font-medium text-ink-soft transition hover:bg-paper hover:text-ink"
              >
                Skip for now
              </button>
            )}
            {!isLast ? (
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="min-h-[44px] rounded-md bg-primary px-6 py-2.5 text-[14px] font-medium text-paper-raised shadow-sm transition hover:bg-primary-soft"
              >
                Continue →
              </button>
            ) : (
              <span className="text-[12.5px] text-ink-soft">Preview is on the right →</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
