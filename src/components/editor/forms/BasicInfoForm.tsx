import { useResume } from '../../../store/ResumeContext';
import type { ContactInfo } from '../../../types/resume';
import { Field, TextArea, TextInput } from '../../ui/FormControls';
import { PhotoUpload } from './PhotoUpload';

const CONTACT_FIELDS: { key: keyof ContactInfo; label: string; placeholder: string; type?: string }[] = [
  { key: 'fullName', label: 'Full name', placeholder: 'Jordan Rivera' },
  { key: 'title', label: 'Professional title', placeholder: 'Software Engineer' },
  { key: 'email', label: 'Email', placeholder: 'jordan@email.com', type: 'email' },
  { key: 'phone', label: 'Phone', placeholder: '+1 555 123 4567' },
  { key: 'location', label: 'Location', placeholder: 'Austin, TX' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/jordanrivera' },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/jordanrivera' },
  { key: 'portfolio', label: 'Portfolio', placeholder: 'jordanrivera.dev' },
];

export function BasicInfoForm() {
  const { resume, dispatch } = useResume();

  return (
    <div className="flex flex-col gap-5">
      <Field label="Profile photo">
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

      <Field label="Profile summary" hint="2–4 sentences. Lead with your role and strongest, most relevant strength.">
        <TextArea
          placeholder="Frontend-focused software engineer with 3 years building accessible, high-traffic web apps..."
          value={resume.summary}
          onChange={(e) => dispatch({ type: 'SET_SUMMARY', value: e.target.value })}
        />
      </Field>
    </div>
  );
}
