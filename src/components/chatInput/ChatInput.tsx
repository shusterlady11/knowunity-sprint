'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ButtonIcon } from '../buttonIcon/ButtonIcon';
import { IconSlot } from '../iconSlot/IconSlot';
import { PlusIcon } from '../../icons/PlusIcon';
import { Microphone01Icon } from '../../icons/Microphone01Icon';
import { Send03Icon } from '../../icons/Send03Icon';
import './chatInput.css';

/** Figma's "Status", without Recording and Loading, which aren't built yet. */
export type ChatInputStatus = 'Inactive' | 'Typing' | 'Ready to send' | 'Long input';

export type ChatInputProps = {
  /** Figma's "Status": the state the bar starts in. After that, what the student does sets it. */
  status?: ChatInputStatus;
  /** Figma's "placeholder": the text in Inactive and Typing. */
  placeholder?: string;
  /** Figma's "answer": the text the bar starts with in Ready to send. */
  answer?: string;
  /** Figma's "longAnswer": the text the bar starts with in Long input. */
  longAnswer?: string;
  /** Figma's "showLeadingButton": the Secondary button on the left. Off on the typing route. */
  showLeadingButton?: boolean;
  /** The field's name for screen readers. */
  label?: string;
  /** Called with the text when the student taps send. */
  onSend?: (text: string) => void;
  /** Called whenever the status changes, so a screen can show or hide the toggle row above the bar. */
  onStatusChange?: (status: ChatInputStatus) => void;
};

/** Figma's growth rule: the field grows one line at a time up to 6 lines, then scrolls inside. */
const MAX_LINES = 6;

function startingText(status: ChatInputStatus, answer: string, longAnswer: string) {
  if (status === 'Ready to send') return answer;
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
  label = 'Your answer',
  onSend,
  onStatusChange,
}: ChatInputProps) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(() => startingText(status, answer, longAnswer));
  const [focused, setFocused] = useState(status === 'Typing');
  // Starting in Long input counts as more than one line before the first measure, so it never flashes
  // as Ready to send.
  const [lines, setLines] = useState(status === 'Long input' ? 2 : 1);

  // A new starting state (e.g. a story control) resets the bar to it.
  const [seen, setSeen] = useState({ status, answer, longAnswer });
  if (seen.status !== status || seen.answer !== answer || seen.longAnswer !== longAnswer) {
    setSeen({ status, answer, longAnswer });
    setText(startingText(status, answer, longAnswer));
    setFocused(status === 'Typing');
  }

  // Typing is the empty field with the caret in it, so starting there means starting focused.
  useEffect(() => {
    if (status === 'Typing') fieldRef.current?.focus();
  }, [status]);

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

  const current: ChatInputStatus =
    text === '' ? (focused ? 'Typing' : 'Inactive') : lines > 1 ? 'Long input' : 'Ready to send';

  const reported = useRef(current);
  useEffect(() => {
    if (reported.current === current) return;
    reported.current = current;
    onStatusChange?.(current);
  }, [current, onStatusChange]);

  const hasText = text !== '';

  return (
    <div className="chatInput" data-status={current}>
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          data-scrolls={lines > MAX_LINES || undefined}
        />
        {hasText ? (
          <ButtonIcon
            variant="Primary"
            size="S"
            icon={<Send03Icon />}
            aria-label="Send"
            onClick={() => onSend?.(text)}
          />
        ) : (
          // The in-field mic is drawn but does nothing yet: whether it leads back to voice or starts
          // dictation is still undecided, so it isn't a button.
          <span className="chatInput__mic">
            <IconSlot size="300">
              <Microphone01Icon />
            </IconSlot>
          </span>
        )}
      </div>
    </div>
  );
}
