/**
 * Moves focus without drawing the focus ring. Sheets move focus in when they open and back when they close,
 * so screen readers and keyboards follow, but Safari would otherwise ring the button after a plain tap. The
 * ring still shows as soon as a keyboard user presses Tab. `focusVisible` isn't in TypeScript's DOM types yet.
 */
export function focusQuietly(element: HTMLElement | null | undefined) {
  element?.focus({ focusVisible: false } as FocusOptions);
}
