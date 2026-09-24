import './progressIndicator.css';

export type ProgressIndicatorProps = {
  /**
   * How far through the question set the student is, as a percentage of the bar. Figma shows 0, 25, 50,
   * 75 and 100; any number from 0 to 100 works, and numbers outside that are held to it.
   */
  progress?: number;
  /** The bar's name for screen readers. */
  'aria-label'?: string;
};

/** A bar that shows how far through the current question set the student is. It fills the width it's given. */
export function ProgressIndicator({ progress = 0, 'aria-label': ariaLabel = 'Progress' }: ProgressIndicatorProps) {
  const percent = Math.min(100, Math.max(0, progress));

  return (
    <div
      className="progressIndicator"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className="progressIndicator__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
