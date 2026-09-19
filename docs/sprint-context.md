# Sprint Context

A 2.5-week design sprint building a voice-based active-recall feature for Knowunity, a study app.
Prototype scope: mobile iOS only, 390px, dark mode. The recall engine (STT, judging) is mocked.

**Committed concept:** Students speak a concept aloud and Knowie replies in text — active recall with positive reinforcement to drive engagement. The loop keeps momentum: each question is its own discrete step, with a chance to review and retry before moving on, and a keyboard toggle covers can't-speak moments.

**Where the recall step lives:** Launched from a stepping-stone in the study plan (once early, once at the end for full review), and separately from the main chat via an "explain out loud" option when a student names a topic.

**Current build target:** the six new components in `module-5-components-to-build.md`.

## Decisions logged

- Can't-speak fallback is its own full screen, not a bottom sheet, because it matches every other screen in the flow and avoids the design system's unconfirmed bottom-sheet pattern.
- Can't-speak fallback swaps to a quiz on the same terms instead of a typing fallback, because typing reintroduces the friction voice is meant to remove.
- The can't-talk flow has one entry path, not two, because the full-screen swap replaces the earlier two-trigger direction.
- Every completed answer shows the real spoken transcript, not a paraphrase, because a paraphrase erases the "app misheard me" vs. "I got it wrong" distinction.
- Recording glow is a separate component from the mic button, not a variant of it, because the two need to animate independently.
- Answer feedback splits into a status card and a separate CTA row, because the CTA's visibility must toggle independently of the result content.
- "Next question" is off by default and only appears after the student reviews or reveals the answer, because no state currently represents "before click."
- Status pill gets its own new tone variant instead of reusing chips' existing color variant, because that variant is shared with every other chips usage in the file.
- "Didn't catch that" is a neutral tone, not mapped to success or error, because it's the app mishearing, not the student being wrong.
- "Reveal answer" opens a full-screen, scrollable overlay with the answer, not an inline reveal, settling how a student who genuinely doesn't know a term sees it.
- XP amount scales with how the answer was earned (full for unaided, partial for hinted, minimal for revealed), because the total needs to double as the earned-mastery signal, not a separate flourish.
- A hinted or revealed answer followed by an unaided "say it back" claws back part of the lost XP, and the streak counter only increments on unaided passes, because a streak on every attempt wouldn't measure retrieval strength.
- Part of session XP confirms only once the results-screen breakdown renders, because overconfidence has to cost something before the reward feels final.

## Not building

- Real speech-to-text or AI judging, transcript and verdict are hardcoded
- Native iOS behavior, this is a web app styled to look like iOS at 390px
- Auto-endpointing of speech, push-to-talk with explicit stop only
- Branching into tutoring or open conversation if a student asks a question
- Tablet or desktop layouts
- RTL support
- Pause/resume within one recording take
