# Sprint context

Voice-based active recall for Knowunity, a study app.
Web prototype styled as iOS: 390px, dark mode only.

**Concept:** Students speak a concept out loud and Knowie replies in text.

**Where it lives:** A study-plan step (early, and at the end for full review), plus "Explain out loud" in main chat.

## Decisions
- Voice/keyboard toggle on every question and answer screen, because switching input shouldn't break the flow.
- OS mic denied: keyboard mode, slashed mic, no micButton, mic side opens re-enable flow, because the mic can't work without permission.
- Primer declined: keyboard mode, mic still selectable, because permission can still be asked.
- "No thanks" on the confirm screen returns to the launching screen, because the student is never trapped.
- Processing copy is "Thinking...", because the wait should feel calm and literal.
- Answers show the verbatim transcript, because a paraphrase hides "misheard" vs. "wrong."
- Correct: "More info" + "Next question", because there's nothing to fix.
- Partial or wrong: "Reveal answer" + "Next question" with the mic live, because the student can retry or move on.
- "Didn't catch that": neutral tone, "Reveal answer" + "Skip", because the app misheard, not the student.
- Skip (before first attempt, or after "Didn't catch that") counts as skipped; "Next question" after partial or wrong counts as needs practice, because Results separate "didn't try" from "tried and missed."
- "Reveal answer" / "More info" open a bottom sheet (answer, context, X, no buttons), because the student reads, then retries or moves on.
- XP: full unaided, partial hinted, minimal revealed, unaided "say it back" earns some back; streak counts unaided passes only, because XP and streak are the mastery signal.
- Some session XP stays pending until the breakdown shows, because the reward should match the real result.
- Results: XP card, then concept breakdown, because reward and mistake review shouldn't mix.
- Score ring hidden at 0 correct, because results stay encouraging.
- XP card and breakdown copy change with how the student performed (tiers such as perfect, mixed, mostly skipped; more may be added), because feedback should be encouraging and honest about the result.

## Not building
- Real speech-to-text or AI judging (transcript and verdict hardcoded)
- Native iOS behavior
- Auto-endpointing (push-to-talk, explicit stop)
- Pause/resume within a take
- Tutoring or open conversation
