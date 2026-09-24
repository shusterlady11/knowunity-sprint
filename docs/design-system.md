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
  any action other than "Continue." Exception: on the voice-recall
  screens, "Continue" is a Primary `button` inside `bottomCTA`, so it
  sits in the same bottom bar as every other action in that flow.

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

For the voice-recall components (micButton, recordingGlow, loadingDots, inputModeToggle, toggleGroup, topicPill, answerCard, statusPill, bottomCTA, progressMeter, resultsSummary, expandableResultRow, and the mic/keyboard icons), see §7.


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
  `buttonGroup`, a `CTA bevel button (Continue)`, or, on the voice-recall
  screens, a `bottomCTA` or `toggleGroup`. Don't put content here that
  isn't an action — it reads to the user as "the thing to do next," and
  anything else undermines that.
- **bottomSheetOnly** — holds a bottom-sheet overlay: a `bottomSheet`
  instance over a scrim, anchored to the bottom of the screen. In use on
  the mic-permission sheet ("Turn on" / "Not now" in a `buttonGroup`) and
  the Reveal answer overlay (answer, context and an X to close, no
  buttons). `bottomSheet` has S / M / L heights and grows with its
  content.

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
  heading — capitals are for proper nouns and acronyms only (XP, DNA),
  never for emphasis or because a mock somewhere used Title Case. That
  includes uppercase text-case styling: a label typed in sentence case
  but displayed in all caps still breaks this rule.
- **Never put a hue or lightness word in a semantic name.** Words for
  what a color *is* ("violet," "light," "dark," "LightVersion") belong in
  the primitive layer only (`color/violet/500`, not
  `text/violetLightVersion`). A semantic name describes a *role*
  (`text/primary`, `background/surface`), and it should be able to
  survive the actual color underneath it changing completely. Two
  deliberate exceptions: the emphasis modifiers `bold` / `subtle` (and
  their `onBold` / `onSubtle` pairs) at the end of a family, because
  they name how strongly a role is expressed, not a color
  (`feedback/success/bold`); and the `accent/*` family, whose role *is*
  a named decorative hue with no meaning attached (`accent/green/bold`).
  Don't add a hue word anywhere else.
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

- **One family per style, from the font tokens.** Display L uses
  `font/family/display`; every other style uses `font/family/default`.
  Figma uses `Greed Standard-TRIAL` for both. That font is unlicensed and
  can't ship, so in code both tokens resolve to `Inter`. If a Greed
  license is obtained, change the two values in tokens.json; nothing else
  moves. Don't pick a family by hand — if something needs to look like an
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
  real Figma Text Styles on the Foundations page (named `Greed/...`).
  Apply one of these to text rather than setting family/weight/
  size by hand, so a future type-scale change propagates instead of
  silently drifting. A component with a genuinely custom size outside the
  type scale (e.g. `listItem`'s 17px label, between Body S's 15 and Body
  M's 18) is a legitimate exception to the *size* — but its family and
  weight should still match what the nearest type-scale role would use,
  not be picked independently.

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

## 7. Voice-recall components

The components built for the voice-recall flow are specified in
`component-spec.md`: description, when each is used, every state, token
bindings and known issues. That file is the source of truth for them; this
file doesn't repeat it.
