# Component spec (source of truth)

Consolidates and supersedes `module-5-components-to-build.md`, `module-5-components-to-build-1.md`, and `module-6-component-spec.md`. Those three stay on disk as history but stop being edited, this file is what Claude Code and Figma work should be checked against going forward.

Legend: ✅ spec confirmed live, ready to build — ⚠️ open blocker, don't build yet — 🆕 needs a first Figma audit

## Why there were three files

`module-5-components-to-build.md` was the first pass: components pulled from the Module 5 screens, brief-level, not yet checked against the live Figma component definitions.

`module-5-components-to-build-1.md` was a revision of that same brief after the results screen got built, added `expandableResultRow`, dropped the Lifebuoy note because Direction B had just been picked.

`module-6-component-spec.md` was the buildable spec: each component re-verified against the live Figma file and tokens.json, with real variant/property/binding definitions. It explicitly superseded the module-5 files. This document now supersedes it in turn, mainly because `micButton` has since been rebuilt and needs re-verification, and a new component (the input-mode toggle) didn't exist yet when module-6 was written.

## Components

### micButton — ⚠️ needs re-audit
Rebuilt in Figma since the last spec was written, so the variant/binding details below are unverified, not just old. Confirm against the live component before building.

Last known spec: variant `state` (Ready / Listening / Denied / Disabled), property `icon` (instance swap). Ready/Listening fill → `interactive/primary`; Disabled fill → `background/surface`, stroke → `border/default`; Denied stroke was unbound black on the pre-rebuild version and needed binding to `border/default`, check whether the rebuild carried that fix over. Disabled is specifically "mic access still resolving," pair with `loadingDots`, not a generic greyed-out state.

### inputModeToggle — 🆕 new, not yet audited
Lets the student switch between voice and keyboard input at any point in the loop. Defaults to keyboard when mic permission is denied; the mic option stays selectable and, when tapped in that state, routes to re-enabling the permission rather than recording. Replaces the earlier can't-speak quiz-swap direction. Resolves the open Lifebuoy-icon question from the original module-5 notes: that icon was reserved for a voluntary "can't talk right now" trigger that never got a job, this toggle is that trigger. Decide whether the toggle reuses the Lifebuoy icon or introduces its own.

### Typing input screen — 🆕 new, not yet audited
Dedicated screen opened by the toggle for entering the current answer by keyboard. No existing spec to check against.

### recordingGlow — ✅
Separate instance from `micButton`, triggered by its Listening state, not a variant of it, so the two can change independently. Three stacked ellipses with layer blur. Fill (layer 1) → `interactive/voice feedback/layer 1`; confirm layers 2/3 are bound the same way rather than just matching visually. Add a boolean (e.g. `active`) only if code needs to query "off" as a real state.

### statusPill — ⚠️ open blocker
Built on a `chips` instance. Needs its own `tone` variant (success / partial / error / unclear) bound to the feedback semantic tokens, not an extension of `chips`' existing `color` variant, which is shared with every other `chips` usage in the file. Current raw VariableID bindings (Correct, Partial, Wrong, Didn't-catch) need resolving to names before the tone mapping is built. Blocker: whether `accent/neutral/surface` is the real intended token for the "unclear" tone or a placeholder is unconfirmed, don't build that mapping on a guess.

### loadingDots — ✅
Three ellipses, `itemSpacing: 4`, animated opacity/scale pulse. Rename the generic "Ellipse" layers to `dot1`/`dot2`/`dot3` so an animation handoff isn't guessing. Pairs with `micButton`'s Disabled state.

### answerFeedbackCard — ✅ (depends on statusPill's blocker clearing)
Two components, not one monolithic sheet: `previewCard` (statusPill + message) and `bottomCTA` (the two buttons), matching how the live file already splits them. `previewCard` gets a `result` variant (correct / incorrect) driving tone, secondary-button label, and message together so they can't drift apart. Secondary label: Correct → "Review answer," anything else → "Reveal answer." `bottomCTA` gets a `showNextQuestion` boolean, default false, since there's currently no way to represent "before the student has reviewed or revealed." Rename the message text layer (currently named after its own copy) to `message`.

### expandableResultRow — ⚠️ open blocker
Variant `state` (collapsed / expanded / error). Property `transcript` (text), split out of the current single baked-in string so the label stays fixed and only the spoken words are swappable. Row fill bindings (success/error) are raw VariableIDs, need resolving to names. Blocker: whether a real Check/X icon component exists to use here is unconfirmed, a Figma plugin API error previously blocked reading the page that would answer it.

## Cleanup, not new builds

Real `button` components already exist in the system but are hand-built frames with off-scale text on these screens: "Turn on"/"Not now" (permission modal), "Let's go!"/"Skip" (first-encounter primer). Swap for real instances, wrap paired buttons in a real `buttonGroup`.

"No thanks"/"Start quiz" on the mic-denied screen belonged to the quiz-swap direction. That screen's premise no longer applies now that the toggle handles mic-denied, confirm whether it still ships in any form before cleaning it up.

## Also still open, not re-verified recently

- 2 remaining hand-built `chips` frames
- 1 remaining hand-set 14px chip label
- Back-button icon on the Permission custom modal, still a plain frame, not a `button` instance
