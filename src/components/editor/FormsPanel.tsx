import { useState, type ReactNode } from 'react';
import { useResume } from '../../store/ResumeContext';
import type { SectionKind } from '../../types/resume';
import { TextInput } from '../ui/FormControls';
import { Toggle } from '../ui/Toggle';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { EducationForm } from './forms/EducationForm';
import { ExperienceLikeForm } from './forms/ExperienceLikeForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm, AwardsForm } from './forms/CertificationsAwardsForm';
import { LanguagesForm, TechnicalSkillsForm, SoftSkillsForm, AchievementsForm } from './forms/LanguagesSkillsForm';
import { CustomSectionsForm } from './forms/CustomSectionsForm';
import { TemplateSelector } from './TemplateSelector';
import { CustomizationPanel } from './CustomizationPanel';
import { QualityPanel } from './QualityPanel';

const FORM_BY_KIND: Partial<Record<SectionKind, () => ReactNode>> = {
  summary: () => null, // summary lives in Basic Information, not its own accordion body
  experience: () => <ExperienceLikeForm list="experience" />,
  internships: () => <ExperienceLikeForm list="internships" />,
  projects: () => <ProjectsForm />,
  education: () => <EducationForm />,
  technicalSkills: () => <TechnicalSkillsForm />,
  softSkills: () => <SoftSkillsForm />,
  certifications: () => <CertificationsForm />,
  achievements: () => <AchievementsForm />,
  awards: () => <AwardsForm />,
  languages: () => <LanguagesForm />,
};

export function FormsPanel() {
  const { resume, dispatch } = useResume();
  const [openId, setOpenId] = useState<string | null>('basic-info');

  const toggleOpen = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div className="flex flex-col gap-3 pb-24">
      <AccordionShell
        id="basic-info"
        label="Basic Information"
        open={openId === 'basic-info'}
        onToggle={() => toggleOpen('basic-info')}
      >
        <BasicInfoForm />
      </AccordionShell>

      <AccordionShell id="design" label="Template & Design" open={openId === 'design'} onToggle={() => toggleOpen('design')}>
        <div className="flex flex-col gap-6">
          <TemplateSelector />
          <div className="border-t border-border pt-5">
            <CustomizationPanel />
          </div>
        </div>
      </AccordionShell>

      {resume.sectionOrder.map((section, index) => {
        // Custom sections are all rendered together below the built-ins via
        // CustomSectionsForm, so skip individual accordions for kind 'custom'
        // to avoid duplicating the "add item" UI per section.
        if (section.kind === 'custom') return null;
        if (section.kind === 'summary') return null; // handled inside Basic Information

        const renderForm = FORM_BY_KIND[section.kind];
        return (
          <AccordionShell
            key={section.id}
            id={section.id}
            open={openId === section.id}
            onToggle={() => toggleOpen(section.id)}
            headerRight={
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => dispatch({ type: 'SECTION_REORDER', fromIndex: index, toIndex: index - 1 })}
                  className="rounded p-1 text-ink-soft hover:bg-paper disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  aria-label="Move down"
                  disabled={index === resume.sectionOrder.length - 1}
                  onClick={() => dispatch({ type: 'SECTION_REORDER', fromIndex: index, toIndex: index + 1 })}
                  className="rounded p-1 text-ink-soft hover:bg-paper disabled:opacity-30"
                >
                  ↓
                </button>
                <Toggle
                  checked={section.visible}
                  onChange={() => dispatch({ type: 'SECTION_TOGGLE_VISIBLE', sectionId: section.id })}
                  label={`Show ${section.label} on resume`}
                />
              </div>
            }
            label={
              <TextInput
                value={section.label}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => dispatch({ type: 'SECTION_RENAME', sectionId: section.id, label: e.target.value })}
                className="max-w-[220px] border-none bg-transparent px-0 py-0 font-medium focus:border-none focus:ring-0"
              />
            }
          >
            {renderForm ? renderForm() : null}
          </AccordionShell>
        );
      })}

      <AccordionShell id="custom" label="Custom Sections" open={openId === 'custom'} onToggle={() => toggleOpen('custom')}>
        <CustomSectionsForm />
      </AccordionShell>

      <AccordionShell id="quality" label="Resume Checklist" open={openId === 'quality'} onToggle={() => toggleOpen('quality')}>
        <QualityPanel />
      </AccordionShell>
    </div>
  );
}

function AccordionShell({
  id: _id,
  label,
  open,
  onToggle,
  children,
  headerRight,
}: {
  id: string;
  label: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  headerRight?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-paper-raised">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-[14px] font-medium text-ink">
          <span className={`inline-block transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
          {label}
        </span>
        {headerRight}
      </div>
      {open && <div className="border-t border-border px-4 py-4">{children}</div>}
    </div>
  );
}


