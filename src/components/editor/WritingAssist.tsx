import { useState } from 'react';
import { bulletizeDescription, improveLine, suggestSummary } from '../../utils/writingAssist';
import type { ResumeData } from '../../types/resume';

type AssistMode = 'line' | 'bullets' | 'summary';

/**
 * Optional writing help. Runs entirely in the browser with rule-based
 * rewrites — nothing is sent anywhere, nothing is applied automatically.
 * The user always sees the suggestion and accepts or dismisses it.
 */
export function WritingAssist({
  mode,
  value,
  onApply,
  resume,
  className = '',
}: {
  mode: AssistMode;
  value: string;
  onApply: (next: string) => void;
  resume?: ResumeData;
  className?: string;
}) {
  const [suggestion, setSuggestion] = useState<{ text: string; notes: string[] } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = () => {
    setBusy(true);
    // A tiny delay keeps the interaction feeling deliberate, not janky.
    setTimeout(() => {
      if (mode === 'summary' && resume) {
        const text = suggestSummary(resume);
        setSuggestion(
          text
            ? { text, notes: ['Drafted only from details already in your resume', 'Edit it freely before or after using it'] }
            : { text: '', notes: ['Add your title or education first — the draft is built only from your own details.'] }
        );
      } else if (mode === 'bullets') {
        setSuggestion(bulletizeDescription(value));
      } else {
        setSuggestion(improveLine(value));
      }
      setBusy(false);
    }, 120);
  };

  if (mode === 'summary' && !resume) return null;

  const disabled = mode !== 'summary' && value.trim().length === 0;
  const label = mode === 'bullets' ? 'Make bullets' : mode === 'summary' ? 'Draft for me' : 'Improve writing';

  return (
    <div className={className}>
      <button
        type="button"
        onClick={suggestion ? () => setSuggestion(null) : run}
        disabled={disabled || busy}
        className="inline-flex items-center gap-1.5 rounded-md border border-primary/25 px-2.5 py-1 text-[12px] font-medium text-primary transition hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
        title={disabled ? 'Write something first' : 'Suggest a clearer wording (runs on your device — nothing is sent anywhere)'}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" fill="currentColor" />
        </svg>
        {suggestion ? 'Hide suggestion' : busy ? 'Thinking…' : label}
      </button>

      {suggestion && (
        <div className="mt-2 rounded-md border border-primary/20 bg-primary/[0.04] p-3" role="region" aria-label="Writing suggestion">
          {suggestion.text ? (
            <>
              <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink">{suggestion.text}</div>
              <ul className="mt-2 list-disc pl-4 text-[11.5px] text-ink-soft">
                {suggestion.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onApply(suggestion.text);
                    setSuggestion(null);
                  }}
                  className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-paper-raised transition hover:bg-primary-soft"
                >
                  Use suggestion
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestion(null)}
                  className="rounded-md px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:bg-paper"
                >
                  Dismiss
                </button>
              </div>
            </>
          ) : (
            <div className="text-[12.5px] text-ink-soft">{suggestion.notes.join(' ')}</div>
          )}
        </div>
      )}
    </div>
  );
}
