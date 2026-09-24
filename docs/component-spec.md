# Component spec (source of truth)

This file is the source of truth for the voice-recall components. Check Claude Code and Figma work against it.

Last verified against the live Figma file (Yummy__Knowie Design System (Copy), `1fSfWxZSPoaFQ8Dg36EGXs`) on 2026-09-23. The voice-recall components in this file live on "New components". Core design-system components they build on (appBar, button, buttonGroup, chips, iconSlot, bottomSheet, scaffold, mascot and others) live on "🎨 Mascot & components". Screens that use them are on "Core flow for Claude Code".

Every component below has the same sections: **Description** (what it is), **When it's used** (the moment in the flow and the screens it appears on), **States** (every variant and what each one means). Build notes follow where relevant. Figma housekeeping and token gaps are collected at the end.

Legend: ✅ confirmed live, ready to build · ◐ built, has a known issue listed in the section · ○ needs a first Figma audit

## Working notes

- `accent/neutral/surface` is a deprecated placeholder. Don't use it. "Didn't catch that" states use `feedback/neutral/*`.
- Icons come from the shared library set (`<Name>/Format=Stroke, Weight=Regular`), e.g. Check, X, CaretRight, QuestionMark. Don't redraw icons as one-off vectors.
- Build every screen on `scaffold` (topNavigation, middleContent, bottomContent, bottomSheetOnly). Every screen on "Core flow for Claude Code" is a scaffold instance (iPhone 13): the app bar sits in topNavigation, the question and feedback cards in middleContent, the mic, toggle row and bottomCTA in bottomContent, and overlays (permission sheet, Reveal answer) in bottomSheetOnly with the scaffold's scrim turned on. Inside bottomContent, the mic, toggle row and bottom bar are positioned by hand in a `bottomArea` frame; in code, lay them out as a bottom-anchored stack.
- All labels, buttons and headings are sentence case, including anything styled with uppercase text case. Acronyms (XP, DNA) stay capitalized.
- Sessions are a fixed 5 questions. resultsSummary and progressMeter assume this.

## The flow at a glance

| Moment | Screen(s) on "Core flow for Claude Code" | Key components |
|---|---|---|
| Question, ready to speak | QUESTION / activeState micOn | topicPill, answerCard (question), micButton (idle + ready), toggleGroup (voice) |
| Question, typing | Question / activeState keyboard option selected, Question / activeState keyboard open | topicPill, answerCard (question), toggleGroup (keyboard) or inputModeToggle (keyboard), input field, Keyboard |
| Recording | Question / listeningState | micButton (listening + ready), recordingGlow |
| Processing | Question / processingState | answerCard (processing), micButton (idle + disabled), loadingDots |
| Feedback | Answering / correctState, correctState finish, partialState, wrongState, notCaughtState | answerCard (answer-*), statusPill, bottomCTA |
| Reveal answer | Reveal answer | bottomSheet overlay (answer + X), over the answer screen |
| Last question | Lastquestion / activeState | answerCard (question), micButton (idle + ready), toggleGroup (voice) |
| XP card | XP card ("Perfect lesson!") | mascotSlot, XP / Score / Blazing stat boxes, Continue button. First of the two Results steps |
| Results | Three "Results" frames: perfect score, mixed ("Here's how it went"), 2 of 5 | progressMeter (perfect and 2-of-5 frames), resultsSummary + expandableResultRow (mixed frame), bottomCTA |
| Mic permission | SPLASH-FIRST-TIME, PERMISSION-MIC, SPLASH-SKIP-MIC | SPLASH-FIRST-TIME: scaffold + button ("Let's go!"). PERMISSION-MIC: bottomSheet with buttonGroup ("Turn on" / "Not now") over the question screen. SPLASH-SKIP-MIC: bottomCTA ("No thanks" / "Continue") |

topicPill sits at the top of every question, answer and permission screen.

## Components

### micButton ✅

Component set `15878:19554`, page "New components". Documented in Figma.

**Description:** the round mic button students tap to start and stop a voice answer (push-to-talk, explicit stop). Icon is set per variant; there is no icon swap property on purpose, because a shared instance-swap property forces every variant onto one icon.

**When it's used:** centered above the bottom row on every voice question and answer screen. Not shown when mic permission is denied at the OS level; the toggleGroup / inputModeToggle blocked state owns that case.

**States:** `listeningState` (idle / listening) × `interactionState` (ready / pressed / disabled). 5 of 6 combinations exist; listening + disabled is intentionally omitted.
- idle + ready: resting, tap to speak. Icon micFilledIcon. QUESTION / activeState micOn, Lastquestion / activeState, answer screens (retry), Reveal answer, PERMISSION-MIC.
- listening + ready: recording. Icon micFilledIcon. Question / listeningState, always with recordingGlow behind it.
- idle + disabled: waiting while Knowie processes the answer. Icon micDisabledIcon. Question / processingState, paired with loadingDots.
- idle + pressed, listening + pressed: momentary press feedback only. Not placed on any screen.

**Bindings:**
- idle + ready fill → `interactive/primary`
- idle + pressed, listening + ready, listening + pressed fill → `interactive/primaryActive`
- idle + disabled fill → `background/surface`, stroke → `border/strong`

**Build note:** listening + ready has the same fill as pressed, so the button alone doesn't show that recording is on. recordingGlow must always render with listeningState=listening.

**Built** (`src/components/micButton`, 2026-09-24, rebuilt after Figma added the pressed shift and the `Control/Mic` token). Props `listeningState` and `interactionState` with Figma's names and options; the types don't allow listening + disabled. Icons `micFilledIcon` / `micDisabledIcon` exported from Figma into `src/icons/` (no icon prop, as in Figma). Size: `Control/Mic` (96px) for the outer frame and the face, no separate tap area. Structure matches Figma: a fixed 96px frame holding a 96px face. Pressed adds `Space/100` top padding to the frame, which centers the face 2px lower, and removes the bevel, like the main button. Icon color: `accent/brand/bold`, `accent/brand/onSubtle` when pressed, `icon/disabled` when disabled. Disabled keeps focus, sets `aria-disabled` and `aria-busy`, and ignores taps. Also `aria-pressed` = listening, and the accessible name is "Record answer".

**Contrast finding:** the violet icon on the resting fill is about 3.1:1, and on the `primaryActive` fill (listening and pressed) about 2.3:1, under the 3:1 minimum for graphics. It's built as Figma specifies; the fix (icon color or fill) is a Figma decision.

### recordingGlow ✅

Component `15878:19671`, page "New components", 168×168. Documented in Figma.

**Description:** the animated halo behind micButton that shows the mic is recording. A separate component, not a micButton variant, so the two can animate independently. Use it only behind micButton while listeningState=listening; never for idle or disabled.

**When it's used:** only while recording. Question / listeningState, centered behind micButton (listening + ready).

**States:** none. It's either on the screen (recording) or not.

**Structure (outer to inner):** every size is a multiple of `Control/Mic` (96): Figma rounds them to whole pixels.
- 1.74× (168px) circle, fill → `interactive/voiceFeedback/layer2`
- 1.42× (136px) circle, fill → `interactive/voiceFeedback/layer3`
- 1.24× (120px) ring, no fill, `Stroke/Hairline` (0.5px) → `interactive/secondary`
- 1.1× (106px) ring, no fill, `Stroke/Hairline` → `interactive/secondary`

No blur.

**Built** (`src/components/recordingGlow`, 2026-09-24). No props, as in Figma; hidden from screen readers. Each ring is `Control/Mic` times its ratio (so 167.04, 136.32, 119.04 and 105.6px exactly), concentric. The outlines are inset shadows at `Stroke/Hairline`, because browsers round a border this thin to whole device pixels. It also has a "Behind micButton (listening)" story that isn't a Figma variant. Not animated yet: the Figma description says "animated" but doesn't say how, so a motion decision is needed first.

### loadingDots ✅

Component `15795:39964`, page "New components". Documented in Figma.

**Description:** three pulsing dots, an indeterminate "working on it" indicator. Horizontal auto layout, gap 4, three circles sized by `Indicator/Dot` (6px), fill → `accent/brand/bold`.

**When it's used:** while Knowie processes a spoken answer. Question / processingState, paired with micButton (idle + disabled). Not a progress meter; don't use it anywhere a percentage or step count is knowable.

**States:** none. The opacity/scale pulse is applied in code, not as component states.

**Built** (`src/components/loadingDots`, 2026-09-24). No props, as in Figma. Three `Indicator/Dot` circles in `accent/brand/bold`, gap `Space/100`, hugging to 26×6. Pulse (decided with the user): each dot fades dim to full and back in `motion.duration.pulse` (1200ms) with `motion.easing.inOut`, dimmest at `motion.opacity.pulseDim` (30%), and each dot starts `motion.duration.pulseStagger` (150ms) after the last, so it travels left to right. All four are code-only tokens in `tokens/motion.json`. Reduced motion: the pulse stops and the dots stay at full brightness. It's a status region labelled "Thinking" (the processing copy in the decision log), so the wait is announced.


### inputModeToggle ✅

Component set `15878:17809` (variants `15878:21975`, `15878:21976`, `15903:16781`), page "New components". Documented in Figma.

**Description:** a 96×48 pill that switches the answer input between speaking and typing. The whole pill is one tap target; the knob slides to the chosen side. Active side icon `icon/primary`, inactive side `icon/tertiary`. Icons: micIcon, keyboardIcon, micBlockedIcon.

**When it's used:** bottom-left on every question and answer screen, so the student can switch input at any point. Placed through toggleGroup on the question screens; placed on its own on the answer screens, Reveal answer and Question / activeState keyboard open.

**States:** `inputMode` (voice / keyboard) × `micBlocked` (false / true). No voice + blocked variant.
- voice, not blocked: default when mic permission is granted. QUESTION / activeState micOn, Lastquestion / activeState, answer screens, Reveal answer.
- keyboard, not blocked: student switched to typing, or declined the mic primer (mic can still be requested). Typing screens.
- keyboard, blocked: mic denied at OS level. Slashed mic; tapping it opens the re-enable-permission flow instead of switching modes. The knob stays on keyboard until permission is granted. Not placed on any screen yet.

**Accessibility:** expose as a two-option segmented control ("Speak" / "Type") with the selected state announced. When blocked, the Speak label says mic access is off.

**Built** (`src/components/inputModeToggle`, 2026-09-24). Props `inputMode` and `micBlocked` (a boolean for Figma's "false" / "true"); the types don't allow voice + blocked. Callbacks: `onInputModeChange(mode)` and `onBlockedMicClick()`. A radio group named "Answer input" with "Speak" ("Speak, mic access is off" when blocked) and "Type", and the Arrow keys switch sides. A tap on either side switches to the other mode, as the Figma description says; when blocked, a tap on either side opens the re-enable-permission flow (Figma only says the mic side does; the keyboard side has nowhere else to go). Slots `Space/1200`, knob inset `Space/100` (Figma's knob is a typed-in 40px), bevel `Bevel/100`, icons `Icon/200` tall. Contrast: the dimmed icon is about 4.3:1 on the pill and the bright one about 10:1 on the knob. Motion: the knob slides in `motion.duration.toggle` (200ms) with `motion.easing.standard`, two code-only tokens in `tokens/motion.json`; under reduced motion it moves instantly.

### toggleGroup ✅

Component set `15878:22602`, page "New components". Documented in Figma.

**Description:** the bottom row on the question screens: inputModeToggle on the left, a "Skip" `button` (Tertiary, S) on the right. Horizontal auto layout, fixed 358 wide (matches the question card, 16px from each screen edge), hug height (48), space-between (gap Auto), padding bound to `Space/0`. Place at x=16. Don't bind a variable to the gap; a bound gap overrides space-between and packs Skip against the toggle.

**When it's used:** on question screens before the student answers. QUESTION / activeState micOn (voice), Lastquestion / activeState (voice), Question / activeState keyboard option selected (keyboard).

**States (mirror inputModeToggle):** `inputMode` (voice / keyboard) × `micBlocked` (false / true).
- voice, not blocked: mic granted, student is speaking.
- keyboard, not blocked: student switched to typing or declined the mic primer.
- keyboard, blocked: mic denied at OS level. Slashed mic; tapping it opens the re-enable-permission flow. micButton is hidden.

**Skip:** available before the first attempt. Tapping it records the question as skipped (skipped-questions card on Results).

**Usage rule:** pick this component's variant. Don't override the nested inputModeToggle's properties on an instance, or the row and toggle can disagree.

**Built** (`src/components/toggleGroup`, 2026-09-24). Built from `inputModeToggle` and `button` (Tertiary, S, "Skip"). Props `inputMode` and `micBlocked` (same rules as inputModeToggle) are passed straight down; callbacks `onInputModeChange`, `onBlockedMicClick` and `onSkip`. The label is fixed to "Skip". The row fills its container (358px inside the screen's 16px gutters) and space-between puts the toggle at the left edge and Skip at the right, with no gap set. Measured: 358×48 row, 96×48 toggle. Skip is 59.6px wide where Figma's is 48, because the code uses Inter, which is wider than Greed Condensed (see the decision log); its right edge still sits on the row's edge.


### topicPill ✅

Component `15850:10081`, page "New components".

**Description:** a small outlined label with a leading dot that names the topic being studied (e.g. "Energy flow in ecosystems"). Text property `Label`, sentence case. Fill `background/surface`, stroke `accent/brand/bold`, fully rounded. Label uses Caption M Bold; the dot is `Indicator/Dot` (6px).

**When it's used:** top of the middle content on every question, answer and permission screen, above the mascot. The Figma description limits it to a question set and its results; not splash pages or study plan overviews.

**States:** none.

**Built** (`src/components/topicPill`, 2026-09-23). Prop `label` (Figma's "Label"). Padding `Space/150` / `Space/300`, gap `Space/150`, corners `Radius/Full` and outline width `stroke/border`: in Figma these are typed-in numbers equal to those tokens. Measured against Figma: same size (216×28) and the same dot and label positions.

### answerCard ✅

Component set `15804:41153`, page "New components". Documented in Figma.

**Description:** the card for whatever Knowie is currently saying or asking. One instance per turn; an answer screen shows two (the question plus the feedback).

**When it's used:** on every question and answer screen, under the mascot.

**States:** `Property 1`.
- Default: Knowie talking without asking a question (e.g. a welcome message). Plain text, no pill. Not placed on any screen.
- question: the question text, on a `background/surfaceQuestion` fill. Every question and answer screen.
- processing: loading message + 3 skeleton bars. Question / processingState. Default copy is "Thinking...". Keep wait copy calm and literal (e.g. "Thinking...", "Checking your answer..."); no jokes or playful lines.
- answer-correct: statusPill correct + feedback message. Answering / correctState, correctState finish.
- answer-partial: statusPill partial + feedback message. Answering / partialState.
- answer-error: statusPill wrong + feedback message. Answering / wrongState.
- answer-notcaught: statusPill notCaught + "I couldn't understand that take." Answering / notCaughtState, Reveal answer.

**Built** (`src/components/answerCard`, 2026-09-23). Decisions behind the differences from Figma:
- Padding and gaps: Figma now binds the card to `Space/400` and `Space/100` (`Padding/lg` was retired).
- Skeleton bars: `Space/300` (12px) tall, since 14px has no token; widths 100%, 88% and 60% of the card; one `font/lineHeight/md` (24px) apart; fill `interactive/secondary`, as in Figma.
- "Thinking..." uses `text/secondary`, as in Figma. (An earlier reading said Figma added extra opacity to both; that was a misreading: Figma stores a variable's own transparency separately from its color, and the script counted it twice.)
- The property is `state`, with Figma's seven options named exactly as in Figma.
- Figma has no text property for the message, so the code adds `message`. Emphasised words (the question's "Q:", "producers", "consumers") are bold overrides on Body M Regular in Figma; in code they're `<strong>` in `font/weight/bold`.
- Still in Figma: the set's description says "Property 1" (the property's old name).

### statusPill ◐

Component set `15762:36623`, page "New components". Built with its own variant, not an extension of `chips`' color variant.

**Description:** a small colored label at the top of a feedback card that says how the answer went. Properties: `Label` (text), `left icon` (boolean, default true).

**When it's used:** inside answerCard' answer-* variants on the feedback screens and Reveal answer. Tone comes from `state`; never hand-color it.

**States:** `state`.
- correct: "Correct". `feedback/success/bold`, label `feedback/success/onBold`, icon Check. Answering / correctState, correctState finish.
- partial: "Almost there". `feedback/partial/bold`, label `feedback/partial/onBold`, icon ArrowCounterClockwise. Answering / partialState.
- wrong: "Try again". `feedback/error/bold`, label `feedback/error/onBold`, icon ArrowsClockwise. Answering / wrongState.
- notCaught: "Didn't catch that". `feedback/neutral/bold`, label `feedback/neutral/onBold`, icon QuestionMark. The app misheard; not the student being wrong. Answering / notCaughtState, Reveal answer.

**Known issue:** wrong and partial use near-identical rotating-arrow icons, so color is the only real difference. See "Open design questions."

### bottomCTA ◐

Component set `15808:41818`, page "New components". Documented in Figma.

**Description:** the action bar anchored to the bottom of the screen. Drawer layouts sit in a full-bleed 390×112 panel. Button labels come from each button's CTA text property; don't hardcode them. `Show secondaryButton` (boolean, default true) hides the secondary button in "Two button drawer" once it's been used.

**When it's used:** answer screens (before and after reveal), Results and SPLASH-SKIP-MIC. Question screens use toggleGroup instead.

**States:** `layout`.
- Two button no drawer: Secondary + Primary side by side, no panel, 104 tall. SPLASH-SKIP-MIC ("No thanks" + "Continue").
- Two button drawer: Secondary + Primary. Correct answer ("More info" + "Next", or "Finish" on the last question), Results ("Review all" or "Review" + "Continue").
- Two button drawer / Secondary: Tertiary + Secondary, low emphasis because the mic is the primary action. Partial / wrong, before and after reveal ("Reveal answer" + "Next"). Didn't catch, before and after reveal ("Reveal answer" + "Skip"). "Next" stays Secondary so it doesn't compete with the mic for a retry.
- One button drawer / primary: single full-width Primary. Not placed on any screen.
- One button drawer / secondary: single full-width Secondary. Not placed on any screen.

**Flow by result:**

| Result | Layout | Buttons | Retry |
|---|---|---|---|
| Correct | Two button drawer | "More info" + "Next" ("Finish" on last question) | none |
| Partial / wrong, before reveal | Two button drawer / Secondary | "Reveal answer" + "Next" | mic, "Tap to dictate" |
| Partial / wrong, after reveal | Two button drawer / Secondary | "Reveal answer" + "Next" | mic, "Tap to try again" |
| Didn't catch, before reveal | Two button drawer / Secondary | "Reveal answer" + "Skip" | mic, "Tap to dictate" |
| Didn't catch, after reveal | Two button drawer / Secondary | "Reveal answer" + "Skip" | mic, "Tap to try again" |

**Skip vs Next:** "Skip" records the question as skipped (skipped-questions card on Results). It appears in two places: before the first attempt (toggleGroup on the question screens), and after "Didn't catch that", because the app misheard and nothing was judged. After a partial or wrong answer the way forward is "Next" (or dictating again), and moving on counts as needs practice, not a skip.

**Known issue:** `Show secondaryButton` is on in every instance, so hiding a button after it's used isn't shown on any screen.

**Built** (`src/components/bottomCTA`, 2026-09-23). Notes and decisions:
- Labels are shorter than in the Figma designs, because L labels are set in Inter (wider than Greed Condensed) and some pairs didn't fit the 358px row: "More info" + "Next", "Reveal answer" + "Next", "Review" + "Continue". Every pair in the table above fits.
- Button widths: the two buttons share the row equally; a button whose label needs more than half grows past the center and the other fills what's left.
- Inside the drawer panel, Secondary buttons are filled with `interactive/secondary` (Figma overrides the fill on those instances); outside it they keep the button's own `background/surface`.
- The panel is sized by `Space/700` above and below the 56px buttons (112px; Figma sets a raw 112px); its top line is `border/default` at `stroke/border` (Figma: raw 1px).
- The one-button layouts are built like the two-button drawers. In Figma their outer frame also has 24/16px padding, but the panel still renders full-width at 0,0, so the result is the same.
- Props: `layout` (Figma's five options), `showSecondaryButton` (Figma's "Show secondaryButton", "Two button drawer" only), `leftCTA` / `rightCTA`, `onLeftClick` / `onRightClick`.

### bottomSheetAppBar ✅

Component set `5101:7358`, page "🎨 Mascot & components". Documented in Figma.

**Description:** the top bar of a `bottomSheet`, used only inside it (a screen's top bar is `appBar`). `Type` sets what it shows: `Default` (drag handle only; the mic-permission sheet), `withTitle` (handle and a centered title), `dismissOnly` (X on the left and a centered title; Reveal answer), `dismissAndAction` (X, title and a right-hand button that takes the student to the next screen, an arrow-right by default). Properties `Title`, `Caption`, `showCaption`; icons are swapped through the `dismissButton` and `actionButton` layers, never by detaching.

**Built** (`src/components/bottomSheetAppBar`, 2026-09-24). Props `type` (Figma's "Type", options as in Figma), `title`, `showCaption`, `caption`, plus `dismissIcon` / `actionIcon` (X and arrow-right by default), `dismissLabel` ("Close") and `actionLabel` ("Next") for screen readers, and `onDismiss` / `onAction`. 72px tall in every type; the handle uses the new `Indicator/Handle Width` (32) and `Indicator/Handle Height` (4) tokens, `Space/150` from the top, `background/floating`. Padding and gap per type as in Figma. **Differences from Figma, by the earlier decision:** the side buttons are `buttonIcon` Tertiary M (20px icon, library X) where Figma still has the old `App Bar Button Icon` (24px icon, hand-drawn x-close and arrow-right). A long title wraps in Inter where Figma's Greed Condensed fits it on one line.

### bottomSheet ✅

Component set `3675:30952`, page "🎨 Mascot & components". Documented in Figma.

**Description:** a sheet for a short, secondary task (permission prompts such as mic access, and supporting detail such as Reveal answer); not for the main question flow or anything the student must complete. `middleSection` holds the content, `bottomSection` the actions, and the top bar is a `bottomSheetAppBar`. `height` (S / M / L) is a design-time preview only; in code the sheet hugs its content and fills the screen width.

**How the screens use it:** Reveal answer / More info (dismissOnly top bar, answer content, no actions) and the mic permission (Default top bar, mascot and headline, a Vertical L `buttonGroup` with "Turn on" / "Not now").

**Built** (`src/components/bottomSheet`, 2026-09-24). Slots as props `middleSection` and `bottomSection` (drawn only when given); the top bar's settings go in `appBar`; `label` names the dialog (default: the top bar's title). `height` is accepted with Figma's options and ignored (decided with the user). Fills its container, hugs its content, top corners `Radius/900`, `background/surface`. Content section: `Space/400` sides, `Space/200` below, `Space/600` gap, centered; actions section: `Space/400` all round. It's a dialog; focus handling and closing on the scrim belong to the screen. The screen's `bottomSheetOnly` slot places it; the slide-up isn't built (no motion token).

### Reveal answer overlay ✅

Not its own component: a `bottomSheet` instance (component set `3675:30952`, page "🎨 Mascot & components", `height=M`) over a scrim. Figma frame `15878:20014`.

**Description:** a panel with the answer and any context the student needs (title, body copy) and an X to close. No action buttons: the student reads the answer, closes the sheet, then chooses to dictate again or skip. The sheet's empty bottom section slot is hidden, and the sheet hugs its content, so it grows to fit longer answers.

**When it's used:**
- "Reveal answer" on a partial, wrong or didn't-catch answer.
- "More info" on a correct answer, so the student can see Knowie's answer if they want to.

It sits over whichever answer screen opened it; the Figma frame only shows it over the didn't-catch-that state.

**States:**
- Open: answer, context and X.
- X: closes the overlay and returns to the answer screen. For incorrect answers that screen is in its after-reveal state (statusPill, micButton idle + ready, inputModeToggle voice, bottomCTA "Reveal answer" + "Next" after partial or wrong, "Reveal answer" + "Skip" after didn't catch). For a correct answer it's unchanged.

### progressIndicator ✅

Component set `15961:17510`, page "🎨 Mascot & components". Documented in Figma. Replaces an older ring-style set of the same name (`9003:8923`).

**Description:** shows how far through the current question set the student is; used in the top app bar during a question set. Not for loading states, and not for the score (that's `progressMeter` on Results). One property, `progress` (0, 25, 50, 75, 100); in code the fill is a percentage of the bar's width and the bar fills the space it's given.

**States:** `progress` 0 / 25 / 50 / 75 / 100. At 0 the fill is a round dot as wide as the bar is tall.

**Built** (`src/components/progressIndicator`, 2026-09-24). Prop `progress` is a number from 0 to 100 (Figma's five steps, plus any percentage in between; values outside are held to 0 to 100), and an optional `aria-label` (default "Progress"). 16px tall (`Indicator/Progress Height`, a new token), a `Radius/Full` pill in `background/stacking`, with a 1px `border/subtle` outline inside its edge; the fill is `accent/brand/bold`, `Radius/Full`, never narrower than the bar is tall. It's a progress bar for screen readers. `border/subtle` was in Figma but missing from `tokens.json`; it was added with Figma's value and description.

### textBlock ✅

Component set `9003:9039`, page "🎨 Mascot & components". Documented in Figma.

**Description:** a title with an optional caption under it, in four sizes. Use it as a section or screen heading with a supporting caption; don't turn `showCaption` on without real caption text. Figma notes it has no instances on the Example Screens page (one demo on the components overview), so its guidance comes from its structure. The design system names it for the text in a screen's content area.

**States:** `variant` XL / L / M / S; properties `showCaption` (on by default), `title` ("Header"), `caption` ("Caption").
- XL: Headline XL (76px) title and a Headline XS caption, centered, `Space/100` between.
- L: Headline L (44px) title and a Headline XS caption, centered, `Space/100` between.
- M: Body M Bold title and Caption M Regular caption, left-aligned, `Space/050` between.
- S: Body S Bold title and Caption S Regular (9px) caption, left-aligned, `Space/050` between.

**Built** (`src/components/textBlock`, 2026-09-24). Same properties and defaults as Figma. The block hugs its text and both lines fill its width. Colors `text/primary` and `text/secondary`. Measured against Figma: the same heights with the default text (100, 60, 42, 34px). XL and L titles are Inter, not Greed Condensed (unlicensed trial font), so they're wider than in Figma (XL "Header" 265px against 247px). The text is a pair of paragraphs and doesn't pick a heading level.

**The other "textBlock" set** (`15725:33034`, one variant named `variant5`, used 12 times inside "Mascot Segment" frames) is a different design: a question card (`background/surfaceQuestion` fill, "Q: ..." text) that `answerCard` in its `question` state already covers. It isn't built.

### tapToAnswer ✅

Component `15808:41585`, page "New components". No description in Figma.

**Description (from its use):** one line of dimmed, centered text that tells the student how to answer. One property, `Text`, "Tap to answer" by default. On the core flow screens it appears in the keyboard states (the typing screen, and the typing screen with the keyboard open), with the text changed to a "Type an answer" hint.

**States:** none.

**Built** (`src/components/tapToAnswer`, 2026-09-24). Prop `text` (Figma's "Text", same default). A plain paragraph, not a button: the input field is what the student taps. Fills its container, centered; Body S Regular in `text/secondary` with the line height (`font/lineHeight/sm`) and letter spacing Figma binds.

### Typing input screen ◐

Not a component: two screens, "Question / activeState keyboard option selected" (`15878:19708`) and "Question / activeState keyboard open" (`15878:19734`).

**Description:** where the student types the current answer instead of speaking. A "Type your answer" field replaces the mic.

**When it's used:** whenever inputModeToggle is on keyboard, whether the student chose it, declined the mic primer, or has the mic blocked.

**States:**
- keyboard selected: toggleGroup (keyboard) above the input field, system keyboard closed. No bottomCTA.
- keyboard open: system keyboard up (the `Keyboard` component, page "New components"), answer being typed. No bottomCTA; the keyboard covers the bottom of the screen.

Both screens also use the `tapToAnswer` component (page "New components").

**Known issue:** the input field is a hand-built frame ("Frame 1171277417"), not a component. `Chat Input` (component set in the file) may be the right one.

### progressMeter ✅

Component set `15862:14684`, page "New components". Documented in Figma.

**Description:** an 80×80 ring at the top of Results that shows the session score, with the score in the middle. Track `background/surface`, partial fill `accent/brand/bold`, full fill `accent/green/bold`, label text style `Greed/Body M Bold` (`type.body.m.bold` in tokens.json).

**When it's used:** in the "Stats Header" of the perfect-score and 2-of-5 Results frames. The mixed "Here's how it went" frame doesn't show it. Omit it entirely when the student got 0 correct (encouraging-tone rule), which is why there is no score=0 variant.

**States:** `score` 1 to 5.
- score=1 to 4: label shows the fraction (e.g. "2/5"), partial fill.
- score=5: label shows "100%", full green fill.

The denominator is fixed at /5 (fixed session length).

**Built** (`src/components/progressMeter`, 2026-09-24). Prop `score` 1 to 5 (no 0). Size `Indicator/Meter` (80px). Ring thickness is 15% of the radius (Figma's inner radius is 85%), worked out from the size (6px at 80px), so it needs no token. Drawn as an SVG ring from the top, clockwise, filling score/5; green for score 5. Label in Body M Bold, `interactive/primary`. Exposed as an image labelled "N out of 5" (", 100%" for a perfect score). The denominator is fixed at 5, as in Figma.


### resultsSummary ◐

Component set `15815:43943`, page "New components". Documented in Figma.

**Description:** a titled card on the end-of-session results screen that lists concepts in one category, one expandableResultRow per concept, up to 5 rows (the fixed session length).

**When it's used:** Results, once the session ends. Stack cards with 8px (`Space/200`) between them on the parent, not on this component.

**States:** `Property 1`.
- good-explanations: concepts explained well. Rows are tone=success.
- needs-practice: questions with a partial or wrong answer that the student moved on from with "Next". Rows are tone=error.
- skipped-questions: questions skipped before any attempt, or skipped after "Didn't catch that". Rows are tone=neutral.

**Rules:** don't show a card that has zero items. Hide any empty trailing row slot (`visible = false`), don't just leave it empty. All rows default to collapsed.

**Known issue:** only the mixed "Here's how it went" frame uses this component (skipped-questions + needs-practice). The perfect-score and 2-of-5 frames have hand-built "Good explanations" lists.

**Built** (`src/components/resultsSummary`, 2026-09-24). Figma's variant property "Property 1" can't be a prop name, so it's `category` (options as in Figma; decided with the user), and the stories keep Figma's variant names. Instead of five slots the card takes a `rows` array of `{ label, question, transcript }` (decided with the user) and draws an `expandableResultRow` per item, with the tone set by the category (success, error, neutral). It draws at most 5 rows and nothing at all for an empty list (the "no empty cards" rule). All rows start collapsed; the card keeps one row open at a time, or the parent controls it with `openRow` / `onOpenRowChange` for one open row across several cards. The card fills its container (358px in the screen gutters); padding `Space/400` on top and `Space/100` elsewhere, gap `Space/300`, rows `Space/100` apart, corners `Radius/600`; fills `accent/green/bold`, `feedback/error/bold`, `feedback/neutral/bold`. Title: fixed text per category, centered, Headline S size and weight (Figma's Button L style) with the line height `font/lineHeight/sm` and spacing `font/tracking/loose` that Figma binds. Measured against Figma: same 358×228 card with three rows.

**Known issue:** the title is `interactive/primary` (near-white) on the green and coral cards, about 2.1:1 and 2.5:1 contrast, under the 3:1 minimum for large text. The dark `interactive/onPrimary` (used on the neutral card) would give about 8.5:1 and 7:1.


### expandableResultRow ✅

Component set `15815:43883`, page "New components".

**Description:** one concept row inside a resultsSummary card. Collapsed it shows the concept name; expanded it also shows what the student said (verbatim transcript), so they can tell "misheard" from "wrong." Property: `transcript` (text), holding only the spoken words.

**When it's used:** inside resultsSummary on the Results screen, never on its own.

**States:** `state` (collapsed / expanded) × `tone` (success / error / neutral).
- success: fill `feedback/success/subtle`, icon Check. Used in good-explanations.
- error: fill `feedback/error/subtle`, icon X. Used in needs-practice.
- neutral: fill `background/surface`, icon DotOutline. Used in skipped-questions.
- collapsed (default): concept name + trailing CaretRight.
- expanded: adds the transcript detail.

Label → `text/primary`.

**Built** (`src/components/expandableResultRow`, 2026-09-24). Props `state`, `tone` and `transcript` as in Figma, plus two required code props, `label` (the concept) and `question`, because Figma types both into the layers. The transcript is shown in curly quotes; with no transcript the row says "Not answered.", as the neutral variant does. The header is a real button (`aria-expanded`); `onToggle(nextState)` lets the parent keep one row open at a time. The row fills its container; padding `Space/400`, gap `Space/200`, corners `Radius/400`; detail indented `Space/700`. The whole top of the card is the tap target (56px, over the 48px minimum). Chevron: right when collapsed, a quarter turn clockwise (pointing down) when open (Figma's -90 is counterclockwise-positive). Icons: Check, X, DotOutline in `feedback/success/onSubtle`, `feedback/error/onSubtle`, `interactive/onSecondary`; chevron `interactive/primary`. No motion on the chevron turn (no token for it yet). Measured against Figma: same 56px collapsed height, same icon, label and chevron positions.


### Mic and keyboard icons ✅

Components on "New components": `micIcon` (`15878:17726`), `micFilledIcon` (`15750:36175`), `micDisabledIcon` (`15753:36361`), `micBlockedIcon` (`15903:16777`), `keyboardIcon` (`15903:16824`).

**Description:** the glyphs used inside micButton and inputModeToggle.

**When it's used:**
- micIcon, keyboardIcon: inputModeToggle, voice and keyboard sides.
- micFilledIcon: micButton (idle + ready, idle + pressed, listening).
- micDisabledIcon: micButton (idle + disabled).
- micBlockedIcon: inputModeToggle blocked state.

**States:** none.

**Built** (`src/icons/`, 2026-09-24): `MicIcon`, `KeyboardIcon`, `MicBlockedIcon`, exported from Figma with `currentColor`, without the baked-in 48% opacity on the blocked mic and its slash (the `icon/tertiary` token carries it). `MicFilledIcon` and `MicDisabledIcon` were built with micButton.

### Shared library icons ✅

`X` (`15776:37347`), `CaretRight` (`15719:27474`), `DotOutline` (`15776:37499`) and `ArrowRight` (`15905:17412`), all `Format=Stroke, Weight=Regular` from the shared icon library (remote components, 32px masters).

**When it's used:**
- X: expandableResultRow (error tone, 16px); the close on bottomSheet overlays through buttonIcon.
- CaretRight: expandableResultRow, trailing. It's shown rotated 90° (pointing down) when the row is expanded.
- DotOutline: expandableResultRow (neutral tone, 16px).
- ArrowRight: the core flow's forward action (20px). The Bold weight in the library isn't used.

**Built** (`src/icons/XIcon.tsx`, `CaretRightIcon.tsx`, `DotOutlineIcon.tsx`, `ArrowRightIcon.tsx`, 2026-09-24). Exported from Figma with `currentColor` and a 2px stroke that stays 2px at any size, like `CheckIcon`. Passed into `iconSlot`. The local `x-close` (`3248:81244`, deleted source) is a different drawing (a filled glyph, not a 2px stroke), so it isn't built; the sheet close uses `buttonIcon` with the library X, as decided.

### buttonGroup ✅

Component set `9003:8455`, page "🎨  Mascot & components". Documented in Figma.

**Description:** a container that arranges a row or column of `button` / `buttonIcon` instances with consistent spacing. `variant` (Horizontal / Vertical) × `size` (M / L). Use it to group related actions, such as a bottom CTA row or the mic-permission pair ("Turn on" / "Not now"); don't put unrelated actions in one group. Figma notes only Horizontal / L was seen in use; Vertical and M are unconfirmed.

**When it's used:** the mic-permission sheet (PERMISSION-MIC, Vertical) and bottom action rows. Not used by `bottomCTA`, which has its own row.

**States:** none beyond the four variants. Vertical stacks a Primary and a Secondary button at full width; Horizontal puts a Secondary `buttonIcon` first and a Primary button filling the rest. Figma's group has no properties for its contents (the buttons inside carry placeholder text).

**Built** (`src/components/buttonGroup`, 2026-09-24). Props `variant` and `size` as in Figma, plus `children` (the buttons), since Figma edits the nested buttons per use. It fills its container (Figma's fixed 319px is a bottom sheet's content width). Gap between the buttons' tap areas: Vertical M `Space/0`, Horizontal M `Space/100`, both L `Space/200`; because a size M button's 48px tap area is taller than its 40px face, all four give about 8px between visible buttons (tested). In a Horizontal group text buttons share the width and an icon button keeps its own size. Children should use the group's size; the group doesn't force it. Measured against Figma: same heights (96, 48, 120, 56) and the same spacing.

### buttonIcon ✅

Component set `9003:8235`, page "🎨  Mascot & components". Documented in Figma.

**Description:** an icon-only button with the same Primary/Secondary/Tertiary × S/M/L × Default/Pressed/Disabled/Loading structure as `button`, for compact, self-explanatory icon actions in a top nav bar or button group. Don't use it where the icon alone doesn't make the action obvious. Figma notes only Secondary was seen in use (inside buttonGroup and topNavigation); Primary and Tertiary are inferred from `button`.

**When it's used:** the back and action buttons in appBar, and the close on bottomSheet overlays (Tertiary, M, with the library X).

**States:** `variant` × `size` × `state`, all 36 combinations exist. The visible circle is Control/S, M or L (32, 40, 56px) with a 16, 20 or 24px icon; the tap area is at least Control/Touch Target (48px).

**Built** (`src/components/buttonIcon`, 2026-09-24). Same props as Figma, plus an `icon` prop (Figma's icon container is empty in the component; each instance puts its own icon in) and a required `aria-label`. It reuses the `button` styles (tap area, bevel, pressed shift, spinner) and overrides only the face size, padding, icon colors and the Primary outline. Icon colors, which Figma sets per instance: `icon/primary` on Secondary and Tertiary, `interactive/onPrimary` on the Primary fill, `icon/disabled` when disabled. Loading swaps the icon for the spinner, as in `button`.

**Figma differences:** `buttonIcon` Primary has a 1px inside outline (`border/default`) in every state except Disabled; the text `button` Primary has none. Built as Figma has it for each; worth deciding which is intended.

## Open design questions

- **statusPill icons for wrong vs partial.** Proposal: switch wrong to `X` (same icon expandableResultRow already uses for the error tone, and already in the library) and keep `ArrowCounterClockwise` for partial. Correct = Check, partial = arrow, wrong = X, didn't catch = QuestionMark: four different shapes, so the states read without color.
- **Mic blocked** isn't shown on any screen yet (toggleGroup or inputModeToggle, keyboard + blocked).

## Tokens

Every token named in this file is in tokens.json, except the deprecated `accent/neutral/surface` (don't use it). `Space/0` and `Space/200` are `space.0` and `space.200`. Figma path `a/b/c` is `a.b.c` in tokens.json (e.g. `feedback/partial/bold` is `feedback.partial.bold`). Figma text style `Greed/Body M Bold` is `type.body.m.bold`.

## Figma cleanup

Housekeeping in the Figma file. Doesn't change what gets built.

- **appBar:** the XP counter (lightning + "2") is a hand-built "chips" frame inside the appBar main component (`15725:32304`, "🎨 Mascot & components"), not a `chips` instance. It shows on every screen.
- **SPLASH-FIRST-TIME:** "Skip" is now a `button` (Tertiary, S). Its "Right buttons" group is hidden in the design, so it doesn't show.
- **appBar:** its 9 back and action buttons are a legacy `App Bar Button Icon` whose source component is deleted. The swap to `buttonIcon` is not invisible: the legacy button shows a 24px icon, while `buttonIcon` Tertiary M shows 20px (Tertiary L keeps 24px but has a 56px tap area). appBar appears on 13 of the core flow screens.
- **expandableResultRow:** the rows inside `resultsSummary` come from a deleted copy (`15808:42383`). The documented set (`15815:43883`, "New components") has the same variants, properties and description, but the two haven't been compared layer by layer.
- **bottomSheetAppBar / bottomSheet:** the side buttons (`dismissButton`, `actionButton`) are still the old `App Bar Button Icon` (24px icon, local x-close and arrow-right icons), not `buttonIcon`; the local `x-close` is a filled glyph, not the library X. The `Default` type is a fixed 64px tall in the set but 72px inside a bottomSheet. The handle's corner radius (2) and its 6px offset from the top are typed in (`Radius/Full`, `Space/150`). The app bar sets are 375px wide but the bottomSheet master is 350px. The stories/variants of `height` only differ by placeholder content.
- **Deleted source components still in use** (they render, but can't be edited centrally): `progressIndicator` (13 uses, inside appBar; the new set exists and appBar will use it once it's built), the mascot's internal parts (`.mascotSlotBase`, `standby`, `approving`), and the `x-close` icon. The old ring-style `progressIndicator` set (`9003:8923`: Primary and Coral, 24 and 16 thickness, optional label) is still in the file next to the new one; delete or rename it so nobody instances it by mistake.
- **textBlock:** the second set named `textBlock` (`15725:33034`, variant `variant5`, 12 uses in "Mascot Segment" frames) duplicates `answerCard`'s question state and uses the deleted `Padding/lg` variable; swap those instances to `answerCard` and delete the set, or rename it so nobody instances it by mistake. The S caption is 9px, under the 11px caption minimum in the platform rules; Caption M (12px) would pass. The variants use the Greed Condensed trial font for XL and L.
- **tapToAnswer:** add a description. Every instance on the core flow screens reads "Tyoe an answer" (a typo for "Type an answer"). The text layer sits 20px down inside a 21px frame; it renders correctly in use, but the frame is worth tidying.
- **recordingGlow:** give the ellipses meaningful names (they're still "Ellipse 3902" to "3905"). `interactive/voiceFeedback/layer0` and `layer1` exist but aren't used; use or delete them.
- **expandableResultRow:** no text layer is linked to a property: the `transcript` property exists but changing it does nothing, and the concept name and question are typed into the layers. Link `transcript` to the transcript layer and expose the concept name and question as properties (code adds `label` and `question`). The transcript's quote marks are typed in and inconsistent (a straight opening quote, a curly closing one); the property's default text also differs from the text shown in the variants. The two quote frames are a fixed 313px, wider than the detail's 290px; make them fill. The detail's left padding is a raw 28 in the success variant (`Space/700` in the others). Icon structure differs by tone (success puts Check straight in the `Icon` layer, error wraps X in an `iconSlot`, neutral has a `DotOutline` layer and no `Icon` layer); icon and CaretRight fills are raw white, not a token; the error expanded variant has four nested frames all named `Detail`.
- **resultsSummary:** rename the variant property "Property 1" (code calls it `category`). Title contrast on the green and coral cards is about 2.1:1 and 2.5:1; the neutral card already uses the dark `interactive/onPrimary`. The top padding (16) and the gap (12) are typed-in numbers (`Space/400`, `Space/300`). In needs-practice and skipped-questions each row sits in an extra nested "Items List" frame (the good-explanations card doesn't). In the needs-practice card the error icon on the rows renders nearly invisible. 8 unused slot properties from earlier iterations (Row 4, error answer row 1/2/3, success answer row 5-8). Safe to delete; confirm first.
- **buttonGroup:** the group's width is a fixed 319 (not fill), and the gap isn't the same across variants (Vertical M is `Space/0`, Horizontal M `Space/100`, both L `Space/200`); it works out to about 8px visible in each, but a comment on the component would say so. There's no way to set the buttons' text from the group.
- **buttonIcon:** Primary has a 1px `border/default` outline that `button` Primary doesn't. The icon container is empty and the icon color is set per instance (Secondary uses `icon/primary`, the appBar's Tertiary uses `text/primary`); consider a documented icon color per variant.
- **micButton:** the listening/pressed icon contrast is about 2.3:1 (needs 3:1).
- **topicPill:** padding (6/12), gap (6), corner radius (100) and outline width (1) are typed-in numbers; bind them to `Space/150`, `Space/300`, `Radius/Full` and `Stroke/Border`.
- **middleSection** (`15851:10099`) isn't used anywhere. **keyboardOutline (legacy)** (`15878:17569`) is only used on the backup page.
- **"New components - backup" page** holds duplicate sets of statusPill, answerCard, expandableResultRow, Results summary and bottomCTA. The backup bottomCTA throws "Component set has existing errors." Delete the page or rename it clearly so nobody instances from it.
- **scaffold sizes:** the scaffold component has 8 size variants in Figma. design-system.md only uses two (iPhone 13 and 17 Pro Max); ignore the others. The voice screens use iPhone 13.
- **Moving components into slots:** moving an existing component instance straight into a scaffold slot corrupts it. Wrap it in a plain frame first.
- **bottomCTA labels:** the screens still show "Next question" and "Review 3 concepts"; the code uses "Next" and "Review" (see bottomCTA). Update the designs to match.
- **Plugin tip:** when querying this file through the Figma plugin API, use `findAllWithCriteria`. `findAll` throws "Unknown node type" on this file.
