import { useId } from 'react';
import type { ReactNode } from 'react';
import { CaretRightIcon } from '../../icons/CaretRightIcon';
import { CheckIcon } from '../../icons/CheckIcon';
import { DotOutlineIcon } from '../../icons/DotOutlineIcon';
import { XIcon } from '../../icons/XIcon';
import { IconSlot } from '../iconSlot/IconSlot';
import './expandableResultRow.css';

export type ExpandableResultRowState = 'collapsed' | 'expanded';
export type ExpandableResultRowTone = 'success' | 'error' | 'neutral';

export type ExpandableResultRowProps = {
  state?: ExpandableResultRowState;
  tone?: ExpandableResultRowTone;
  /** What the student said, word for word. Leave it out for a skipped question. */
  transcript?: string;
  /** The concept the row is about (Figma types it into the layer, so it has no property there). */
  label: string;
  /** The question that was asked, shown in the detail (also typed into the layer in Figma). */
  question: string;
  /** Called with the state the student asked for. The parent decides, so it can keep one row open at a time. */
  onToggle?: (nextState: ExpandableResultRowState) => void;
};

// The leading icon per tone, all drawn at Icon/200 (16px).
const toneIcon: Record<ExpandableResultRowTone, ReactNode> = {
  success: <CheckIcon />,
  error: <XIcon />,
  neutral: <DotOutlineIcon />,
};

export function ExpandableResultRow({
  state = 'collapsed',
  tone = 'success',
  transcript,
  label,
  question,
  onToggle,
}: ExpandableResultRowProps) {
  const detailId = useId();
  const isExpanded = state === 'expanded';

  return (
    <div className="expandableResultRow" data-state={state} data-tone={tone}>
      <button
        type="button"
        className="expandableResultRow__header"
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? detailId : undefined}
        onClick={() => onToggle?.(isExpanded ? 'collapsed' : 'expanded')}
      >
        <span className="expandableResultRow__icon">
          <IconSlot size="200">{toneIcon[tone]}</IconSlot>
        </span>
        <span className="expandableResultRow__label">{label}</span>
        <span className="expandableResultRow__arrow">
          <IconSlot size="250">
            <CaretRightIcon />
          </IconSlot>
        </span>
      </button>
      {isExpanded && (
        <div id={detailId} className="expandableResultRow__detail" role="region" aria-label={`${label}: your answer`}>
          <p className="expandableResultRow__detailLabel">Question</p>
          <p className="expandableResultRow__quote">{question}</p>
          <p className="expandableResultRow__detailLabel">What you said</p>
          <p className="expandableResultRow__quote">{transcript ? `“${transcript}”` : 'Not answered.'}</p>
        </div>
      )}
    </div>
  );
}
