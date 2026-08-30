import type { TemplateTokens } from '../store/templates';

export function TemplateThumb({ tokens }: { tokens: TemplateTokens }) {
  const headingBar =
    tokens.headingStyle === 'bar' ? (
      <div className="mb-1 h-2 w-10 rounded-sm" style={{ backgroundColor: tokens.accent }} />
    ) : tokens.headingStyle === 'boxed' ? (
      <div className="mb-1 inline-block rounded-sm px-1 py-0.5" style={{ backgroundColor: `${tokens.accent}22` }}>
        <div className="h-1.5 w-8 rounded-sm" style={{ backgroundColor: tokens.accent }} />
      </div>
    ) : (
      <div
        className="mb-1 h-1.5 w-10 rounded-sm bg-ink-soft/50"
        style={tokens.headingStyle === 'underline' ? { borderBottom: `1px solid ${tokens.accent}` } : undefined}
      />
    );

  return (
    <div className="aspect-[210/297] w-full rounded-sm border border-border bg-white p-3">
      <div className="mb-2 h-2.5 w-16 rounded-sm" style={{ backgroundColor: tokens.nameColor }} />
      <div className="mb-3 h-1 w-10 rounded-sm bg-ink-soft/30" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="mb-2">
          {headingBar}
          <div className="space-y-1">
            <div className="h-1 w-full rounded-sm bg-ink-soft/15" />
            <div className="h-1 w-4/5 rounded-sm bg-ink-soft/15" />
          </div>
        </div>
      ))}
    </div>
  );
}
