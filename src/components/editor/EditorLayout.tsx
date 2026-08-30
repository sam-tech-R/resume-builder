import { useState } from 'react';
import { useResume } from '../../store/ResumeContext';
import { DownloadPdfButton } from './DownloadPdfButton';
import { FormsPanel } from './FormsPanel';
import { Wizard } from './wizard/Wizard';
import { Logo } from '../Logo';
import { ResumePreview } from '../preview/ResumePreview';

const MODE_KEY = 'resume-builder:mode';

type EditorMode = 'guided' | 'sections';

function loadMode(): EditorMode {
  try {
    const raw = localStorage.getItem(MODE_KEY);
    return raw === 'sections' ? 'sections' : 'guided';
  } catch {
    return 'guided';
  }
}

export function EditorLayout({ onBack }: { onBack: () => void }) {
  const { clearDraft, saveStatus } = useResume();
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [mode, setMode] = useState<EditorMode>(loadMode);
  // Changing this remounts the wizard, restarting it at step 1 after a reset.
  const [wizardEpoch, setWizardEpoch] = useState(0);

  const switchMode = (next: EditorMode) => {
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* non-critical */
    }
  };

  const confirmReset = () => {
    clearDraft();
    try {
      sessionStorage.removeItem('resume-builder:step');
    } catch {
      /* non-critical */
    }
    setWizardEpoch((n) => n + 1);
    setConfirmingReset(false);
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-paper">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-paper-raised px-3 py-2 sm:px-5 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onBack} className="shrink-0 rounded-md px-1.5 py-1 text-[13px] font-medium text-ink-soft transition hover:bg-paper hover:text-ink">
            ← Home
          </button>
          <span className="hidden sm:block">
            <Logo compact />
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SaveIndicator status={saveStatus} />
          {confirmingReset ? (
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="hidden text-ink-soft sm:inline">Clear everything?</span>
              <button onClick={confirmReset} className="font-medium text-danger">
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
      <div className="flex shrink-0 border-b border-border bg-paper-raised md:hidden" role="tablist" aria-label="Editor views">
        {(['edit', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={mobileTab === tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 border-b-2 py-2.5 text-[13.5px] font-medium transition ${
              mobileTab === tab ? 'border-primary text-primary' : 'border-transparent text-ink-soft'
            }`}
          >
            {tab === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {!confirmingReset && (
        <button
          onClick={() => setConfirmingReset(true)}
          className="shrink-0 border-b border-border bg-paper-raised px-3 py-2 text-left text-[12.5px] text-ink-soft sm:hidden"
        >
          Start over
        </button>
      )}

      <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[minmax(0,480px)_1fr]">
        <div className={`min-w-0 overflow-hidden md:block ${mobileTab === 'edit' ? 'flex flex-col' : 'hidden'}`}>
          {mode === 'guided' ? (
            <Wizard key={wizardEpoch} onOpenFullEditor={() => switchMode('sections')} />
          ) : (
            <div className="h-full overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
              <div className="mx-auto w-full max-w-3xl">
                <button
                  type="button"
                  onClick={() => switchMode('guided')}
                  className="mb-3 rounded-md border border-border px-3 py-1.5 text-[12.5px] font-medium text-ink-soft transition hover:border-primary/40 hover:text-primary"
                >
                  ← Back to guided steps
                </button>
                <FormsPanel />
              </div>
            </div>
          )}
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
    <span className="hidden items-center gap-1.5 text-[12px] text-ink-soft sm:flex" role="status">
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'saving' ? 'bg-accent' : 'bg-primary'}`} />
      {status === 'saving' ? 'Saving…' : 'Saved'}
    </span>
  );
}

