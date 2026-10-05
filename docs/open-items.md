# Open items

Everything still waiting on a decision or on content, in one place. Each item names the screen it blocks, by its number in SPEC.md's build order (flow order, 2026-09-30). When an item is decided, move the decision into SPEC.md and `docs/sprint-context.md`, and delete it here.

## Waiting on content

The designer supplies these, stored in a new file under `src/content/` (SPEC.md › How the mocked recall behaves).

- **The 5 questions,** from what the participants just studied, with their topic. Placeholders stand in until then (`src/content/questions.ts`).
- **For each question:** 2–4 key points, one hint per key point, a correct-feedback line, the More info / Reveal context, and a canned transcript for each verdict it can get. Placeholders stand in for all of these (`src/content/questions.ts`), and for the Results copy (`src/content/results.ts`).
- **The participant scripts:** a first-pass and a later-pass chain per question, and the role-play tasks that match them.
- **The `tour` reference script** used in SPEC.md › Verification.

## Waiting on a decision

### Before the first three screens

| # | Decision | Blocks |
|---|---|---|
| D1 | Does the splash get a close button, and where does it lead? Figma's frame has a top bar of loose layers; `AppBar` can't stand in because it always draws progress and XP. If it gets one: `ButtonIcon` Tertiary M with `XCloseIcon`. | 1 First-run splash |
| D7 | Is `AnswerCard` `Default` Figma's splash speech bubble (a `background/surface` box with radius 16 and a tail)? Checked side by side at build time. | 1 First-run splash |
| D9 | Page headings for screen readers. `TextBlock` doesn't choose a heading level, so no screen has a real `<h1>` to jump to. | All screens |
| D10 | `themeColor` in the page's `viewport`: leave it out, or read it from `tokens/tokens.json` (it can't be a CSS variable). | App shell |
| D11 | Which build step owns scaling the 390×844 design to the phone's width and growing `Scaffold`'s 48px top strip to the Dynamic Island's safe area. Neither shows in a 390×844 browser check; both are needed on the iPhone 17. | Device test |

### For later screens

| # | Decision | Blocks |
|---|---|---|
| D4 | Where a screen with no Figma frame gets reviewed: in the dev server at 390, or as an extra `Scaffold` story in Storybook. | 5 Entry link, 9 End screen |
| D8 | Mic skipped's small shadow under the mascot is a loose layer with no component: drop it, or add it to `MascotSlot` in Figma. | 11 Mic skipped |
| D13 | Mic skipped's body text: Figma uses Headline S, but `TextBlock` L draws its caption in Headline XS. Accept that, or change something in Figma. | 11 Mic skipped |

## Known limits until later screens exist

Not decisions, just things that won't work yet:

- None right now.
