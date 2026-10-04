'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/button/Button';
import { getSession, hasSeenSplash, startSession } from '../../../lib/session';
import { MessageScreen } from '../../MessageScreen';

// Whether the page is running full screen from the Home Screen. Unknown (null) on the server.
const fullScreen = () =>
  matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const noSubscription = () => () => {};

/**
 * Opened from the Home Screen icon (full screen), the link goes straight on. Opened in Safari, it stays on
 * this address and shows how to add it to the Home Screen, so the icon keeps the code: Home Screen apps
 * don't share storage with Safari (decided 2026-10-02). "Continue in browser" is for testing on a computer.
 */
export function EntryScreen({ code }: { code: string }) {
  const router = useRouter();
  const isFullScreen = useSyncExternalStore(noSubscription, fullScreen, () => null);

  const goOn = () => {
    const session = getSession();
    // The same script in progress: carry on where the student left off.
    if (session?.code === code) return router.replace(session.route);
    // Otherwise a new session for this code: the splash on a phone's first visit, else question 1.
    const route = hasSeenSplash() ? '/q/1' : '/start';
    startSession(code, route);
    router.replace(route);
  };

  useEffect(() => {
    if (isFullScreen) goOn();
    // Goes on once the page knows it's running full screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen]);

  // Nothing to show while deciding, or while going on.
  if (isFullScreen !== false) return null;

  return (
    <MessageScreen
      expression="approving"
      title="Add to Home Screen"
      caption="Tap Share, then Add to Home Screen. Open Knowie from your Home Screen to start."
      actions={<Button variant="Secondary" size="L" CTA="Continue in browser" onClick={goOn} />}
    />
  );
}
