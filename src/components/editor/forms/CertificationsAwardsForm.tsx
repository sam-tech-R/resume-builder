import { useResume } from '../../../store/ResumeContext';
import type { AwardEntry, CertificationEntry } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { EntryCard, Field, SmallButton, TextArea, TextInput } from '../../ui/FormControls';

export function CertificationsForm() {
  const { resume, dispatch } = useResume();
  const update = (id: string, patch: Partial<CertificationEntry>) =>
    dispatch({ type: 'LIST_UPDATE', list: 'certifications', id, patch });
  const remove = (id: string) => dispatch({ type: 'LIST_REMOVE', list: 'certifications', id });

  return (
    <div className="flex flex-col gap-4">
      {resume.certifications.map((entry) => (
        <EntryCard key={entry.id} title={entry.name || 'New certification'} onRemove={() => remove(entry.id)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Certification name">
              <TextInput value={entry.name} onChange={(e) => update(entry.id, { name: e.target.value })} placeholder="AWS Certified Solutions Architect" />
            </Field>
            <Field label="Issuer">
              <TextInput value={entry.issuer} onChange={(e) => update(entry.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
            </Field>
            <Field label="Date">
              <TextInput value={entry.date} onChange={(e) => update(entry.id, { date: e.target.value })} placeholder="Mar 2024" />
            </Field>
            <Field label="Credential URL (optional)">
              <TextInput value={entry.credentialUrl} onChange={(e) => update(entry.id, { credentialUrl: e.target.value })} placeholder="credly.com/..." />
            </Field>
          </div>
        </EntryCard>
      ))}
      <SmallButton
        variant="primary"
        onClick={() =>
          dispatch({
            type: 'LIST_ADD',
            list: 'certifications',
            entry: { id: makeId('cert'), name: '', issuer: '', date: '', credentialUrl: '' } satisfies CertificationEntry,
          })
        }
      >
        + Add certification
      </SmallButton>
    </div>
  );
}

export function AwardsForm() {
  const { resume, dispatch } = useResume();
  const update = (id: string, patch: Partial<AwardEntry>) => dispatch({ type: 'LIST_UPDATE', list: 'awards', id, patch });
  const remove = (id: string) => dispatch({ type: 'LIST_REMOVE', list: 'awards', id });

  return (
    <div className="flex flex-col gap-4">
      {resume.awards.map((entry) => (
        <EntryCard key={entry.id} title={entry.title || 'New award'} onRemove={() => remove(entry.id)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Award title">
              <TextInput value={entry.title} onChange={(e) => update(entry.id, { title: e.target.value })} placeholder="Dean's List" />
            </Field>
            <Field label="Issuer">
              <TextInput value={entry.issuer} onChange={(e) => update(entry.id, { issuer: e.target.value })} placeholder="University of Texas" />
            </Field>
            <Field label="Date">
              <TextInput value={entry.date} onChange={(e) => update(entry.id, { date: e.target.value })} placeholder="2023" />
            </Field>
          </div>
          <Field label="Description (optional)">
            <TextArea value={entry.description} onChange={(e) => update(entry.id, { description: e.target.value })} />
          </Field>
        </EntryCard>
      ))}
      <SmallButton
        variant="primary"
        onClick={() =>
          dispatch({
            type: 'LIST_ADD',
            list: 'awards',
            entry: { id: makeId('award'), title: '', issuer: '', date: '', description: '' } satisfies AwardEntry,
          })
        }
      >
        + Add award
      </SmallButton>
    </div>
  );
}
