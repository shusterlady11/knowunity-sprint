# Module 5, Task 3: Components to build

Brief for Module 6. Pulled directly from the screens on the Module 5 core flow page, not from memory, everything below is grounded in what's actually built.

## New components, nothing in the system covers these yet

### Mic action button
The primary circular CTA a student taps to start or stop recording an answer.

**Used on:** Entry / session framing, Question / Asking, Question / Listening, both permission screens, the first-encounter primer.

**States:** idle (mic icon, ready to record), listening/recording (active, pairs with the Recording glow below), denied/slashed (mic-slash icon, used on the permission screens).

**Notes:** currently a hand-built frame on every screen with a different icon instance swapped in by hand. Needs one real component so hit target and sizing stay consistent, and needs a decision on whether it owns the Recording glow itself or composes with it as a separate layer.

### Answer feedback sheet
The bottom sheet that appears after a spoken answer is judged, carrying a status pill and up to two actions.

**Used on:** Answering / Correct, Partial, Wrong, Didn't catch it.

**States:** Correct, Partial, Wrong, Didn't catch it. Worth confirming per state which actions actually show, does Correct skip straight to "Next question" while a miss shows "Reveal answer" plus "Next question"?

**Notes:** this is the component that resolves a gap design-system.md already calls out itself, "bottomSheetOnly... empty on every example screen this system currently has, treat as unconfirmed." Needs a defined slot for the status pill and a defined action-button pair, not a one-off layout per screen.

### Status pill
Small colored label reporting how a spoken answer was judged.

**Used on:** inside the Answer feedback sheet.

**States:** Correct (success), Almost there/partial (its own tone, not a straight success), Try again/wrong (error), Didn't catch that (neutral, this is the app mishearing, not the student being wrong, shouldn't read as a failure state).

**Notes:** feedback/success and feedback/error tokens already exist and cover two of the four states. "Didn't catch that" doesn't map to either, flag that explicitly rather than forcing it onto success or error. Current label text is hand-set at 14px, which isn't on the font/size scale (15/sm is the nearest step), that needs correcting once this becomes a real component.

### Loading dots
Three-dot pulse shown while a spoken answer is being transcribed and judged.

**Used on:** Question / Processing.

**States:** one animated loop. Worth having a static frame too, something Module 6 can build from before motion gets layered in.

**Notes:** nothing like this exists in the current component index.

### Recording glow
The pulsing halo behind the mic while it's actively listening.

**Used on:** Question / Listening.

**States:** on, while recording. Off is just the idle screen with no glow, not a separate state to build.

**Notes:** this is motion, not a static layer, flag it for the code phase as much as for Figma.

### Expandable result row
A row in the results screen's Good Explanations / Needs Practice list that opens in place to show the transcript of that answer.

**Used on:** Results screen, both cards.

**States:** collapsed (check or x icon, term label, chevron pointing right) and expanded (same header, chevron rotated to point down, reveals a "What you said" label plus the transcript text for that answer).

**Behavior, not just a visual state:**
- Accordion, not independent toggles. Only one row open at a time, opening a row closes whatever else is open. This needs to be built as real interaction logic in Module 6, a static Figma mockup can't demonstrate it, it can only show one row open as a reference frame.
- List is scrollable. Both cards (Good Explanations and Needs Practice) need to exist on the screen at once, reachable by scrolling, not swapped out or cut off.
- Every collapsed row shows the same chevron affordance, success rows and error rows both. A row with no chevron reads as not tappable, which breaks the pattern.
- The detail content is the actual spoken-answer transcript, not an AI-generated summary. This matches the placement decision log: transcript shown on every completed answer so the student can tell "the app misheard me" from "I actually got it wrong." A paraphrase would defeat that.

**Notes:** doesn't map to design-system.md's `listItem` today, that only covers the plain chips-vs-listItem distinction, nothing about an expand/collapse state or a nested detail slot. This needs to be added as a new `listItem` variant, or a new component built on top of it, with a defined detail slot rather than a one-off layout per row.

## Not new, just not being used

Every one of these is a real button already in the system, Primary, Secondary, or Tertiary, but on the page right now each is a hand-built frame with hand-set 24px text (also off the type scale, nearest real step is 21/lg or 28/xl):

- "Turn on" / "Not now", permission modal
- "No thanks" / "Start quiz", the mic-denied screen (label on the second button still pending, "Exam plan" or "Save & leave" were the two options on the table)
- "Let's go!" / "Skip", the first-encounter primer

This isn't a Module 6 build item, it's cleanup before handoff, swap these for real `button` instances, and wrap any pair that sits together in a real `buttonGroup` instead of hand-placed spacing.
