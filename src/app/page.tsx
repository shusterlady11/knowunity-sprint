'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultCode } from '../content/scripts';
import { getSession, startSession } from '../lib/session';

// The app's home address (D5, decided 2026-10-02): resumes a session in progress; with none, starts one on
// the tour script at the first-run splash. Students come in through their entry link (/s/[code]) instead.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession() ?? startSession(defaultCode, '/start');
    router.replace(session.route);
  }, [router]);

  return null;
}
