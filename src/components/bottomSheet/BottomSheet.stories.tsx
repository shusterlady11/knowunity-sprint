import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Button } from '../button/Button';
import { ButtonGroup } from '../buttonGroup/ButtonGroup';
import { BottomSheet } from './BottomSheet';

const figmaDescription = `Sheet that slides up over a screen for a short, secondary task. middleSection holds the content; bottomSection holds the actions. The top bar is a bottomSheetAppBar; pick its Type for the sheet's purpose. USE: permission prompts (mic access) and supporting detail such as Reveal answer. DON'T: use for the main question flow or anything the student must complete to continue the set. height (S/M/L) is a design-time preview only; in code the sheet hugs its content and fills the screen width.

**In code:** the two slots are the props \`middleSection\` and \`bottomSection\`. The top bar's settings (its type, title, icons and taps) go in \`appBar\`, which takes the \`bottomSheetAppBar\` properties, because Figma sets them on the nested bar. \`bottomSection\` left out means the actions section isn't drawn, as when Figma hides the empty slot on Reveal answer. \`height\` keeps Figma's S / M / L options so the props mirror Figma, but has no effect (decided with the user): the sheet fills the width it's given and always hugs its content. The two real uses, Reveal answer (about 259px tall) and the mic permission (about 537px), are both \`height=M\` in Figma and very different heights.

**Layout:** top corners \`Radius/900\`, bottom corners square, fill \`background/surface\`. The content section has \`Space/400\` at the sides and \`Space/200\` below, with \`Space/600\` between items, centered; the actions section has \`Space/400\` all round and the same gap. The sheet doesn't position itself: the screen's \`bottomSheetOnly\` slot places it at the bottom, over the scrim, and the slide-up isn't built (no motion token for it).

**Accessibility:** it's a dialog, named by \`label\` or, by default, the top bar's title (the Default top bar has no title, so give it a \`label\`). Focus handling and closing on the scrim belong to the screen.

**The stories** show Figma's three heights with each variant's default top bar (S has dismissAndAction; M and L have Default), plus Reveal answer and mic permission as they're used in the screens. The mic permission sheet leaves out its mascot (not built yet).`;

const sampleContent = (
  <p style={{ margin: 0, color: 'var(--color-text-primary)', font: 'var(--type-body-m-regular-fontWeight) var(--type-body-m-regular-fontSize)/var(--type-body-m-regular-lineHeight) var(--type-body-m-regular-fontFamily)', letterSpacing: 'var(--type-body-m-regular-letterSpacing)' }}>
    Producers make their own food, while consumers get energy by eating producers or other consumers.
  </p>
);

const meta = {
  title: 'Components/bottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  argTypes: { appBar: { control: false }, middleSection: { control: false }, bottomSection: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const sheet = canvasElement.querySelector('.bottomSheet') as HTMLElement;
    const bar = sheet.querySelector('.bottomSheetAppBar') as HTMLElement;
    const middle = sheet.querySelector('.bottomSheet__middle') as HTMLElement;
    const bottom = sheet.querySelector('.bottomSheet__bottom') as HTMLElement | null;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.backgroundColor = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return value;
    };

    // The sheet: fills its container, top corners Radius/900, square bottom, surface fill, no padding.
    const box = sheet.getBoundingClientRect();
    const ss = getComputedStyle(sheet);
    const parent = sheet.parentElement as HTMLElement;
    await expect(box.width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    await expect(ss.borderTopLeftRadius).toBe(token('--radius-900'));
    await expect(ss.borderTopRightRadius).toBe(token('--radius-900'));
    await expect(ss.borderBottomLeftRadius).toBe('0px');
    await expect(ss.borderBottomRightRadius).toBe('0px');
    await expect(ss.backgroundColor).toBe(paint('--color-background-surface'));
    await expect(ss.paddingTop).toBe('0px');

    // The top bar sits at the top, full width, and the sections stack under it.
    const barBox = bar.getBoundingClientRect();
    await expect(barBox.top).toBe(box.top);
    await expect(barBox.width).toBe(box.width);
    await expect(middle.getBoundingClientRect().top).toBe(barBox.bottom);

    // The middle section: Space/400 at the sides, Space/200 below, no top padding; content is centered.
    const ms = getComputedStyle(middle);
    await expect(ms.paddingLeft).toBe(token('--space-400'));
    await expect(ms.paddingRight).toBe(token('--space-400'));
    await expect(ms.paddingTop).toBe('0px');
    await expect(ms.paddingBottom).toBe(token('--space-200'));
    await expect(ms.rowGap).toBe(token('--space-600'));

    // The bottom section: drawn only when given; Space/400 all round.
    if (args.bottomSection == null) {
      await expect(bottom).toBeNull();
    } else {
      await expect(bottom).not.toBeNull();
      const bs = getComputedStyle(bottom!);
      await expect(bs.paddingTop).toBe(token('--space-400'));
      await expect(bs.paddingLeft).toBe(token('--space-400'));
      await expect(bs.paddingBottom).toBe(token('--space-400'));
      await expect(bottom!.getBoundingClientRect().top).toBe(middle.getBoundingClientRect().bottom);
    }

    // It hugs its content: its height is the sum of its parts, whatever `height` says.
    const parts = barBox.height + middle.getBoundingClientRect().height + (bottom ? bottom.getBoundingClientRect().height : 0);
    await expect(box.height).toBe(parts);

    // A dialog, named by its label or the top bar's title.
    await expect(sheet).toHaveAttribute('role', 'dialog');
    const type = args.appBar?.type ?? 'Default';
    const name = args.label ?? (type === 'Default' ? null : (args.appBar?.title ?? 'Title'));
    if (name) await expect(sheet).toHaveAccessibleName(name);
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeightS: Story = {
  name: 'height=S',
  args: {
    height: 'S',
    appBar: { type: 'dismissAndAction', title: 'Title' },
    middleSection: sampleContent,
    bottomSection: <Button variant="Primary" size="L" CTA="Continue" />,
  },
};

export const HeightM: Story = {
  name: 'height=M',
  args: {
    height: 'M',
    appBar: { type: 'Default' },
    label: 'Sheet',
    middleSection: sampleContent,
    bottomSection: <Button variant="Primary" size="L" CTA="Continue" />,
  },
};

export const HeightL: Story = {
  name: 'height=L',
  args: {
    height: 'L',
    appBar: { type: 'Default' },
    label: 'Sheet',
    middleSection: sampleContent,
    bottomSection: <Button variant="Primary" size="L" CTA="Continue" />,
  },
};

// Not Figma variants: the two real uses. Reveal answer has no actions, so its bottom section is left out.
export const RevealAnswer: Story = {
  name: 'Reveal answer (dismissOnly, no actions)',
  args: {
    height: 'M',
    appBar: { type: 'dismissOnly', title: 'Producers and consumers' },
    middleSection: sampleContent,
  },
};

export const MicPermission: Story = {
  name: 'Mic permission (Default, with buttons)',
  args: {
    height: 'M',
    appBar: { type: 'Default' },
    label: 'Turn on your microphone',
    middleSection: (
      <p style={{ margin: 0, textAlign: 'center', color: 'var(--color-text-primary)', font: 'var(--type-headline-s-fontWeight) var(--type-headline-s-fontSize)/var(--type-headline-s-lineHeight) var(--type-headline-s-fontFamily)' }}>
        Turn on your microphone settings to start practicing.
      </p>
    ),
    bottomSection: (
      <ButtonGroup variant="Vertical" size="L">
        <Button variant="Primary" size="L" CTA="Turn on" />
        <Button variant="Secondary" size="L" CTA="Not now" />
      </ButtonGroup>
    ),
  },
};
