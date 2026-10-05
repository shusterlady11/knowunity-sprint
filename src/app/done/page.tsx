'use client';

import { useEffect } from 'react';
import type { EndedBy } from '../../lib/session';
import { getSession, rememberRoute, useSession } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

// One message for each way in (SPEC.md › 9), split into a headline and the line under it.
const messages: Record<EndedBy, { title: string; caption: string }> = {
  finished: { title: 'Nice work.', caption: 'You’re done.' },
  left: { title: 'Progress saved.', caption: 'Come back any time.' },
  optedOut: { title: 'No problem.', caption: 'Maybe next time.' },
};

/**
 * End screen (SPEC.md › 9): Knowie and one message, chosen by how the student got here, which the button
 * that led here saved in the session (was D3). Nothing to tap: the session is over, and the moderator resets
 * from /reset. No Figma frame; composed like the other message screens.
 */
export default function DonePage() {
  const endedBy = useSession()?.endedBy ?? 'finished';

  // A finished or opted-out session reopens on this message; one the student left resumes where they were.
  useEffect(() => {
    if (getSession()?.endedBy !== 'left') rememberRoute('/done');
  }, []);

  return <MessageScreen expression="approving" title={messages[endedBy].title} caption={messages[endedBy].caption} />;
}
