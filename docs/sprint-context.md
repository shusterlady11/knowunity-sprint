# Sprint Context

Voice-based active-recall feature for Knowunity, a study app.
mobile iOS only, Web prototype at 390px, dark mode only.

**Concept:** Students speak a concept aloud and Knowie replies in text. The loop keeps momentum: each question is its own discrete step, with a chance to review and retry before moving on, and a keyboard toggle covers can't-speak moments.

**Where it lives:** A study-plan stepping-stone (once early, once at the end for full review), plus an "explain out loud" option in main chat when a student names a topic.

**Current build target:** `docs/component-spec.md`.

## Decisions
- Persistent voice/text toggle, usable any time; text side opens a typing screen for the current question, because it keeps the student in flow instead of diverting them to another format.
- No mic, keyboard mode. OS-denied: micBlocked=true, micButton hidden, mic side opens re-enable-permission flow, because the mic can't work until permission is re-granted. Declined primer (Not now → confirm → Continue): micBlocked=false, mic side switches back to voice, because permission was never requested and can still be asked.
- "No thanks" on the confirm screen returns to the launching screen, because the student is never trapped.
- Processing copy is "Thinking...", because the Voice UX reference calls for a calm, literal wait state.
- Every completed answer shows the verbatim transcript, because a paraphrase hides "misheard" vs. "wrong."
- Recording glow is a separate component from the mic button, not a variant of it, because the two need to animate independently.
- Answer feedback splits into a status card and a separate CTA row, because the CTA's visibility must toggle independently of the result content.
- "Next question" stays hidden until the student reviews or reveals the answer, because no state represents "before click."
- Status pill gets a new tone variant, not the shared chips color variant.
- "Didn't catch that" uses a neutral tone, because it's the app mishearing, not the student being wrong.
- "Reveal answer" opens a full-screen scrollable overlay, because it's how a student who doesn't know the term sees it.
- XP scales by how it was earned (full unaided, partial hinted, minimal revealed; unaided "say it back" claws back part), because XP needs to double as the mastery signal, not a separate flourish. Streaks count unaided passes only, because a streak on every attempt wouldn't measure retrieval strength.
- Part of session XP stays pending until the results breakdown renders, because the reward should land with the real picture.
- Results come in two steps, XP/stat card then concept breakdown, because the reward and the mistake review shouldn't muddy each other.
- Breakdown copy is tiered (perfect, mixed, mostly-skipped); XP card copy is confirmed for a perfect run only.

## Not building
- Real speech-to-text or AI judging; transcript and verdict are hardcoded
- Native iOS behavior; this is a web app styled as iOS
- Auto-endpointing; push-to-talk with explicit stop only
- Pause/resume within one recording take
- Branching into tutoring or open conversation
