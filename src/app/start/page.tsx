'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { TextBlock } from '../../components/textBlock/TextBlock';
import { MascotSlot } from '../../components/mascotSlot/MascotSlot';
import { AnswerCard } from '../../components/answerCard/AnswerCard';
import { Button } from '../../components/button/Button';
import { SpeechBubbleTailIcon } from '../../icons/SpeechBubbleTailIcon';
import { defaultCode } from '../../content/scripts';
import { getSession, markSplashSeen, rememberRoute, startSession } from '../../lib/session';
import './start.css';

/** First-run splash (SPEC.md › 1): Knowie explains why answering out loud helps, then the mic primer. */
export default function StartPage() {
  const router = useRouter();

  // Shown once per phone: the entry link skips it from now on. Opened without the entry link, there's no
  // session yet, so one starts on the tour script, as the home address does, so what the student does from
  // here is remembered.
  useEffect(() => {
    markSplashSeen();
    if (!getSession()) startSession(defaultCode, '/start');
    rememberRoute('/start');
  }, []);

  return (
    <Scaffold
      // No top bar: the splash has no close or back button (was D1). "Let's go!" is the only way on.
      showTopNavSlot={false}
      middleContent={
        <div className="start__content">
          {/* TextBlock doesn't choose a heading level, so the screen marks its title as the page heading. */}
          <div role="heading" aria-level={1} className="start__heading">
            <TextBlock variant="L" showCaption={false} title="Now, let’s build some muscle memory." />
          </div>
          <div className="start__speaker">
            <div className="start__mascot">
              <MascotSlot size="2XL" expression="standby" />
            </div>
            <div className="start__bubble">
              {/* Built here: AnswerCard has no tail (docs/component-gaps.md). Decoration only. */}
              <SpeechBubbleTailIcon className="start__tail" />
              <AnswerCard
                state="Default"
                message="When you can explain a concept to someone else, not only do you strengthen your memory, but you will score higher on your tests!"
              />
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="start__actions">
          <Button variant="Primary" size="L" CTA="Let’s go!" onClick={() => router.push('/mic')} />
        </div>
      }
    />
  );
}
