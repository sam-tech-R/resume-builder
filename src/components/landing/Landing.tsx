import { useEffect, useState } from 'react';
import { TEMPLATE_LIST } from '../../store/templates';
import { Logo } from '../Logo';
import { TemplateThumb } from '../TemplateThumb';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div>
      <Nav onStart={onStart} />
      <Hero onStart={onStart} />
      <Features />
      <Templates onStart={onStart} />
      <FinalCta onStart={onStart} />
      <Footer />
    </div>
  );
}

function Nav({ onStart }: { onStart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-ink md:inline">
            Early Access · Free
          </span>
          <button
            onClick={onStart}
            className="min-h-[40px] rounded-md bg-primary px-4 py-2 text-[14px] font-medium text-paper-raised transition hover:bg-primary-soft"
          >
            Create resume
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  const [built, setBuilt] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setBuilt(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-2 md:pb-24 md:pt-20">
      <div className="flex flex-col items-start">
        <span className="rounded-full border border-border bg-paper-raised px-3 py-1.5 text-[12px] font-medium text-ink-soft">
          Built for Indian students &amp; freshers
        </span>
        <h1 className="mt-5 font-display text-[2.4rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[3rem] md:text-[3.3rem]">
          A resume that gets you <span className="text-primary">shortlisted</span>.
        </h1>
        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">
          Guided steps, ATS-friendly templates and a real, selectable-text PDF — free during early access.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            onClick={onStart}
            className="min-h-[48px] rounded-md bg-primary px-7 text-[15px] font-medium text-paper-raised shadow-sm transition hover:bg-primary-soft"
          >
            Create my resume — free
          </button>
          <a
            href="#templates"
            className="flex min-h-[48px] items-center justify-center rounded-md border border-border px-6 text-[14.5px] font-medium text-ink transition hover:border-ink-soft/50"
          >
            See templates
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-soft">
          {['No sign-up', 'Autosaves on your device', 'Nothing sent to servers'].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="#1f3a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Signature element: the product itself — a live-looking resume sheet
          that assembles on first paint. Fictional Indian example data. */}
      <div className="relative flex items-center justify-center">
        <div className="w-full max-w-sm overflow-hidden rounded-md border border-border bg-white shadow-[0_24px_70px_-20px_rgba(20,23,31,0.3)]">
          <div className="border-b border-border px-6 pb-5 pt-6 sm:px-7">
            <div className={`h-4 rounded-sm bg-ink transition-all duration-700 ${built ? 'w-44 opacity-100' : 'w-0 opacity-0'}`} />
            <div
              className={`mt-2 h-2.5 rounded-sm bg-accent/60 transition-all delay-150 duration-700 ${built ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}
            />
            <div className="mt-3 flex gap-2.5">
              {['+91 98765 43210', 'Bengaluru'].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-sm bg-ink-soft/10 px-1.5 py-0.5 text-[10px] text-ink-soft transition-all duration-700 ${
                    built ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${250 + i * 100}ms` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-5 px-6 py-6 sm:px-7">
            {['Education', 'Internship', 'Projects', 'Skills'].map((label, sIdx) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-2 w-20 rounded-sm bg-primary/70" />
                  <span className="text-[10px] font-medium text-ink-soft/70">{label}</span>
                </div>
                <div className="space-y-1.5">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-sm bg-ink-soft/15 transition-all duration-700 ${built ? 'opacity-100' : 'w-0 opacity-0'}`}
                      style={{ width: i === 1 ? '58%' : '92%', transitionDelay: `${350 + sIdx * 110 + i * 60}ms` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Floating proof chips */}
        <div className="absolute -left-1 top-8 hidden rounded-md border border-border bg-paper-raised px-3 py-2 text-[11.5px] font-medium text-ink shadow-sm sm:block">
          ATS-ready PDF
        </div>
        <div className="absolute -right-1 bottom-10 hidden rounded-md border border-border bg-paper-raised px-3 py-2 text-[11.5px] font-medium text-ink shadow-sm sm:block">
          ✦ Rewrites weak bullets
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: 'ATS-friendly by design',
    body: 'Single-column layouts, standard headings and real selectable text — parsed cleanly by recruitment software.',
  },
  {
    title: 'Guided, step by step',
    body: 'Basic info → education → projects → skills → done. Skip anything optional; your data is never lost.',
  },
  {
    title: 'Writing assistance',
    body: 'Turn rough sentences into sharp bullet points and fix weak phrasing — reviewed and edited by you, always.',
  },
  {
    title: '4 professional templates',
    body: 'Genuinely different looks for freshers and experienced candidates. Switch anytime without losing data.',
  },
  {
    title: 'One-tap PDF download',
    body: 'A real A4 PDF with clean page breaks — the same file recruiters and ATS portals expect.',
  },
  {
    title: 'Private by default',
    body: 'Your draft autosaves on your device. No account, no server, nothing sent to any AI service.',
  },
];

function Features() {
  return (
    <section className="border-t border-border bg-paper-raised/60 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-xl font-display text-[1.7rem] font-semibold leading-tight text-ink md:text-[1.9rem]">
          Everything a strong resume needs. Nothing it doesn't.
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="font-display text-[16px] font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Templates({ onStart }: { onStart: () => void }) {
  return (
    <section id="templates" className="border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-[1.7rem] font-semibold leading-tight text-ink md:text-[1.9rem]">Four templates, one clean structure.</h2>
        <p className="mt-2 max-w-lg text-[14.5px] text-ink-soft">
          Switch anytime without losing your data — every template reads your sections in the same order underneath.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TEMPLATE_LIST.map((t) => (
            <button key={t.id} onClick={onStart} className="group text-left">
              <div className="transition group-hover:-translate-y-1">
                <TemplateThumb tokens={t} />
              </div>
              <div className="mt-2 text-[13px] font-semibold text-ink">{t.name}</div>
              <div className="text-[12px] text-ink-soft">{t.description}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="border-t border-border bg-primary py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
        <div>
          <h2 className="max-w-md font-display text-[1.6rem] font-semibold leading-tight text-paper-raised">
            Your resume, built in the time it takes to fill a form.
          </h2>
          <p className="mt-2 text-[13.5px] text-paper-raised/75">
            Early access — every premium feature is currently free. No payment, no account.
          </p>
        </div>
        <button
          onClick={onStart}
          className="min-h-[48px] shrink-0 rounded-md bg-accent px-7 text-[15px] font-medium text-ink transition hover:brightness-95"
        >
          Create my resume
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-[13px] text-ink-soft sm:px-6 md:flex-row">
        <Logo compact />
        <span>Your data stays in your browser — always.</span>
      </div>
    </footer>
  );
}
