import { useResume } from '../../../store/ResumeContext';
import type { ExperienceEntry } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { Checkbox, EntryCard, Field, SmallButton, TextInput } from '../../ui/FormControls';
import type { ListField } from '../../../store/resumeReducer';

const emptyEntry = (): ExperienceEntry => ({
  id: makeId('exp'),
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  bullets: [''],
});

export function ExperienceLikeForm({ list }: { list: Extract<ListField, 'experience' | 'internships'> }) {
  const { resume, dispatch } = useResume();
  const entries = resume[list];

  const update = (id: string, patch: Partial<ExperienceEntry>) => dispatch({ type: 'LIST_UPDATE', list, id, patch });
  const remove = (id: string) => dispatch({ type: 'LIST_REMOVE', list, id });

  const updateBullet = (entry: ExperienceEntry, index: number, value: string) => {
    const bullets = [...entry.bullets];
    bullets[index] = value;
    update(entry.id, { bullets });
  };
  const addBullet = (entry: ExperienceEntry) => update(entry.id, { bullets: [...entry.bullets, ''] });
  const removeBullet = (entry: ExperienceEntry, index: number) =>
    update(entry.id, { bullets: entry.bullets.filter((_, i) => i !== index) });

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <EntryCard key={entry.id} title={entry.role || entry.company || 'New entry'} onRemove={() => remove(entry.id)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Role / Title">
              <TextInput value={entry.role} onChange={(e) => update(entry.id, { role: e.target.value })} placeholder="Software Engineer" />
            </Field>
            <Field label="Company">
              <TextInput value={entry.company} onChange={(e) => update(entry.id, { company: e.target.value })} placeholder="Acme Corp" />
            </Field>
            <Field label="Location">
              <TextInput value={entry.location} onChange={(e) => update(entry.id, { location: e.target.value })} placeholder="Remote" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <TextInput value={entry.startDate} onChange={(e) => update(entry.id, { startDate: e.target.value })} placeholder="Jun 2023" />
              </Field>
              <Field label="End date">
                <TextInput
                  value={entry.endDate}
                  disabled={entry.current}
                  onChange={(e) => update(entry.id, { endDate: e.target.value })}
                  placeholder="Present"
                  className={entry.current ? 'opacity-50' : ''}
                />
              </Field>
            </div>
          </div>
          <Checkbox
            label="I currently work here"
            checked={entry.current}
            onChange={(e) => update(entry.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
          />

          <Field label="Highlights" hint="One achievement per line. Start with an action verb; include a number where you can.">
            <div className="flex flex-col gap-2">
              {entry.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2">
                  <TextInput value={bullet} onChange={(e) => updateBullet(entry, i, e.target.value)} placeholder="Reduced page load time by 40% by..." />
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
      <SmallButton variant="primary" onClick={() => dispatch({ type: 'LIST_ADD', list, entry: emptyEntry() })}>
        + Add {list === 'internships' ? 'internship' : 'work experience'}
      </SmallButton>
    </div>
  );
}
