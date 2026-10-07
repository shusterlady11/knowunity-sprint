import { useCallback, useState } from 'react';

// The question the student last saw on screen. Kept in memory only, so after a reload nothing has been shown
// yet and the first question appears without rising in.
let lastShown: number | null = null;

/**
 * Whether question n should rise into place (middleSection's animateIn): only when moving from one question
 * to another (Next, Skip, "Review all"). The first question shown, behind the mic primer or after a reload,
 * just appears with its welcome card (decided 2026-10-07), and dictating, processing and the result, which
 * show the same question again, don't move. Decided once, when the screen opens.
 *
 * Call markShown() in an effect once the question is really on screen. A screen that sends the student
 * straight on to another route (the question screen in keyboard mode) skips it, so the screen they land on
 * still rises in.
 */
export function useQuestionEnter(n: number) {
  const [animateIn] = useState(() => lastShown !== null && lastShown !== n);
  const markShown = useCallback(() => {
    lastShown = n;
  }, [n]);
  return { animateIn, markShown };
}
