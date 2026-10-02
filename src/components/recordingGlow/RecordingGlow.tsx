import './recordingGlow.css';

/** The halo behind micButton while it is recording: two circles that breathe. Decorative, so it's hidden from screen readers; no props, as in Figma. */
export function RecordingGlow() {
  return (
    <span className="recordingGlow" aria-hidden="true">
      <span className="recordingGlow__circle recordingGlow__circle--halo" />
      <span className="recordingGlow__circle recordingGlow__circle--core" />
    </span>
  );
}
