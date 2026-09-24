import type { ButtonHTMLAttributes } from 'react';
import { MicFilledIcon } from '../../icons/MicFilledIcon';
import { MicDisabledIcon } from '../../icons/MicDisabledIcon';
import './micButton.css';

export type MicButtonState =
  | { listeningState?: 'idle'; interactionState?: 'ready' | 'pressed' | 'disabled' }
  // Figma has no listening + disabled variant: the button can't be listening and unavailable at once.
  | { listeningState: 'listening'; interactionState?: 'ready' | 'pressed' };

export type MicButtonProps = MicButtonState &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled'>;

export function MicButton({
  listeningState = 'idle',
  interactionState = 'ready',
  type = 'button',
  onClick,
  ...rest
}: MicButtonProps) {
  const isDisabled = interactionState === 'disabled';

  return (
    <button
      aria-label="Record answer"
      {...rest}
      type={type}
      className="micButton"
      data-listening-state={listeningState}
      data-interaction-state={interactionState}
      aria-pressed={listeningState === 'listening'}
      aria-disabled={isDisabled || undefined}
      aria-busy={isDisabled || undefined}
      onClick={isDisabled ? undefined : onClick}
    >
      <span className="micButton__face">
        {isDisabled ? <MicDisabledIcon className="micButton__icon" /> : <MicFilledIcon className="micButton__icon" />}
      </span>
    </button>
  );
}
