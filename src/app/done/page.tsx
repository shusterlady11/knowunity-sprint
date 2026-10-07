'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/button/Button';
import type { EndedBy } from '../../lib/session';
import { getSession, rememberRoute, reopenSession, useSession } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

// One message for each way in (SPEC.md › 9), split into a headline and the line under it.
const messages: Record<EndedBy, { title: string; caption: string }> = {
  finished: { title: 'Nice work.', caption: 'You’re done.' },
  left: { title: 'Progress saved.', caption: 'Come back any time.' },
  optedOut: { title: 'No problem.', caption: 'Maybe next time.' },
};

/**
 * End screen (SPEC.md › 9): Knowie and one message, chosen by how the student got here, which the button
 * that led here saved in the session (was D3). No Figma frame; composed like the other message screens.
 * A student who left gets "Keep going", back to their question; one who opted out gets "Go back", to Mic
 * skipped. Finishing is the end: nothing to tap (decided 2026-10-07).
 */
export default function DonePage() {
  const router = useRouter();
  const endedBy = useSession()?.endedBy ?? 'finished';

  const backTo = (route: string) => {
    reopenSession(route);
    router.push(route);
  };
  const keepGoing = () => backTo(getSession()?.route ?? '/q/1');

  // A finished or opted-out session reopens on this message; one the student left resumes where they were.
  useEffect(() => {
    if (getSession()?.endedBy !== 'left') rememberRoute('/done');
  }, []);

  const actions =
    endedBy === 'left' ? (
      <Button variant="Primary" size="L" CTA="Keep going" onClick={keepGoing} />
    ) : endedBy === 'optedOut' ? (
      <Button variant="Primary" size="L" CTA="Go back" onClick={() => backTo('/mic-off')} />
    ) : undefined;

  return (
    <MessageScreen
      expression="approving"
      title={messages[endedBy].title}
      caption={messages[endedBy].caption}
      actions={actions}
    />
  );
}
