import './loadingDots.css';

/** Three pulsing dots: an indeterminate "working on it" indicator (no props, as in Figma). */
export function LoadingDots() {
  return (
    <span className="loadingDots" role="status" aria-label="Thinking">
      <span className="loadingDots__dot" aria-hidden="true" />
      <span className="loadingDots__dot" aria-hidden="true" />
      <span className="loadingDots__dot" aria-hidden="true" />
    </span>
  );
}
