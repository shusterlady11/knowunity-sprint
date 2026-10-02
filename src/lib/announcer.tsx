'use client';

import { useEffect, useState } from 'react';

// The one visually hidden live region that tells screen-reader users every state change in a full sentence
// (SPEC.md › Screen-reader announcements; docs/recordingglow-listening-spec.md §7). It sits in the root
// layout, so a message said just before a route change ("Recording cancelled.") is still heard after it.

let setMessage: ((message: string) => void) | null = null;

/** Says a sentence to screen-reader users. The same sentence twice in a row is said twice. */
export function announce(message: string) {
  setMessage?.('');
  requestAnimationFrame(() => setMessage?.(message));
}

export function Announcer() {
  const [message, setOwnMessage] = useState('');
  useEffect(() => {
    setMessage = setOwnMessage;
    return () => {
      setMessage = null;
    };
  }, []);
  return (
    <div className="announcer" role="status" aria-live="polite">
      {message}
    </div>
  );
}
