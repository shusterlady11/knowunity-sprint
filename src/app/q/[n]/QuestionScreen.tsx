'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../components/scaffold/Scaffold';
import { AppBar } from '../../../components/appBar/AppBar';
import { MiddleSection } from '../../../components/middleSection/MiddleSection';
import { TapToAnswer } from '../../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../../components/micButton/MicButton';
import { ToggleGroup } from '../../../components/toggleGroup/ToggleGroup';
import { BottomSheet } from '../../../components/bottomSheet/BottomSheet';
import { TextBlock } from '../../../components/textBlock/TextBlock';
import { ButtonGroup } from '../../../components/buttonGroup/ButtonGroup';
import { Button } from '../../../components/button/Button';
import { intro, questions, topic } from '../../../content/questions';
import { bold } from '../../../content/bold';
import './question.css';

/** The question screen's taps, plus the exit confirm sheet that the close X opens over it. */
export function QuestionScreen({ n }: { n: number }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const isLast = n === questions.length;

  // Skipping isn't saved yet: that waits for the saved session (screen 5).
  const skip = () => router.push(isLast ? '/results' : `/q/${n + 1}`);

  // With the sheet open, focus moves into it and Escape closes it; closing hands focus back to the X.
  useEffect(() => {
    if (!leaving) return;
    sheetRef.current?.querySelector('button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLeaving(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.querySelector<HTMLElement>('.appBar .buttonIcon')?.focus();
    };
  }, [leaving]);

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          {/* Progress counts questions finished: 0 on question 1, 80 on question 5. XP stays 0 until the saved session exists. */}
          <AppBar progress={((n - 1) / questions.length) * 100} xp={0} onClose={() => setLeaving(true)} />
        </div>
      }
      middleContent={
        <div className="question__content" inert={leaving}>
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={n === 1} />
        </div>
      }
      bottomContent={
        <div className="question__answer" inert={leaving}>
          <TapToAnswer text="Tap to dictate" />
          <MicButton onClick={() => router.push(`/q/${n}/recording`)} />
          <ToggleGroup
            inputMode="voice"
            micBlocked={false}
            onInputModeChange={(mode) => mode === 'keyboard' && router.push(`/q/${n}/type`)}
            onSkip={skip}
          />
        </div>
      }
      showBottomSheetBackground={leaving}
      bottomSheetOnly={
        leaving ? (
          // Exit confirm (SPEC.md): no Figma frame; composed like the mic permission sheet.
          <div ref={sheetRef} className="question__sheet">
            <BottomSheet
              appBar={{ type: 'Default' }}
              label="Leave?"
              middleSection={<TextBlock variant="L" title="Leave?" caption="Your progress is saved." />}
              bottomSection={
                <ButtonGroup variant="Vertical" size="L">
                  <Button variant="Primary" size="L" CTA="Keep going" onClick={() => setLeaving(false)} />
                  <Button variant="Secondary" size="L" CTA="Leave" onClick={() => router.push('/done')} />
                </ButtonGroup>
              }
            />
          </div>
        ) : undefined
      }
    />
  );
}
