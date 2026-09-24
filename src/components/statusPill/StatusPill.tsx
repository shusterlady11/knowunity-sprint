import type { ReactNode } from 'react';
import { IconSlot } from '../iconSlot/IconSlot';
import { CheckIcon } from '../../icons/CheckIcon';
import { ArrowCounterClockwiseIcon } from '../../icons/ArrowCounterClockwiseIcon';
import { ArrowsClockwiseIcon } from '../../icons/ArrowsClockwiseIcon';
import { QuestionMarkIcon } from '../../icons/QuestionMarkIcon';
import './statusPill.css';

export type StatusPillState = 'correct' | 'partial' | 'wrong' | 'notCaught';

export type StatusPillProps = {
  state?: StatusPillState;
  leftIcon?: boolean;
};

// The wording and icon are fixed per state: the Figma description says they are part of the
// state's meaning, so neither can be changed from outside.
const content: Record<StatusPillState, { label: string; icon: ReactNode }> = {
  correct: { label: 'Correct', icon: <CheckIcon /> },
  partial: { label: 'Almost there', icon: <ArrowCounterClockwiseIcon /> },
  wrong: { label: 'Try again', icon: <ArrowsClockwiseIcon /> },
  notCaught: { label: "Didn't catch that", icon: <QuestionMarkIcon /> },
};

export function StatusPill({ state = 'correct', leftIcon = true }: StatusPillProps) {
  const { label, icon } = content[state];
  return (
    <span className="statusPill" data-state={state}>
      {leftIcon && <IconSlot size="150">{icon}</IconSlot>}
      <span className="statusPill__label">{label}</span>
    </span>
  );
}
