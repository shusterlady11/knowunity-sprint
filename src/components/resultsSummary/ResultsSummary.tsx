import { useId, useState } from 'react';
import { ExpandableResultRow } from '../expandableResultRow/ExpandableResultRow';
import type { ExpandableResultRowTone } from '../expandableResultRow/ExpandableResultRow';
import './resultsSummary.css';

// Figma names this property "Property 1"; it's called category here (see the component spec).
export type ResultsSummaryCategory = 'good-explanations' | 'needs-practice' | 'skipped-questions';

export type ResultsSummaryRow = {
  /** The concept the row is about. */
  label: string;
  /** The question that was asked. */
  question: string;
  /** What the student said, word for word. Leave it out for a skipped question. */
  transcript?: string;
};

export type ResultsSummaryProps = {
  category?: ResultsSummaryCategory;
  /** 1 to 5 rows (a session is a fixed 5 questions). With none, the card isn't drawn. */
  rows: ResultsSummaryRow[];
  /** Which row is open (its index), or null for none. Leave it out and the card keeps one row open at a time itself. */
  openRow?: number | null;
  /** Called with the row that should be open, or null when the open row is closed. */
  onOpenRowChange?: (openRow: number | null) => void;
};

const MAX_ROWS = 5;

const titleFor: Record<ResultsSummaryCategory, string> = {
  'good-explanations': 'Good explanations',
  'needs-practice': 'Needs practice',
  'skipped-questions': 'Skipped questions',
};

// The rows take their tone from the card they're in.
const toneFor: Record<ResultsSummaryCategory, ExpandableResultRowTone> = {
  'good-explanations': 'success',
  'needs-practice': 'error',
  'skipped-questions': 'neutral',
};

export function ResultsSummary({ category = 'good-explanations', rows, openRow, onOpenRowChange }: ResultsSummaryProps) {
  const titleId = useId();
  const [ownOpenRow, setOwnOpenRow] = useState<number | null>(null);
  const current = openRow !== undefined ? openRow : ownOpenRow;

  // A card with nothing in it isn't shown at all.
  if (rows.length === 0) return null;

  function toggle(index: number) {
    const next = current === index ? null : index;
    setOwnOpenRow(next);
    onOpenRowChange?.(next);
  }

  return (
    <section className="resultsSummary" data-category={category} aria-labelledby={titleId}>
      <h2 id={titleId} className="resultsSummary__title">
        {titleFor[category]}
      </h2>
      <ul className="resultsSummary__list">
        {rows.slice(0, MAX_ROWS).map((row, index) => (
          <li key={`${row.label}-${index}`} className="resultsSummary__item">
            <ExpandableResultRow
              tone={toneFor[category]}
              state={current === index ? 'expanded' : 'collapsed'}
              label={row.label}
              question={row.question}
              transcript={row.transcript}
              onToggle={() => toggle(index)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
