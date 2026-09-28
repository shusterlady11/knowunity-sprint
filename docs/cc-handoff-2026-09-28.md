---
Handoff for CC: accessibility fixes + recordingGlow motion
Verified live against Figma file "Yummy__Knowie Design System (Copy)" (fileKey 1fSfWxZSPoaFQ8Dg36EGXs) on 2026-09-28.
---

## 1. What's actually fixed in Figma today

**resultsSummary component** (New components page, 15815:43943)
- `good-explanations` and `needs-practice` variant Titles rebound from `interactive/primary` to `interactive/onPrimary` (fixes contrast).
- `skipped-questions` variant was already correct, untouched.
- Hand-built duplicate frames converted to real component instances (so they inherit this fix and won't drift again) on:
  - **Module 5 core flow** page — 3 frames converted
  - **Core flow for Claude Code** page — "Results partial" and "Results perfect" converted

**micButton icon contrast** (New components page, 15878:19554)
- `idle/pressed`, `listening/ready`, `listening/pressed` icon vectors rebound to a new token, `accent/brand/onSubtleStrong` (was failing ~2.3:1 against `interactive/primaryActive`, now passes 3:1 / WCAG 1.4.11).
- `idle/ready` and `idle/disabled` untouched, already correct.

**text/tertiary contrast** (Foundations page)
- Repointed from `color/alpha/light-48` to a new primitive, `color/alpha/light-50` (4.34:1 → ~4.61:1, clears 4.5:1).
- `icon/tertiary` deliberately left on `color/alpha/light-48` — it's used on white backgrounds elsewhere in the product where raising opacity would have hurt contrast, not helped.

**Hand-built duplicate titles on New components page** (fixed, scoped)
- "Good Explanations Title" ×2 (15861:10185, 15861:10135) and "Needs Practice Title" (15861:10202) rebound from `interactive/primary` to `interactive/onPrimary`. Same backgrounds as resultsSummary (green `accent/green/bold`, red `feedback/error/bold`), same fix, computed 7–8.5:1.
- Deliberately **not** touched on `Module 6 component work` (nodes 15828:44376, 15861:12348) — different frames, no instance relationship, left alone per explicit scope.

**progressMeter component — all 5 score variants fixed** (New components page, master component 15862:14684)
- `1/5` through `4/5` and `100%` (nodes 15862:14663/14668/14673/14678/14683) rebound from `interactive/primary` to `interactive/onPrimary`.
- The `100%` variant sits on `accent/green/bold` and was measured at ~2.08:1 before the fix, a real failure, not a false flag. The `1/5`–`4/5` variants sit on `accent/brand/bold` (violet) and measured ~3.15:1 before the fix — passes WCAG's large-text 3:1 but fails normal-text 4.5:1, and at 18px/Semi Bold (600 weight) it's borderline which threshold even applies, so all 5 were fixed together for consistency rather than patching only the one the audit flagged.
- This is the master component, so the fix cascaded automatically to its instances on **New components** ("Results summary screen") and **Core flow for Claude Code** ("Results perfect" and "Results partial") — confirmed none of those instances had a local override on this fill, so nothing needed a separate touch.
- **Confirmed untouched**: Module 6's "100%" (15828:44436) is a hand-built duplicate with no instance relationship to this master — verified it's still on `interactive/primary` after the fix, exactly as intended.

**expandableResultRow check/x/chevron icons — verified, no fix needed**
- Measured all three tone variants against their actual backgrounds: success checkmark 9.2:1, error x-icon 6.45:1, neutral chevron 13.95:1. All comfortably clear the 3:1 non-text minimum (WCAG 1.4.11). The audit's "unverified" flag was appropriately cautious, but the actual numbers are clean. No change made.

## 2. New/changed tokens — pull these fresh, don't use a cached export

| Token | Type | Value | Notes |
|---|---|---|---|
| `color/violet/450` | primitive | `#7560D6` | New primitive |
| `accent/brand/onSubtleStrong` | semantic | aliases `color/violet/450` | Icon color for content on `interactive/primaryActive` where `accent/brand/onSubtle` fails 3:1 |
| `color/alpha/light-50` | primitive | `rgba(245,243,255,0.5)` | New primitive |
| `text/tertiary` | semantic | now aliases `color/alpha/light-50` | Was aliasing `color/alpha/light-48` |

Any token JSON pulled before today's session is stale on these four. No new tokens were needed for the title/progressMeter fixes — both reused the existing `interactive/onPrimary`.

## 3. Still open — not addressed this session

- **docs/component-spec.md cleanup list** — untouched.
- **Module 6 component work page** — still has both the duplicate-title bug and the progressMeter "100%" bug, by explicit instruction. If that page is ever used as reference, it's stale.

## 4. recordingGlow — this is a prototype, not a Figma update

The actual `recordingGlow` component in Figma (New components page, 15878:19671) is **unchanged**: still 4 static ellipses (168/136/120/106px), no reactions, no prototyping. CC is not missing an updated Figma component, it doesn't exist yet — the motion work today lives entirely in a code prototype.

**Prototype:** https://claude.ai/artifact/KcTChqHr32U2zs2hukRRY9

Spec, as validated in the prototype:
- **Ripple**: 1.5px stroke, `interactive/primary`, fires once per detected speech onset (not per frame) — a burst above amplitude 0.35 triggers one ripple, louder bursts (>0.58 amplitude) add a second smaller one 150ms later. Scale 0.4 → 1.5–2.8x, 900–1500ms, ease `cubic-bezier(.16,1,.3,1)`.
- **Glow**: two layers, a 220px crisp core (blur 2px) and a 360px soft halo (blur 20px), both `accent/brand/onSubtle`, breathing in sync on a 3400ms loop. Deliberately asymmetric: rises over ~25% of the cycle, falls over the remaining 75% — modeled on why breathing-exercise apps use a longer exhale than inhale for a calming effect, not a symmetric back-and-forth.
- **Reduced motion**: ripples still appear (feedback isn't lost) but without the scale animation; glow holds a static opacity instead of breathing.
- **Screen reader**: state changes ("Listening for your answer." / "Stopped listening.") go through a visually-hidden `role="status"` / `aria-live="polite"` region, separate from the visual state label — don't wire the terse visual label directly to `aria-live`, it reads as meaningless out of context.
- Only `transform` and `opacity` are animated (GPU-safe, per the ux-motion guidance we used to build this).

**Open decision, needs an answer before CC builds**: the prototype dropped the 4 static base rings that are recordingGlow's current resting-state ellipses, to isolate the new mechanic for review. Decide whether the real component keeps those rings underneath the glow/ripple layer, or whether they're being replaced outright — CC shouldn't infer this on its own.

## 5. Pre-build checklist for CC

1. Pull a fresh token export — don't reuse one from before today (see table above).
2. Build from `resultsSummary` and `progressMeter` component instances, not from the Module 6 hand-built frames (§3) — that page still has both bugs, left there deliberately.
3. Build recordingGlow's motion from the prototype spec in §4, not from Figma — Figma has no updated version of this component yet.
4. Get a decision on the base-rings question in §4 before starting, not after.
