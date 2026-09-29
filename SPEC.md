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

## Screen list, in build order (easiest first)

| # | Screen | Route | File (new unless noted) | Figma frame(s) on "Core flow for Claude Code" |
|---|---|---|---|---|
| 1 | End screen | `/done` | `src/app/done/page.tsx` | none (composed from existing components) |
| 2 | First-run splash | `/start` | `src/app/start/page.tsx` | SPLASH-FIRST-TIME |
| 3 | Mic skipped | `/mic-off` | `src/app/mic-off/page.tsx` | SPLASH-SKIP-MIC |
| 4 | Mic primer | `/mic` | `src/app/mic/page.tsx` | PERMISSION-MIC |
| 5 | Question | `/q/[n]` | `src/app/q/[n]/page.tsx` | QUESTION / activeState micOn, Lastquestion / activeState |
| 6 | Dictating | `/q/[n]/recording` | `src/app/q/[n]/recording/page.tsx` | Question / listeningState |
| 7 | Entry link and reset | `/s/[code]`, `/reset` | `src/app/s/[code]/page.tsx`, `src/app/reset/page.tsx` | none |
| 8 | Processing | `/q/[n]/thinking` | `src/app/q/[n]/thinking/page.tsx` | Question / processingState |
| 9 | Result | `/q/[n]/result` | `src/app/q/[n]/result/page.tsx` | Answering / correctState (+ finish), partialState, wrongState, notCaughtState, Reveal answer |
| 10 | Results | `/results` | `src/app/results/page.tsx` | Results perfect, Results partial, Results needs improvement |
| 11 | Typing | `/q/[n]/type` | `src/app/q/[n]/type/page.tsx` | Question / activeState keyboard option selected, keyboard open |

`[n]` is the question number, 1–5. `src/app/page.tsx` (still the create-next-app placeholder) and `src/app/layout.tsx` get replaced as part of screen 1.

**Every screen:**
- **Built on `Scaffold`** (`src/components/scaffold/`), using its slots `topNavigation`, `middleContent`, `bottomContent` and `bottomSheetOnly`.
- **Knowie's expression** is `standby` unless a screen says otherwise, as in Figma.
- **Sheets are overlays on a route, not routes of their own.** That covers the exit confirm, Reveal answer and More info.

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

### 1. End screen: `/done`

- **States:** one. Its wording is Open.
- **Components:**
  - `Scaffold` with no top navigation
  - `MascotSlot`
  - `TextBlock`
- **Student actions:** none decided (see Open). The moderator resets from `/reset`.

### 2. First-run splash: `/start`

- **States:** one. It shows once per phone; later visits skip it (see Mocked recall › Storage).
- **Components:**
  - `Scaffold` with no top navigation
  - `MascotSlot` 2XL, `standby`
  - `IconSlot` (the three explainer rows)
  - `Button` Primary L "Let's go!"
- **Actions:**

| Action | Leads to |
|---|---|
| "Let's go!" | `/mic` |

### 3. Mic skipped: `/mic-off`

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
| No thanks | Open: the decision log says "the launching screen", which the test doesn't have |

### 4. Mic primer: `/mic`

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

### 5. Question: `/q/[n]`

- **States:**
  - Ready to answer by voice (questions 1–4).
  - The last question: the same screen with `ProgressIndicator` at 100.
  - A Try again round: only the questions that were missed.
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

### 6. Dictating: `/q/[n]/recording`

- **States:** one: listening. The student sees no transcript while speaking.
- **Components:**
  - `AppBar`, `TopicPill`, `MascotSlot` 2XL, `AnswerCard` `question`
  - `RecordingGlow`. It breathes only, with no ripples; whether it's static or breathing in this build is Open.
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

### 7. Entry link and reset: `/s/[code]`, `/reset`

- **`/s/[code]`** is the link the moderator sends. The code (e.g. `k7`) is meaningless to the student and selects one stored script (see Mocked recall). It then goes to:

| Situation | Leads to |
|---|---|
| A session is already in progress | wherever the student left off |
| First visit on this phone | `/start` |
| Otherwise | `/q/1` |

- **Home Screen:** the student adds this page to their Home Screen. The saved icon has to open `/s/[code]` with its code. On iOS, Home Screen web apps don't share storage with Safari, so the code can't be passed along any other way.
- **`/reset`** clears the saved session and the "splash seen" flag between participants. It's reached by typing the address and never appears in the student's flow.
- **Full-screen mode:** an app manifest (`src/app/manifest.ts`, the Next.js file convention) and the page metadata make the Home Screen icon open full screen, with no Safari toolbars.

### 8. Processing: `/q/[n]/thinking`

- **States:**
  - "Thinking...", for at least 1.2s.
  - "Taking a moment…", from ~4s, only for a `slow` take.
  - Fallback at ~10s: goes to the result as "didn't catch that".

  Where the "Thinking..." and "Taking a moment…" text appears is Open: the `AnswerCard` `processing` story shows no text.
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

### 9. Result: `/q/[n]/result`

**States, one per verdict.** Each shows `AnswerCard` `question` above the answer card.

| Verdict | Answer card | Pill | Bottom actions | Mic |
|---|---|---|---|---|
| Correct | `answer-correct` | `StatusPill` `correct` | `BottomCTA` "Two button drawer": Secondary "More info", Primary "Next" ("Finish" on the last question) | none |
| Partial | `answer-partial` | `StatusPill` `partial` | `BottomCTA` "Two button drawer / Secondary": Tertiary "Reveal answer", Secondary "Next" | live: `MicButton` `idle` / `ready` + `InputModeToggle` `voice` |
| Wrong | `answer-error` | `StatusPill` `wrong` | same as Partial | live |
| Didn't catch that | `answer-notcaught` | `StatusPill` `notCaught` | Tertiary "Reveal answer", Secondary "Skip" | live |

**The answer card shows:**
- The latest take, word for word (canned in the mock).
- On a partial or wrong: a line saying how many key ideas are covered so far, and a hint toward one that's missing.

**The hint and covered line are blocked.** `AnswerCard` currently takes only `state` and `message`, so this needs an answerCard change designed in Figma first (see Open).

**Sheets.** "Reveal answer" and "More info" open a `BottomSheet` M with `BottomSheetAppBar` `dismissOnly`. The sheet holds the answer and context, an X, and no buttons. Closing it returns to the same result.

**Actions:**

| Action | Leads to |
|---|---|
| Tap mic (partial, wrong, didn't catch that) | `/q/[n]/recording` to retry. The next take is judged together with the earlier ones. |
| Toggle to keyboard | `/q/[n]/type` |
| Next after a correct | `/q/[n+1]`, or `/results` after the last question |
| Next after a partial or wrong | counts as needs practice, then the next question |
| Finish | `/results` |
| Skip (didn't catch that) | counts as skipped, then the next question |
| Reveal answer / More info | the sheet |
| Close X | exit confirm sheet |

### 10. Results: `/results`

- **States:**
  - Perfect: every concept correct.
  - Mixed.
  - Mostly skipped.
  - A merged view after a Try again round.

  The copy changes with each state.
- **Components:**
  - `ProgressMeter` score 1–5. It's hidden when nothing is correct.
  - `ResultsSummary` `good-explanations`, `needs-practice` and `skipped-questions`
  - `ExpandableResultRow`, with tone `success`, `error` or `neutral`. A row's transcript is every take for that concept, joined.
  - `BottomCTA` "Two button drawer" with Primary "Continue"
  - No `AppBar`, as in Figma.
- **Actions:**

| Action | Leads to |
|---|---|
| Try again (shown only when something wasn't correct) | the first missed question. The round covers missed questions only, then comes back here with one merged picture. |
| Continue | `/done` |
| Expand a row | shows that concept's takes |

Whether "Review all" stays alongside Try again is Open.

### 11. Typing: `/q/[n]/type`

- **States:**
  - Keyboard selected: the field isn't focused yet.
  - Keyboard open: the phone's own keyboard is up. It's the system keyboard, not something we build.
- **Components:**
  - `AppBar`, `TopicPill`, `MascotSlot` 2XL, `AnswerCard` `question`
  - `TapToAnswer` "Type an answer" (Figma currently says "Tyoe")
  - `ToggleGroup` `keyboard`, `micBlocked=false`
  - `Button` Tertiary S "Skip", while the keyboard is closed
  - With the keyboard open: `InputModeToggle` `keyboard`, a text field (missing component, see Open) and `ButtonIcon` Secondary M to send
- **Actions:**

| Action | Leads to |
|---|---|
| Send | `/q/[n]/thinking`. The typed answer goes to the same mock as a spoken one. |
| Toggle to voice | `/q/[n]` |
| Skip | counts as skipped, then the next question |
| Close X | exit confirm sheet |

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
- **Where it launches from:** the study-plan and main-chat entry points. The test starts from the moderator's link.
- **Records:** logging or analytics. The test relies on screen share and notes.
- **Devices and platforms:**
  - tablet, desktop and RTL layouts
  - native iOS APIs: haptics, permission sheets, navigation transitions
  - layouts that stretch: other iPhone widths scale the 390 design instead
- **The recordingGlow rebuild** in `recordingglow-listening-spec.md`, beyond whatever Open settles for this build.

## How the mocked recall behaves

**Content** (supplied by the designer, stored in a new file under `src/content/`):
- 5 questions from what the participants just studied.
- For each question: 2–4 key points, one pre-written hint per key point, the "More info" / Reveal context, and a canned transcript for each verdict it can get.

**Scripts** (new, stored with the content; the code in `/s/[code]` picks one):
- **Each question gets its own chain of takes.** Each take lists the key points it covers, for example `q1: 1,2 > 3`.
- **There are also special takes:**
  - `notCaught`: didn't catch that
  - `idk`: "I don't know", treated as Skip
  - `slow`: a late verdict
- **A question's chain only affects that question.** Takes left over when the student moves on are dropped. Takes beyond the plan cover nothing new.
- **The moderator gives each participant role-play tasks that match their script,** such as "answer this one fully" or "leave something out", so the verdicts make sense to them. Participants are told beforehand that the transcript text is a placeholder.

**The engine** (new, `src/lib/recallEngine/`) is one piece with a fake setting. Given a take, it returns which key points that take covered, the same shape a real engine would return. Everything else is worked out from that:

- **Verdict from combined coverage** across all of this question's takes: all key points covered is correct, some is partial, none is wrong.
- **Covered line:** "N of M key ideas".
- **Hints:**
  - A partial or wrong shows the next unused hint, in key-point order.
  - After 2 hints, Reveal answer is the way forward, with the mic still live.
- **Timing:**
  - "Thinking..." lasts at least 1.2s.
  - A `slow` take shows "Taking a moment…" at ~4s and becomes "didn't catch that" at ~10s.
- **XP:**

  | Outcome | XP |
  |---|---|
  | First-try correct | 10 |
  | Correct after a hint or retry | 5 |
  | Revealed | 1 |
  | Skipped | 0 |

  A correct answer in a Try again round earns 5.
- **Results groups:**

  | Group | What lands there |
  |---|---|
  | Good explanations | correct, at any attempt |
  | Needs practice | Next tapped after a partial or wrong |
  | Skipped | Skip, `idk`, or Skip after "didn't catch that" |

**Storage.** The session is saved on the phone:
- the script code
- the current route
- every take
- verdicts, hints used and XP

Reopening the app resumes where the student was. `/reset` clears the session.

**Screen size.** The 390×844 design scales to the phone's width. The first remote participant has an iPhone 17 (402×874), where it scales to about 103%, or about 870 tall. `Scaffold`'s top strip for the status bar is fixed at 48px (`src/components/scaffold/scaffold.css`). It must grow to the phone's safe area when that's larger, which it is on Dynamic Island phones. The bottom content must stay clear of the home bar.

## Verification

### The five-minute check

Run this after any change. It should take about five minutes, most of it the walkthrough.

**1. Automated (about 1 minute).** These must pass:
- `npm run lint`
- `npm run build`
- the Storybook component tests
- the recall engine's unit tests in `src/lib/recallEngine/`. They cover verdicts from coverage, combined takes, leftover and extra takes, hint order and the 2-hint limit, `notCaught`, `slow`, and every XP outcome.

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
| 4 | Next. On question 2, switch to voice if needed (Open 22). Tap mic, then the cancel X | back on `/q/2`, no take stored |
| 5 | Tap mic, tap it again to stop | Partial, with the covered line and hint 1 |
| 6 | Tap mic, stop | Correct. XP shows 15. |
| 7 | Next. On question 3: tap mic, stop | "Taking a moment…" at ~4s, "didn't catch that" at ~10s |
| 8 | Skip. On question 4: record and stop twice | Wrong with hint 1, then wrong with hint 2 |
| 9 | Reveal answer, close the sheet, Next | question 5 |
| 10 | Close the app and reopen it from its icon | still on `/q/5` |
| 11 | Record and stop, then "Finish" | Correct, then `/results` |
| 12 | Check Results | Good explanations: questions 1, 2, 5. Needs practice: 4. Skipped: 3. `ProgressMeter` shows 3. XP is 25 plus whatever Open 8 decides for question 4. Try again is shown. |
| 13 | Try again | `/q/3` |
| 14 | Close X → "Keep going", then close X → "Leave" | stays on `/q/3`, then `/done` |

Until the answerCard change lands (Open 1), steps 5 and 8 check the verdict only, not the hint and covered line.

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

**Waiting on the designer:**
1. **The answerCard change** for the hint and the covered line (Figma first). It blocks hints on screen 9.
2. **The text input component** on screen 11. Nobody is assigned to design it yet.
3. **Content:**
   - the 5 questions, their key points and hints
   - the canned transcripts and More info context
   - the participant scripts and their role-play tasks

**Decisions still to make:**

4. **recordingGlow on screen 6:** keep today's static glow, or bring the breathing forward now. Breathing needs blur tokens (20px, 2px) that don't exist yet.
5. **"No thanks" on `/mic-off`:** where it leads when there's no launching screen.
6. **End screen:** its wording, and whether it offers anything, such as starting again.
7. **After 2 hints:** how Reveal answer is emphasized. Figma doesn't design this.
8. **XP for needs practice** (Next after a partial or wrong), including Next after the answer was revealed. The 10/5/1/0 tiers don't cover it.
9. **A reveal followed by a correct retry:** whether it counts as revealed (1 XP) or correct after a retry (5 XP).
10. **Typed answers:** show the student's own typed text, or the canned transcript.
11. **Skip while typing:** Figma's keyboard-open frame has no Skip.
12. **Reloading mid-take:** what happens when the app reopens on `/recording` or `/thinking`.
13. **The Results bottom bar:** whether "Review all" stays next to Try again and Continue.
14. **Progress bar values:** per question, and during a Try again round. Figma shows 25 on question 1.
15. **Screen-reader announcements** for listening, thinking and the verdict. `recordingglow-listening-spec.md` §7 proposes a live-region pattern for listening only.
16. **The voice/keyboard toggle:** the decision log says it's on every question and answer screen, but Figma's correct-result screen has none.
17. **Pending XP** (the decision log says some XP confirms only on the breakdown): what it means without an XP card.
18. **The spec file's home:** whether `recordingglow-listening-spec.md` moves into `docs/`.
19. **Where the processing text appears:** "Thinking..." and "Taking a moment…". The `AnswerCard` `processing` story shows no text, and no documented prop adds it.
20. **Scripts in a Try again round:** which takes a redone question gets, since its chain was used up or dropped in the first round.
21. **An `idk` take:** whether it shows a result screen first, or moves straight to the next question like Skip.
22. **Input mode across questions:** whether keyboard or voice carries over to the next question, or each question starts in voice.
