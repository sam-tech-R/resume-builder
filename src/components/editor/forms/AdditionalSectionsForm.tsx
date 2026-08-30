import { useState } from 'react';
import { useResume } from '../../../store/ResumeContext';
import { SmallButton } from '../../ui/FormControls';
import { CertificationsForm, AwardsForm } from './CertificationsAwardsForm';
import { AchievementsForm, LanguagesForm } from './LanguagesSkillsForm';
import { CustomSectionsForm } from './CustomSectionsForm';
import { ExperienceLikeForm } from './ExperienceLikeForm';

/**
 * The "Additional Sections" wizard step: a set of genuinely optional
 * add-ons. Nothing here is required — enabling one simply reveals its form.
 */
export function AdditionalSectionsForm() {
  const { resume, dispatch } = useResume();
  const [openId, setOpenId] = useState<string | null>(null);

  const showSection = (kind: string) => {
    const meta = resume.sectionOrder.find((s) => s.kind === kind);
    if (meta && !meta.visible) dispatch({ type: 'SECTION_TOGGLE_VISIBLE', sectionId: meta.id });
  };

  const bodyFor = (id: string) => {
    switch (id) {
      case 'internships':
        return <ExperienceLikeForm list="internships" />;
      case 'certifications':
        return <CertificationsForm />;
      case 'achievements':
        return <AchievementsForm />;
      case 'awards':
        return <AwardsForm />;
      case 'languages':
        return <LanguagesForm />;
      default:
        return <CustomSectionsForm />;
    }
  };

  const addOns = [
    {
      id: 'internships',
      label: 'Internships',
      blurb: 'Internship stints, separate from full-time roles.',
      active: resume.internships.length > 0,
      enable: () => {
        if (!resume.internships.length)
          dispatch({ type: 'LIST_ADD', list: 'internships', entry: { id: `int-${Date.now().toString(36)}`, company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] } });
        showSection('internships');
      },
    },
    {
      id: 'certifications',
      label: 'Certifications',
      blurb: 'NPTEL, Coursera, AWS — courses and certificates.',
      active: resume.certifications.length > 0,
      enable: () => {
        if (!resume.certifications.length)
          dispatch({ type: 'LIST_ADD', list: 'certifications', entry: { id: `cert-${Date.now().toString(36)}`, name: '', issuer: '', date: '', credentialUrl: '' } });
        showSection('certifications');
      },
    },
    {
      id: 'achievements',
      label: 'Achievements',
      blurb: 'Hackathons, competitions, scholarships.',
      active: resume.achievements.length > 0,
      enable: () => showSection('achievements'),
    },
    {
      id: 'awards',
      label: 'Awards',
      blurb: 'Formal awards with issuer and date.',
      active: resume.awards.length > 0,
      enable: () => {
        if (!resume.awards.length)
          dispatch({ type: 'LIST_ADD', list: 'awards', entry: { id: `award-${Date.now().toString(36)}`, title: '', issuer: '', date: '', description: '' } });
        showSection('awards');
      },
    },
    {
      id: 'languages',
      label: 'Languages',
      blurb: 'Hindi, English, regional languages with proficiency.',
      active: resume.languages.length > 0,
      enable: () => {
        if (!resume.languages.length)
          dispatch({ type: 'LIST_ADD', list: 'languages', entry: { id: `lang-${Date.now().toString(36)}`, name: '', proficiency: 'Conversational' } });
        showSection('languages');
      },
    },
    {
      id: 'custom',
      label: 'Custom section',
      blurb: 'Anything else — publications, extracurriculars, interests.',
      active: resume.customSections.length > 0,
      enable: () => dispatch({ type: 'CUSTOM_SECTION_ADD', heading: 'Extracurriculars' }),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12.5px] text-ink-soft">All optional — add only what strengthens your resume. You can hide or reorder these later.</p>
      {addOns.map((a) => {
        const isOpen = openId === a.id;
        return (
          <div key={a.id} className="overflow-hidden rounded-lg border border-border bg-paper-raised">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[14px] font-medium text-ink">
                  {a.label}
                  {a.active && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-primary">Added</span>}
                </div>
                <p className="mt-0.5 text-[12px] text-ink-soft">{a.blurb}</p>
              </div>
              <SmallButton
                variant={isOpen ? 'default' : a.active ? 'default' : 'primary'}
                onClick={() => {
                  if (!isOpen && !a.active) a.enable();
                  setOpenId(isOpen ? null : a.id);
                }}
              >
                {isOpen ? 'Close' : a.active ? 'Edit' : '+ Add'}
              </SmallButton>
            </div>
            {isOpen && <div className="border-t border-border px-4 py-4">{bodyFor(a.id)}</div>}
          </div>
        );
      })}
    </div>
  );
}
