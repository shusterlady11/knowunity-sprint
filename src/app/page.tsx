'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultCode } from '../content/scripts';
import { getSession, startSession } from '../lib/session';

// The app's home address (D5, decided 2026-10-02): resumes a session in progress, including one the student
// left, so progress is kept. A finished or opted-out session, or none, starts fresh at the first-run splash
// (decided 2026-10-07), on the same script if there was one, else the tour. Students come in through their
// entry link (/s/[code]) instead.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const saved = getSession();
    const ended = saved?.endedBy === 'finished' || saved?.endedBy === 'optedOut';
    const session = saved && !ended ? saved : startSession(saved?.code ?? defaultCode, '/start');
    router.replace(session.route);
  }, [router]);

  return null;
}
