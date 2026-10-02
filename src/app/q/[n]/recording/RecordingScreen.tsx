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
import { ExitConfirm } from '../../ExitConfirm';
import '../../exitConfirm.css';
import './recording.css';

// Set once a load that opened on this route has been sent back to the question.
let sentBackOnLoad = false;

/** Dictating: the question stays on screen while the mic listens; no transcript, no toggle, no Skip. */
export function RecordingScreen({ n }: { n: number }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [hint, setHint] = useState('Listening…');
  const [hintFading, setHintFading] = useState(false);
  const keepGoing = useCallback(() => setLeaving(false), []);

  // "Listening…" first, then "Tap to submit…" once the student has had time to start speaking. The mic is
  // mocked, so this is a timer (motion.duration.listeningHint), not speech detection; only a tap stops it.
  // The old words fade out, then the new ones fade in; with reduced motion they just swap.
  useEffect(() => {
    // The build can rewrite the token's 3000ms as 3s, so read the unit too.
    const value = getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-listeningHint').trim();
    const delay = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
    const timer = setTimeout(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) setHint('Tap to submit…');
      else setHintFading(true);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  // Once "Listening…" has faded out, swap the words and fade back in.
  const onHintFaded = (e: React.TransitionEvent) => {
    if (!hintFading || e.propertyName !== 'opacity') return;
    setHint('Tap to submit…');
    setHintFading(false);
  };

  useEffect(() => {
    // Opened straight onto this route (a reload, or reopening the app here): the take is dropped and the
    // student goes back to the question. The browser remembers the first page it loaded, so this only
    // matches once per load; later taps on the mic record as usual.
    const first = performance.getEntriesByType('navigation')[0];
    if (!sentBackOnLoad && first && new URL(first.name).pathname === window.location.pathname) {
      sentBackOnLoad = true;
      router.replace(`/q/${n}`);
      return;
    }
    announce('Listening for your answer.');
  }, [n, router]);

  // The take isn't stored yet: that waits for the saved session (screen 5). Both taps replace this route,
  // so going back never lands on a recording that has ended.
  const stop = () => router.replace(`/q/${n}/thinking`);
  const cancel = () => {
    announce('Recording cancelled.');
    router.replace(`/q/${n}`);
  };

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          <AppBar progress={((n - 1) / questions.length) * 100} xp={0} onClose={() => setLeaving(true)} />
        </div>
      }
      middleContent={
        <div className="recording__content" inert={leaving}>
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={n === 1} />
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
