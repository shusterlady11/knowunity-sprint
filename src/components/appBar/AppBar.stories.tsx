import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { AppBar } from './AppBar';

const figmaDescription = `Top bar of a question set: close (X) on the left, progressIndicator in the middle showing how far through the set the student is, and xpCounter on the right. USE: at the top of every question and answer screen in a set. DON'T: use on splash, results or study-plan screens, or inside a bottomSheet (use bottomSheetAppBar). Set progress and the XP number through the exposed progressIndicator and xpCounter properties; never detach the bar to change them.

**In code:** the bar has no properties of its own in Figma; \`progress\` and \`xp\` are the exposed properties of the progressIndicator and xpCounter inside it (defaults 25 and 2, as in Figma). \`onClose\` is the close button's tap and \`closeLabel\` its name for screen readers ("Close").

**Built from:** \`buttonIcon\` (Tertiary, size M) with the \`x-close\` icon for the close button, \`progressIndicator\` and \`xpCounter\`. The x-close is the filled glyph Figma uses here (a different drawing from the library X that the bottom sheet's top bar uses).

**Layout:** the bar fills the width it's given and is 56px tall: a 48px row with \`Space/200\` below it, \`Space/300\` at the sides and \`Space/100\` between the parts. The progress bar fills the space between the buttons, with \`Space/300\` above and below it.

**The unused concept:** Figma also has a six-layout set, now renamed "appBar (unused concept)" (gradient background, not used on any screen). It isn't built.`;

// Records the tap without the click event, so Storybook doesn't serialize it (which froze the docs page).
const closeSpy = fn();

const meta = {
  title: 'Components/appBar',
  component: AppBar,
  tags: ['autodocs'],
  args: { onClose: () => closeSpy() },
  argTypes: { onClose: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    closeSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const progress = args.progress ?? 25;
    const bar = canvasElement.querySelector('.appBar') as HTMLElement;
    const close = bar.querySelector('.buttonIcon') as HTMLElement;
    const slot = bar.querySelector('.appBar__slot') as HTMLElement;
    const track = bar.querySelector('.progressIndicator') as HTMLElement;
    const counter = bar.querySelector('.xpCounter') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));

    // The bar: fills its container, 56px tall (a 48px row plus Space/200), Space/300 at the sides.
    const box = bar.getBoundingClientRect();
    const bs = getComputedStyle(bar);
    const parent = bar.parentElement as HTMLElement;
    await expect(box.width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    await expect(box.height).toBe(px('--control-touch-target') + px('--space-200'));
    await expect(bs.paddingLeft).toBe(token('--space-300'));
    await expect(bs.paddingRight).toBe(token('--space-300'));
    await expect(bs.paddingTop).toBe('0px');
    await expect(bs.paddingBottom).toBe(token('--space-200'));
    await expect(bs.columnGap).toBe(token('--space-100'));

    // Left to right: close, the progress slot, the XP counter, with Space/100 between.
    const c = close.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const x = counter.getBoundingClientRect();
    await expect(c.left).toBe(box.left + px('--space-300'));
    await expect(c.width).toBe(px('--control-touch-target'));
    await expect(c.height).toBe(px('--control-touch-target'));
    await expect(s.left).toBe(c.right + px('--space-100'));
    await expect(x.left).toBeCloseTo(s.right + px('--space-100'), 1);
    await expect(x.right).toBeCloseTo(box.right - px('--space-300'), 1);

    // Everything sits in the 48px row: the close button and the counter are centered in it.
    const rowTop = box.top;
    await expect(c.top).toBe(rowTop);
    await expect(x.top + x.height / 2).toBeCloseTo(rowTop + px('--control-touch-target') / 2, 1);

    // The progress bar: fills the slot's width, centered, with Space/300 above and below in the slot.
    const t = track.getBoundingClientRect();
    await expect(getComputedStyle(slot).paddingTop).toBe(token('--space-300'));
    await expect(getComputedStyle(slot).paddingBottom).toBe(token('--space-300'));
    await expect(t.left).toBe(s.left);
    await expect(t.width).toBe(s.width);
    await expect(t.height).toBe(px('--indicator-progress-height'));
    await expect(t.top + t.height / 2).toBeCloseTo(rowTop + px('--control-touch-target') / 2, 1);
    await expect(track).toHaveAttribute('aria-valuenow', String(progress));

    // The parts: the close is a Tertiary M icon button, and the counter shows the XP.
    await expect(close).toHaveAttribute('data-variant', 'Tertiary');
    await expect(close).toHaveAttribute('data-size', 'M');
    await expect(close).toHaveAccessibleName('Close');
    await expect(counter).toHaveAccessibleName(`${args.xp ?? 2} XP`);

    // Tapping the close button.
    await userEvent.click(close);
    await expect(closeSpy).toHaveBeenCalledTimes(1);
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'appBar' };

// Not Figma variants: the start and the end of a set.
export const Start: Story = { name: 'appBar, progress=0', args: { progress: 0, xp: 0 } };
export const End: Story = { name: 'appBar, progress=100, xp=120', args: { progress: 100, xp: 120 } };
