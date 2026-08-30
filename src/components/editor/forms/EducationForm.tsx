import { useResume } from '../../../store/ResumeContext';
import type { EducationEntry } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { EntryCard, Field, SmallButton, TextArea, TextInput } from '../../ui/FormControls';

const emptyEntry = (): EducationEntry => ({
  id: makeId('edu'),
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
});

export function EducationForm() {
  const { resume, dispatch } = useResume();

  const update = (id: string, patch: Partial<EducationEntry>) =>
    dispatch({ type: 'LIST_UPDATE', list: 'education', id, patch });
  const remove = (id: string) => dispatch({ type: 'LIST_REMOVE', list: 'education', id });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12.5px] text-ink-soft">Add your most recent qualification first — Class X/XII and college both count.</p>
      {resume.education.map((entry) => (
        <EntryCard key={entry.id} title={entry.institution || 'New entry'} onRemove={() => remove(entry.id)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Institution">
              <TextInput value={entry.institution} onChange={(e) => update(entry.id, { institution: e.target.value })} placeholder="RV College of Engineering" />
            </Field>
            <Field label="Location">
              <TextInput value={entry.location} onChange={(e) => update(entry.id, { location: e.target.value })} placeholder="Bengaluru, Karnataka" />
            </Field>
            <Field label="Degree">
              <TextInput value={entry.degree} onChange={(e) => update(entry.id, { degree: e.target.value })} placeholder="B.Tech / B.Com / Class XII (CBSE)" />
            </Field>
            <Field label="Field of study">
              <TextInput value={entry.field} onChange={(e) => update(entry.id, { field: e.target.value })} placeholder="Computer Science & Engineering" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start year">
                <TextInput value={entry.startDate} onChange={(e) => update(entry.id, { startDate: e.target.value })} placeholder="2022" />
              </Field>
              <Field label="End year">
                <TextInput value={entry.endDate} onChange={(e) => update(entry.id, { endDate: e.target.value })} placeholder="2026" />
              </Field>
            </div>
            <Field label="Grade / CGPA (optional)">
              <TextInput value={entry.gpa} onChange={(e) => update(entry.id, { gpa: e.target.value })} placeholder="8.7 / 10 CGPA" />
            </Field>
          </div>
          <Field label="Notes (optional)" hint="Relevant coursework, honors, thesis topic.">
            <TextArea value={entry.description} onChange={(e) => update(entry.id, { description: e.target.value })} />
          </Field>
        </EntryCard>
      ))}
      <SmallButton variant="primary" onClick={() => dispatch({ type: 'LIST_ADD', list: 'education', entry: emptyEntry() })}>
        + Add education
      </SmallButton>
    </div>
  );
}
