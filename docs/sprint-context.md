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
- Cancel (an X beside the mic while recording) throws away the take and returns to idle, mic ready, because a fumbled start shouldn't force a bad submission, and idle is where the student can record again, switch to keyboard, or skip.
- Prototype purpose (2026-09-29): a usability test with students on a real iPhone in Safari, deployed over HTTPS, in English, on the team's test phones or a remote participant's own iPhone, opened from the Home Screen as a full-screen web app (no Safari toolbars, so the full height holds and there's no back swipe). On phones that aren't 390 wide, the whole 390×844 design scales to the phone's width; iPhone screens share nearly the same proportions, so it also fills the height. The first remote participant has an iPhone 17 (402×874 points): the design scales to 103%, 844 becomes about 870, leaving about 4 spare points. Links carry a short meaningless code (e.g. /s/k7) that maps to a script stored in the prototype, so the student can't read the plan in the address, and the Home Screen icon keeps that code. The moderator talks a remote participant through Add to Home Screen, and watches through the participant's screen share on the call. Each participant gets role-play tasks per question ("answer this fully", "leave something out", "say you don't know") that match the script, so verdicts make sense to them. This replaces the earlier "happy path only" scope.
- Recall engine (2026-09-29): mocked for now; a real engine (Safari speech recognition + an AI judge) is estimated at 3–5 days and deferred. The mock is one piece with a fake setting that a real one can replace later without touching the screens. A script in the link gives each question its own chain of takes, and each take lists the key points it covers (e.g. q1: 1,2 > 3), plus special takes for "didn't catch that", "I don't know" and "slow". The verdict, combined coverage, next hint and covered count are all worked out from the key points, as a real engine's answer would be. What a student does on one question can't shift another's chain: leftover takes are dropped when they move on, and takes beyond the plan cover nothing new. The transcript is canned per question and verdict, and participants are told beforehand that the words shown are placeholders. No real microphone is used: recordingGlow only breathes, with no ripples, so nothing claims to hear the student; the primer screens show but no browser prompt appears, and a denial is only reachable through "Not now".
- Content: 5 questions from what the participants just studied, supplied by the designer. Each has 2–4 key points, a pre-written hint per key point, and a canned transcript for each verdict it can get.
- Missing designs: the designer designs the answerCard change in Figma; exit confirm, end screen and "Taking a moment…" are composed from existing components and reviewed in Storybook. The text input is still unassigned.
- Screens in scope: first-run splash and mic permission primer before question 1; question; dictating with cancel; processing; correct, partial, wrong and "didn't catch that" results; Reveal answer sheet; hints; keyboard answering (required, because "Not now" must lead somewhere); Results (perfect and non-perfect); exit confirm; end screen. XP card stays out until its stats exist as a Figma component.
- Recording: the student sees no words while speaking, only after stopping, so they recall rather than proofread.
- Processing: "Thinking..." shows for at least 1.2s. A "slow" script entry makes it become "Taking a moment…" after ~4s and fall back to "Didn't catch that" after ~10s, so both states can be tested.
- Retries: a verdict counts all takes for a question combined. The card shows the latest take plus a line on how many key ideas are covered so far; the hint and that line live inside answerCard, a component change the designer makes in Figma first. Results rows show all takes for a concept joined, so every take is stored. A partial or wrong shows the next unused pre-written hint; at most 2 hints, then Reveal answer is the way forward, with the mic still live.
- Non-answers: an "idk" script entry is treated as Skip ("I don't know"). A question back or off-topic speech would be judged wrong; the mock covers it with a "wrong" entry. Knowie never answers it.
- XP: 10 first-try correct, 5 correct after a hint or retry, 1 revealed, 0 skipped. No "say it back" claw-back, since it isn't built. A correct answer reached after a retry lands in good explanations.
- Results: Try again is offered only when something was missed, and as often as that stays true. It redoes only the concepts that weren't correct; a redo that's correct earns 5 XP and moves to good explanations. Results then show one merged picture of all 5. Continue goes to the end screen.
- Leaving: the appBar X opens a confirm sheet ("Leave? Your progress is saved."); Leave goes to the end screen. A reload resumes where the student was, since progress is saved on the phone; a hidden reset link clears it between participants.
- Processing copy is "Thinking...", because the wait should feel calm and literal.
- Answers show the verbatim transcript, because a paraphrase hides "misheard" vs. "wrong."
- Bottom bar labels are short ("Next", not "Next question"; "Review", not "Review 3 concepts"), because L labels are set in Inter, which is wider than Greed Condensed, and the longer pairs don't fit side by side at 390px.
- Correct: "More info" + "Next", because there's nothing to fix.
- Partial or wrong: "Reveal answer" + "Next" with the mic live, because the student can retry or move on.
- "Didn't catch that": neutral tone, "Reveal answer" + "Skip", because the app misheard, not the student.
- Skip (before first attempt, or after "Didn't catch that") counts as skipped; "Next" after partial or wrong counts as needs practice, because Results separate "didn't try" from "tried and missed."
- "Reveal answer" / "More info" open a bottom sheet (answer, context, X, no buttons), because the student reads, then retries or moves on.
- XP: full unaided, partial hinted, minimal revealed, unaided "say it back" earns some back; streak counts unaided passes only, because XP and streak are the mastery signal.
- Some session XP stays pending until the breakdown shows, because the reward should match the real result.
- Results: XP card, then concept breakdown, because reward and mistake review shouldn't mix.
- Code uses Inter, not Greed, because Greed is an unlicensed trial font that can't be published; Greed is preferred if licensing is ever cleared.
- Tried switching to the real Greed VF trial font for real (2026-09-28), reverted same day: many already-built components (button, bottomCTA, toggleGroup, appBar, bottomSheetAppBar) were specifically measured and had labels shortened against Inter's wider character metrics, so Greed's narrower rendering broke that fit rather than just "looking more accurate." Re-attempt only alongside re-tuning those components' measurements, not as a drop-in swap.
- Score ring hidden at 0 correct, because results stay encouraging.
- XP card and breakdown copy change with how the student performed (tiers such as perfect, mixed, mostly skipped; more may be added), because feedback should be encouraging and honest about the result.
- recordingGlow's 4 static resting-state rings are retired, replaced outright by the ripple/breathing motion, because static lines carry no information — the motion should move in unison with the speaker's actual voice pattern as real-time feedback, and anything extraneous shouldn't appear.
- recordingGlow's listening motion follows recordingglow-listening-spec.md. Its open calls are settled when recordingGlow is built, not before. Leanings so far (2026-09-29): breathe the two filled ellipses in place on voiceFeedback layer2/layer3 and compare against the prototype; drop the two outline rings; ripples on interactive/secondary; ripple size from the real mic level, read inside recordingGlow. Figma doesn't have to match the code's animation exactly, because Figma can't hold motion.

## Not building
- Real speech-to-text or AI judging for now (mocked; see Recall engine)
- Native iOS behavior
- Auto-endpointing (push-to-talk, explicit stop)
- Pause/resume within a take
- Tutoring or open conversation
