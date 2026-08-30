import { useEffect, useState } from 'react';
import { useResume } from '../../store/ResumeContext';

function slugify(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'resume';
  return trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type Status = 'idle' | 'generating' | 'done' | 'error';

export function DownloadPdfButton() {
  const { resume } = useResume();
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (status === 'done' || status === 'error') {
      const t = setTimeout(() => setStatus('idle'), 2200);
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
      a.download = `${slugify(resume.contact.fullName)}-resume.pdf`;
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

  const label = { idle: 'Download PDF', generating: 'Preparing PDF…', done: 'Downloaded ✓', error: 'Failed — try again' }[status];

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'generating'}
      aria-live="polite"
      className={`rounded-md px-5 py-2.5 text-[14px] font-medium shadow-sm transition disabled:opacity-70 ${
        status === 'error' ? 'bg-danger text-paper-raised hover:brightness-95' : 'bg-primary text-paper-raised hover:bg-primary-soft'
      }`}
    >
      {label}
    </button>
  );
}
