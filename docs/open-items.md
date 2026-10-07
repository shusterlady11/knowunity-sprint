# Open items

Everything still waiting on a decision or on content, in one place. Each item names the screen it blocks, by its number in SPEC.md's build order (flow order, 2026-09-30). When an item is decided, move the decision into SPEC.md and `docs/sprint-context.md`, and delete it here.

## Waiting on content

The designer supplies these, stored in a new file under `src/content/` (SPEC.md › How the mocked recall behaves).

- **The 5 questions,** from what the participants just studied, with their topic. Placeholders stand in until then (`src/content/questions.ts`).
- **For each question:** 2–4 key points, one hint per key point, a correct-feedback line, the More info / Reveal context, and a canned transcript for each verdict it can get. Placeholders stand in for all of these (`src/content/questions.ts`), and for the Results copy (`src/content/results.ts`).
- **The participant scripts:** a first-pass and a later-pass chain per question, and the role-play tasks that match them.
- **The `tour` reference script** used in SPEC.md › Verification.

## Waiting on a decision

None. All decisions are settled; see `docs/sprint-context.md` › Decisions.

## Known limits

Not decisions, just things that won't work yet:

- **Question screens have no page heading** for screen readers to jump to (Question, Dictating, Processing, Result, Typing). Left as is for the usability test, which is run with students looking at the screen; the announcer still reads every state change (was D9, 2026-10-07).
