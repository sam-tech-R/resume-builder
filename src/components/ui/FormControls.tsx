import type { ChangeEvent, ReactNode } from 'react';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-ink-soft">{hint}</span>}
    </label>
  );
}

const inputClasses =
  'w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-[14px] text-ink placeholder:text-ink-soft/60 transition focus:border-primary';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClasses} min-h-[90px] resize-y ${props.className ?? ''}`} />;
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-ink">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}

export function SmallButton({
  children,
  onClick,
  variant = 'default',
  type = 'button',
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'primary';
  type?: 'button' | 'submit';
  ariaLabel?: string;
}) {
  const styles = {
    default: 'border border-border text-ink hover:bg-paper',
    danger: 'border border-transparent text-danger hover:bg-danger/10',
    primary: 'border border-transparent bg-primary text-paper-raised hover:bg-primary-soft',
  }[variant];
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition ${styles}`}>
      {children}
    </button>
  );
}

/** Wraps a single repeatable entry (one job, one degree, one project...) with a remove control. */
export function EntryCard({ children, onRemove, title }: { children: ReactNode; onRemove: () => void; title: string }) {
  return (
    <div className="rounded-lg border border-border bg-paper-raised p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="truncate text-[12px] font-semibold uppercase tracking-wide text-ink-soft">{title}</span>
        <SmallButton variant="danger" onClick={onRemove} ariaLabel={`Remove ${title}`}>
          Remove
        </SmallButton>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

/** Comma/enter separated tag input used for skills, achievements, etc. */
export function TagListInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const commit = (raw: string) => {
    // Split on commas so pasting "React, Node, SQL" produces three tags.
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) onChange([...values, ...parts]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span key={`${v}-${i}`} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[13px] text-primary">
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-primary/60 hover:text-primary"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={placeholder ?? 'Type and press Enter'}
        aria-label={placeholder ?? 'Type and press Enter'}
        className={`${inputClasses} mt-2`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit(e.currentTarget.value);
            e.currentTarget.value = '';
          } else if (e.key === 'Backspace' && e.currentTarget.value === '' && values.length > 0) {
            onChange(values.slice(0, -1));
          }
        }}
        onPaste={(e) => {
          const pasted = e.clipboardData.getData('text');
          if (pasted.includes(',')) {
            e.preventDefault();
            commit(pasted);
          }
        }}
      />
    </div>
  );
}
