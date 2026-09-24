import { Button } from '../button/Button';
import { InputModeToggle } from '../inputModeToggle/InputModeToggle';
import type { InputModeToggleProps } from '../inputModeToggle/InputModeToggle';
import './toggleGroup.css';

export type ToggleGroupProps = InputModeToggleProps & {
  /** Called when the student taps Skip. */
  onSkip?: () => void;
};

/** Pick the variant with inputMode and micBlocked; the nested toggle mirrors it, so the row and the toggle can't disagree. */
export function ToggleGroup({ onSkip, ...toggleProps }: ToggleGroupProps) {
  return (
    <div className="toggleGroup">
      <InputModeToggle {...toggleProps} />
      <Button variant="Tertiary" size="S" CTA="Skip" onClick={onSkip} />
    </div>
  );
}
