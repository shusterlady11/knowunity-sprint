import './recordingGlow.css';

/** The halo behind micButton while it is recording. Decorative, so it's hidden from screen readers; no props, as in Figma. */
export function RecordingGlow() {
  return (
    <span className="recordingGlow" aria-hidden="true">
      <span className="recordingGlow__ring recordingGlow__ring--outerFill" />
      <span className="recordingGlow__ring recordingGlow__ring--innerFill" />
      <span className="recordingGlow__ring recordingGlow__ring--outerLine" />
      <span className="recordingGlow__ring recordingGlow__ring--innerLine" />
    </span>
  );
}
