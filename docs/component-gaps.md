# Component gaps

A running list of things built inline during a screen build because Storybook had no component for them. Read it before building a screen: if something you need is already here from another screen, build it properly as a component with a story instead, switch the earlier screen over to it, and mark it built here (`.claude/skills/build-screen/SKILL.md`, step 5).

| What | Built inline for | Notes | Status |
|---|---|---|---|
| Back-only top bar | 1 First-run splash (`src/app/start/page.tsx`) | `AppBar` always draws progress and XP. Figma's bar is loose layers: a back arrow on the left and a hidden Tertiary S "Skip". Built as a `ButtonIcon` Tertiary L (`ArrowLeftIcon`) in a 56px row. | Inline |
| Speech-bubble tail (Knowie speaking from behind a card) | 1 First-run splash (`src/app/start/page.tsx`, `start.css`) | `AnswerCard` `Default` matches Figma's bubble box (background/surface, Radius/400, Space/400 padding, Body M Regular) but has no tail. The tail is a 20×16 `background/surface` shape on the card's top edge, and the mascot sits behind the card's top. | Inline |
