'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ButtonIcon } from '../buttonIcon/ButtonIcon';
import { IconSlot } from '../iconSlot/IconSlot';
import { PlusIcon } from '../../icons/PlusIcon';
import { LoadingIcon } from '../../icons/LoadingIcon';
import { Microphone01Icon } from '../../icons/Microphone01Icon';
import { Send03Icon } from '../../icons/Send03Icon';
import './chatInput.css';

/**
 * Figma's "Status", without Typing and Recording. Typing looks the same as Inactive, so it isn't built (decided
 * 2026-10-09); Recording isn't built yet.
 */
export type ChatInputStatus = 'Inactive' | 'Ready to send' | 'Long input' | 'Loading';

export type ChatInputProps = {
  /**
   * Figma's "Status": the state the bar starts in. After that, what the student does sets it: entering text,
   * then sending it, which moves the bar to Loading.
   */
  status?: ChatInputStatus;
  /** Figma's "placeholder": the text in Inactive. */
  placeholder?: string;
  /** Figma's "answer": the text the bar starts with in Ready to send and in Loading. */
  answer?: string;
  /** Figma's "longAnswer": the text the bar starts with in Long input. */
  longAnswer?: string;
  /** Figma's "showLeadingButton": the Secondary button on the left. Off on the typing route. */
  showLeadingButton?: boolean;
  /**
   * Draw the mic in the empty field. Code-only: Figma always draws it. It isn't a button, so the typing route
   * turns it off; the voice/keyboard toggle is the way back to voice (D14, decided 2026-10-05).
   */
  showMic?: boolean;
  /** The field's name for screen readers. */
  label?: string;
  /** Called with the text when the student taps send. The bar then moves to Loading. */
  onSend?: (text: string) => void;
  /** Called whenever the student's input changes the status, so a screen can show or hide the toggle row above the bar. */
  onStatusChange?: (status: Exclude<ChatInputStatus, 'Loading'>) => void;
};

/** Figma's growth rule: the field grows one line at a time up to 6 lines, then scrolls inside. */
const MAX_LINES = 6;

function startingText(status: ChatInputStatus, answer: string, longAnswer: string) {
  if (status === 'Ready to send' || status === 'Loading') return answer;
  if (status === 'Long input') return longAnswer;
  return '';
}

/** The type-to-answer bar: a growing text field with a send button, and an optional button on the left. */
export function ChatInput({
  status = 'Inactive',
  placeholder = 'Type your answer...',
  answer = 'Short answer',
  longAnswer = 'Producers make their own food from sunlight, like plants. Consumers get energy by eating producers or other consumers.',
  showLeadingButton = true,
  showMic = true,
  label = 'Your answer',
  onSend,
  onStatusChange,
}: ChatInputProps) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(() => startingText(status, answer, longAnswer));
  // Set when the student taps send: the text stays, dimmed, and the loader turns until the screen moves on.
  const [sent, setSent] = useState(false);
  // Starting in Long input counts as more than one line before the first measure, so it never flashes
  // as Ready to send.
  const [lines, setLines] = useState(status === 'Long input' ? 2 : 1);

  // A new starting state (e.g. a story control) resets the bar to it.
  const [seen, setSeen] = useState({ status, answer, longAnswer });
  if (seen.status !== status || seen.answer !== answer || seen.longAnswer !== longAnswer) {
    setSeen({ status, answer, longAnswer });
    setText(startingText(status, answer, longAnswer));
    setSent(false);
  }

  const loading = status === 'Loading' || sent;

  // Loading takes the caret away, so a field that had focus when the answer was sent stops showing one.
  useEffect(() => {
    if (loading) fieldRef.current?.blur();
  }, [loading]);

  // Grow with the text: measure the lines it needs, and let CSS cap the height at 6 lines.
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(field).lineHeight);
    const needed = Math.max(1, Math.round(field.scrollHeight / lineHeight));
    setLines(needed);
    field.style.height = `${Math.min(needed, MAX_LINES) * lineHeight}px`;
  }, [text]);

  const typed: Exclude<ChatInputStatus, 'Loading'> =
    text === '' ? 'Inactive' : lines > 1 ? 'Long input' : 'Ready to send';
  const current: ChatInputStatus = loading ? 'Loading' : typed;

  const reported = useRef(typed);
  useEffect(() => {
    if (loading || reported.current === typed) return;
    reported.current = typed;
    onStatusChange?.(typed);
  }, [loading, typed, onStatusChange]);

  const hasText = text !== '';

  const send = () => {
    onSend?.(text);
    // Only an answer with words in it is on its way; a screen ignores one that is just spaces.
    if (text.trim() !== '') setSent(true);
  };

  return (
    <div className="chatInput" data-status={current} data-multiline={lines > 1 || undefined}>
      {showLeadingButton && (
        <ButtonIcon variant="Secondary" size="L" icon={<PlusIcon />} aria-label="Add" />
      )}
      <div className="chatInput__field">
        <textarea
          ref={fieldRef}
          className="chatInput__text"
          rows={1}
          value={text}
          placeholder={placeholder}
          aria-label={label}
          onChange={(event) => setText(event.target.value)}
          readOnly={loading}
          aria-busy={loading || undefined}
          data-scrolls={lines > MAX_LINES || undefined}
        />
        {loading ? (
          // Loading draws the loader where the send button was: the answer is on its way. It stands still
          // under reduced motion, and the field says it is busy.
          <span className="chatInput__spinner" aria-hidden="true">
            <IconSlot size="300">
              <LoadingIcon className="chatInput__spinnerIcon" />
            </IconSlot>
          </span>
        ) : hasText ? (
          <ButtonIcon variant="Primary" size="S" icon={<Send03Icon />} aria-label="Send" onClick={send} />
        ) : (
          showMic && (
            // The in-field mic is drawn but isn't a button: the typing route hides it, and the toggle is the
            // way back to voice (D14).
            <span className="chatInput__mic">
              <IconSlot size="300">
                <Microphone01Icon />
              </IconSlot>
            </span>
          )
        )}
      </div>
    </div>
  );
}
