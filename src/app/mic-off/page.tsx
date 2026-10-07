'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { MascotSlot } from '../../components/mascotSlot/MascotSlot';
import { BottomCTA } from '../../components/bottomCTA/BottomCTA';
import { HeadlineBlock } from '../../components/headlineBlock/HeadlineBlock';
import { endSession, rememberRoute, updateSession } from '../../lib/session';
import './micOff.css';

/**
 * Mic skipped (SPEC.md › 11), as in Figma's SPLASH-SKIP-MIC: after "Not now" on the mic primer, Knowie offers
 * to keep going by typing. Continue opens question 1 in keyboard mode, with the mic still selectable; No
 * thanks ends the session with the "opted out" message.
 */
export default function MicOffPage() {
  const router = useRouter();

  useEffect(() => rememberRoute('/mic-off'), []);

  const keepGoing = () => {
    updateSession((s) => {
      s.inputMode = 'keyboard';
    });
    router.push('/q/1/type');
  };

  const optOut = () => {
    endSession('optedOut');
    router.push('/done');
  };

  return (
    <Scaffold
      showTopNavSlot={false}
      middleContent={
        <div className="micOff__content">
          {/* No shadow under Knowie: Figma's is a loose layer, dropped (was D8). */}
          <MascotSlot size="3XL" expression="approving" />
          {/* HeadlineBlock doesn't choose a heading level, so the screen marks it as the page heading. */}
          <div role="heading" aria-level={1} className="micOff__heading">
            <HeadlineBlock
              title="Let’s switch it up."
              body="Your mic is off, so you have the option to keep learning without speaking out loud. Improving your comprehension with recall also works when you type!"
            />
          </div>
        </div>
      }
      bottomContent={
        <div className="micOff__bar">
          <BottomCTA layout="Two button no drawer" leftCTA="No thanks" rightCTA="Continue" onLeftClick={optOut} onRightClick={keepGoing} />
        </div>
      }
    />
  );
}
