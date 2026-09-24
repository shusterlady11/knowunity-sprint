import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { BottomCTA } from './BottomCTA';

const figmaDescription = `The bottom action bar anchored to the base of the answer screens, Results and SPLASH-SKIP-MIC. Question screens use toggleGroup instead.

USE
Pick the layout variant for the moment:
• Two button no drawer: Secondary + Primary side by side, no panel. Gap Space/100 (4px), side padding Space/400 (16px), top/bottom padding Space/600 (24px), all bound. Hugs to 104px. Static splash pairing: SPLASH-SKIP-MIC ("No thanks" + "Continue").
• Two button drawer: outer frame hugs to 112px; its child "bottomSheet" is a full-bleed 390px, 112px panel (fill/stroke/radius token-bound) centering the buttonRow (16px side padding, Space/100 gap, both buttons FILL). Secondary + Primary. Used for a correct answer ("More info" + "Next question", or "Finish" on the last question) and Results ("Review all" or "Review N concepts" + "Continue"). Optional boolean "Show secondaryButton" (default true) hides the secondary button; when hidden, the primary re-fills the row.
• Two button drawer / Secondary: same panel and buttonRow. Left button (layer "button") Tertiary, "Reveal answer"; right button (layer "secondaryButton") Secondary, fill bound to interactive/secondary. Low emphasis because the mic is the primary action (retry). Right button label: "Next question" after a partial or wrong answer, "Skip" after "Didn't catch that". "Show secondaryButton" is not wired in this variant.
• One button drawer / primary: single full-width Primary in the 112px panel. Not placed on any screen.
• One button drawer / secondary: single full-width Secondary in the 112px panel. Not placed on any screen.

"Reveal answer" and "More info" open a separate bottomSheet overlay (answer, context, X to close, no buttons). That overlay is not part of this component.

NOTE: after switching a button instance's variant (e.g. Primary to Secondary), check its fill. A leftover instance color override can survive the switch. Secondary buttons here must resolve to interactive/secondary to read against the dark panel.

DON'T
Don't add a 3rd button to buttonRow. Don't hardcode button labels; use each button instance's CTA text property.

**In code:** \`layout\` has Figma's five options, named exactly as in Figma, and \`showSecondaryButton\` is Figma's "Show secondaryButton" (it applies to "Two button drawer" only, as in Figma). The labels and taps are \`leftCTA\` / \`rightCTA\` and \`onLeftClick\` / \`onRightClick\`: the right-hand button is always the forward action, and one-button layouts use only the right-hand props. All buttons are the \`button\` component at size L.

**Button widths:** the two buttons share the row equally; when one label needs more than half, that button grows past the center and the other shrinks to fill what's left.

**Labels must fit.** L labels are set in Inter, which is wider than Figma's Greed Condensed, so some label pairs from the designs don't fit side by side (for example "Reveal answer" + "Next question" needs 434px of the 358px row). Screens use shorter wording: "More info" + "Next", "Reveal answer" + "Next", "Review" + "Continue" (see the decision log in sprint-context.md).

**Inside the panel,** Secondary buttons are filled with \`interactive/secondary\` so they read against the panel, as in Figma, where those instances override the button's fill.

**Differences from Figma, by decision:** the drawer panel is sized by \`Space/700\` above and below the buttons (112px in all; Figma sets a raw 112px); its top line is \`border/default\` at \`stroke/border\` (Figma uses the same color with a raw 1px width). The one-button layouts are built like the two-button drawers (in Figma their outer frame also has padding, but the panel still renders full-width, so the result is the same).`;

// Records clicks without the event, so Storybook doesn't serialize a click event (which froze the docs page).
const leftSpy = fn();
const rightSpy = fn();

const meta = {
  title: 'Components/bottomCTA',
  component: BottomCTA,
  tags: ['autodocs'],
  args: { onLeftClick: () => leftSpy(), onRightClick: () => rightSpy() },
  argTypes: { onLeftClick: { control: false }, onRightClick: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    leftSpy.mockClear();
    rightSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const layout = args.layout ?? 'Two button no drawer';
    const bar = canvasElement.querySelector('.bottomCTA') as HTMLElement;
    const row = bar.querySelector('.bottomCTA__row') as HTMLElement;
    const buttons = [...row.querySelectorAll(':scope > .button')] as HTMLElement[];
    const root = getComputedStyle(document.documentElement);
    const px = (name: string) => parseFloat(root.getPropertyValue(name));

    const isDrawer = layout !== 'Two button no drawer';
    const expectedHeight = isDrawer
      ? 2 * px('--space-700') + px('--control-l')
      : 2 * px('--space-600') + px('--control-l');
    await expect(bar.getBoundingClientRect().height).toBe(expectedHeight);

    const panel = bar.querySelector('.bottomCTA__panel') as HTMLElement | null;
    if (isDrawer) {
      await expect(getComputedStyle(panel!).borderTopLeftRadius).toBe(`${px('--radius-900')}px`);
      await expect(getComputedStyle(panel!).borderBottomLeftRadius).toBe('0px');
    } else {
      await expect(panel).toBeNull();
    }

    const variants = buttons.map((b) => b.dataset.variant);
    const expectedVariants = {
      'Two button no drawer': ['Secondary', 'Primary'],
      'Two button drawer': args.showSecondaryButton === false ? ['Primary'] : ['Secondary', 'Primary'],
      'Two button drawer / Secondary': ['Tertiary', 'Secondary'],
      'One button drawer / primary': ['Primary'],
      'One button drawer / secondary': ['Secondary'],
    }[layout];
    await expect(variants).toEqual(expectedVariants);
    for (const b of buttons) await expect(b.dataset.size).toBe('L');

    // In the drawer panel, Secondary buttons are filled with interactive/secondary (Figma's override).
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'var(--color-interactive-secondary)';
    document.body.appendChild(probe);
    const secondaryFill = getComputedStyle(probe).backgroundColor;
    probe.remove();
    for (const b of buttons.filter((x) => x.dataset.variant === 'Secondary')) {
      const fill = getComputedStyle(b.querySelector('.button__face') as HTMLElement).backgroundColor;
      if (isDrawer) await expect(fill).toBe(secondaryFill);
      else await expect(fill).not.toBe(secondaryFill);
    }

    // The buttons fill the row exactly, and no label is squeezed or spills out.
    const gap = buttons.length > 1 ? px('--space-100') : 0;
    const total = buttons.reduce((sum, b) => sum + b.getBoundingClientRect().width, 0) + gap;
    await expect(Math.round(total)).toBe(Math.round(row.getBoundingClientRect().width));
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    for (const b of buttons) {
      const face = b.querySelector('.button__face') as HTMLElement;
      await expect(face.scrollWidth).toBeLessThanOrEqual(face.clientWidth + 1);
    }

    await userEvent.click(buttons[buttons.length - 1]);
    await expect(rightSpy).toHaveBeenCalledTimes(1);
    if (buttons.length > 1) {
      await userEvent.click(buttons[0]);
      await expect(leftSpy).toHaveBeenCalledTimes(1);
    }
  },
} satisfies Meta<typeof BottomCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

const equalWidths = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const [a, b] = [...canvasElement.querySelectorAll('.bottomCTA__row > .button')] as HTMLElement[];
  await expect(Math.round(a.getBoundingClientRect().width)).toBe(Math.round(b.getBoundingClientRect().width));
};

export const TwoButtonNoDrawer: Story = {
  name: 'layout=Two button no drawer',
  args: { layout: 'Two button no drawer', leftCTA: 'No thanks', rightCTA: 'Continue' },
  play: async (context) => {
    await meta.play!(context);
    await equalWidths(context);
  },
};

export const TwoButtonDrawer: Story = {
  name: 'layout=Two button drawer',
  args: { layout: 'Two button drawer', leftCTA: 'More info', rightCTA: 'Finish' },
  play: async (context) => {
    await meta.play!(context);
    await equalWidths(context);
  },
};

export const TwoButtonDrawerNoSecondary: Story = {
  name: 'layout=Two button drawer, Show secondaryButton=false',
  args: { layout: 'Two button drawer', showSecondaryButton: false, leftCTA: 'More info', rightCTA: 'Next' },
};

export const TwoButtonDrawerSecondary: Story = {
  name: 'layout=Two button drawer / Secondary',
  args: { layout: 'Two button drawer / Secondary', leftCTA: 'Reveal answer', rightCTA: 'Skip' },
  play: async (context) => {
    await meta.play!(context);
    // "Reveal answer" needs more than half the row, so it grows past the center.
    const [left, right] = [...context.canvasElement.querySelectorAll('.bottomCTA__row > .button')] as HTMLElement[];
    await expect(left.getBoundingClientRect().width).toBeGreaterThan(right.getBoundingClientRect().width);
  },
};

export const OneButtonDrawerPrimary: Story = {
  name: 'layout=One button drawer / primary',
  args: { layout: 'One button drawer / primary', rightCTA: 'Next' },
};

export const OneButtonDrawerSecondary: Story = {
  name: 'layout=One button drawer / secondary',
  args: { layout: 'One button drawer / secondary', rightCTA: 'Skip' },
};
