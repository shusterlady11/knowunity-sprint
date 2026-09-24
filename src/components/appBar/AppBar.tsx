import { XCloseIcon } from '../../icons/XCloseIcon';
import { ButtonIcon } from '../buttonIcon/ButtonIcon';
import { ProgressIndicator } from '../progressIndicator/ProgressIndicator';
import { XpCounter } from '../xpCounter/XpCounter';
import type { XpCounterProps } from '../xpCounter/XpCounter';
import './appBar.css';

export type AppBarProps = {
  /** Set through Figma's exposed progressIndicator property: how far through the question set the student is, 0 to 100. */
  progress?: number;
  /** Set through Figma's exposed xpCounter property: the student's XP. */
  xp?: XpCounterProps['xp'];
  /** The close button's name for screen readers. */
  closeLabel?: string;
  /** Called when the student taps the close (X) button. */
  onClose?: () => void;
};

/** The top bar of a question set: close on the left, progress in the middle, XP on the right. */
export function AppBar({ progress = 25, xp = 2, closeLabel = 'Close', onClose }: AppBarProps) {
  return (
    <header className="appBar">
      <ButtonIcon variant="Tertiary" size="M" icon={<XCloseIcon />} aria-label={closeLabel} onClick={onClose} />
      <div className="appBar__slot">
        <ProgressIndicator progress={progress} aria-label="Question set progress" />
      </div>
      <XpCounter xp={xp} />
    </header>
  );
}
