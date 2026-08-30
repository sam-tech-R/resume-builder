import { useResume } from '../../../store/ResumeContext';
import type { ProjectEntry } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { EntryCard, Field, SmallButton, TextInput } from '../../ui/FormControls';

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
      {resume.projects.map((entry) => (
        <EntryCard key={entry.id} title={entry.name || 'New project'} onRemove={() => remove(entry.id)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name">
              <TextInput value={entry.name} onChange={(e) => update(entry.id, { name: e.target.value })} placeholder="Personal Finance Tracker" />
            </Field>
            <Field label="Link (optional)">
              <TextInput value={entry.link} onChange={(e) => update(entry.id, { link: e.target.value })} placeholder="github.com/you/project" />
            </Field>
            <Field label="Tech stack">
              <TextInput value={entry.techStack} onChange={(e) => update(entry.id, { techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <TextInput value={entry.startDate} onChange={(e) => update(entry.id, { startDate: e.target.value })} placeholder="Jan 2024" />
              </Field>
              <Field label="End date">
                <TextInput value={entry.endDate} onChange={(e) => update(entry.id, { endDate: e.target.value })} placeholder="Mar 2024" />
              </Field>
            </div>
          </div>
          <Field label="Highlights">
            <div className="flex flex-col gap-2">
              {entry.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2">
                  <TextInput value={bullet} onChange={(e) => updateBullet(entry, i, e.target.value)} placeholder="Built a REST API handling 10k requests/day" />
                  <SmallButton variant="danger" onClick={() => removeBullet(entry, i)}>
                    ×
                  </SmallButton>
                </div>
              ))}
              <SmallButton onClick={() => addBullet(entry)}>+ Add highlight</SmallButton>
            </div>
          </Field>
        </EntryCard>
      ))}
      <SmallButton variant="primary" onClick={() => dispatch({ type: 'LIST_ADD', list: 'projects', entry: emptyEntry() })}>
        + Add project
      </SmallButton>
    </div>
  );
}
