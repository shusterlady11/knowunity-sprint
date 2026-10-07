'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { ToggleGroup } from '../../../../components/toggleGroup/ToggleGroup';
import { ChatInput } from '../../../../components/chatInput/ChatInput';
import { intro, questions, topic } from '../../../../content/questions';
import { bold } from '../../../../content/bold';
import { endQuestion, questionRecord, questionRoute, rememberRoute, updateSession, useSession, type Session } from '../../../../lib/session';
import { ExitConfirm } from '../../ExitConfirm';
import '../../exitConfirm.css';
import './type.css';

type Status = 'Inactive' | 'Typing' | 'Ready to send' | 'Long input';

/**
 * Typing: the keyboard way to answer, built around chatInput. The toggle row (back to voice, and Skip)
 * shows while the keyboard is down and hides while it's up. A sent answer goes to the same mock engine as
 * a spoken one, and its exact words become the take's transcript.
 */
export function TypeScreen({ n, startTyping }: { n: number; startTyping: boolean }) {
  const router = useRouter();
  const session = useSession();
  const [leaving, setLeaving] = useState(false);
  const keepGoing = useCallback(() => setLeaving(false), []);
  const answerRef = useRef<HTMLDivElement>(null);
  const isLast = n === questions.length;
  const showIntro = n === 1 && session !== null && session.introSeen !== true;

  // Remember the question: in keyboard mode, reopening it comes back here.
  useEffect(() => rememberRoute(`/q/${n}`), [n]);

  // Keep the bar above the iPhone keyboard. iOS doesn't shrink the page when the keyboard opens, so the bar
  // follows the visible area (visualViewport) up by the keyboard's height, and the page is kept from
  // scrolling so the question stays in view. Check this on the iPhone.
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const follow = () => {
      const keyboard = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      answerRef.current?.style.setProperty('--type-keyboard', `${keyboard}px`);
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    follow();
    viewport.addEventListener('resize', follow);
    viewport.addEventListener('scroll', follow);
    return () => {
      viewport.removeEventListener('resize', follow);
      viewport.removeEventListener('scroll', follow);
    };
  }, []);

  // Anything that starts or ends answering retires the welcome card for good.
  const change = (edit: (s: Session) => void) =>
    updateSession((s) => {
      if (n === 1) s.introSeen = true;
      edit(s);
    });

  const onStatusChange = (next: Status) => {
    if (next !== 'Inactive') change(() => {});
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    change((s) => {
      questionRecord(s, n).typed = text.trim();
    });
    router.push(`/q/${n}/thinking`);
  };

  const toVoice = () => {
    change((s) => {
      s.inputMode = 'voice';
    });
    router.push(`/q/${n}`);
  };

  const skip = () => {
    change((s) => endQuestion(s, n, 'skipped'));
    router.push(isLast ? '/results' : questionRoute(n + 1));
  };

  // The row shows only while the keyboard is down, whatever is in the field (decided 2026-10-06): with the
  // keyboard up it would sit on the question card, and with it down the student can always get back to voice
  // or skip. The keyboard is up while the field has focus.
  const [keyboardUp, setKeyboardUp] = useState(startTyping);
  const showRow = !keyboardUp;

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          <AppBar progress={((n - 1) / questions.length) * 100} xp={session?.xp ?? 0} onClose={() => setLeaving(true)} />
        </div>
      }
      middleContent={
        <div className="type__content" inert={leaving}>
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={showIntro} />
        </div>
      }
      bottomContent={
        <div
          ref={answerRef}
          className="type__answer"
          inert={leaving}
          onFocus={(e) => setKeyboardUp(e.target instanceof HTMLTextAreaElement)}
          onBlur={(e) => e.target instanceof HTMLTextAreaElement && setKeyboardUp(false)}
        >
          {showRow && (
            <ToggleGroup
              inputMode="keyboard"
              micBlocked={false}
              onInputModeChange={(mode) => mode === 'voice' && toVoice()}
              onSkip={skip}
            />
          )}
          <ChatInput status={startTyping ? 'Typing' : 'Inactive'} showLeadingButton={false} showMic={false} onSend={send} onStatusChange={onStatusChange} />
        </div>
      }
      showBottomSheetBackground={leaving}
      bottomSheetOnly={leaving ? <ExitConfirm onKeepGoing={keepGoing} /> : undefined}
    />
  );
}
