import { useState } from 'react';
import { useResume } from '../../store/ResumeContext';
import { DownloadPdfButton } from './DownloadPdfButton';
import { FormsPanel } from './FormsPanel';
import { ResumePreview } from '../preview/ResumePreview';

export function EditorLayout({ onBack }: { onBack: () => void }) {
  const { clearDraft, saveStatus } = useResume();
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-paper">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-paper-raised px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onBack} className="shrink-0 text-[13px] font-medium text-ink-soft hover:text-ink">
            ← Home
          </button>
          <span className="hidden truncate font-display text-[15px] font-semibold sm:inline">Resume Builder</span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SaveIndicator status={saveStatus} />
          {confirmingReset ? (
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="hidden text-ink-soft sm:inline">Clear everything?</span>
              <button
                onClick={() => {
                  clearDraft();
                  setConfirmingReset(false);
                }}
                className="font-medium text-danger"
              >
                Yes, clear
              </button>
              <button onClick={() => setConfirmingReset(false)} className="text-ink-soft">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmingReset(true)} className="hidden text-[13px] text-ink-soft hover:text-ink sm:inline">
              Start over
            </button>
          )}
          <DownloadPdfButton />
        </div>
      </header>

      {/* Mobile tab switch — hidden on desktop where both panels show at once */}
      <div className="flex shrink-0 border-b border-border bg-paper-raised md:hidden">
        {(['edit', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-[13px] font-medium capitalize transition ${
              mobileTab === tab ? 'border-b-2 border-primary text-primary' : 'text-ink-soft'
            }`}
          >
            {tab === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {!confirmingReset && (
        <button
          onClick={() => setConfirmingReset(true)}
          className="shrink-0 border-b border-border bg-paper-raised px-3 py-1.5 text-left text-[12px] text-ink-soft sm:hidden"
        >
          Start over
        </button>
      )}

      <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[minmax(0,440px)_1fr]">
        <div className={`min-w-0 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:block ${mobileTab === 'edit' ? 'block' : 'hidden'}`}>
          <FormsPanel />
        </div>
        <div
          className={`min-w-0 overflow-y-auto bg-[#efefec] px-3 py-5 sm:px-5 sm:py-8 md:block ${mobileTab === 'preview' ? 'block' : 'hidden'}`}
        >
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}

function SaveIndicator({ status }: { status: 'saved' | 'saving' | 'idle' }) {
  if (status === 'idle') return null;
  return (
    <span className="hidden items-center gap-1.5 text-[12px] text-ink-soft sm:flex">
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'saving' ? 'bg-accent' : 'bg-primary'}`} />
      {status === 'saving' ? 'Saving…' : 'Saved'}
    </span>
  );
}
