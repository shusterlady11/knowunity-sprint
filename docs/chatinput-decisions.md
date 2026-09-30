# chatInput (type fallback) decisions

Figma: `chatInput` set, Mascot & components page (Chat frame), file 1fSfWxZSPoaFQ8Dg36EGXs. Decided 2026-09-30.

- Live component is `chatInput`. `Chat Input (legacy)` on Module 6 is Knowunity's original and must not be used.
- Typing route uses `showLeadingButton = false`.
- Text props: `placeholder` (Inactive, Typing, Loading), `answer` (Ready to send), `longAnswer` (Long input). Text follows Body M Regular, 18/26.
- Recording and Loading states stay in the component.
- Screen margins: 16px (Space/400) everywhere, per the platform constraints. A 12px inset was tried on question/answer screens and reverted for consistency; the brief takes precedence. Cards, toggleGroup and the chatInput field all sit at 16..374 on a 390 screen. Components should fill the width the Scaffold gives them rather than hard-coding 358.

## Build rules
- **Growth:** the bar grows upward from just above the keyboard, one line at a time, up to 6 lines of answer text (6 x 26px). Past that it stops growing and scrolls inside the field so the question stays visible. The keyboard never moves. Figma shows this as a static Long input on "keyboard open"; the scaffold can't reflow live.
- **Emptying the field:** deleting all text returns the bar to Typing (empty, caret, keyboard still up, no send button), and the toggleGroup row reappears above it: inputModeToggle to switch back to the mic, and Skip. While the field has text, that row is hidden. The screen goes back to Inactive and "keyboard option selected" only when the keyboard is dismissed.

## Still open
- What the mic inside the field does (way back to voice vs dictation). If the toggle is the way back to voice, the in-field mic may be redundant.
