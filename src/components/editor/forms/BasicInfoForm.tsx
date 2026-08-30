import { useResume } from '../../../store/ResumeContext';
import type { ContactInfo } from '../../../types/resume';
import { Field, TextArea, TextInput } from '../../ui/FormControls';
import { WritingAssist } from '../WritingAssist';
import { PhotoUpload } from './PhotoUpload';

/**
 * Placeholders are realistic-but-fictional Indian examples (example.com
 * email, the classic reserved 98765 43210 number) so users instantly
 * understand the expected format without anyone's real data being shown.
 */
const CONTACT_FIELDS: { key: keyof ContactInfo; label: string; placeholder: string; type?: string; optional?: boolean }[] = [
  { key: 'fullName', label: 'Full name', placeholder: 'Ananya Sharma' },
  { key: 'title', label: 'Professional title', placeholder: 'B.Tech CSE Student · Aspiring Software Engineer' },
  { key: 'email', label: 'Email', placeholder: 'ananya.sharma@example.com', type: 'email' },
  { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
  { key: 'location', label: 'Location', placeholder: 'Bengaluru, Karnataka' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/ananya-sharma', optional: true },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/ananya-sharma', optional: true },
  { key: 'portfolio', label: 'Portfolio (optional)', placeholder: 'ananya.dev', optional: true },
];

export function BasicInfoForm() {
  const { resume, dispatch } = useResume();

  return (
    <div className="flex flex-col gap-5">
      <Field label="Profile photo (optional)">
        <PhotoUpload />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACT_FIELDS.map((f) => {
          const value = resume.contact[f.key];
          const invalidEmail = f.key === 'email' && value.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          return (
            <Field key={f.key} label={f.label}>
              <TextInput
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={value}
                onChange={(e) => dispatch({ type: 'SET_CONTACT', field: f.key, value: e.target.value })}
                aria-invalid={invalidEmail}
                className={invalidEmail ? 'border-danger focus:border-danger' : ''}
              />
              {invalidEmail && <span className="mt-1 block text-[12px] text-danger">Doesn't look like a valid email.</span>}
            </Field>
          );
        })}
      </div>

      <div>
        <Field label="Profile summary" hint="2–4 sentences. Lead with your role or degree and your strongest relevant skills.">
          <TextArea
            placeholder="Final-year Computer Science student skilled in React and Node.js. Built a placement portal used by 200+ students. Seeking a software engineering role..."
            value={resume.summary}
            onChange={(e) => dispatch({ type: 'SET_SUMMARY', value: e.target.value })}
          />
        </Field>
        <WritingAssist
          mode="summary"
          value={resume.summary}
          resume={resume}
          onApply={(next) => dispatch({ type: 'SET_SUMMARY', value: next })}
          className="mt-2"
        />
      </div>
    </div>
  );
}
