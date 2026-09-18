# Platform Constraints: Knowunity

## Scope for this sprint

**Mobile iOS only. 390px. Dark mode only.**

Knowunity ships on iOS, Android and web, and the design system has desktop and
tablet modes. None of that is in scope here. Every screen you design and every
screen you build targets one canvas: an iPhone, 390px wide, in dark mode.

This is a deliberate constraint, not a simplification. Over 70% of Knowunity
usage is on phones, the recall step is a phone behaviour, and one target means
you spend your time on the experience instead of on breakpoints.

If a decision only makes sense at a wider width, it's out of scope.

---

## What you're actually building

Worth being blunt about this, because the gap trips people up in Module 11.

**You are building a web app that looks and behaves like an iOS screen.** Not a
native app. It runs in a browser, it deploys to Vercel, and you view it at 390px
wide. It should be indistinguishable from the real thing to anyone watching your
walkthrough video, and it is still a web page.

What follows from that:

- **No native APIs.** No native haptics, no native permission sheets, no native
  navigation transitions. Anything iOS gives you for free, you build.
- **Safe areas are yours to handle.** Use `env(safe-area-inset-top)` and
  `env(safe-area-inset-bottom)` with `viewport-fit=cover`, or fake them with
  fixed padding. Don't let content sit under a status bar or a home indicator.
- **Test it on a phone, not just in a browser at 390px.** Add it to your home
  screen and open it. Things that looked fine in a desktop window stop looking
  fine the moment there's a real thumb and a real notch.
- **The iOS Simulator is optional.** Useful for a convincing recording, not
  required for the build.

---

## What's mocked, and what that means

**The recall itself is mocked.** No real speech-to-text, no real AI judging. You
are designing and building the experience, not the engine.

In practice:

- **The transcript is fake.** You decide what the student "said." Hard-code a
  few answers: a good one, a partial one, a miss.
- **The verdict is fake.** You decide whether it passed. Which means you get to
  design what a partial looks like without waiting on a model to produce one.
- **The latency is fake, and you have to build it anyway.** The real thing takes
  a few seconds. If your prototype answers instantly, you have not designed the
  hardest state in the whole feature. Put a real delay in and design what fills
  it.
- **The microphone is your call.** You can capture real audio with
  `getUserMedia` for the feel of it, or mock the recording state entirely.
  Neither is wrong. Real capture needs HTTPS, which Vercel gives you, and it
  gets you a genuine permission prompt to design around. Mocking is faster.
  Decide early and don't burn a day on it.

---

## The canvas

- **Width:** 390px (iPhone 14/15 class). Matches the `scaffold` component in the
  design system.
- **Mode:** dark only. The system has one mode.
- **Safe areas:** account for the status bar at the top and the home indicator
  at the bottom. The `scaffold` handles both — build inside it rather than
  around it.
- **Thumb zone:** primary actions sit low. Anything a student taps repeatedly
  during the recall loop, the mic especially, belongs where a thumb naturally
  rests, not at the top of the screen.

Real students are on everything from an iPhone SE (320px) up to a Pro Max
(430px). Design at 390 and don't let anything break when it's narrower.

---

## Touch and input

- **Minimum touch target: 44x44pt.** Non-negotiable, and the mic affordance is
  the one that matters most here.
- **No hover.** No tooltips, no hover menus, no hover-revealed affordances.
  Anything that only exists on hover doesn't exist.
- **Press feedback on everything tappable.** A subtle scale down on press,
  return on release. Nothing should feel dead under a finger.
- **Voice input is push-to-talk.** Hold or tap to record, explicit stop to send,
  cancel and re-record before sending. No auto-detection of when someone has
  finished speaking. See `05-voice-ux-reference.md`.

---

## Spacing

4px base unit. Every spacing value is a multiple of 4.

| Value | Use |
|---|---|
| 4px | Icon-to-label gaps |
| 8px | Within compact components |
| 12px | Padding inside cards, list item gaps |
| 16px | Standard padding, section gaps, screen margins |
| 20px | Between related groups |
| 24px | Section padding |
| 32px | Between major sections |
| 40px | Screen-level spacing |
| 48px | Major separations |

**Screen margins: 16px left and right.** Single column. Cards and content blocks
run edge to edge minus margins.

The design system's `Size` collection holds the real values. Use those tokens,
not these numbers, once you've extracted them in Module 7. This scale is here so
you can sanity-check the extraction.

---

## Typography

- **Use Inter Variable.** Knowunity's real font is custom and can't be shared
  outside the company, so Inter Variable is the substitute for every prototype
  in this sprint. Don't go hunting for the real one.
- **Minimum body text: 14px.** Minimum caption or helper text: 11px.
- **Line height: 1.4–1.6 for body.** Readability matters more than usual here:
  students are reading Knowie's feedback while stressed.
- Load the font properly. Subset it, preload it, and set a system fallback so
  nothing reflows on first paint.

---

## Color and contrast

- **All text and UI must meet WCAG 2.1 AA:** 4.5:1 for body, 3:1 for large text
  and UI components.
- Dark mode is where contrast quietly fails. Check it, don't assume it.
- **Never use color as the sole indicator of meaning.** Pair it with an icon,
  a label, a shape or motion. This matters most on the recall result: got it,
  partial and missed cannot be distinguished by color alone.

---

## Accessibility, and the voice-shaped hole in it

A voice-first feature excludes people by default. That isn't a reason not to
build it, but it is a reason to design the way out rather than bolting one on.

- **A student who can't speak, or can't speak right now, needs a way through.**
  Situational (a train, a shared room, a library) and permanent are different
  problems that can share one solution. The Design Brief calls this "never trap
  the student."
- **Knowie's output is already text**, which is the one thing this feature gets
  right for free. Don't undo it by putting meaning only in animation or color.
- **Respect `prefers-reduced-motion`.** The recall loop leans on motion for
  system status. Make sure the status is still legible when the motion is off.
- **Screen reader order matters most on the result screen**, where the verdict,
  the explanation and the next action all land at once.

---

## Performance

The prototype only has to run well on your own phone. These habits still carry,
because the real feature ships to students on budget devices.

- The recall turn should feel responsive. The brief targets under 4 seconds
  between the student finishing and seeing a result.
- Optimize and lazy-load image assets.
- Prefer skeleton screens over loading spinners.
- Design empty states assuming content might not be there yet.

---

## Internationalization

- Active in 15+ markets and multiple languages.
- **Accommodate text expansion.** German and French run 30–40% longer than
  English. A button label or a Knowie prompt that just fits in English will
  break in German. Test your tightest label by pasting in the German.
- Follow locale conventions for dates, times and numbers.
- Never embed text in images or illustrations.
- RTL is a future consideration, not a sprint requirement.