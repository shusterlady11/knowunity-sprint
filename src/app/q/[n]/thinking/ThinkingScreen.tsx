'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { AnswerCard } from '../../../../components/answerCard/AnswerCard';
import { MicButton } from '../../../../components/micButton/MicButton';
import { LoadingDots } from '../../../../components/loadingDots/LoadingDots';
import { idkTranscript, questions, topic } from '../../../../content/questions';
import { bold } from '../../../../content/bold';
import { defaultCode, scripts } from '../../../../content/scripts';
import { combine, feedbackFor, judgeTake, verdictFor, xpFor, type Verdict } from '../../../../lib/recallEngine';
import { announce } from '../../../../lib/announcer';
import { durationMs } from '../../../../lib/motion';
import { getSession, questionRecord, updateSession, useSession } from '../../../../lib/session';
import { ExitConfirm } from '../../ExitConfirm';
import { sendBackOnLoad } from '../../sendBackOnLoad';
import '../../exitConfirm.css';
import './thinking.css';

/**
 * Processing: "Thinking..." for at least motion.duration.thinkingMin, then the result. A slow take shows
 * "Taking a moment…" at slowNotice and gives up as "didn't catch that" at slowTimeout. An "I don't know"
 * take counts as a skip and goes straight to the next question, with no result screen.
 */
export function ThinkingScreen({ n }: { n: number }) {
  const router = useRouter();
  const xp = useSession()?.xp ?? 0;
  const [leaving, setLeaving] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const isLast = n === questions.length;

  // Where to go once judged. Held while the exit confirm is open, so the screen doesn't change under it.
  const leavingRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const goTo = useCallback(
    (route: string) => {
      if (leavingRef.current) pendingRef.current = route;
      else router.replace(route);
    },
    [router],
  );
  const openExit = () => {
    leavingRef.current = true;
    setLeaving(true);
  };
  const keepGoing = useCallback(() => {
    leavingRef.current = false;
    setLeaving(false);
    if (pendingRef.current) router.replace(pendingRef.current);
  }, [router]);

  useEffect(() => {
    if (sendBackOnLoad(n, (route) => router.replace(route))) return;
    announce('Thinking.');

    const session = getSession();
    const script = scripts[session?.code ?? defaultCode] ?? scripts[defaultCode];
    // This take is the next one in the question's chain. It's only counted once judged, so a take dropped
    // by a reload doesn't use up a step of the script.
    const takeNumber = (session?.questions[n]?.takes ?? 0) + 1;
    const take = judgeTake(script, session?.pass ?? 1, n, takeNumber);

    // Saves the verdict and the card's feedback for the result screen, then goes there. Choosing the hint
    // here, once per take, means reopening the result doesn't use up another. A correct answer ends the
    // question, so its XP is awarded now and the counter shows it on the result.
    const keyPointCount = questions[n - 1].keyPoints.length;
    // The take's canned transcript, by how much this take covered on its own; nothing for a take that
    // wasn't caught, since nothing was heard.
    const transcriptFor = (): string | null => {
      if (take.kind === 'idk') return idkTranscript;
      if (take.kind !== 'points') return null;
      const own = verdictFor(take.points, keyPointCount);
      return questions[n - 1].transcripts[own === 'notCaught' ? 'wrong' : own];
    };
    const addTranscript = (record: { transcripts?: string[] }) => {
      const transcript = transcriptFor();
      if (transcript) record.transcripts = [...(record.transcripts ?? []), transcript];
    };
    const finish = (verdict: Verdict, covered: number[]) => {
      updateSession((s) => {
        const record = questionRecord(s, n);
        record.takes = takeNumber;
        addTranscript(record);
        record.covered = covered;
        record.verdict = verdict;
        const hintsUsed = record.hintsUsed ?? [];
        record.feedback = feedbackFor(verdict, covered, hintsUsed, keyPointCount);
        if (record.feedback.kind === 'hint') record.hintsUsed = [...hintsUsed, record.feedback.keyPoint];
        if (verdict === 'correct' && !record.outcome) {
          const revealed = record.revealed === true;
          record.outcome = revealed ? 'needsPractice' : 'correct';
          s.xp += xpFor({ kind: 'correct', firstTry: takeNumber === 1, revealed });
        }
      });
      goTo(`/q/${n}/result`);
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    if (take.kind === 'slow') {
      timers.push(
        setTimeout(() => {
          setMessage('Taking a moment…');
          announce('Taking a moment.');
        }, durationMs('--motion-duration-slowNotice')),
        setTimeout(() => finish('notCaught', session?.questions[n]?.covered ?? []), durationMs('--motion-duration-slowTimeout')),
      );
    } else {
      timers.push(
        setTimeout(() => {
          if (take.kind === 'idk') {
            // "I don't know" is treated as Skip: no result, straight to the next question.
            updateSession((s) => {
              const record = questionRecord(s, n);
              record.takes = takeNumber;
              addTranscript(record);
              record.outcome = 'skipped';
            });
            return goTo(isLast ? '/results' : `/q/${n + 1}`);
          }
          if (take.kind === 'notCaught') return finish('notCaught', session?.questions[n]?.covered ?? []);
          const covered = combine(session?.questions[n]?.covered ?? [], take);
          finish(verdictFor(covered, keyPointCount), covered);
        }, durationMs('--motion-duration-thinkingMin')),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [n, isLast, router, goTo]);

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          <AppBar progress={((n - 1) / questions.length) * 100} xp={xp} onClose={openExit} />
        </div>
      }
      middleContent={
        <div className="thinking__content" inert={leaving}>
          {/* No intro card once the student has answered, so Knowie's reply fits (decided 2026-10-04). */}
          <MiddleSection topic={topic} question={bold(questions[n - 1].prompt)} showIntro={false} />
          <AnswerCard state="processing" message={message} />
        </div>
      }
      bottomContent={
        <div className="thinking__answer" inert={leaving}>
          {/* Not tappable while Knowie judges the take; the dots show it's working. */}
          <MicButton listeningState="idle" interactionState="disabled" />
          <div className="thinking__dots">
            <LoadingDots />
          </div>
        </div>
      }
      showBottomSheetBackground={leaving}
      bottomSheetOnly={leaving ? <ExitConfirm onKeepGoing={keepGoing} /> : undefined}
    />
  );
}
