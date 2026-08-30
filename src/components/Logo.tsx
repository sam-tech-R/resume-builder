/**
 * Brand mark: a clean document glyph with an "R" in the brand deep-teal,
 * plus the wordmark. `compact` renders mark + name only (for tight spaces
 * like the editor header); the full version adds the subtle "powered by
 * Samyak GPT" identity line.
 */
export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="7" fill="#1f3a3d" />
        <path d="M10 8.5h9.2a4.3 4.3 0 0 1 1.3 8.4l3.2 6.6h-3.6l-2.8-6H13v6h-3V8.5Zm3 6.4h6a1.9 1.9 0 1 0 0-3.8h-6v3.8Z" fill="#f7f7f5" />
        <circle cx="24.4" cy="7.6" r="2.1" fill="#c08a2e" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[16px] font-semibold tracking-tight ${light ? 'text-paper-raised' : 'text-ink'}`}>
          Resume Builder
        </span>
        {!compact && (
          <span className={`mt-1 font-mono text-[10px] tracking-wide ${light ? 'text-paper-raised/60' : 'text-ink-soft/80'}`}>
            powered by Samyak GPT
          </span>
        )}
      </span>
    </span>
  );
}
