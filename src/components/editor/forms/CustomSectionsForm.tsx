import { useResume } from '../../../store/ResumeContext';
import type { CustomSectionItem } from '../../../types/resume';
import { makeId } from '../../../utils/id';
import { EntryCard, Field, SmallButton, TextArea, TextInput } from '../../ui/FormControls';

export function CustomSectionsForm() {
  const { resume, dispatch } = useResume();

  return (
    <div className="flex flex-col gap-6">
      {resume.customSections.map((section) => (
        <div key={section.id} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <TextInput
              value={section.heading}
              onChange={(e) => dispatch({ type: 'CUSTOM_SECTION_RENAME', sectionId: section.id, heading: e.target.value })}
              placeholder="Section name (e.g. Publications)"
              className="max-w-xs font-medium"
            />
            <SmallButton
              variant="danger"
              onClick={() => {
                if (section.items.length === 0 || window.confirm(`Remove "${section.heading || 'this section'}" and all its items?`)) {
                  dispatch({ type: 'CUSTOM_SECTION_REMOVE', sectionId: section.id });
                }
              }}
            >
              Remove section
            </SmallButton>
          </div>

          <div className="flex flex-col gap-3">
            {section.items.map((item) => (
              <EntryCard
                key={item.id}
                title={item.title || 'New item'}
                onRemove={() => dispatch({ type: 'CUSTOM_SECTION_ITEM_REMOVE', sectionId: section.id, itemId: item.id })}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Title">
                    <TextInput
                      value={item.title}
                      onChange={(e) =>
                        dispatch({ type: 'CUSTOM_SECTION_ITEM_UPDATE', sectionId: section.id, itemId: item.id, patch: { title: e.target.value } })
                      }
                    />
                  </Field>
                  <Field label="Subtitle">
                    <TextInput
                      value={item.subtitle}
                      onChange={(e) =>
                        dispatch({ type: 'CUSTOM_SECTION_ITEM_UPDATE', sectionId: section.id, itemId: item.id, patch: { subtitle: e.target.value } })
                      }
                    />
                  </Field>
                  <Field label="Date">
                    <TextInput
                      value={item.date}
                      onChange={(e) =>
                        dispatch({ type: 'CUSTOM_SECTION_ITEM_UPDATE', sectionId: section.id, itemId: item.id, patch: { date: e.target.value } })
                      }
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <TextArea
                    value={item.description}
                    onChange={(e) =>
                      dispatch({ type: 'CUSTOM_SECTION_ITEM_UPDATE', sectionId: section.id, itemId: item.id, patch: { description: e.target.value } })
                    }
                  />
                </Field>
              </EntryCard>
            ))}
            <SmallButton
              onClick={() => {
                const item: CustomSectionItem = { id: makeId('item'), title: '', subtitle: '', date: '', description: '' };
                dispatch({ type: 'CUSTOM_SECTION_ITEM_ADD', sectionId: section.id, item });
              }}
            >
              + Add item
            </SmallButton>
          </div>
        </div>
      ))}
      <SmallButton variant="primary" onClick={() => dispatch({ type: 'CUSTOM_SECTION_ADD', heading: 'Custom Section' })}>
        + Add custom section
      </SmallButton>
    </div>
  );
}
