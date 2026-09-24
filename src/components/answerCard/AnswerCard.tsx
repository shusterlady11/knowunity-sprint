import type { ReactNode } from 'react';
import { StatusPill } from '../statusPill/StatusPill';
import type { StatusPillState } from '../statusPill/StatusPill';
import './answerCard.css';

export type AnswerCardState =
  | 'Default'
  | 'question'
  | 'processing'
  | 'answer-correct'
  | 'answer-partial'
  | 'answer-error'
  | 'answer-notcaught';

export type AnswerCardProps = {
  state?: AnswerCardState;
  message?: ReactNode;
};

const pillFor: Partial<Record<AnswerCardState, StatusPillState>> = {
  'answer-correct': 'correct',
  'answer-partial': 'partial',
  'answer-error': 'wrong',
  'answer-notcaught': 'notCaught',
};

const defaultMessage: Partial<Record<AnswerCardState, string>> = {
  processing: 'Thinking...',
  'answer-notcaught': 'I couldn’t understand that take.',
};

export function AnswerCard({ state = 'Default', message }: AnswerCardProps) {
  const text = message ?? defaultMessage[state] ?? '';
  const pill = pillFor[state];
  const isProcessing = state === 'processing';
  // Feedback and the wait state are announced when they appear; the question and Knowie's
  // talking card are ordinary content.
  const announce = pill !== undefined || isProcessing;

  return (
    <div
      className="answerCard"
      data-state={state}
      role={announce ? 'status' : undefined}
      aria-busy={isProcessing || undefined}
    >
      {pill && <StatusPill state={pill} />}
      <p className="answerCard__message">{text}</p>
      {isProcessing && (
        <div className="answerCard__skeleton" aria-hidden="true">
          <span className="answerCard__bar" />
          <span className="answerCard__bar" />
          <span className="answerCard__bar" />
        </div>
      )}
    </div>
  );
}
