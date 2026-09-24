import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { ProgressIndicator } from './ProgressIndicator';

const figmaDescription = `Shows how far through the current question set the student is. USE: in the top app bar during a question set. DON'T: use for loading states, or to show the score (that's progressMeter on the results screen). progress sets the fill (0, 25, 50, 75, 100); in code the fill is a percentage of the bar's width, and the bar fills the space it's given.

**In code:** \`progress\` is a number from 0 to 100, the fill's width as a percentage of the bar. Figma shows 0, 25, 50, 75 and 100; any number in between works, and numbers outside 0 to 100 are held to it. The bar is \`Indicator/Progress Height\` (16px) tall, fills the width it's given, and is a pill (\`Radius/Full\`) in \`background/stacking\` with a 1px \`border/subtle\` outline inside its edge. The fill is \`accent/brand/bold\`. At 0 the fill is still a round dot as wide as the bar is tall, as in Figma. It's a progress bar for screen readers, with \`aria-label\` (default "Progress") as its name.

**Replaces the old set:** Figma still has an older ring-style set also called progressIndicator (Primary and Coral, 24 and 16 thickness, an optional label). This is the new one, with the single property \`progress\` and the primary colors only.`;

const meta = {
  title: 'Components/progressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const raw = args.progress ?? 0;
    const percent = Math.min(100, Math.max(0, raw));
    const bar = canvasElement.querySelector('.progressIndicator') as HTMLElement;
    const fill = bar.querySelector('.progressIndicator__fill') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const paint = (property: 'backgroundColor' | 'boxShadow', value: string) => {
      const probe = document.createElement('span');
      probe.style[property] = value;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe)[property];
      probe.remove();
      return computed;
    };

    // The track: 16px tall, as wide as its container, a pill on the stacking color.
    const barBox = bar.getBoundingClientRect();
    const parent = bar.parentElement as HTMLElement;
    await expect(barBox.height).toBe(px('--indicator-progress-height'));
    await expect(barBox.width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    const bs = getComputedStyle(bar);
    await expect(bs.borderTopLeftRadius).toBe(token('--radius-full'));
    await expect(bs.backgroundColor).toBe(paint('backgroundColor', 'var(--color-background-stacking)'));

    // The 1px outline inside the edge, on top of the fill.
    const outline = getComputedStyle(bar, '::after');
    await expect(outline.boxShadow).toBe(paint('boxShadow', 'inset 0 0 0 var(--stroke-border) var(--color-border-subtle)'));

    // The fill: a percentage of the track's width, never narrower than the bar is tall, in the brand color.
    const fillBox = fill.getBoundingClientRect();
    const expectedWidth = Math.max((percent / 100) * barBox.width, px('--indicator-progress-height'));
    await expect(fillBox.width).toBeCloseTo(expectedWidth, 1);
    await expect(fillBox.height).toBe(px('--indicator-progress-height'));
    await expect(fillBox.left).toBe(barBox.left);
    await expect(getComputedStyle(fill).borderTopLeftRadius).toBe(token('--radius-full'));
    await expect(getComputedStyle(fill).backgroundColor).toBe(paint('backgroundColor', 'var(--color-accent-brand-bold)'));

    // A progress bar for screen readers.
    await expect(bar).toHaveAttribute('role', 'progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', String(percent));
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
    await expect(bar).toHaveAccessibleName('Progress');
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Progress0: Story = { name: 'progress=0', args: { progress: 0 } };
export const Progress25: Story = { name: 'progress=25', args: { progress: 25 } };
export const Progress50: Story = { name: 'progress=50', args: { progress: 50 } };
export const Progress75: Story = { name: 'progress=75', args: { progress: 75 } };
export const Progress100: Story = { name: 'progress=100', args: { progress: 100 } };

// Not Figma variants: a percentage between the steps, and one past the end (held to 100).
export const Progress60: Story = { name: 'progress=60 (any percentage)', args: { progress: 60 } };
export const ProgressOver: Story = { name: 'progress=140 (held to 100)', args: { progress: 140 } };
