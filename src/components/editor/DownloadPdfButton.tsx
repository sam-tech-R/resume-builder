import { useEffect, useState } from 'react';
import { useResume } from '../../store/ResumeContext';

function slugify(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'resume';
  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type Status = 'idle' | 'generating' | 'done' | 'error';

/**
 * Real PDF export via @react-pdf/renderer (lazily loaded on first click).
 * The premium-level export is free during early access — communicated
 * honestly, with no payment UI anywhere.
 */
export function DownloadPdfButton({ full = false }: { full?: boolean }) {
  const { resume } = useResume();
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (status === 'done' || status === 'error') {
      const t = setTimeout(() => setStatus('idle'), 2600);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleDownload = async () => {
    setStatus('generating');
    try {
      // @react-pdf/renderer is a large dependency (embeds its own PDF/font
      // engine). Loading it only when the user actually exports keeps the
      // initial page — landing + editor — fast on first paint.
      const [{ pdf }, { ResumePdfDocument }, { bakePhoto }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../pdf/ResumePdfDocument'),
        import('../../utils/photoBake'),
      ]);

      const bakedPhotoSrc = resume.photo ? await bakePhoto(resume.photo) : null;
      const blob = await pdf(<ResumePdfDocument resume={resume} bakedPhotoSrc={bakedPhotoSrc} />).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slugify(resume.contact.fullName) || 'resume'}-resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('done');
    } catch (err) {
      console.error('PDF generation failed', err);
      setStatus('error');
    }
  };

  const label = {
    idle: full ? 'Download Resume (PDF)' : 'Download PDF',
    generating: 'Preparing PDF…',
    done: 'Downloaded ✓',
    error: 'Couldn\'t generate — try again',
  }[status];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleDownload}
        disabled={status === 'generating'}
        aria-live="polite"
        className={`min-h-[44px] rounded-md px-5 py-2.5 text-[14px] font-medium shadow-sm transition disabled:opacity-70 ${
          status === 'error'
            ? 'bg-danger text-paper-raised hover:brightness-95'
            : 'bg-primary text-paper-raised hover:bg-primary-soft'
        } ${full ? 'w-full' : ''}`}
      >
        {label}
      </button>
      {full && (
        <p className="text-[11.5px] text-ink-soft">
          {status === 'done' ? (
            <span className="font-medium text-primary">Saved to your downloads — check your Files app or browser downloads.</span>
          ) : status === 'error' ? (
            <span>Please try again. If it keeps failing, check your browser storage settings.</span>
          ) : (
            <span>Early access — every premium feature is currently free. No payment, no account.</span>
          )}
        </p>
      )}
    </div>
  );
}

