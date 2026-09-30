# Gaps and cuts

As of 2026-09-30. This compares the states in `docs/voice-ux.md` with the Figma screens (page "Core flow for Claude Code") and the Storybook library. It then lists everything deliberately cut, each with its reason. The build itself is specified in `SPEC.md`; the decisions are logged in `docs/sprint-context.md`.

**Key:**
- ✅ designed or built
- ⚠️ partly
- ❌ missing

## Gap table: every state in voice-ux.md

| State (voice-ux priority) | Designed in Figma | In Storybook | What still needs building |
|---|---|---|---|
| Idle, mic ready (Must) | ✅ QUESTION / activeState micOn, Lastquestion | ✅ `MicButton` idle, `AnswerCard` question, `ToggleGroup` voice | Screen 5, `/q/[n]` |
| Recording (Must) | ✅ Question / listeningState | ⚠️ `MicButton` listening is built. `RecordingGlow` still draws 4 static rings. | Screen 6. `RecordingGlow` must breathe and drop its outline rings. "Tap to submit" is loose text in Figma; it's built as `TapToAnswer`. |
| Processing (Must) | ✅ Question / processingState | ✅ `AnswerCard` processing (shows "Thinking..." by default), `LoadingDots` | Screen 8, `/q/[n]/thinking` |
| Result: pass / partial / fail (Must) | ✅ correctState, partialState, wrongState | ✅ All verdict variants of `AnswerCard`, `StatusPill` and `BottomCTA`. The hint is the card's `message`, as in Figma's variants. | Screen 9. The hint copy (with the covered count) comes from the content. |
| Cancel & re-record before send (Must) | ✅ The X beside the mic on listeningState (`buttonIcon` Secondary S) | ✅ `ButtonIcon`, `src/icons/XIcon.tsx` | Part of screen 6. The X throws the take away and returns to ready. |
| Text fallback turn (Must) | ✅ keyboard option selected and keyboard open, now built on `chatInput` (Inactive, Long input) | ⚠️ `ToggleGroup`, `InputModeToggle` and `ButtonIcon` exist. `chatInput` isn't built yet. | Screen 11. `chatInput` becomes a Storybook component (rules in `docs/chatinput-decisions.md`). Keeping the bar above the iOS keyboard needs `visualViewport` handling. |
| Mic permission primer + OS prompt (Must) | ✅ SPLASH-FIRST-TIME, PERMISSION-MIC | ✅ Stories: `BottomSheet` › Mic permission and `Scaffold` › Mic permission | Screens 2 and 4. The OS prompt itself is cut (see Cuts). The splash's close button is loose layers with no component. |
| Permission denied → text (Must) | ⚠️ SPLASH-SKIP-MIC covers "Not now". No screen shows a blocked mic. | ✅ `ToggleGroup` and `InputModeToggle` with `micBlocked=true` | Screens 3 and 11. A real browser denial can't happen, since the mic is mocked, so "Not now" is the only way in. |
| Skip a term (Must) | ✅ On idle and "didn't catch that" | ✅ `Button` Tertiary S | Screens 5, 9 and 11 |
| Empty / silent recording (If time) | ✅ notCaughtState ("Didn't catch that") | ✅ `AnswerCard` answer-notcaught, `StatusPill` notCaught | Screen 9, triggered by a `notCaught` take in the script |
| Noisy / garbled transcript (If time) | ✅ Same notCaughtState | ✅ Same | Same as above |
| Judge slow / times out (If time) | ⚠️ No frame for it, but it's the processing card with different text | ✅ `AnswerCard` processing, with "Taking a moment…" passed as `message` | Screen 8, triggered by a `slow` take |
| No / dropped network (If time) | ❌ | ❌ | Nothing: cut (see Cuts) |
| Mic hardware busy (Out of scope) | ❌ | ❌ | Nothing: cut |
| Language switch mid-answer (Out of scope) | ❌ | ❌ | Nothing: cut |
| Pause/resume into one take (Out of scope) | ❌ | ❌ | Nothing: cut |

## Beyond voice-ux.md

These are in Figma, Storybook or SPEC.md, but voice-ux.md doesn't list them. Most are recorded in `docs/sprint-context.md`.

| Item | Figma | Storybook | Status |
|---|---|---|---|
| "Didn't catch that" as a fourth verdict | ✅ | ✅ | In the build (screen 9). It covers voice-ux's "misheard, not wrong" principle. |
| Reveal answer / More info sheets | ✅ Reveal answer | ✅ `BottomSheet` › Reveal answer | In the build (screen 9) |
| Hints (at most 2), then a fixed nudge and Reveal as the primary button | ✅ The card text in answer-partial and answer-error is Knowie's feedback | ✅ `AnswerCard` `message`, `BottomCTA` "Two button drawer" | In the build (screen 9) |
| Results screens | ✅ perfect, partial, needs improvement | ✅ `ProgressMeter`, `ResultsSummary`, `ExpandableResultRow` | In the build (screen 10). "Review all" starts a new pass. |
| Exit confirm | ❌ | ⚠️ Composed from `BottomSheet`, `TextBlock`, `ButtonGroup` and `Button` | In the build (every question route) |
| End screen | ❌ | ⚠️ Composed from `MascotSlot` and `TextBlock` | In the build (screen 1) |
| Entry point screen | ⚠️ Some exploration exists outside the core flow | ❌ | Maybe later (SPEC.md › Maybe later) |
| XP card | ⚠️ Its stats are loose layers | ❌ | Cut |

## Cuts

These were cut from this build, each with the reason on record. Where no reason was ever given, the table says so.

**The engine**

| Cut | Reason |
|---|---|
| Real speech-to-text and AI judging | Estimated at 3–5 days of work you didn't want to spend now. Deferred, not ruled out. The mock is built so a real engine can replace it without touching the screens. |
| Any real microphone use, including the browser's permission prompt | Nothing in the mocked build uses the mic: transcripts are canned and the ripples are cut. So the primer shows, but no browser prompt follows. |
| Moderator choosing verdicts live from a second device | About 2 days of build for the phone-to-laptop link. A script in the link does the job for this test. |
| Script visible in the link | The student would read the plan in the address. Links carry a short, meaningless code instead. |

**Recording and feedback**

| Cut | Reason |
|---|---|
| Ripples in `RecordingGlow` | With no real mic, fake ripples would move while the student is silent, claiming to hear them. |
| `RecordingGlow`'s two outline rings | Static lines carry no information. |
| The Figma "Glow feedback group" on the listening screen | Replaced by the listening spec's approach, which animates the component's existing filled circles on their existing voiceFeedback tokens instead of adding new gradient layers. |
| Live transcript while speaking | So the student recalls instead of proofreading. |
| Transcript on the result screen | The result card holds Knowie's feedback, as in Figma's answerCard variants. The transcript appears in the Results rows instead. |
| A separate "covered so far" line | Folded into the hint's copy, so no answerCard change is needed. |
| Auto-endpointing | A hard constraint in the design brief: push-to-talk with an explicit stop. |
| Pause/resume within a take | The design brief defers it. |
| Tutoring (answering the student's questions) | The brief says recall only. Knowie never answers a question back. |

**Rewards and results**

| Cut | Reason |
|---|---|
| XP card | Its stats (XP, score, streak) are loose layers in Figma, not a component. Waiting for Figma. |
| Pending XP (some XP held back until Results) | Without an XP card, there's nothing to hold it back for. XP counts up as it's earned. |
| Results-level Try again round | Retrying happens on a question, by tapping the mic after a partial or wrong. "Review all" covers going through everything again. |
| "Say it back" | No reason recorded. It isn't designed in Figma. |
| Streaks | No reason recorded. |

**Launching and records**

| Cut | Reason |
|---|---|
| Launching from the study plan or main chat | The test starts from the moderator's link. The entry point screen is noted under "Maybe later". |
| Logging or analytics | Chosen with this tradeoff on the table: participants are students, possibly minors, so storing their data adds a consent and data-handling burden. The test relies on screen share and notes. |

**Devices and layout**

| Cut | Reason |
|---|---|
| Running in a Safari tab | The toolbars take ~100–180px of the 844 height, and a back swipe can leave the prototype mid-session. It runs from the Home Screen, full screen. |
| Layouts that stretch to other iPhone widths | Scaling the 390 design is cheaper and keeps it exact. Stretching would mean reworking `Scaffold` and components built for 390. |
| Tablet, desktop and RTL layouts | Out of scope this sprint (`docs/platform-constraints.md`). |
| Native iOS APIs (haptics, permission sheets, navigation transitions) | It's a web prototype styled as iOS, not a native app (`docs/platform-constraints.md`). |

**Edge cases**

| Cut | Reason |
|---|---|
| Network loss mid-answer | The mock runs on the phone, so nothing in the loop needs the network once the app has loaded. |
| Mic busy with another app | Rare in practice. voice-ux.md lists it as a known gap. |
| Switching language mid-answer | Real, but "not a v1 sprint problem" (voice-ux.md). The test runs in English. |
