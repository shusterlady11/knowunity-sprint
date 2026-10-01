import { Fragment, type ReactNode } from 'react';

/** Turns the content's **bold** markers into `<strong>`, the way answerCard sets key words in bold. */
export function bold(text: string): ReactNode {
  return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}
