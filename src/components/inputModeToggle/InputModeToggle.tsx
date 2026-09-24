import type { KeyboardEvent } from 'react';
import { KeyboardIcon } from '../../icons/KeyboardIcon';
import { MicBlockedIcon } from '../../icons/MicBlockedIcon';
import { MicIcon } from '../../icons/MicIcon';
import './inputModeToggle.css';

export type InputMode = 'voice' | 'keyboard';

export type InputModeToggleState =
  | { inputMode?: 'voice'; micBlocked?: false }
  // Figma has no voice + blocked variant: you can't be in voice mode without mic access.
  | { inputMode: 'keyboard'; micBlocked?: boolean };

export type InputModeToggleProps = InputModeToggleState & {
  /** Called with the mode the student switched to. */
  onInputModeChange?: (inputMode: InputMode) => void;
  /** Called instead of switching when the mic is blocked; open the re-enable-permission flow here. */
  onBlockedMicClick?: () => void;
};

export function InputModeToggle({
  inputMode = 'voice',
  micBlocked = false,
  onInputModeChange,
  onBlockedMicClick,
}: InputModeToggleProps) {
  // The whole pill is one tap target: a tap on either side switches to the other mode. While the mic
  // is blocked there is nothing to switch to, so the tap opens the re-enable-permission flow instead.
  function activate() {
    if (micBlocked) onBlockedMicClick?.();
    else onInputModeChange?.(inputMode === 'voice' ? 'keyboard' : 'voice');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const towardVoice = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    const towardKeyboard = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    if (!towardVoice && !towardKeyboard) return;
    event.preventDefault();
    if ((towardVoice ? 'voice' : 'keyboard') === inputMode) return;
    activate();
    if (!micBlocked) {
      const other = towardVoice ? event.currentTarget.previousElementSibling : event.currentTarget.nextElementSibling;
      (other as HTMLElement | null)?.focus();
    }
  }

  const isVoice = inputMode === 'voice';

  return (
    <div
      className="inputModeToggle"
      role="radiogroup"
      aria-label="Answer input"
      data-input-mode={inputMode}
      data-mic-blocked={micBlocked}
    >
      <span className="inputModeToggle__knob" aria-hidden="true" />
      <button
        type="button"
        role="radio"
        aria-checked={isVoice}
        aria-label={micBlocked ? 'Speak, mic access is off' : 'Speak'}
        tabIndex={isVoice ? 0 : -1}
        className="inputModeToggle__slot"
        data-active={isVoice}
        onClick={activate}
        onKeyDown={handleKeyDown}
      >
        {micBlocked ? (
          <MicBlockedIcon className="inputModeToggle__icon" />
        ) : (
          <MicIcon className="inputModeToggle__icon" />
        )}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!isVoice}
        aria-label="Type"
        tabIndex={isVoice ? -1 : 0}
        className="inputModeToggle__slot"
        data-active={!isVoice}
        onClick={activate}
        onKeyDown={handleKeyDown}
      >
        <KeyboardIcon className="inputModeToggle__icon" />
      </button>
    </div>
  );
}
