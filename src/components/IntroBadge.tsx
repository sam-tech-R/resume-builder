import { useEffect, useState } from 'react';

const SESSION_KEY = 'resume-builder:intro-shown';

/**
 * A small, non-blocking toast in the corner of the screen. Shows once per
 * browser tab session, fades out on its own after ~2.5s, and never traps
 * focus or blocks interaction with the page underneath it.
 */
export function IntroBadge() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');

    setVisible(true);
    const leaveTimer = setTimeout(() => setLeaving(true), 2200);
    const removeTimer = setTimeout(() => setVisible(false), 2700);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-out ${
        leaving ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-full border border-border bg-paper-raised/95 px-4 py-2 shadow-[0_4px_20px_rgba(20,23,31,0.08)] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-sans text-[13px] font-medium text-ink">Resume Builder</span>
        <span className="text-[13px] text-ink-soft">·</span>
        <span className="font-mono text-[11px] tracking-wide text-ink-soft">Powered by Samyak GPT</span>
      </div>
    </div>
  );
}
