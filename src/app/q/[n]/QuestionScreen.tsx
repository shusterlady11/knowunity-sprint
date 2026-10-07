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
import { endQuestion, getSession, rememberRoute, updateSession, useSession, type Session } from '../../../lib/session';
import { ExitConfirm } from '../ExitConfirm';
import '../exitConfirm.css';
import './question.css';

/** The question screen's taps, plus the exit confirm sheet that the close X opens over it. */
export function QuestionScreen({ n }: { n: number }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const keepGoing = useCallback(() => setLeaving(false), []);
  const session = useSession();
  const xp = session?.xp ?? 0;
  // The "Welcome!" card shows only the very first time on question 1, until the student starts answering
  // (decided 2026-10-05). The question card stays. Tapping the mic hands it to the dictating screen, which
  // fades it out once Knowie is listening; switching to the keyboard or skipping retires it here.
  // Only once the saved session has been read: the server can't see it, so a page that's already retired the
  // card would otherwise draw it for a moment and fade it out again.
  const showIntro = n === 1 && session !== null && session.introSeen !== true;
  const isLast = n === questions.length;

  // A student in keyboard mode answers on the typing screen; otherwise remember this question.
  useEffect(() => {
    if (getSession()?.inputMode === 'keyboard') return router.replace(`/q/${n}/type`);
    rememberRoute(`/q/${n}`);
  }, [n, router]);

  // Starting to answer, or moving on, retires the welcome card for good.
  const leaveQuestion = (change?: (s: Session) => void) =>
    updateSession((s) => {
      if (n === 1) s.introSeen = true;
      change?.(s);
    });

  const skip = () => {
    leaveQuestion((s) => endQuestion(s, n, 'skipped'));
    router.push(isLast ? '/results' : `/q/${n + 1}`);
  };

  const toKeyboard = () => {
    leaveQuestion((s) => {
      s.inputMode = 'keyboard';
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
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={showIntro} />
        </div>
      }
      bottomContent={
        <div className="question__answer" inert={leaving}>
          <TapToAnswer text="Tap to dictate" />
          {/* The welcome card stays until Knowie is listening: the dictating screen fades it out. */}
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
