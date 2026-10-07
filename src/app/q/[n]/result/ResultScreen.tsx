'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { AnswerCard } from '../../../../components/answerCard/AnswerCard';
import { TapToAnswer } from '../../../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../../../components/micButton/MicButton';
import { InputModeToggle } from '../../../../components/inputModeToggle/InputModeToggle';
import { BottomCTA } from '../../../../components/bottomCTA/BottomCTA';
import { ChatInput } from '../../../../components/chatInput/ChatInput';
import { nudge, questions, topic } from '../../../../content/questions';
import { bold } from '../../../../content/bold';
import { fillHint, type Verdict } from '../../../../lib/recallEngine';
import { announce } from '../../../../lib/announcer';
import { endQuestion, getSession, questionRecord, questionRoute, rememberRoute, updateSession, useSession } from '../../../../lib/session';
import { ExitConfirm } from '../../ExitConfirm';
import { AnswerSheet } from './AnswerSheet';
import '../../exitConfirm.css';
import './result.css';

const cardState: Record<Verdict, 'answer-correct' | 'answer-partial' | 'answer-error' | 'answer-notcaught'> = {
  correct: 'answer-correct',
  partial: 'answer-partial',
  wrong: 'answer-error',
  notCaught: 'answer-notcaught',
};

// Said to screen readers with the covered count, in the status pill's own words.
const verdictWord: Record<Verdict, string> = {
  correct: 'Correct.',
  partial: 'Almost there.',
  wrong: 'Try again.',
  notCaught: 'Didn’t catch that. Tap the mic to try again.',
};

/**
 * Result: the verdict on the latest take. Correct ends the question; partial, wrong and "didn't catch that"
 * keep the mic live for another try, with Reveal answer and Next (or Skip) below.
 */
export function ResultScreen({ n }: { n: number }) {
  const router = useRouter();
  const session = useSession();
  const record = session?.questions[n];
  const question = questions[n - 1];
  const total = question.keyPoints.length;
  const isLast = n === questions.length;
  // Worked out at the tap, so it follows the input mode the student is in by then.
  const nextRoute = () => (isLast ? '/results' : questionRoute(n + 1));

  const [sheet, setSheet] = useState<'none' | 'exit' | 'answer'>('none');
  const closeSheet = useCallback(() => setSheet('none'), []);

  // Remember this result; with no judged take (opened some other way), go back to the question.
  useEffect(() => {
    const saved = getSession()?.questions[n];
    if (!saved?.verdict) return router.replace(`/q/${n}`);
    rememberRoute(`/q/${n}/result`);
    const covered = saved.covered?.length ?? 0;
    announce(saved.verdict === 'notCaught' ? verdictWord.notCaught : `${verdictWord[saved.verdict]} You covered ${covered} of ${total} key ideas.`);
  }, [n, total, router]);

  if (!record?.verdict || !record.feedback) return null;
  const { verdict, feedback } = record;
  const covered = record.covered ?? [];

  const message =
    feedback.kind === 'correct'
      ? question.correct
      : feedback.kind === 'hint'
        ? fillHint(question.hints[feedback.keyPoint - 1], covered, total)
        : feedback.kind === 'nudge'
          ? nudge
          : undefined; // "didn't catch that": the card's own default line.

  // Ends the question with an outcome and its XP, once, then moves on.
  const finish = (outcome: 'needsPractice' | 'skipped') => {
    updateSession((s) => endQuestion(s, n, outcome));
    router.push(nextRoute());
  };

  const reveal = () => {
    updateSession((s) => {
      questionRecord(s, n).revealed = true;
    });
    setSheet('answer');
  };

  // Switching modes here keeps the student on this result; the retry control below changes to match.
  const setMode = (mode: 'voice' | 'keyboard') =>
    updateSession((s) => {
      s.inputMode = mode;
    });
  const typing = session?.inputMode === 'keyboard';

  const blocked = sheet !== 'none';
  const live = verdict !== 'correct';

  // The bottom bar for each state (SPEC.md › 7). Reveal answer is always on the left (decided 2026-10-05):
  // on a correct answer the left button is More info and Primary Next is on the right; on every other
  // verdict, including after two hints, Reveal answer stays Tertiary on the left.
  const bottomBar =
    verdict === 'correct' ? (
      <BottomCTA
        layout="Two button drawer"
        leftCTA="More info"
        rightCTA={isLast ? 'Finish' : 'Next'}
        onLeftClick={() => setSheet('answer')}
        onRightClick={() => router.push(nextRoute())}
      />
    ) : verdict === 'notCaught' ? (
      <BottomCTA
        layout="Two button drawer / Secondary"
        leftCTA="Reveal answer"
        rightCTA="Skip"
        onLeftClick={reveal}
        onRightClick={() => finish('skipped')}
      />
    ) : (
      <BottomCTA
        layout="Two button drawer / Secondary"
        leftCTA="Reveal answer"
        rightCTA="Next"
        onLeftClick={reveal}
        onRightClick={() => finish('needsPractice')}
      />
    );

  return (
    <Scaffold
      topNavigation={
        <div inert={blocked}>
          <AppBar progress={((n - 1) / questions.length) * 100} xp={session?.xp ?? 0} onClose={() => setSheet('exit')} />
        </div>
      }
      middleContent={
        <div className="result__content" inert={blocked}>
          <MiddleSection topic={topic} question={bold(question.prompt)} showIntro={false} />
          <AnswerCard state={cardState[verdict]} message={message} />
        </div>
      }
      bottomContent={
        <div className="result__answer" inert={blocked}>
          {live && !typing && (
            <>
              <TapToAnswer text={record.revealed ? 'Tap to try again' : 'Tap to dictate'} />
              <div className="result__mic">
                <div className="result__toggle">
                  <InputModeToggle inputMode="voice" micBlocked={false} onInputModeChange={(mode) => mode === 'keyboard' && setMode('keyboard')} />
                </div>
                <MicButton listeningState="idle" interactionState="ready" onClick={() => router.push(`/q/${n}/recording`)} />
              </div>
            </>
          )}
          {live && typing && (
            // In keyboard mode, the typing bar takes the mic's place (decided 2026-10-05): tapping it opens the
            // typing screen, ready to type. The toggle switches back to the mic here.
            <div className="result__typing">
              <InputModeToggle inputMode="keyboard" micBlocked={false} onInputModeChange={(mode) => mode === 'voice' && setMode('voice')} />
              <div className="result__bar-input" onFocusCapture={() => router.push(`/q/${n}/type?focus`)}>
                <ChatInput status="Inactive" showLeadingButton={false} showMic={false} />
              </div>
            </div>
          )}
          <div className="result__bar">{bottomBar}</div>
        </div>
      }
      showBottomSheetBackground={blocked}
      bottomSheetOnly={
        sheet === 'exit' ? (
          <ExitConfirm onKeepGoing={closeSheet} />
        ) : sheet === 'answer' ? (
          <AnswerSheet answer={question.answer} onClose={closeSheet} />
        ) : undefined
      }
    />
  );
}
