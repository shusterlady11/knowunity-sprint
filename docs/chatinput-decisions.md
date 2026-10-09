# chatInput (type fallback) decisions

Figma: `chatInput` set, Mascot & components page (Chat frame), file 1fSfWxZSPoaFQ8Dg36EGXs. Decided 2026-09-30.

- Live component is `chatInput`. `Chat Input (legacy)` on Module 6 is Knowunity's original and must not be used.
- Typing route uses `showLeadingButton = false`.
- Text props: `placeholder` (Inactive), `answer` (Ready to send, Loading), `longAnswer` (Long input). Text follows Body M Regular, 18/26.
- Recording and Loading states stay in the Figma component. Loading is built (2026-10-09); Recording is not.
- Screen margins: 16px (Space/400) everywhere, per the platform constraints. A 12px inset was tried on question/answer screens and reverted for consistency; the brief takes precedence. Cards, toggleGroup and the chatInput field all sit at 16..374 on a 390 screen. Components should fill the width the Scaffold gives them rather than hard-coding 358.

## Build rules
- **Growth:** the bar grows upward from just above the keyboard, one line at a time, up to 6 lines of answer text (6 x 26px). Past that it stops growing and scrolls inside the field so the question stays visible. The keyboard never moves. Figma shows this as a static Long input on "keyboard open"; the scaffold can't reflow live.
- **Emptying the field:** deleting all text returns the bar to Inactive (empty, no send button; the caret stays while the keyboard is up). The toggleGroup row follows the keyboard, not the field, as decided 2026-10-06.

## Decided later
- **The mic inside the field (D14, 2026-10-05):** hidden on the typing route with the code-only prop `showMic={false}`. The voice/keyboard toggle is the way back to voice, and there's no real mic for dictation. Figma's component still draws it.
- **Typing status removed (2026-10-09):** Typing looks the same as Inactive in Storybook, so `chatInput` has no Typing status. The typing screen puts the caret in the field itself when it opens from a tap.
- **Loading follows send (2026-10-09):** tapping send keeps the text, dims it (`text/placeholder`), and turns the loading icon where the send button was. Figma's Loading frame shows the placeholder instead; the sprint flow wins. The field stays read-only until the screen changes the bar's props.
