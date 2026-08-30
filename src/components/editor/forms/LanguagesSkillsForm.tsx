import { useResume } from '../../../store/ResumeContext';
import type { LanguageEntry } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { EntryCard, Field, SmallButton, TagListInput, TextInput } from '../../ui/FormControls';

const PROFICIENCIES: LanguageEntry['proficiency'][] = ['Basic', 'Conversational', 'Fluent', 'Native'];

export function LanguagesForm() {
  const { resume, dispatch } = useResume();
  const update = (id: string, patch: Partial<LanguageEntry>) => dispatch({ type: 'LIST_UPDATE', list: 'languages', id, patch });
  const remove = (id: string) => dispatch({ type: 'LIST_REMOVE', list: 'languages', id });

  return (
    <div className="flex flex-col gap-4">
      {resume.languages.map((entry) => (
        <EntryCard key={entry.id} title={entry.name || 'New language'} onRemove={() => remove(entry.id)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Language">
              <TextInput value={entry.name} onChange={(e) => update(entry.id, { name: e.target.value })} placeholder="Spanish" />
            </Field>
            <Field label="Proficiency">
              <select
                value={entry.proficiency}
                onChange={(e) => update(entry.id, { proficiency: e.target.value as LanguageEntry['proficiency'] })}
                className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-[14px] text-ink focus:border-primary"
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </EntryCard>
      ))}
      <SmallButton
        variant="primary"
        onClick={() =>
          dispatch({
            type: 'LIST_ADD',
            list: 'languages',
            entry: { id: makeId('lang'), name: '', proficiency: 'Conversational' } satisfies LanguageEntry,
          })
        }
      >
        + Add language
      </SmallButton>
    </div>
  );
}

export function TechnicalSkillsForm() {
  const { resume, dispatch } = useResume();
  return (
    <Field label="Technical skills" hint="Press Enter or comma after each skill.">
      <TagListInput
        values={resume.technicalSkills}
        onChange={(values) => dispatch({ type: 'STRING_LIST_SET', list: 'technicalSkills', values })}
        placeholder="TypeScript, React, PostgreSQL..."
      />
    </Field>
  );
}

export function SoftSkillsForm() {
  const { resume, dispatch } = useResume();
  return (
    <Field label="Soft skills" hint="Press Enter or comma after each skill.">
      <TagListInput
        values={resume.softSkills}
        onChange={(values) => dispatch({ type: 'STRING_LIST_SET', list: 'softSkills', values })}
        placeholder="Communication, Leadership..."
      />
    </Field>
  );
}

export function AchievementsForm() {
  const { resume, dispatch } = useResume();
  return (
    <Field label="Achievements" hint="Press Enter or comma after each achievement.">
      <TagListInput
        values={resume.achievements}
        onChange={(values) => dispatch({ type: 'STRING_LIST_SET', list: 'achievements', values })}
        placeholder="Won first place at HackTX 2024..."
      />
    </Field>
  );
}
