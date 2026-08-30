import { useResume } from '../../../store/ResumeContext';
import type { ProjectEntry } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { findWeakWording } from '../../../utils/writingAssist';
import { EntryCard, Field, SmallButton, TextArea, TextInput } from '../../ui/FormControls';
import { WritingAssist } from '../WritingAssist';

const emptyEntry = (): ProjectEntry => ({
  id: makeId('proj'),
  name: '',
  link: '',
  techStack: '',
  startDate: '',
  endDate: '',
  bullets: [''],
});

export function ProjectsForm() {
  const { resume, dispatch } = useResume();
  const update = (id: string, patch: Partial<ProjectEntry>) => dispatch({ type: 'LIST_UPDATE', list: 'projects', id, patch });
  const remove = (id: string) => dispatch({ type: 'LIST_REMOVE', list: 'projects', id });

  const updateBullet = (entry: ProjectEntry, index: number, value: string) => {
    const bullets = [...entry.bullets];
    bullets[index] = value;
    update(entry.id, { bullets });
  };
  const addBullet = (entry: ProjectEntry) => update(entry.id, { bullets: [...entry.bullets, ''] });
  const removeBullet = (entry: ProjectEntry, index: number) =>
    update(entry.id, { bullets: entry.bullets.filter((_, i) => i !== index) });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12.5px] text-ink-soft">
        Class projects, hackathon builds and personal projects all count — for freshers they're often the strongest part of the resume.
      </p>
      {resume.projects.map((entry) => (
        <EntryCard key={entry.id} title={entry.name || 'New project'} onRemove={() => remove(entry.id)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name">
              <TextInput value={entry.name} onChange={(e) => update(entry.id, { name: e.target.value })} placeholder="CampusLink — Placement Portal" />
            </Field>
            <Field label="Link (optional)">
              <TextInput value={entry.link} onChange={(e) => update(entry.id, { link: e.target.value })} placeholder="github.com/you/campuslink" />
            </Field>
            <Field label="Tech stack">
              <TextInput value={entry.techStack} onChange={(e) => update(entry.id, { techStack: e.target.value })} placeholder="React, Node.js, MongoDB" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <TextInput value={entry.startDate} onChange={(e) => update(entry.id, { startDate: e.target.value })} placeholder="Aug 2024" />
              </Field>
              <Field label="End date">
                <TextInput value={entry.endDate} onChange={(e) => update(entry.id, { endDate: e.target.value })} placeholder="Dec 2024" />
              </Field>
            </div>
          </div>
          <Field label="Description" hint="Rough sentences are fine — write what it does and who used it.">
            <TextArea
              value={entry.bullets.join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                update(entry.id, { bullets: lines });
              }}
              placeholder={"Built a placement portal used by 200+ students across 3 departments\nImplemented resume shortlisting with role-based access"}
              className="min-h-[72px]"
            />
          </Field>
          {entry.bullets.filter((b) => b.trim()).length > 0 && (
            <WritingAssist
              mode="bullets"
              value={entry.bullets.filter((b) => b.trim()).join(' ')}
              onApply={(next) => update(entry.id, { bullets: next.split('\n').map((l) => l.trim()).filter(Boolean) })}
            />
          )}
          {entry.bullets.some((b) => findWeakWording(b).length > 0) && (
            <p className="text-[11.5px] text-accent">{findWeakWording(entry.bullets.find((b) => findWeakWording(b).length > 0) ?? '')[0].hint}</p>
          )}
          <div className="flex flex-col gap-2">
            {entry.bullets.map((bullet, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  value={bullet}
                  onChange={(e) => updateBullet(entry, i, e.target.value)}
                  placeholder="Built a REST API handling 10k requests/day"
                  aria-label={`Highlight ${i + 1}`}
                />
                <SmallButton variant="danger" onClick={() => removeBullet(entry, i)} aria-label={`Remove highlight ${i + 1}`}>
                  ×
                </SmallButton>
              </div>
            ))}
            <SmallButton onClick={() => addBullet(entry)}>+ Add highlight</SmallButton>
          </div>
        </EntryCard>
      ))}
      <SmallButton variant="primary" onClick={() => dispatch({ type: 'LIST_ADD', list: 'projects', entry: emptyEntry() })}>
        + Add project
      </SmallButton>
    </div>
  );
}
