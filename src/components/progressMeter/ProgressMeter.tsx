import './progressMeter.css';

export type ProgressMeterScore = 1 | 2 | 3 | 4 | 5;

export type ProgressMeterProps = {
  /** Questions answered correctly out of 5. There is no 0: the meter is left out when nothing was correct. */
  score?: ProgressMeterScore;
};

// A session is a fixed 5 questions (see the decision log), so the denominator is fixed.
const TOTAL = 5;

// The ring is drawn in a 100-unit box that scales to the meter's size. Its thickness is 15% of the
// radius (Figma's inner radius is 85%), so it follows the size and needs no token of its own.
const RADIUS = 50;
const THICKNESS = RADIUS * 0.15;
const CENTER_LINE = RADIUS - THICKNESS / 2;

export function ProgressMeter({ score = 1 }: ProgressMeterProps) {
  const isPerfect = score === TOTAL;
  return (
    <div
      className="progressMeter"
      role="img"
      aria-label={isPerfect ? `${score} out of ${TOTAL}, 100%` : `${score} out of ${TOTAL}`}
      data-score={score}
    >
      <svg className="progressMeter__ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="progressMeter__track" cx="50" cy="50" r={CENTER_LINE} strokeWidth={THICKNESS} />
        <circle
          className="progressMeter__fill"
          cx="50"
          cy="50"
          r={CENTER_LINE}
          strokeWidth={THICKNESS}
          pathLength="100"
          strokeDasharray={`${(score / TOTAL) * 100} 100`}
        />
      </svg>
      <span className="progressMeter__label" aria-hidden="true">
        {isPerfect ? '100%' : `${score}/${TOTAL}`}
      </span>
    </div>
  );
}
