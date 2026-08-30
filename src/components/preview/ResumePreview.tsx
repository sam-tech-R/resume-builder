import { useResume } from '../../store/ResumeContext';
import { TEMPLATES, type TemplateTokens } from '../../store/templates';
import type { PhotoData, ResumeData, ResumeSettings, SectionMeta } from '../../types/resume';
import { CSS_FONT_FAMILY, MARGIN_PX } from '../../utils/settingsPresets';
import { dateRange, getVisibleSections } from '../../utils/resumeSections';
import { sampleResume } from '../../utils/sampleResume';

/**
 * Renders the resume as plain, conventional HTML: single column, standard
 * headings, no tables/multi-column tricks — regardless of which template is
 * selected. This mirrors the PDF template's structure (see
 * components/pdf/ResumePdfDocument.tsx) so the live preview never surprises
 * the user at export time.
 */
export function ResumePreview() {
  const { resume } = useResume();
  const isEmpty = !resume.contact.fullName.trim() && getVisibleSections(resume).length === 0;
  const data = isEmpty ? { ...sampleResume, templateId: resume.templateId, settings: resume.settings } : resume;

  return (
    <div className="mx-auto w-full max-w-[720px]">
      {isEmpty && (
        <div className="mb-3 rounded-md border border-border bg-paper-raised px-3.5 py-2.5 text-[12.5px] text-ink-soft">
          This is an example. Start filling in the form on the left and it'll become your resume.
        </div>
      )}
      <div className={isEmpty ? 'opacity-70' : ''}>
        <ResumeSheet resume={data} />
      </div>
    </div>
  );
}

export function ResumeSheet({ resume }: { resume: ResumeData }) {
  const tokens = TEMPLATES[resume.templateId];
  const { settings } = resume;
  const sections = getVisibleSections(resume);
  const { contact } = resume;
  const hasContactLine = [contact.email, contact.phone, contact.location].some(Boolean);
  const hasLinks = [contact.linkedin, contact.github, contact.portfolio].some(Boolean);

  const fs = (base: number) => `${(base * settings.fontSizeScale).toFixed(2)}px`;
  const headingFs = (base: number) => `${(base * settings.headingScale).toFixed(2)}px`;
  const sectionGap = `${(22 * settings.sectionSpacing).toFixed(0)}px`;

  return (
    <div
      className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
      style={{
        fontFamily: CSS_FONT_FAMILY[settings.fontFamily],
        color: '#1a1a1a',
        padding: `${MARGIN_PX[settings.margin]}px`,
        lineHeight: settings.lineSpacing,
        minHeight: 960,
      }}
    >
      <header className={`mb-1 flex items-start gap-6 ${tokens.photoAlign === 'left' ? 'flex-row-reverse justify-end' : 'justify-between'}`}>
        <div>
          <h1
            className="leading-tight"
            style={{ fontSize: headingFs(26), color: tokens.nameColor, fontWeight: tokens.nameWeight === 'bold' ? 700 : 500 }}
          >
            {contact.fullName || 'Your Name'}
          </h1>
          {contact.title && (
            <p className="mt-0.5" style={{ fontSize: fs(14), color: '#333' }}>
              {contact.title}
            </p>
          )}
          {hasContactLine && (
            <p className="mt-2" style={{ fontSize: fs(11.5), color: '#444' }}>
              {[contact.email, contact.phone, contact.location].filter(Boolean).join('   |   ')}
            </p>
          )}
          {hasLinks && (
            <p className="mt-1" style={{ fontSize: fs(11.5), color: '#444' }}>
              {[contact.linkedin, contact.github, contact.portfolio].filter(Boolean).join('   |   ')}
            </p>
          )}
        </div>
        {resume.photo && <PhotoView photo={resume.photo} size={86} />}
      </header>

      <div style={{ marginTop: sectionGap }}>
        {sections.map((section, i) => (
          <div key={section.id} style={{ marginTop: i === 0 ? 0 : sectionGap }}>
            <PreviewSection section={section} resume={resume} tokens={tokens} settings={settings} fs={fs} headingFs={headingFs} />
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <p className="mt-10 text-center text-[13px]" style={{ color: '#999' }}>
          Start filling in the form on the left — your resume will appear here as you type.
        </p>
      )}
    </div>
  );
}

function PhotoView({ photo, size }: { photo: PhotoData; size: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden border border-[#e5e5e2]"
      style={{ width: size, height: size, borderRadius: photo.shape === 'circle' ? '50%' : '8px' }}
    >
      <img
        src={photo.src}
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full object-cover"
        style={{ transform: `translate(-50%, -50%) translate(${photo.offsetX}%, ${photo.offsetY}%) scale(${photo.zoom})` }}
      />
    </div>
  );
}

function SectionHeading({
  children,
  tokens,
  headingFs,
}: {
  children: React.ReactNode;
  tokens: TemplateTokens;
  headingFs: (base: number) => string;
}) {
  const label = tokens.headingCase === 'upper' ? String(children).toUpperCase() : children;
  const baseStyle: React.CSSProperties = {
    fontSize: headingFs(12.5),
    fontWeight: 700,
    letterSpacing: `${tokens.headingTracking}px`,
    marginBottom: 8,
  };

  if (tokens.headingStyle === 'underline') {
    return (
      <h2 style={{ ...baseStyle, borderBottom: `1px solid ${tokens.accent}`, paddingBottom: 4, color: '#111' }}>{label}</h2>
    );
  }
  if (tokens.headingStyle === 'bar') {
    return (
      <h2 style={{ ...baseStyle, display: 'flex', alignItems: 'center', gap: 8, color: '#111' }}>
        <span style={{ width: 3, height: 14, backgroundColor: tokens.accent, display: 'inline-block' }} />
        {label}
      </h2>
    );
  }
  if (tokens.headingStyle === 'boxed') {
    return (
      <h2
        style={{
          ...baseStyle,
          display: 'inline-block',
          backgroundColor: `${tokens.accent}1a`,
          color: tokens.accent,
          padding: '3px 8px',
          borderRadius: 3,
        }}
      >
        {label}
      </h2>
    );
  }
  return <h2 style={{ ...baseStyle, color: '#222' }}>{label}</h2>;
}

function PreviewSection({
  section,
  resume,
  tokens,
  settings,
  fs,
  headingFs,
}: {
  section: SectionMeta;
  resume: ResumeData;
  tokens: TemplateTokens;
  settings: ResumeSettings;
  fs: (base: number) => string;
  headingFs: (base: number) => string;
}) {
  void settings;
  return (
    <section>
      <SectionHeading tokens={tokens} headingFs={headingFs}>
        {section.label}
      </SectionHeading>
      {section.kind === 'summary' && (
        <p style={{ fontSize: fs(12.5), color: '#222' }}>{resume.summary}</p>
      )}

      {(section.kind === 'experience' || section.kind === 'internships') &&
        resume[section.kind].map((e) => (
          <div key={e.id} className="mb-3 last:mb-0">
            <div className="flex items-baseline justify-between gap-3">
              <span style={{ fontSize: fs(13), fontWeight: 600, color: '#111' }}>
                {e.role}
                {e.company ? `, ${e.company}` : ''}
              </span>
              <span className="shrink-0" style={{ fontSize: fs(11), color: tokens.accent }}>
                {dateRange(e.startDate, e.endDate)}
              </span>
            </div>
            {e.location && (
              <div style={{ fontSize: fs(11.5), color: '#555' }}>{e.location}</div>
            )}
            {e.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ fontSize: fs(12.5), color: '#222' }}>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

      {section.kind === 'projects' &&
        resume.projects.map((p) => (
          <div key={p.id} className="mb-3 last:mb-0">
            <div className="flex items-baseline justify-between gap-3">
              <span style={{ fontSize: fs(13), fontWeight: 600, color: '#111' }}>
                {p.name}
                {p.techStack ? ` — ${p.techStack}` : ''}
              </span>
              <span className="shrink-0" style={{ fontSize: fs(11), color: tokens.accent }}>
                {dateRange(p.startDate, p.endDate)}
              </span>
            </div>
            {p.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {p.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ fontSize: fs(12.5), color: '#222' }}>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

      {section.kind === 'education' &&
        resume.education.map((e) => (
          <div key={e.id} className="mb-3 last:mb-0">
            <div className="flex items-baseline justify-between gap-3">
              <span style={{ fontSize: fs(13), fontWeight: 600, color: '#111' }}>{e.institution}</span>
              <span className="shrink-0" style={{ fontSize: fs(11), color: tokens.accent }}>
                {dateRange(e.startDate, e.endDate)}
              </span>
            </div>
            <div style={{ fontSize: fs(12), color: '#333' }}>
              {[e.degree, e.field].filter(Boolean).join(' in ')}
              {e.gpa ? ` · GPA ${e.gpa}` : ''}
            </div>
            {e.description && (
              <p className="mt-0.5" style={{ fontSize: fs(12), color: '#222' }}>
                {e.description}
              </p>
            )}
          </div>
        ))}

      {section.kind === 'technicalSkills' && (
        <p style={{ fontSize: fs(12.5), color: '#222' }}>{resume.technicalSkills.join('   ·   ')}</p>
      )}
      {section.kind === 'softSkills' && (
        <p style={{ fontSize: fs(12.5), color: '#222' }}>{resume.softSkills.join('   ·   ')}</p>
      )}
      {section.kind === 'achievements' && (
        <ul className="list-disc pl-4">
          {resume.achievements.map((a, i) => (
            <li key={i} style={{ fontSize: fs(12.5), color: '#222' }}>
              {a}
            </li>
          ))}
        </ul>
      )}

      {section.kind === 'certifications' &&
        resume.certifications.map((c) => (
          <div key={c.id} className="mb-1.5 flex items-baseline justify-between gap-3 last:mb-0">
            <span style={{ fontSize: fs(12.5), color: '#222' }}>
              {c.name}
              {c.issuer ? ` — ${c.issuer}` : ''}
            </span>
            <span className="shrink-0" style={{ fontSize: fs(11), color: tokens.accent }}>
              {c.date}
            </span>
          </div>
        ))}

      {section.kind === 'awards' &&
        resume.awards.map((a) => (
          <div key={a.id} className="mb-1.5 last:mb-0">
            <div className="flex items-baseline justify-between gap-3">
              <span style={{ fontSize: fs(12.5), fontWeight: 500, color: '#222' }}>
                {a.title}
                {a.issuer ? ` — ${a.issuer}` : ''}
              </span>
              <span className="shrink-0" style={{ fontSize: fs(11), color: tokens.accent }}>
                {a.date}
              </span>
            </div>
            {a.description && <p style={{ fontSize: fs(12), color: '#333' }}>{a.description}</p>}
          </div>
        ))}

      {section.kind === 'languages' && (
        <p style={{ fontSize: fs(12.5), color: '#222' }}>
          {resume.languages.map((l) => `${l.name} (${l.proficiency})`).join('   ·   ')}
        </p>
      )}

      {section.kind === 'custom' &&
        (() => {
          const cs = resume.customSections.find((c) => c.id === section.customSectionId);
          if (!cs) return null;
          return cs.items.map((item) => (
            <div key={item.id} className="mb-2 last:mb-0">
              <div className="flex items-baseline justify-between gap-3">
                <span style={{ fontSize: fs(13), fontWeight: 600, color: '#111' }}>{item.title}</span>
                <span className="shrink-0" style={{ fontSize: fs(11), color: tokens.accent }}>
                  {item.date}
                </span>
              </div>
              {item.subtitle && <div style={{ fontSize: fs(12), color: '#333' }}>{item.subtitle}</div>}
              {item.description && (
                <p style={{ fontSize: fs(12), color: '#222' }}>{item.description}</p>
              )}
            </div>
          ));
        })()}
    </section>
  );
}
