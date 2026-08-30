import type { ReactNode } from 'react';
import type { ResumeData } from '../../../types/resume';

export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  optional: boolean;
  render: () => ReactNode;
  /** Heuristic for the step-completion tick. Absent = always complete. */
  isDone?: (resume: ResumeData) => boolean;
}

export function stepDone(resume: ResumeData, steps: WizardStep[], index: number): boolean {
  const step = steps[index];
  if (!step?.isDone) return true;
  return step.isDone(resume);
}
