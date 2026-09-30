---
recordingGlow — listening state spec
For CC. Verified live against Figma file "Yummy__Knowie Design System (Copy)" (fileKey 1fSfWxZSPoaFQ8Dg36EGXs), New components page, node 15878:19671, on 2026-09-29.
Prototype: https://claude.ai/artifact/KcTChqHr32U2zs2hukRRY9 (private — share access if CC needs to open it directly, everything needed to build is below)
---

## 1. Current component (idle state, unchanged)

`recordingGlow`, 168×168, 4 child ellipses, verified live:

| Layer | Size | Fill/stroke | Token | Resolved | Opacity |
|---|---|---|---|---|---|
| Ellipse 3902 | 168px | solid fill | `interactive/voiceFeedback/layer2` | `color/violet/500` #9178E6 | 20% (baked into token) |
| Ellipse 3903 | 136px | solid fill | `interactive/voiceFeedback/layer3` | `color/violet/400` #7B65E0 | 43% (baked into token) |
| Ellipse 3904 | 120px | 0.5px stroke | `interactive/secondary` | `color/alpha/light-10` (white, 10.2% opacity) | — |
| Ellipse 3905 | 106px | 0.5px stroke | `interactive/secondary` | same as above | — |

Don't touch this state or these tokens. This is the resting mic button, unchanged by the work below.

## 2. Decision: base layers stay, listening state adds motion on top

Keep Ellipses 3902–3905 exactly as they are for idle. For listening, animate them rather than introducing new nodes:

- **Ellipse 3902 (layer2, 168px)** becomes the outer glow halo. Add `blur(20px)`, animate `transform: scale()` and `opacity` per the breathe keyframes in §3.
- **Ellipse 3903 (layer3, 136px)** becomes the inner glow core. Add `blur(2px)`, animate the same way with its own keyframes.
- **Ellipses 3904/3905** stay static underneath, unchanged — they're the speech-feedback anchor points the ripples (§4) grow from.

Why reuse instead of building new gradient layers: `voiceFeedback/layer2` and `layer3` already exist as a two-tier system for exactly this component (lighter/lower-opacity outer, darker/higher-opacity inner), and the ordering already matches what the motion needs — outer=softer, inner=stronger. A blurred solid circle at animated scale reads visually the same as the radial-gradient wash I prototyped; there's no need for new fill types or new nodes. This keeps the token architecture aligned instead of adding parallel gradient definitions that could drift from layer2/layer3 over time.

If CC finds a technical reason to build separate gradient nodes instead (e.g. blur performance on the actual RN/web stack), the color/opacity/timing values below still apply — bind them to `voiceFeedback/layer2` and `layer3`, don't hardcode hex.

## 3. Glow motion — verified from prototype

Both layers loop independently of ripple amplitude — it's a fixed ambient pulse, not audio-reactive.

**Core (Ellipse 3903 / layer3):**
- Rest size 136px → prototype scaled a 220px node between 0.94–1.1x; if applied directly to the 136px ellipse, scale range is proportionally the same (0.94–1.1x of 136px).
- Blur: 2px
- Opacity: 0.5 → 0.88 → 0.5
- Duration: 3400ms, `ease-in-out`, infinite

**Halo (Ellipse 3902 / layer2):**
- Rest size 168px, scale range 0.92–1.12x
- Blur: 20px
- Opacity: 0.3 → 0.56 → 0.3
- Duration: 3400ms, `ease-in-out`, infinite

**Rhythm — asymmetric on purpose:** both rise over the first 25% of the 3400ms cycle and fall over the remaining 75%. This is the same rise/fall imbalance breathing-exercise apps use (quick inhale, longer exhale) because it reads as calming rather than a mechanical back-and-forth. Don't simplify this to a symmetric 50/50 ease-in-out — that was tried and rejected earlier in this process for feeling mechanical.

```css
@keyframes glow-core-breathe {
  0%   { opacity: 0.5;  transform: scale(0.94); }
  25%  { opacity: 0.88; transform: scale(1.1); }
  100% { opacity: 0.5;  transform: scale(0.94); }
}
@keyframes glow-halo-breathe {
  0%   { opacity: 0.3;  transform: scale(0.92); }
  25%  { opacity: 0.56; transform: scale(1.12); }
  100% { opacity: 0.3;  transform: scale(0.92); }
}
```

Only `transform` and `opacity` animate — GPU-safe, no layout thrash.

## 4. Ripple — new layer, speech-reactive

A pool of expanding ring outlines, separate from the static stroke rings (3904/3905), which stay put. Ripples fire on detected speech bursts, not continuously.

- Stroke: 1.5px
- Color: **not yet decided — see §5, needs your call**
- Base size: 106px (matches Ellipse 3905, the innermost static ring)
- Trigger: one ripple per detected speech onset. A burst with amplitude > 0.35 fires one ripple; if amplitude > 0.58, a second smaller ripple (0.65x the amplitude) fires 150ms later, layering two ripples for louder bursts.
- Scale: 0.4 → (1.5 + amplitude × 1.3), so louder speech produces a bigger ripple (range ~1.5x–2.8x)
- Opacity: starts at (0.5 + amplitude × 0.15), fades to 0
- Duration: (900 + amplitude × 600)ms, so louder speech also produces a slightly longer ripple (range 900–1500ms)
- Easing: `cubic-bezier(.16,1,.3,1)` — ease-out, no bounce
- Pool size: 6 DOM elements reused, not created per-frame

Amplitude source (0–1, smoothed): fast attack (0.18) climbing toward target, slow release (0.08) falling — modeled on VU/PPM meter ballistics so the visual doesn't twitch on every micro-fluctuation in the input signal.

## 5. Open token decision — needs your call before CC builds

The prototype's ripple used `interactive/primary` (`color/violet/50`, #F4F2FF, fully opaque). The existing static rings it sits next to use `interactive/secondary` (`color/alpha/light-10`, only 10.2% opacity white).

This is a real mismatch, not an oversight I'm papering over. Two options:

**A. Keep ripple on `interactive/primary` (opaque), deliberately.** Ripples are a brief, attention-grabbing burst signal, functionally different from the always-on static ring stroke. At 10.2% opacity (`interactive/secondary`), the ripple would barely register against the dark background, undermining the reason it exists. If you go this way, I'd add a new semantic token — something like `interactive/voiceFeedback/ripple` aliasing `interactive/primary` — so the deviation is documented in the token system rather than a component quietly referencing a mismatched token. Same pattern as `layer2`/`layer3` already existing for this component.

**B. Use `interactive/secondary` to match the static rings exactly**, accepting that ripples will be much subtler and rely more on the scale/motion than color contrast to read.

My recommendation is A — the ripple's whole job is to be a noticeable speech-feedback pulse, and a near-invisible stroke defeats that. But this is a visual call, not a technical one, and I haven't made it for you.

## 6. Reduced motion

- Ripples still appear (speech feedback isn't lost) but skip the scale animation — they fade in place instead of expanding.
- Glow core/halo hold a static opacity (core 0.75, halo 0.42 — the midpoint of their normal range) instead of breathing.
- Respect `prefers-reduced-motion: reduce`.

## 7. Screen reader pattern

State changes go through a visually-hidden live region, separate from any visible state label:

```html
<div class="sr-only" role="status" aria-live="polite" id="srAnnounce"></div>
```

```js
srAnnounce.textContent = listening ? 'Listening for your answer.' : 'Stopped listening.';
```

Don't wire `aria-live` directly to a terse visual label like "Listening" — out of context (no visible parent label read alongside it) that announces as a single meaningless word. The live region needs its own full sentence.

## 8. Not addressed here — product decisions, not mine to make

These affect the listening-state experience but weren't part of this motion spec and need a PM/eng call, not an invented default:

- **Silence timeout**: how long does the mic stay in listening state with no speech before it times out or prompts the user?
- **False positive / ambient noise handling**: what happens if background noise triggers ripples with no actual speech? Does the amplitude threshold (0.35) need a noise floor calibration step, or per-device tuning?
- **Quiet speaker floor**: a student speaking softly may never cross the 0.35 amplitude threshold, so the mic would look "on" but give a listener no ripple feedback at all, which could read as broken. Is there a minimum-ripple guarantee needed, or is this covered by other feedback (a level meter, a text hint)?

## 9. Build order

1. Confirm the §5 token decision before writing any code.
2. Apply glow motion to Ellipses 3902/3903 per §3 (or build separate gradient nodes if there's a technical reason to, using the same tokens/values).
3. Build the ripple pool per §4, bound to whichever token §5 resolves to.
4. Wire the live region per §7.
5. Add the reduced-motion branch per §6.
