import type { ResumeData } from '../../../types/resume';
import type { WizardStep } from './steps';
import { BasicInfoForm } from '../forms/BasicInfoForm';
import { EducationForm } from '../forms/EducationForm';
import { ExperienceLikeForm } from '../forms/ExperienceLikeForm';
import { ProjectsForm } from '../forms/ProjectsForm';
import { SoftSkillsForm, TechnicalSkillsForm } from '../forms/LanguagesSkillsForm';
import { AdditionalSectionsForm } from '../forms/AdditionalSectionsForm';
import { TemplateSelector } from '../TemplateSelector';
import { CustomizationPanel } from '../CustomizationPanel';
import { SectionManager } from '../SectionManager';
import { QualityPanel } from '../QualityPanel';
import { DownloadPdfButton } from '../DownloadPdfButton';

/**
 * The guided flow. Education deliberately comes before Work Experience —
 * for Indian students and freshers the degree is the strongest signal.
 * Every step renders the same shared forms used by the full editor, so
 * nothing is ever lost when moving between steps or modes.
 */
export function buildSteps(resume: ResumeData): WizardStep[] {
  const hasAddOns =
    resume.certifications.length > 0 ||
    resume.achievements.length > 0 ||
    resume.awards.length > 0 ||
    resume.languages.length > 0 ||
    resume.customSections.length > 0 ||
    resume.internships.length > 0;

  return [
    {
      id: 'basic',
      title: 'Basic Information',
      subtitle: 'Name, contact details and a short profile summary.',
      optional: false,
      render: () => <BasicInfoForm />,
      isDone: (r: ResumeData) => Boolean(r.contact.fullName.trim() && r.contact.email.trim()),
    },
    {
      id: 'education',
      title: 'Education',
      subtitle: 'College, Class XII — most recent first.',
      optional: false,
      render: () => <EducationForm />,
      isDone: (r: ResumeData) => r.education.length > 0,
    },
    {
      id: 'experience',
      title: 'Work Experience',
      subtitle: 'Jobs, internships and part-time work.',
      optional: true,
      render: () => <ExperienceLikeForm list="experience" />,
      isDone: (r: ResumeData) => r.experience.length > 0 || r.internships.length > 0,
    },
    {
      id: 'projects',
      title: 'Projects',
      subtitle: 'Academic, personal and hackathon projects.',
      optional: true,
      render: () => <ProjectsForm />,
      isDone: (r: ResumeData) => r.projects.length > 0,
    },
    {
      id: 'skills',
      title: 'Skills',
      subtitle: 'Technical tools and workplace strengths.',
      optional: false,
      render: () => (
        <div className="flex flex-col gap-6">
          <TechnicalSkillsForm />
          <div className="border-t border-border pt-5">
            <SoftSkillsForm />
          </div>
        </div>
      ),
      isDone: (r: ResumeData) => r.technicalSkills.length > 0 || r.softSkills.length > 0,
    },
    {
      id: 'additional',
      title: 'Additional Sections',
      subtitle: 'Optional extras — certifications, achievements and more.',
      optional: true,
      render: () => <AdditionalSectionsForm />,
      isDone: () => hasAddOns,
    },
    {
      id: 'customize',
      title: 'Customize',
      subtitle: 'Template, fonts, spacing and section order.',
      optional: false,
      render: () => (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-soft">Template</h3>
            <TemplateSelector />
          </div>
          <div className="border-t border-border pt-5">
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-soft">Design</h3>
            <CustomizationPanel />
          </div>
          <div className="border-t border-border pt-5">
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-soft">Sections</h3>
            <SectionManager />
          </div>
        </div>
      ),
    },
    {
      id: 'finish',
      title: 'Preview & Download',
      subtitle: 'Final quality check and your PDF.',
      optional: false,
      render: () => (
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[15px] font-semibold text-ink">Download your resume</div>
                <p className="mt-1 text-[12.5px] text-ink-soft">
                  A real, selectable-text A4 PDF — free during early access, no payment or account needed.
                </p>
              </div>
              <DownloadPdfButton full />
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-soft">Resume quality</h3>
            <QualityPanel />
          </div>
        </div>
      ),
    },
  ];
}
