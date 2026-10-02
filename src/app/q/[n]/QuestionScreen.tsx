'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../components/scaffold/Scaffold';
import { AppBar } from '../../../components/appBar/AppBar';
import { MiddleSection } from '../../../components/middleSection/MiddleSection';
import { TapToAnswer } from '../../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../../components/micButton/MicButton';
import { ToggleGroup } from '../../../components/toggleGroup/ToggleGroup';
import { intro, questions, topic } from '../../../content/questions';
import { bold } from '../../../content/bold';
import { ExitConfirm } from '../ExitConfirm';
import '../exitConfirm.css';
import './question.css';

/** The question screen's taps, plus the exit confirm sheet that the close X opens over it. */
export function QuestionScreen({ n }: { n: number }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const keepGoing = useCallback(() => setLeaving(false), []);
  const isLast = n === questions.length;

  // Skipping isn't saved yet: that waits for the saved session (screen 5).
  const skip = () => router.push(isLast ? '/results' : `/q/${n + 1}`);

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
      bottomSheetOnly={leaving ? <ExitConfirm onKeepGoing={keepGoing} /> : undefined}
    />
  );
}
