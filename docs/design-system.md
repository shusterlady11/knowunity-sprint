design-system.md
Yummy / Knowie — component & convention rules

This file is rules, not values. For every color, size, radius, spacing
step, or type-scale number, see tokens.json — nothing here should ever
need updating because a number changed.


## 1. Component index — what to reach for

Situational, not exhaustive. Full three-part descriptions ("what it is /
when to use it / one thing not to do") live on each component set itself
in Figma — read those before using a component for the first time.

**Screen structure**
- Building a screen at all → start from `scaffold`, not a blank frame.
  See §2.
- A persistent top bar with a title/logo and 0–2 trailing actions →
  `appBar`.

**Actions**
- The one most important action on a screen → `button`, Primary, size L.
- A secondary or grouped action → `button`, Secondary or Tertiary.
- An icon-only action (no room or need for a label) → `buttonIcon`.
- Two or more related actions that belong together → `buttonGroup`
  (Horizontal or Vertical), wrapping `button` or `buttonIcon` instances —
  never lay buttons out by hand with manual spacing.
- The single "advance the flow" continue action at the bottom of a lesson
  or flow screen → `CTA bevel button (Continue)`. This is a dedicated,
  single-purpose component, not a Primary button — don't reach for a
  Primary button to do this job, and don't reach for this component for
  any action other than "Continue."

**Selection & filtering**
- A filterable or selectable pill, especially in a group → `chips`.
  Confirmed fill-only (`background/surface`, `radius/full`) — no
  border/stroke. Don't add one by analogy with cards or inputs just
  because `border/default`'s description mentions "container edges"
  generally; chips are the counter-example.

**Status & feedback**
- Step-based or percentage progress through a task → `progressIndicator`.
  It has five fixed steps (see tokens.json), not a continuous range —
  round to the nearest one rather than trying to bind an arbitrary
  percentage.
- A brief, transient status message after an action → `snackbar`. Not for
  anything the user must act on — it's a toast, not a modal.

**Content**
- A row with a leading icon/emoji and a label, especially one that
  navigates onward (shows a trailing chevron) or carries a status badge
  → `listItem`. This is NOT `chips` — easy to confuse since both are
  pill-shaped with an icon and a label, but `listItem` has real
  properties chips doesn't: larger text (17px vs. chips' 15px) and
  `radius/600` (24px) rather than a full pill. It's a real component set
  with three independent variant axes — `trailing` (Icon, Icon & Text,
  Switch, Checkbox, None), `variant` (Filled, Filled Compact,
  Transparent), and `state` (Default, Pressed, Selected) — so "which
  listItem" is really three choices, not one:
  - `variant=Filled` → `background/surface` fill, no border, a bottom
    inset-shadow bevel (not a border, even though it reads like an edge).
  - `variant=Transparent` → no fill at all (the page color shows
    through) and no border/bevel either.
  - `variant=Outlined` → `background/page` fill (not `background/surface`)
    *with* a visible `border/default` stroke at `stroke/heavy-border`
    (2px, not the standard 1px), `radius/800` (32px — not `radius/600`;
    corrected after the first pass read as too rounded against the live
    app). Added to the real component set for the Home-screen promo cards
    ("Dream College" / "Verified Study Plan") after confirming Filled and
    Transparent both failed to match the live app. Currently only exists
    for `trailing=Icon` and `trailing=None` (the two cases actually in
    use) — `Icon & Text`, `Switch`, and `Checkbox` don't have an Outlined
    member yet; that's a gap to fill deliberately if a future screen
    needs one, not to assume exists.
- A heading with an optional caption line → `textBlock`.
- Any icon, at any size, anywhere it appears (inside a button, a chip, a
  nav bar, standalone) → `iconSlot`. Never place a raw icon vector
  directly into a layout — wrap it in `iconSlot` so sizing and swapping
  stay consistent.
- The mascot illustration, at hero scale → `mascotSlot`. Always pull Knowie
  from the Figma design system file — "Yummy__Knowie Design System (Copy)"
  (file key `1fSfWxZSPoaFQ8Dg36EGXs`), "🎨 Mascot & components" page — export
  the real component (e.g. the `standby` instance) as SVG/PNG and use that
  asset directly. Never hand-recreate Knowie freehand from a screenshot: the
  real artwork has a hand-drawn crayon-texture edge, specific eye-ring styling,
  and a fixed leg count that are easy to get subtly wrong redrawing by eye.

If a situation doesn't map cleanly onto anything above, don't improvise —
see §4, "never invent a component."

For the five components built in the Module 6 voice-recall sprint (`statusPill`, `answerCards`, `bottomCTA`, `expandableResultRow`, `Results summary`), see §7 for full descriptions until they're folded into the situational index above.


## 2. Scaffold composition

Every screen is an instance of the `scaffold` component (two size
variants: iPhone 13 and 17 Pro Max — do not build a third size by hand;
if a screen needs a different device size, that's a gap to raise, not to
route around).

The scaffold has a fixed status-bar header at the top, and then four
named slots. A slot is empty space until you put something in it — never
delete or rename a slot to make a screen "fit."

- **topNavigation** — the screen's nav row. In practice this holds an
  `appBar`, or a lighter hand-built row combining `buttonIcon` (back /
  close), a `progressIndicator` (lesson progress), and `button` (a
  trailing text action). Whatever you put here should read as
  "navigation," not page content.
- **middleContent** — the screen's actual content: text via `textBlock`,
  lists, `mascotSlot` for a celebratory or milestone moment, results,
  cards. This is the only slot that's expected to scroll or vary
  substantially in height from screen to screen.
- **bottomContent** — the screen's primary action(s): a `button`, a
  `buttonGroup`, or a `CTA bevel button (Continue)`. Don't put content
  here that isn't an action — it reads to the user as "the thing to do
  next," and anything else undermines that.
- **bottomSheetOnly** — reserved for a bottom-sheet overlay. It's empty
  on every example screen this system currently has, so treat "how a
  populated bottom sheet should look" as unconfirmed rather than
  inventing a pattern for it.

A screen is the scaffold plus what you put in its slots — it is not a
new frame that happens to look similar.


## 3. Naming conventions

Two conventions coexist in this file. Follow the first one going
forward; the second is a legacy pattern to recognize, not to extend.

**The convention in current use** (components, variant properties,
semantic tokens, typography):
- lowerCamelCase, no spaces: `buttonIcon`, `progressIndicator`,
  `mascotSlot`.
- Variant and boolean property names are also lowerCamelCase:
  `variant`, `size`, `state`, `showLeftIcon`, `showCaption`.
- Semantic tokens are lowercase, slash-delimited paths that read as
  role → sub-role → modifier: `background/page`, `accent/green/bold`,
  `interactive/onPrimary`. Compound words inside a segment are
  camelCase (`onPrimary`, `pressedInverse`, `linkHover`), never
  hyphenated or spaced.

**The legacy exception to recognize:** the raw sizing scale (spacing,
radius, icon, illustration steps) and a handful of older color
primitives use Capitalized-Category/Value naming instead —
`Radius/Full`, `Icon/200`, `Surface/Page`, `Homie/Inkwell`. Don't take
this as license to capitalize new names; it's inherited, not the
standard. `CTA bevel button (Continue)` is a further one-off (Title
Case, spaces, parentheses) — treat it as a named exception for that one
component, not a pattern.

When in doubt, match the lowerCamelCase / slash-path convention, not the
legacy one.


## 4. Never do this

- **Never invent a value that isn't in tokens.json.** If a color, size,
  radius, or type value you need doesn't exist there, say so and ask —
  don't eyeball something close and drop it in. Caught in practice: the
  Home screen's horizontally-scrolling rows (promo cards, quick-action
  chips, the composer) were built with an 18px edge inset that isn't on
  the `space/*` scale at all — it "looked about right" against the
  reference. Corrected to `space/200` (8px).
- **Never use a CSS fallback value** like `var(--token, #333)`. If a
  token resolves to nothing, that's a bug in the token pipeline to go
  fix, not a gap to paper over in the component.
- **Never use anything but sentence case** on a label, button, or
  heading — capitals are for proper nouns only, never for emphasis or
  because a mock somewhere used Title Case.
- **Never put an appearance word in a semantic name.** "Bold," "subtle,"
  "light," "dark" — words that describe how a color *looks* — belong in
  the primitive layer only (`color/violet/500`, not
  `text/violetLightVersion`). A semantic name describes a *role*
  (`text/primary`, `background/surface`), and it should be able to
  survive the actual color underneath it changing completely.
- **Never read a primitive directly from a component.** Components
  consume the semantic layer only; the semantic layer is the only thing
  allowed to reference a primitive. If a component needs a color that
  the semantic layer doesn't yet expose, that's a semantic-token gap to
  raise — not a reason to reach past it.
- **Never build something new when a component in this system already
  does the job.** This file has accumulated duplicate, disconnected
  copies of the same component before (multiple unrelated `button` and
  `buttonIcon` component sets have existed side by side at different
  times) — that's the exact failure mode this rule exists to prevent.
  Search for an existing component and read its description before
  creating anything.
- **Never invent a component to fill a gap.** This is a real system
  that's extended on purpose, not organically. If nothing here covers
  what you need, say plainly what's missing and propose a name for it —
  and let it be a decision, not a fait accompli.

Two more, learned directly from cleanup work done on this file:

- **Never leave a component set with two variants that resolve to the
  same name.** A duplicated variant combination (e.g. two "Tertiary,
  size=S, state=Loading" entries in one set) makes the whole component
  set invalid in Figma, not just the duplicate — check for this after
  any copy/paste into a component set.
- **Never leave a stray duplicate half-cleaned up.** A component that's
  been detached from every page still exists in the file and can get
  picked up by accident later. If you're removing or replacing a
  component, confirm it's actually gone, not just out of sight.

One more, learned from recreating a real screen outside Figma (HTML/code,
not a Figma instance):

- **Never add a style property "because that category of element usually
  has one."** A token's USE list (e.g. `border/default`: "Card outlines,
  dividers, input borders at rest, separators") describes where that
  token is commonly applied, not a guarantee every visually-similar
  element gets it — `chips` sits right next to cards and inputs and still
  has zero stroke. When recreating a screen or component outside Figma,
  check that specific component's real definition (e.g. Figma's
  `get_design_context`, or the component's actual instance) before adding
  a border, shadow, or anything else by assumption.

## 5. Typography

- **Two font families, split by role, never mixed.** Display and Headline
  sizes (the whole `type/display/*` and `type/headline/*` scale) use
  `font/family/display` (Display L only) or `font/family/heading`
  (everything else in that range) — both resolve to the real
  `Greed Condensed-TRIAL` family in Figma. Body and Caption sizes use
  `font/family/default`, which resolves to `Inter`. There is no style
  that mixes the two within itself, and no reason to reach for Greed on
  body copy or Inter on a headline — if something needs to look like an
  exception, that's a gap to raise, not a one-off swap.
- **Weight comes from the type style, not from eyeballing "how bold it
  looks."** `font/weight/heavy` (800) is paired with `font/family/display`
  for Display L specifically and nowhere else. Headline sizes use
  `font/weight/bold` (700) down through `font/weight/semibold` (600) and
  `font/weight/regular` (400) at the XS/XXS sizes — never Heavy. If a
  design calls for something bolder than a headline size's own defined
  weight, that's a real discrepancy to flag (as happened with the
  Home-screen promo cards, and separately with a stray `900` weight found
  on a few Figma text styles that didn't match any defined token) — not a
  reason to bump the weight until it "reads right."
- **A shared Text Style before a hardcoded font, whenever one exists.**
  All 20 Display/Headline/Body/Caption combinations are registered as
  real Figma Text Styles on the Foundations page (named `Greed/...` for
  historical reasons — the name doesn't imply every one of them uses the
  Greed font; eight of the twenty, all Body and Caption, correctly use
  Inter). Apply one of these to text rather than setting family/weight/
  size by hand, so a future type-scale change propagates instead of
  silently drifting. A component with a genuinely custom size outside the
  type scale (e.g. `listItem`'s 17px label, between Body S's 15 and Body
  M's 18) is a legitimate exception to the *size* — but its family and
  weight should still match what the nearest type-scale role would use
  (Inter, for body-ish content), not be picked independently.

## 6. Spacing

- **Every gap and margin comes from the `space/*` scale in tokens.json** —
  0, 2, 4, 6, 8, 12, 16, 24, 28, 32, 48, 64, 96, 160, and so on. Not "a
  round-ish number," not "whatever looked right" — one of these values,
  full stop. A 1-3px nudge to make something "sit better" is still an
  invented value if it isn't on this list.
- **The scale is not evenly incremented, especially past 32.** It jumps
  32 → 48 → 64 → 96 → 160. When you're matching a specific measurement
  (from a spec, a screenshot, a redline) to the scale, round to the
  nearest defined step rather than assuming the steps keep going up by a
  fixed amount — and if two candidate steps are both plausible, check the
  result visually rather than trusting the arithmetic alone.
- **Two visually-parallel elements should share one spacing value, not
  two close-but-different ones.** If measuring off a screenshot gives you
  4px for one icon-to-label gap and 6px for what should be the identical
  relationship elsewhere, that's almost always measurement noise (an
  icon's irregular bounding box, antialiasing) — pick one token and apply
  it consistently rather than encoding the discrepancy as if it were
  intentional.
- **Not every visual gap is a fixed margin — some are centering.**
  Content whose height changes by state (a greeting that's one line vs.
  two, a hero area that may or may not carry a subtitle) is often meant
  to sit centered in its available space, not pinned a fixed distance
  from a reference point above it. A fixed margin measured off one
  screenshot will only look right for that one state; if the content
  varies, the correct implementation is usually `justify-content:center`
  (or equivalent) on the container, with spacing tokens reserved for the
  fixed relationships within the centered block itself (e.g. mascot to
  headline, headline to chips).

## 7. Module 6 components (voice recall sprint)

Five component sets built for the Knowie voice-recall flow, all on the
"New components" page of this file in Figma. Descriptions below are
reproduced verbatim from each component set's own Figma description field
-- read them there first if you want the live, most-current version;
this section is a snapshot of them, plus properties pulled directly from
each set's component-property definitions.

### statusPill

Component set. Variants -- `state`: correct / wrong / notCaught / partial.
Other properties -- `Label` (TEXT, default "Correct"), `left icon`
(BOOLEAN, default true).

> Small colored label reporting how a spoken answer was judged, shown
> inside the Answer feedback sheet after a student speaks a term aloud.
>
> USE: exactly one per feedback moment, right after Knowie has judged an
> answer -- correct, partial, wrong, or a mishearing. States: correct
> (feedback.success), wrong (feedback.error), partial (feedback.partial,
> its own tone -- not a downgraded success), notCaught (feedback.neutral).
> notCaught means the app didn't hear or transcribe the answer; it's not
> a judgment on the student, so it must never read as a failure state or
> reuse feedback.error.
>
> Each variant carries its own fixed label text and icon (Check /
> ArrowCounterClockwise / ArrowsClockwise / QuestionMark) -- not editable
> free text, since the wording is part of the state's meaning. The
> leading icon can be hidden via the "left icon" property if a screen
> needs the pill without one, but the icon set per state shouldn't be
> swapped.
>
> DON'T: don't use this for anything other than the outcome of a single
> spoken-answer attempt (it's not a generic status/tag component -- see
> chips for that). Don't combine states, invent a new state without a
> matching feedback/* token pair, or pick colors by eye -- every fill and
> text color here is bound to a feedback/* variable and should stay that
> way.

### answerCards

Component set. Variants -- `Property 1`: Default / question / processing /
answer-correct / answer-partial / answer-error / answer-notcaught. (Axis
not yet renamed off Figma's default `Property 1` -- see conventions
below.) No other properties.

> The single scrollable card for whatever Knowie is currently saying or
> asking in the recall flow. One instance per turn.
>
> USE
> Pick the Property 1 variant for the moment:
> - Default -- generic "Knowie is talking, not posing a question" card
>   (e.g. the welcome/intro message). Plain text, no pill.
> - question -- the question text itself.
> - processing -- loading message + 3 skeleton bars. The message
>   ("Mashing potatoes...") is placeholder copy, meant to rotate through
>   a set of short, cheeky "what Knowie's doing" lines each time this
>   state appears -- not fixed text.
> - answer-correct / answer-partial / answer-error / answer-notcaught --
>   a statusPill (state=correct/partial/wrong/notCaught, paired with its
>   matching icon: Check/ArrowCounterClockwise/ArrowsClockwise/
>   QuestionMark) plus a grounded feedback message.
>
> DON'T
> Don't put question copy in Default or vice versa. Don't hand-color the
> statusPill or its icon -- tone comes from the pill's own state
> property.

### bottomCTA

Component set. Variants -- `layout`: Two button no drawer / Two button
drawer / Two button drawer / Secondary / One button drawer / primary /
One button drawer / secondary. Other properties -- `Show
secondaryButton` (BOOLEAN, default true) -- only meaningful on the
"Two button drawer" variant; not wired to either button on "Two
button drawer / Secondary."

> The bottom action bar anchored to the base of the question/answer screen —
> carries the primary/secondary CTAs and, in three variants, the drawer that
> reveals the answer.
>
> USE
> Place at the bottom of the screen. Pick the layout variant for the moment:
> • Two button no drawer — secondaryButton "Reveal answer" + primaryButton
>   "Next question" side by side. Both always visible (no show/hide toggle
>   by design). Gap Space/100 (4px), side padding Space/400 (16px),
>   top/bottom padding Space/600 (24px) on the outer frame — all bound.
>   Height hugs content (104px). This is the static, splash-screen pairing —
>   not mid-flow.
> • Two button drawer — outer frame has no padding of its own and hugs to
>   112px. Its one child, "bottomSheet," is a full-bleed (edge-to-edge,
>   390px) fixed 112px panel — fill/stroke/radius all token-bound — that
>   centers the buttonRow (16px side padding, Space/100 gap, both buttons
>   FILL width) both vertically and horizontally inside it. Has an optional
>   boolean "Show secondaryButton" (default true) to hide "Reveal answer"
>   once it's been used — when hidden, primaryButton correctly re-fills the
>   full row width.
> • Two button drawer / Secondary — same bottomSheet/buttonRow structure and
>   112px panel as "Two button drawer." Left button (layer "button") is
>   styled Tertiary, CTA "Reveal answer"; right button (layer
>   "secondaryButton") is styled Secondary, CTA "Skip" — fill verified bound
>   to interactive/secondary. The "Show secondaryButton" boolean is not
>   wired to either button in this variant; both are always visible. Reach
>   for this on screens that already have their own primary CTA elsewhere
>   (e.g. the mic) — the drawer itself needs to stay secondary/low-emphasis,
>   appearing or disappearing as the moment calls for it, and its lighter
>   treatment signals the user is inside a multi-step flow rather than
>   looking at a static, one-shot screen.
> • One button drawer / primary — same idea, single full-width primaryButton
>   centered in its own bottomSheet panel. Frame height is fixed at 112px to
>   match "Two button drawer" (previously mismatched at 108px — fixed).
> • One button drawer / secondary — for screens where the mic icon (not this
>   component) is the real primary CTA, e.g. the mic-tap-to-answer screen.
>   Single full-width button, but styled Secondary so it doesn't compete
>   with the mic. Currently used for "Skip."
>
> NOTE: when switching a button instance's variant property (e.g. Primary →
> Secondary), check its fill afterward — a leftover instance-level color
> override from before the switch can survive the variant change and keep
> showing the old color instead of picking up the new variant's token. Any
> Secondary button in this set needs to resolve to interactive/secondary to
> read correctly against the dark bottomSheet; verify that binding rather
> than trusting the variant value alone. (Caught once on "One button drawer
> / secondary"; confirmed clean on "Two button drawer / Secondary.")
>
> REMAINING GAP (not yet built)
> The bottomSheet panel is still an empty placeholder — no content or slot
> wired up yet for the revealed answer itself.
>
> DON'T
> Don't add a 3rd button to buttonRow. Don't hardcode button labels — use
> each button instance's CTA text property.

### expandableResultRow

Component set. Variants -- `state`: collapsed / expanded, crossed with
`tone`: success / error / neutral (6 variants total). Other properties --
`transcript` (TEXT, default sample sentence).

> One row in the results screen's Good Explanations / Needs Practice /
> skipped-questions lists. `state` (collapsed/expanded) controls the
> chevron rotation and whether the transcript detail is shown --
> accordion logic (only one row open at a time) is real interaction
> logic to build in code, not something this static set can demonstrate
> beyond a reference frame. `tone` (success/error/neutral) sets the
> leading icon (Check/X/DotOutline) and the row fill from the feedback
> token set. `transcript` holds only the raw spoken-answer text -- the
> "What you said:" label is fixed structure, not a property. Never put a
> summary or hint in `transcript`.

### Results summary

Component set. Variants -- `Property 1`: good-explanations /
needs-practice / skipped-questions. (Axis not yet renamed -- see
conventions below.) Other properties -- SLOT properties for each row:
`row 1` (shared by all three variants, independent content per variant),
plus `good-explanations row 2`, `good-explanations row 3`,
`needs-practice row 2`, `needs-practice row 3`, `skipped row 2`,
`skipped row 3`. Eight further SLOT properties from earlier iterations
(`Row 4`, `error answer row 1-3`, `success answer row 5-8`) are still
defined but unused -- not wired to any visible row, safe to delete once
confirmed.

> The end-of-session results list. Stacks up to 3 expandableResultRow
> instances to recap how the student did.
>
> USE
> Show once the recall session ends. Pick the Property 1 variant for the
> tab being shown:
> - good-explanations -- rows "row 1" (shared slot, see below),
>   "good-explanations row 2", "good-explanations row 3".
> - needs-practice -- rows "row 1" (shared), "needs-practice row 2",
>   "needs-practice row 3". Partial answers live here -- there's no
>   separate partial-answer card.
> - skipped-questions -- rows "row 1" (shared), "skipped row 2",
>   "skipped row 3".
>
> "row 1" is one shared slot property reused across all three variants
> (same property key, independent content per variant) -- that's
> intentional, same pattern as a shared text/boolean property on a
> button set.
>
> SPACING
> Rows within one card: Space/100 (4px), bound on the Items List frame
> -- already correct. Between separate top-level Results summary cards,
> when more than one is shown on a screen (e.g. Good Explanations +
> Needs Practice + Skipped Questions stacked together): Space/200
> (8px). No screen currently places multiple instances together, so
> this is documented here for whenever that layout gets built -- set it
> on the parent frame that stacks the instances, not on this component
> itself.
>
> KNOWN ISSUE (flagged, not fixed)
> The row-1 slot's preferredValues are still restricted to the two
> success-tone expandableResultRow components, and every currently-filled
> row instance across all three variants -- including needs-practice and
> skipped-questions -- is still the success-tone "Row 1 / collapsed /
> success" component. Until the filled instances are swapped to the
> matching tone (partial for needs-practice, neutral for skipped) and the
> slot's preferredValues opened up, all three tabs will visually show
> green/success rows regardless of which tab it is.
>
> DON'T
> Don't exceed 3 rows per variant. Don't repurpose "row 1" for anything
> other than each variant's first row.

### Naming & structure conventions from this sprint

What was actually used building these five, and where it does and
doesn't line up with §3:

- Component set names are lowerCamelCase, no spaces, matching the rest
  of the system -- `statusPill`, `answerCards`, `bottomCTA`,
  `expandableResultRow`. **`Results summary` is the one exception**
  (Title Case, with a space) -- not an intentional named exception like
  `CTA bevel button (Continue)`, just not yet conformed. Rename it to
  `resultsSummary` next time it's touched, or decide it's a deliberate
  exception and say why.
- Variant axis names are lowerCamelCase where they were renamed --
  `state` (statusPill, expandableResultRow), `tone`
  (expandableResultRow), `layout` (bottomCTA). **`answerCards` and
  `Results summary` still use Figma's default `Property 1`** -- neither
  got renamed to something meaningful. Cleanup item, not a pattern to
  copy.
- Boolean properties didn't fully land on the established `showXxx`
  camelCase pattern (§3): statusPill's is `left icon` (lowercase,
  space) and bottomCTA's is `Show secondaryButton` (Title Case, space) --
  neither matches `showLeftIcon`/`showCaption`. Worth conforming both to
  `showXxx`-style naming next time they're touched.
- TEXT properties are inconsistent in case: `Label` (statusPill,
  capitalized) vs. `transcript` (expandableResultRow, lowercase). Prefer
  lowercase, matching `transcript`.
- SLOT properties are new to the system as of this sprint and introduce
  a third naming style not covered by §3: lowercase words with
  spaces, and a hyphenated variant-name prefix for tab-scoped rows --
  `row 1`, `good-explanations row 2`, `needs-practice row 3`, `skipped
  row 2`. Reads fine in the Figma properties panel; whether it should be
  tightened to camelCase (`row1`, `goodExplanationsRow2`) is an open
  decision, not yet made either way.

Six structural lessons worth carrying forward:

1. A variant's own component name must be exactly `propertyName=value`
   (with the `=`). Renaming it to a plain descriptive string breaks the
   entire component set -- Figma throws "Component set has existing
   errors" and blocks reading *any* of its properties, not just that
   variant's. Happened to bottomCTA today.
2. Turning on auto layout (`layoutMode`) on a frame doesn't by itself let
   its children take FILL/HUG sizing if that frame's *own*
   `layoutPositioning` -- relative to *its* parent -- is still
   `ABSOLUTE`. Reset that on the frame itself first, not just on its
   children.
3. Prefer a hugging (not fixed) outer frame height whenever a variant's
   content can legitimately differ in size from its siblings in the set
   -- a stale fixed size silently overflows or clips instead of growing
   rather than reporting bounds that match what's actually visible.
   (bottomCTA's "One button drawer" hit exactly this -- fixed at 108px
   while its bottomSheet rendered at 112px -- until the height was
   corrected to match.)
4. A component property (including a SLOT) can be legitimately shared --
   same name and key -- across multiple variants in one set, each
   variant holding independent content. Results summary's `row 1` slot
   is intentionally reused by all three tabs; that's a supported
   pattern, not something to "fix" by splitting into three separate
   properties.
5. Deleting and recreating a component -- including via a page
   duplicate/restore -- gives it a brand-new node ID, and its
   description and any component-property renames do **not** travel
   with the copy. Re-verify both after any such operation. (Results
   summary lost both this way today and had to be redone.)
6. Switching a button instance's `variant` property (e.g. Primary to
   Secondary) does not guarantee its fill updates to match -- a
   color override left on the instance from before the switch can
   survive it and keep showing the old variant's color. Always verify
   the actual bound variable on the fill after a variant swap, not just
   the variant property's value. (bottomCTA's "One button drawer /
   secondary" button kept showing its old color after being switched to
   Secondary, until the fill was rebound to interactive/secondary by
   hand.)
