'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { MascotSlot } from '../../components/mascotSlot/MascotSlot';
import { BottomCTA } from '../../components/bottomCTA/BottomCTA';
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
          {/* Built here: Figma's text is loose layers, a Headline L title and a Headline S line Space/200 apart,
              which no TextBlock size matches (docs/component-gaps.md). */}
          <div className="micOff__text">
            <h1 className="micOff__title">Let’s switch it up.</h1>
            <p className="micOff__body">
              Your mic is off, so you have the option to keep learning without speaking out loud. Improving your
              comprehension with recall also works when you type!
            </p>
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
