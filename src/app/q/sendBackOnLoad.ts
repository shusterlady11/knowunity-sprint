'use client';

// Set once a load that opened mid-take has been sent back to its question.
let sentBackOnLoad = false;

/**
 * On the recording and thinking routes: opened straight onto the route (a reload, or reopening the app
 * there), the take is dropped and the student goes back to the question (SPEC.md › 4 and 6). The browser
 * remembers the first page it loaded, so this only matches once per load; later visits work as usual.
 *
 * Call it at the start of the screen's start-up effect, once the address has updated: it returns true when
 * it's sending the student back, and the screen should then skip its own start-up.
 */
export function sendBackOnLoad(n: number, replace: (route: string) => void): boolean {
  if (sentBackOnLoad) return false;
  const first = performance.getEntriesByType('navigation')[0];
  if (!first || new URL(first.name).pathname !== window.location.pathname) return false;
  sentBackOnLoad = true;
  replace(`/q/${n}`);
  return true;
}
