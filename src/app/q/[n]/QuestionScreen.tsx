'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../components/scaffold/Scaffold';
import { AppBar } from '../../../components/appBar/AppBar';
import { MiddleSection } from '../../../components/middleSection/MiddleSection';
import { TapToAnswer } from '../../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../../components/micButton/MicButton';
import { ToggleGroup } from '../../../components/toggleGroup/ToggleGroup';
import { intro, questions, topic } from '../../../content/questions';
import { bold } from '../../../content/bold';
import { getSession, questionRecord, rememberRoute, updateSession, useSession } from '../../../lib/session';
import { ExitConfirm } from '../ExitConfirm';
import '../exitConfirm.css';
import './question.css';

/** The question screen's taps, plus the exit confirm sheet that the close X opens over it. */
export function QuestionScreen({ n }: { n: number }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const keepGoing = useCallback(() => setLeaving(false), []);
  const xp = useSession()?.xp ?? 0;
  const isLast = n === questions.length;

  // A student in keyboard mode answers on the typing screen; otherwise remember this question.
  useEffect(() => {
    if (getSession()?.inputMode === 'keyboard') return router.replace(`/q/${n}/type`);
    rememberRoute(`/q/${n}`);
  }, [n, router]);

  const skip = () => {
    updateSession((session) => {
      questionRecord(session, n).outcome = 'skipped';
    });
    router.push(isLast ? '/results' : `/q/${n + 1}`);
  };

  const toKeyboard = () => {
    updateSession((session) => {
      session.inputMode = 'keyboard';
    });
    router.push(`/q/${n}/type`);
  };

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          {/* Progress counts questions finished: 0 on question 1, 80 on question 5. */}
          <AppBar progress={((n - 1) / questions.length) * 100} xp={xp} onClose={() => setLeaving(true)} />
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
            onInputModeChange={(mode) => mode === 'keyboard' && toKeyboard()}
            onSkip={skip}
          />
        </div>
      }
      showBottomSheetBackground={leaving}
      bottomSheetOnly={leaving ? <ExitConfirm onKeepGoing={keepGoing} /> : undefined}
    />
  );
}
