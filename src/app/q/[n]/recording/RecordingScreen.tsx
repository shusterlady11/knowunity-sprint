'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { TapToAnswer } from '../../../../components/tapToAnswer/TapToAnswer';
import { RecordingGlow } from '../../../../components/recordingGlow/RecordingGlow';
import { MicButton } from '../../../../components/micButton/MicButton';
import { ButtonIcon } from '../../../../components/buttonIcon/ButtonIcon';
import { XIcon } from '../../../../icons/XIcon';
import { intro, questions, topic } from '../../../../content/questions';
import { bold } from '../../../../content/bold';
import { announce } from '../../../../lib/announcer';
import { durationMs } from '../../../../lib/motion';
import { questionRecord, rememberRoute, updateSession, useSession } from '../../../../lib/session';
import { useQuestionEnter } from '../../../../lib/questionEnter';
import { ExitConfirm } from '../../ExitConfirm';
import { sendBackOnLoad } from '../../sendBackOnLoad';
import '../../exitConfirm.css';
import './recording.css';

/** Dictating: the question stays on screen while the mic listens; no transcript, no toggle, no Skip. */
export function RecordingScreen({ n }: { n: number }) {
  const router = useRouter();
  // The same question as the screen before, so it stays put; it rises in only when opened fresh.
  const { animateIn, markShown } = useQuestionEnter(n);
  const [leaving, setLeaving] = useState(false);
  const [hint, setHint] = useState('Listening…');
  const [hintFading, setHintFading] = useState(false);
  const session = useSession();
  const xp = session?.xp ?? 0;
  // The welcome card, if the student hasn't started answering before: it opens here still showing, then fades
  // while the question card slides up, once Knowie is listening (decided 2026-10-05).
  const showIntro = n === 1 && session !== null && session.introSeen !== true;
  const keepGoing = useCallback(() => setLeaving(false), []);

  // "Listening…" first, then "Tap to submit…" once the student has had time to start speaking. The mic is
  // mocked, so this is a timer (motion.duration.listeningHint), not speech detection; only a tap stops it.
  // The old words fade out, then the new ones fade in; with reduced motion they just swap.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) setHint('Tap to submit…');
      else setHintFading(true);
    }, durationMs('--motion-duration-listeningHint'));
    return () => clearTimeout(timer);
  }, []);

  // Once "Listening…" has faded out, swap the words and fade back in.
  const onHintFaded = (e: React.TransitionEvent) => {
    if (!hintFading || e.propertyName !== 'opacity') return;
    setHint('Tap to submit…');
    setHintFading(false);
  };

  useEffect(() => {
    if (sendBackOnLoad(n, (route) => router.replace(route))) return;
    markShown();
    // Saved as the question itself: reopening the app mid-take returns there.
    rememberRoute(`/q/${n}`);
    announce('Listening for your answer.');
    // Let the card draw once, then retire it, so it animates out rather than vanishing.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() =>
        updateSession((s) => {
          if (n === 1) s.introSeen = true;
        }),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [n, router, markShown]);

  // Stopping submits the take to the processing screen, which judges and counts it. Both taps replace this
  // route, so going back never lands on a recording that has ended.
  const stop = () => {
    // A spoken take: clear any typed text left from a dropped typed take, so it isn't used as this one's words.
    updateSession((s) => {
      delete questionRecord(s, n).typed;
    });
    router.replace(`/q/${n}/thinking`);
  };
  const cancel = () => {
    announce('Recording cancelled.');
    router.replace(`/q/${n}`);
  };

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          <AppBar progress={((n - 1) / questions.length) * 100} xp={xp} onClose={() => setLeaving(true)} />
        </div>
      }
      middleContent={
        <div className="recording__content" inert={leaving}>
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={showIntro} animateIn={animateIn} />
        </div>
      }
      bottomContent={
        <div className="recording__answer" inert={leaving}>
          <div className="recording__hint" data-fading={hintFading || undefined} onTransitionEnd={onHintFaded}>
            <TapToAnswer text={hint} />
          </div>
          <div className="recording__mic">
            <div className="recording__glow">
              <RecordingGlow />
            </div>
            <MicButton listeningState="listening" interactionState="ready" onClick={stop} />
          </div>
          <ButtonIcon variant="Secondary" size="S" icon={<XIcon />} aria-label="Cancel recording" onClick={cancel} />
        </div>
      }
      showBottomSheetBackground={leaving}
      bottomSheetOnly={leaving ? <ExitConfirm onKeepGoing={keepGoing} /> : undefined}
    />
  );
}
