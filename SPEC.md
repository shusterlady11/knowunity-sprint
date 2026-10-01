# Voice recall prototype: build spec

**This prototype is the Next.js app in this repo** (Next 16.3.5, App Router, routes under `src/app/`). Every screen is a page with its own route, and the student reaches each one by tapping, never by typing an address. Storybook (`npm run storybook`) stays the component catalog: screens are put together from the components in `src/components/`, and every component and variant named below is one that Storybook documents.

Decisions behind this spec are logged in `docs/sprint-context.md`. Rules for building it are in `CLAUDE.md`, `docs/design-system.md` and `docs/platform-constraints.md`. The screen designs are in the Figma file "Yummy__Knowie Design System (Copy)" (key `1fSfWxZSPoaFQ8Dg36EGXs`), on the page "Core flow for Claude Code". That file is read-only for the build. Anything still undecided is listed under [Open](#open), not settled here.

**Terms used below:**
- **Take:** one recording, or one typed answer, for a question.
- **Key points:** the 2–4 ideas a good answer to a question covers.
- **Verdict:** correct, partial, wrong or "didn't catch that".
- **Script:** the moderator's plan for what each take covers.

## What we're building

A voice active-recall session for a usability test: a student explains 5 concepts out loud, and Knowie answers in text with a verdict, a hint or the answer.
Real students on real iPhones use it. The recall engine is mocked and follows a script the moderator picks for each participant.

## Screen list, in build order (flow order)

Each screen is built only after the screen that leads to it, so every button goes somewhere real when it's tapped (decided 2026-09-30).

| # | Screen | Route | File (new unless noted) | Figma frame(s) on "Core flow for Claude Code" |
|---|---|---|---|---|
| 1 | First-run splash | `/start` | `src/app/start/page.tsx` | SPLASH-FIRST-TIME |
| 2 | Mic primer | `/mic` | `src/app/mic/page.tsx` | PERMISSION-MIC |
| 3 | Question | `/q/[n]` | `src/app/q/[n]/page.tsx` | QUESTION / activeState micOn, Lastquestion / activeState |
| 4 | Dictating | `/q/[n]/recording` | `src/app/q/[n]/recording/page.tsx` | Question / listeningState |
| 5 | Entry link and reset | `/s/[code]`, `/reset` | `src/app/s/[code]/page.tsx`, `src/app/reset/page.tsx` | none |
| 6 | Processing | `/q/[n]/thinking` | `src/app/q/[n]/thinking/page.tsx` | Question / processingState |
| 7 | Result | `/q/[n]/result` | `src/app/q/[n]/result/page.tsx` | Answering / correctState (+ finish), partialState, wrongState, notCaughtState, Reveal answer |
| 8 | Results | `/results` | `src/app/results/page.tsx` | Results perfect, Results partial, Results needs improvement |
| 9 | End screen | `/done` | `src/app/done/page.tsx` | none (composed from existing components) |
| 10 | Typing | `/q/[n]/type` | `src/app/q/[n]/type/page.tsx` | Question / activeState keyboard option selected, keyboard open |
| 11 | Mic skipped | `/mic-off` | `src/app/mic-off/page.tsx` | SPLASH-SKIP-MIC |

`[n]` is the question number, 1–5. `src/app/page.tsx` (still the create-next-app placeholder) and `src/app/layout.tsx` get replaced as part of the first screen built, the first-run splash.

**Every screen:**
- **Built on `Scaffold`** (`src/components/scaffold/`), using its slots `topNavigation`, `middleContent`, `bottomContent` and `bottomSheetOnly`.
- **Knowie's expression** is `standby` unless a screen says otherwise, as in Figma.
- **Sheets are overlays on a route, not routes of their own.** That covers the exit confirm, Reveal answer and More info.
- **Centered content sits 24px above center:** on screens whose middle content is a centered block (headline, Knowie, text), the block sits 24px higher than the true middle of `middleContent` (decided 2026-10-01, on the first-run splash). Applies to the End screen and Mic skipped.
- **Bottom buttons:** a full-width button in `bottomContent` sits 16px from each side, lining up with the cards above it, and 24px from the bottom edge (`Scaffold`'s 16px plus 8px), even where a Figma frame insets it differently (decided 2026-10-01).
- **Every button links to its real route from the start,** even when that screen isn't built yet. Until it is, the screen that links to it counts as unfinished; nothing is sent to a temporary stand-in (decided 2026-09-30).

**Exit confirm (on every `/q/...` route).** The close `ButtonIcon` in `AppBar` opens the confirm "Leave? Your progress is saved." It's composed from existing components and reviewed in Storybook:
- `BottomSheet` in `Scaffold`'s `bottomSheetOnly` slot, with `showBottomSheetBackground`
- `TextBlock` in its `middleSection`
- `ButtonGroup` Vertical L in its `bottomSection`, holding two `Button`s

It follows the same pattern as the Storybook story "BottomSheet › Mic permission (Default, with buttons)".

| Action | Leads to |
|---|---|
| Keep going | closes the sheet, stays on the same route |
| Leave | `/done` |

## Screens

### 1. First-run splash: `/start`

- **States:** one. It shows once per phone; later visits skip it (see Mocked recall › Storage).
- **Components** (as in the Figma frame SPLASH-FIRST-TIME):
  - `Scaffold`
  - `TextBlock` for the headline "Now, let's build some muscle memory."
  - `MascotSlot` 2XL, `standby`
  - a speech bubble holding the body text "When you can explain a concept to someone else…". In Figma it's loose layers (a `background/surface` box with radius 16, plus a tail). `AnswerCard` `Default` may cover it; this is checked side by side at build time (`docs/open-items.md`, D7).
  - `Button` Primary L "Let's go!"
- **Top navigation:** Figma's frame has a top bar built from loose layers: an icon button on the left and a hidden Skip. `AppBar` can't stand in, since it always draws progress and XP. Whether the splash gets a close button, and where it leads, is D1 in `docs/open-items.md`.
- **Actions:**

| Action | Leads to |
|---|---|
| "Let's go!" | `/mic` |

### 2. Mic primer: `/mic`

- **States:** one. The question screen sits behind a scrim, with a sheet over it.
- **Components:**
  - `Scaffold` with `showBottomSheetBackground`
  - `BottomSheet` M holding `BottomSheetAppBar` Default, `MascotSlot` 3XL `approving`, and `ButtonGroup` Vertical L with two `Button`s
- **Reference:** the Storybook story "Scaffold › Mic permission (sheet over scrim)".
- **Actions:**

| Action | Leads to |
|---|---|
| Turn on | `/q/1`, voice mode. No browser prompt appears: the mic is mocked. |
| Not now | `/mic-off` |

### 3. Question: `/q/[n]`

- **States:**
  - Ready to answer by voice.
  - `ProgressIndicator` shows questions finished: 0 on question 1, 20 on question 2, up to 80 on question 5. Each pass starts again at 0.
  - The screen opens in whichever input mode the student last used, voice or keyboard. A student in keyboard mode lands on `/q/[n]/type` instead.
- **Components:**
  - `AppBar` (close `ButtonIcon`, `ProgressIndicator`, `XpCounter`)
  - `TopicPill`
  - `MascotSlot` 2XL
  - `AnswerCard` `question`
  - `MicButton` `idle` / `ready`
  - `ToggleGroup` `voice`, `micBlocked=false`
  - `Button` Tertiary S "Skip"
- **Actions:**

| Action | Leads to |
|---|---|
| Tap mic | `/q/[n]/recording` |
| Toggle to keyboard | `/q/[n]/type` |
| Skip | counts as skipped, then `/q/[n+1]`, or `/results` after the last question |
| Close X | exit confirm sheet |

### 4. Dictating: `/q/[n]/recording`

- **States:** one: listening. The student sees no transcript while speaking.
- **Components:**
  - `AppBar`, `TopicPill`, `MascotSlot` 2XL, `AnswerCard` `question`
  - `RecordingGlow`, breathing, with no ripples and without the two outline rings (see Mocked recall › recordingGlow in this build)
  - `MicButton` `listening` / `ready`
  - `ButtonIcon` Secondary S with `src/icons/XIcon.tsx`, labelled "Cancel recording" for screen readers
  - `TapToAnswer` with the text "Tap to submit"
  - No toggle and no Skip, as in Figma.
- **Actions:**

| Action | Leads to |
|---|---|
| Tap mic (stop) | submits the take, then `/q/[n]/thinking` |
| Cancel X | throws the take away, then `/q/[n]` |
| Close X | exit confirm sheet |
| Reopening the app on this route | `/q/[n]`; the take is dropped |

### 5. Entry link and reset: `/s/[code]`, `/reset`

- **`/s/[code]`** is the link the moderator sends. The code (e.g. `k7`) is meaningless to the student and selects one stored script (see Mocked recall). It then goes to:

| Situation | Leads to |
|---|---|
| A session is already in progress | wherever the student left off |
| First visit on this phone | `/start` |
| Otherwise | `/q/1` |

- **Home Screen:** the student adds this page to their Home Screen. The saved icon has to open `/s/[code]` with its code. On iOS, Home Screen web apps don't share storage with Safari, so the code can't be passed along any other way.
- **`/reset`** clears the saved session and the "splash seen" flag between participants. It's reached by typing the address and never appears in the student's flow.
- **Full-screen mode:** an app manifest (`src/app/manifest.ts`, the Next.js file convention) and the page metadata make the Home Screen icon open full screen, with no Safari toolbars.

### 6. Processing: `/q/[n]/thinking`

- **States:**
  - "Thinking...", for at least 1.2s.
  - "Taking a moment…", from ~4s, only for a `slow` take.
  - Fallback at ~10s: goes to the result as "didn't catch that".

  The text appears inside `AnswerCard` `processing`, which shows "Thinking..." by default (Figma's "Processing message" layer). "Taking a moment…" is passed as its `message`.
- **Components:**
  - `AppBar`, `TopicPill`, `MascotSlot` 2XL
  - `AnswerCard` `question` + `AnswerCard` `processing`
  - `LoadingDots`
  - `MicButton` `idle` / `disabled`
- **Actions:**

| Action | Leads to |
|---|---|
| Close X | exit confirm sheet |
| None: this screen moves on by itself | `/q/[n]/result` when the mock's verdict is ready |
| Reopening the app on this route | `/q/[n]`; the take is dropped |

### 7. Result: `/q/[n]/result`

**States, one per verdict.** Each shows `AnswerCard` `question` above the answer card.

| Verdict | Answer card | Pill | Bottom actions | Mic |
|---|---|---|---|---|
| Correct | `answer-correct` | `StatusPill` `correct` | `BottomCTA` "Two button drawer": Secondary "More info", Primary "Next" ("Finish" on the last question) | none, and no voice/keyboard toggle: there's nothing left to answer |
| Partial | `answer-partial` | `StatusPill` `partial` | `BottomCTA` "Two button drawer / Secondary": Tertiary "Reveal answer", Secondary "Next" | live: `MicButton` `idle` / `ready` + `InputModeToggle` `voice` |
| Wrong | `answer-error` | `StatusPill` `wrong` | same as Partial | live |
| Partial or wrong, after both hints are used | as above | as above | `BottomCTA` "Two button drawer": Primary "Reveal answer", Secondary "Next" | live |
| Didn't catch that | `answer-notcaught` | `StatusPill` `notCaught` | Tertiary "Reveal answer", Secondary "Skip" | live |

**The answer card shows Knowie's feedback, passed as `AnswerCard`'s `message`,** as in Figma's answerCard variants. No component change is needed.

| Verdict | Card text |
|---|---|
| Correct | that question's correct feedback, from the content |
| Partial or wrong | the next unused hint. Its copy includes the covered count, e.g. "You've got 2 of 3 key ideas. Think about…" |
| Partial or wrong, after both hints are used | a fixed nudge toward Reveal, the same for every question: "You're close. Want to see the full answer?" |
| Didn't catch that | the component's default, "I couldn't understand that take." |

**The student's transcript isn't shown on this screen.** It appears in the Results rows (screen 8), including exactly what a typed take said.

**Sheets.** "Reveal answer" and "More info" open a `BottomSheet` M with `BottomSheetAppBar` `dismissOnly`. The sheet holds the answer and context, an X, and no buttons. Closing it returns to the same result.

**Actions:**

| Action | Leads to |
|---|---|
| Tap mic (partial, wrong, didn't catch that) | `/q/[n]/recording` to retry. The next take is judged together with the earlier ones. |
| Toggle to keyboard | `/q/[n]/type` |
| Next after a correct | `/q/[n+1]`, or `/results` after the last question |
| Next after a partial or wrong, or after a reveal | counts as needs practice (1 XP), then the next question |
| Finish | `/results` |
| Skip (didn't catch that) | counts as skipped, then the next question |
| Reveal answer / More info | the sheet |
| Close X | exit confirm sheet |

### 8. Results: `/results`

- **States:**
  - Perfect: every concept correct.
  - Mixed.
  - Mostly skipped.

  The copy changes with each state. Results show only the latest pass.
- **Components:**
  - `ProgressMeter` score 1–5. It's hidden when nothing is correct.
  - `ResultsSummary` `good-explanations`, `needs-practice` and `skipped-questions`
  - `ExpandableResultRow`, with tone `success`, `error` or `neutral`. A row's transcript is every take for that concept, joined: the canned transcript for a spoken take, and exactly what was typed for a typed one. This is the only place the student sees their transcript.
  - `BottomCTA` "Two button drawer": Secondary "Review all", Primary "Continue"
  - No `AppBar`, as in Figma.
- **Actions:**

| Action | Leads to |
|---|---|
| Review all | starts a new pass at `/q/1` with all 5 questions. XP earned so far carries over; the new pass's Results replace the old ones. |
| Continue | `/done`, "finished" message |
| Expand a row | shows that concept's takes |

### 9. End screen: `/done`

- **States:** one message for each way in:

  | Arrived by | Message |
  |---|---|
  | Finishing (Results → Continue) | "Nice work. You're done." |
  | Leaving mid-session (exit confirm → Leave) | "Progress saved. Come back any time." |
  | Opting out (`/mic-off` → No thanks) | "No problem. Maybe next time." |

- **Components:**
  - `Scaffold` with no top navigation
  - `MascotSlot`, `approving`
  - `TextBlock`
- **Student actions:** none. The session is over, and the moderator resets from `/reset`.

### 10. Typing: `/q/[n]/type`

Built around `chatInput`, a new Storybook component made from the Figma set `chatInput` (16075:17758, "Mascot & components" page). The typing route uses `showLeadingButton={false}`. Don't use the "Chat Input (legacy)" set on "Module 6 component work". Its rules are in `docs/chatinput-decisions.md` and the Figma set's description.

- **States** (`chatInput` `Status`, plus what surrounds it):

| State | Keyboard | `chatInput` | Above the bar |
|---|---|---|---|
| Keyboard option selected | down | `Inactive`, with its placeholder | `ToggleGroup` `keyboard` (`micBlocked=false`) + `Button` Tertiary S "Skip" |
| Typing, field empty | up | `Typing`: a caret, no send button | the same `ToggleGroup` + Skip row |
| Ready to send | up | `Ready to send`: text, with a send `ButtonIcon` Primary S | nothing: the row is hidden while the field has text |
| Long input | up | `Long input`: grows upward one line (26px) at a time, up to 6 lines, then scrolls inside the field | nothing |

  - **Emptying the field:** deleting all the text goes back to Typing, and the row reappears.
  - **Dismissing the keyboard:** only this returns the screen to "Keyboard option selected".
  - **The keyboard never moves,** and the question above stays visible.
  - **Unused on this route:** `chatInput`'s `Loading` and `Recording` states. The screen moves to `/q/[n]/thinking` on send, and there's no real mic.

- **Other components:** `AppBar`, `TopicPill`, `MascotSlot` 2XL, `AnswerCard` `question`. `TapToAnswer` is no longer on this screen; `chatInput`'s placeholder replaces it.
- **Keeping the bar above the keyboard:** this has to be done by hand. On iOS, the page's `100dvh` doesn't shrink when the keyboard opens, so a bar pinned to the bottom of `Scaffold` would sit behind the keyboard. The page has to follow the visible area (the `visualViewport` API) and move the bar up. Check it on the iPhone, not just in a desktop browser.
- **Width:** `chatInput` fills the width `Scaffold` gives it, as `AnswerCard` and `ToggleGroup` already do (`width: 100%`), with no hard-coded 358px. Screen margins stay 16px everywhere (`docs/platform-constraints.md`).
- **Actions:**

| Action | Leads to |
|---|---|
| Send | `/q/[n]/thinking`. The typed answer goes to the same mock as a spoken one. |
| `InputModeToggle` to voice (field empty, or keyboard down) | `/q/[n]`. Voice becomes the mode for later questions. |
| Skip (field empty, or keyboard down) | counts as skipped, then the next question |
| Dismiss the keyboard | "Keyboard option selected" |
| Close X | exit confirm sheet |

### 11. Mic skipped: `/mic-off`

- **States:** one: "Let's switch it up. Your mic is off…"
- **Components:**
  - `Scaffold` with no top navigation
  - `MascotSlot` 3XL, `approving`
  - `TextBlock`
  - `BottomCTA` layout "Two button no drawer": `Button` Secondary L "No thanks", `Button` Primary L "Continue"
- **Actions:**

| Action | Leads to |
|---|---|
| Continue | `/q/1/type` (keyboard mode, mic still selectable) |
| No thanks | `/done`, "opted out" message. It stands in for the launching screen the test doesn't have. |

## Out of scope

- **The engine:**
  - real speech-to-text and AI judging (deferred, estimated at 3–5 days; the mock is built so a real engine can replace it)
  - any real microphone use: no browser mic prompt, and no voice-driven ripples in `RecordingGlow`
- **Rewards:**
  - the XP card: its stats aren't a Figma component yet
  - "Say it back"
  - streaks
- **Recording behaviour:**
  - auto-endpointing
  - pause/resume within a take
  - tutoring: Knowie never answers a question back
- **Edge cases:**
  - switching language mid-answer
  - mic busy with another app
  - network loss: the mock runs on the phone
- **Records:** logging or analytics. The test relies on screen share and notes.
- **Devices and platforms:**
  - tablet, desktop and RTL layouts
  - native iOS APIs: haptics, permission sheets, navigation transitions
  - layouts that stretch: other iPhone widths scale the 390 design instead
- **The rest of the recordingGlow spec** (`docs/recordingglow-listening-spec.md`): ripples and a real mic level.
- **A results-level Try again round.** Retrying happens on a question, by tapping the mic after a partial or wrong.
- **Pending XP.** `XpCounter` counts up as XP is earned; nothing is held back until Results.

## Maybe later

- **Entry point screen.** The screen a student launches the session from. The design brief names two places: a stepping-stone in the study plan (a light pass early, a fuller pass at the end of the section) and an "Explain out loud" option in the main chat. This test starts from the moderator's link instead (`/s/[code]` → `/start`). If it's added, it comes before the first-run splash, and it becomes the "launching screen" that "No thanks" on `/mic-off` returns to (today that goes to `/done`). Existing Figma work to start from: the "Entry points" section on the "✨ Example Screens" page, and the "Entry / session framing" frames on the "Strategy: Research • Inspo • User Flows" page.

## How the mocked recall behaves

**Content** (supplied by the designer, stored in a new file under `src/content/`):
- 5 questions from what the participants just studied.
- For each question: 2–4 key points, one pre-written hint per key point (its copy can include the covered count, filled in by the engine), a correct-feedback line, the "More info" / Reveal context, and a canned transcript for each verdict it can get (shown in Results).

**Scripts** (new, stored with the content; the code in `/s/[code]` picks one):
- **Each question gets its own chain of takes.** Each take lists the key points it covers, for example `q1: 1,2 > 3`.
- **There are also special takes:**
  - `notCaught`: didn't catch that
  - `idk`: "I don't know". It's treated as Skip: no result screen, straight to the next question.
  - `slow`: a late verdict
- **Each script has two chains per question: one for the first pass and one for every later pass** (started by "Review all"), so role-play tasks can differ between passes.
- **A question's chain only affects that question.** Takes left over when the student moves on are dropped. Takes beyond the plan cover nothing new.
- **The moderator gives each participant role-play tasks that match their script,** such as "answer this one fully" or "leave something out", so the verdicts make sense to them. Participants are told beforehand that the transcript text is a placeholder.

**The engine** (new, `src/lib/recallEngine/`) is one piece with a fake setting. Given a take, it returns which key points that take covered, the same shape a real engine would return. Everything else is worked out from that:

- **Verdict from combined coverage** across all of this question's takes: all key points covered is correct, some is partial, none is wrong.
- **Covered count:** "N of M key ideas", filled into the hint's copy.
- **Hints:**
  - A partial or wrong shows the next unused hint, in key-point order.
  - After 2 hints, "Reveal answer" becomes the primary button, the card shows the fixed nudge, and the mic stays live.
- **Timing:**
  - "Thinking..." lasts at least 1.2s.
  - A `slow` take shows "Taking a moment…" at ~4s and becomes "didn't catch that" at ~10s.
- **XP:**

  | Outcome | XP |
  |---|---|
  | First-try correct | 10 |
  | Correct after a hint or retry | 5 |
  | Revealed, including a correct retry after a reveal | 1 |
  | Needs practice (Next after a partial or wrong) | 1 |
  | Skipped | 0 |

  XP carries over between passes. `XpCounter` shows it as it's earned.
- **Results groups:**

  | Group | What lands there |
  |---|---|
  | Good explanations | correct, at any attempt |
  | Needs practice | Next tapped after a partial or wrong, and any concept whose answer was revealed |
  | Skipped | Skip, `idk`, or Skip after "didn't catch that" |

**Screen-reader announcements.** One visually hidden live region (the pattern in `docs/recordingglow-listening-spec.md` §7) announces every state change in a full sentence:
- "Listening for your answer."
- "Recording cancelled."
- "Thinking."
- "Taking a moment."
- each verdict with its covered count, e.g. "Partial. You covered 2 of 3 key ideas."

**recordingGlow in this build.** Only the two filled circles show, and they breathe; the two outline rings are removed. The breathing follows `docs/recordingglow-listening-spec.md` §3:
- a 3400ms loop that rises for the first 25% and falls for the rest
- core: scale 0.94–1.1, opacity 0.5–0.88
- halo: scale 0.92–1.12, opacity 0.3–0.56

The blur values (20px halo, 2px core) are treated as part of the animation, so they live with the timing in `tokens/motion.json`, not in Figma. Under reduced motion, the circles hold still at opacity 0.75 (core) and 0.42 (halo). The Figma component doesn't have to match the animation.

**Input mode.** Voice or keyboard carries over to the next question until the student switches back.

**Storage.** The session is saved on the phone:
- the script code
- the current route
- every take
- verdicts, hints used and XP
- the input mode and the pass number

Reopening the app resumes where the student was, except mid-take: on `/recording` or `/thinking` it returns to `/q/[n]` and drops that take. `/reset` clears the session.

**Screen size.** The 390×844 design scales to the phone's width. The first remote participant has an iPhone 17 (402×874), where it scales to about 103%, or about 870 tall. `Scaffold`'s top strip for the status bar is fixed at 48px (`src/components/scaffold/scaffold.css`). It must grow to the phone's safe area when that's larger, which it is on Dynamic Island phones. The bottom content must stay clear of the home bar.

## Verification

### The five-minute check

Run this after any change. It should take about five minutes, most of it the walkthrough.

**1. Automated (about 1 minute).** These must pass:
- `npm run lint`
- `npm run build`
- the Storybook component tests
- the recall engine's unit tests in `src/lib/recallEngine/`. They cover verdicts from coverage, combined takes, leftover and extra takes, hint order and the 2-hint limit, `notCaught`, `slow`, `idk`, first-pass and later-pass chains, and every XP outcome.

**2. Walkthrough with the `tour` script (about 4 minutes).** Use a 390×844 viewport, either browser devtools or the phone. Tap only; don't type addresses after the first step.

`tour` is a reference script stored with the content, planned so one pass reaches every route:

| Question | What the takes cover |
|---|---|
| 1 | every key point on the first take |
| 2 | some key points, then the rest |
| 3 | a `slow` take |
| 4 | no key points, then no key points again |
| 5 | every key point on the first take |

| Step | Do | Expect |
|---|---|---|
| 1 | Open `/reset`, then `/s/tour` | `/start` |
| 2 | "Let's go!" → "Not now" → "Continue" | `/mic`, then `/mic-off`, then `/q/1/type` |
| 3 | Type anything, send | "Thinking..." for at least 1.2s, then Correct. XP shows 10. "More info" opens the sheet and its X closes it. |
| 4 | Next | `/q/2/type`, because keyboard mode carries over. |
| 4b | Toggle to voice, tap mic, then the cancel X | back on `/q/2`, no take stored |
| 5 | Tap mic, tap it again to stop | Partial, with hint 1 (including the covered count) on the card |
| 6 | Tap mic, stop | Correct. XP shows 15. |
| 7 | Next. On question 3: tap mic, stop | "Taking a moment…" at ~4s, "didn't catch that" at ~10s |
| 8 | Skip. On question 4: record and stop three times | Wrong with hint 1, then hint 2, then the nudge with "Reveal answer" as the primary button |
| 9 | Reveal answer (now the primary button), close the sheet, Next | question 5. XP shows 16. |
| 10 | Close the app and reopen it from its icon | still on `/q/5` |
| 11 | Record and stop, then "Finish" | Correct, then `/results` |
| 12 | Check Results | Good explanations: questions 1, 2, 5. Needs practice: 4. Skipped: 3. `ProgressMeter` shows 3. XP is 26. Question 1's row shows what was typed. The bottom bar shows "Review all" + "Continue". |
| 13 | Review all | `/q/1` in voice mode, progress at 0, XP still 26 |
| 14 | Close X → "Keep going", then close X → "Leave" | stays on `/q/1`, then `/done` with "Progress saved. Come back any time." |


### Before each test session (on the test phone)

**Setup:**
- Open `/reset`.
- Add `/s/[code]` for that participant to the Home Screen.
- Open the app from the icon: it's full screen, and the code is kept.

**Layout:**
- On the iPhone 17, the design is scaled with nothing clipped.
- The Dynamic Island doesn't cover `AppBar`, and the home bar doesn't cover the bottom actions.
- On a test call with screen share, the call's controls don't cover Next or the mic.

**House rules:**
- Tap targets are at least 44×44 after scaling.
- Contrast meets `docs/platform-constraints.md`.
- Under reduced motion, nothing important depends on animation.
- The cancel X and the send button have labels for screen readers.
- New CSS uses only tokens from `build/css/tokens.css`.
- Labels are in sentence case.

## Open

All other open items were decided on 2026-09-29 and are written into the sections above and into `docs/sprint-context.md`. Everything still waiting, including the build decisions for each screen, is collected in `docs/open-items.md`. What's left here:

1. **The mic inside `chatInput`'s field:** is it the way back to voice, or dictation? If `InputModeToggle` is the way back, the in-field mic may be redundant (`docs/chatinput-decisions.md` › Still open).
2. **Content:**
   - the 5 questions, their key points, hints and correct-feedback lines
   - the canned transcripts and the More info / Reveal context
   - the participant scripts, each with a first-pass and a later-pass chain per question, and the role-play tasks that match them
   - the `tour` reference script used in Verification
