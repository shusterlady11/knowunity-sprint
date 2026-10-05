'use client';

import { useEffect, useRef } from 'react';
import { BottomSheet } from '../../../../components/bottomSheet/BottomSheet';
import type { Question } from '../../../../content/questions';

/**
 * The Reveal answer and More info sheet (SPEC.md › 7): the concept's name in the bar, a bulleted and
 * underlined heading, then the answer and context, with an X and no buttons, as in Figma's "Reveal answer".
 * Closing returns to the same result.
 */
export function AnswerSheet({ answer, onClose }: { answer: Question['answer']; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // Focus moves into the sheet and Escape closes it; closing hands focus back to what opened it.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.querySelector('button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div ref={ref} className="answerSheet">
      <BottomSheet
        appBar={{ type: 'dismissOnly', title: answer.title, dismissLabel: 'Close answer', onDismiss: onClose }}
        middleSection={
          <div className="answerSheet__content">
            {/* Built here: Figma's bulleted, underlined heading is loose layers (docs/component-gaps.md). */}
            <div className="answerSheet__heading">
              <p className="answerSheet__title" role="heading" aria-level={2}>
                <span className="answerSheet__dot" aria-hidden="true" />
                {answer.heading}
              </p>
              <span className="answerSheet__underline" aria-hidden="true" />
            </div>
            <p className="answerSheet__body">{answer.body}</p>
          </div>
        }
      />
    </div>
  );
}
