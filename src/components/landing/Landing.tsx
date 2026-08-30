import { useEffect, useState } from 'react';
import { TEMPLATE_LIST } from '../../store/templates';
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
      <AtsExplainer />
      <FinalCta onStart={onStart} />
      <Footer />
    </div>
  );
}

function Nav({ onStart }: { onStart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-display text-sm text-paper-raised">R</span>
          <span className="font-display text-[17px] font-semibold">Resume Builder</span>
        </div>
        <button
          onClick={onStart}
          className="rounded-md border border-primary/20 bg-transparent px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-paper-raised"
        >
          Create My Resume
        </button>
      </div>
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  const [built, setBuilt] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBuilt(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
      <div className="flex flex-col justify-center">
        <h1 className="font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-ink md:text-[3.4rem]">
          A resume that reads well —
          <br />
          to software <span className="text-primary">and</span>
          <br />
          to <span className="text-accent">people</span>.
        </h1>
        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-soft">
          Fill in your details, pick a template, and export a real, text-searchable PDF.
          No account. Nothing sent to a server or a third-party AI.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStart}
            className="rounded-md bg-primary px-6 py-3 text-[15px] font-medium text-paper-raised shadow-sm transition hover:bg-primary-soft"
          >
            Create My Resume
          </button>
          <a href="#ats" className="text-[14px] font-medium text-ink-soft underline decoration-border underline-offset-4 hover:text-ink">
            Why ATS matters
          </a>
        </div>
      </div>

      {/* Signature element: a live-looking resume card that assembles itself
          on first paint. This *is* the product, so the hero shows it directly
          rather than an abstract illustration. */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm overflow-hidden rounded-sm border border-border bg-white shadow-[0_20px_60px_-15px_rgba(20,23,31,0.25)]">
          <div className="border-b border-border px-7 pt-7 pb-5">
            <div className={`h-4 w-40 rounded-sm bg-ink transition-all duration-700 ${built ? 'opacity-100' : 'w-0 opacity-0'}`} />
            <div
              className={`mt-2 h-2.5 w-28 rounded-sm bg-accent/60 transition-all delay-150 duration-700 ${built ? 'opacity-100' : 'w-0 opacity-0'}`}
            />
            <div className="mt-3 flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-14 rounded-sm bg-ink-soft/30 transition-all duration-700 ${built ? 'opacity-100' : 'w-0 opacity-0'}`}
                  style={{ transitionDelay: `${250 + i * 100}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-5 px-7 py-6">
            {['Profile Summary', 'Work Experience', 'Projects', 'Education'].map((label, sIdx) => (
              <div key={label}>
                <div className="mb-2 h-2 w-24 rounded-sm bg-primary/70" />
                <div className="space-y-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-sm bg-ink-soft/15 transition-all duration-700 ${built ? 'opacity-100' : 'w-0 opacity-0'}`}
                      style={{ width: i === 2 ? '60%' : '92%', transitionDelay: `${400 + sIdx * 120 + i * 60}ms` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { title: 'Live preview', body: 'Type on the left, see the exact layout update on the right.' },
  { title: 'Real, selectable text', body: 'Every PDF is a real document — never a screenshot.' },
  { title: '4 ATS-safe templates', body: 'Genuinely different looks, all single-column and parser-friendly.' },
  { title: 'Full control', body: 'Reorder, rename, or hide any section. Add a custom one if you need it.' },
  { title: 'Optional photo', body: 'Add one with pan and zoom, or skip it — never required.' },
  { title: 'Private by default', body: 'Your draft stays on this device. No account, no server copy.' },
];

function Features() {
  return (
    <section className="border-t border-border bg-paper-raised/50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-lg font-display text-[1.8rem] font-semibold leading-tight text-ink">
          Everything a resume needs. Nothing it doesn't.
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
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-[1.8rem] font-semibold leading-tight text-ink">Four templates, one clean structure.</h2>
        </div>
        <p className="mt-2 max-w-lg text-[14.5px] text-ink-soft">
          Switch anytime without losing your data — every template reads sections in the same order underneath.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TEMPLATE_LIST.map((t) => (
            <button key={t.id} onClick={onStart} className="group text-left">
              <TemplateThumb tokens={t} />
              <div className="mt-2 text-[13px] font-semibold text-ink">{t.name}</div>
              <div className="text-[12px] text-ink-soft">{t.description}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtsExplainer() {
  const points = [
    'Single-column, linear reading order — no text boxes or tables that confuse parsers.',
    'Standard section headings instead of creative relabeling.',
    'Real selectable text embedded directly — never a rasterized image.',
    'Conventional fonts and spacing an ATS can reliably segment.',
  ];
  return (
    <section id="ats" className="border-t border-border py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-[1.8rem] font-semibold leading-tight text-ink">
            Most resumes are rejected by software first.
          </h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
            Applicant Tracking Systems parse your PDF before a recruiter sees it. The templates here
            are built around what parsers actually handle well.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {points.map((p) => (
            <li key={p} className="flex gap-3 border-b border-border pb-4 last:border-none">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-[14px] leading-relaxed text-ink-soft">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="border-t border-border bg-primary py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <h2 className="max-w-md font-display text-[1.7rem] font-semibold leading-tight text-paper-raised">
          Your resume, built in the time it takes to fill a form.
        </h2>
        <button
          onClick={onStart}
          className="shrink-0 rounded-md bg-accent px-6 py-3 text-[15px] font-medium text-ink transition hover:brightness-95"
        >
          Create My Resume
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-[13px] text-ink-soft md:flex-row">
        <span>Resume Builder</span>
        <span>Your data stays in your browser.</span>
      </div>
    </footer>
  );
}
