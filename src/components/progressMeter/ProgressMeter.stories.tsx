import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { ProgressMeter } from './ProgressMeter';

const figmaDescription = `Task-completion ring for the results screen. 5 variants (score=1 through score=5) - no score=0 variant exists on purpose: per the encouraging-tone business rule, the meter is omitted entirely from the layout when the student got 0 correct, not shown at 0%.

Label format: plain fraction N/5 for score=1-4, 100% only at score=5 (a perfect score gets the percentage, everything else gets the fraction).

Ring and label colors are all bound to variables (background/surface for the track, accent/brand/bold for a partial fill, accent/green/bold for the full/100% fill, interactive/primary for the label text - a light near-white, correct for sitting on the dark ring, not a bug even though it can look like plain white at a glance).

KNOWN LIMITATION (deferred, not fixed)
The denominator is hardcoded to /5 for the fixed 5-question session length. Supporting a different session length (e.g. 4 questions) would need a second total variant axis crossed with score - explicitly deferred by the designer, not started.

**In code:** \`score\` is 1 to 5 with no 0, so leave the meter out when nothing was correct. The size is \`Indicator/Meter\` (80px). The ring's thickness is 15% of its radius (Figma's inner radius is 85%), worked out from the size, so it's 6px at 80px and follows the size with no token of its own. The ring starts at the top and runs clockwise, and each point of score fills a fifth of it. The label uses the Body M Bold text style. It's exposed to screen readers as an image labelled "N out of 5" (with ", 100%" for a perfect score), since the ring and label are decoration for the same fact.`;

const meta = {
  title: 'Components/progressMeter',
  component: ProgressMeter,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const score = args.score ?? 1;
    const meter = canvasElement.querySelector('.progressMeter') as HTMLElement;
    const svg = meter.querySelector('svg') as SVGSVGElement;
    const track = meter.querySelector('.progressMeter__track') as SVGCircleElement;
    const fill = meter.querySelector('.progressMeter__fill') as SVGCircleElement;
    const label = meter.querySelector('.progressMeter__label') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const size = parseFloat(token('--indicator-meter'));
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };

    // Size from Indicator/Meter; the ring thickness is 15% of the radius (6px at 80px).
    const box = meter.getBoundingClientRect();
    await expect(box.width).toBe(size);
    await expect(box.height).toBe(size);
    const scale = size / 100;
    const thickness = parseFloat(track.getAttribute('stroke-width')!) * scale;
    await expect(thickness).toBeCloseTo((size / 2) * 0.15, 5);
    const outerRadius = (parseFloat(track.getAttribute('r')!) + parseFloat(track.getAttribute('stroke-width')!) / 2) * scale;
    await expect(outerRadius).toBe(size / 2);
    await expect(svg.getBoundingClientRect().width).toBe(size);

    // Colors: a grey track, a brand-violet fill (green for a perfect score), a near-white label.
    await expect(getComputedStyle(track).stroke).toBe(paint('--color-background-surface'));
    await expect(getComputedStyle(fill).stroke).toBe(paint(score === 5 ? '--color-accent-green-bold' : '--color-accent-brand-bold'));
    await expect(getComputedStyle(label).color).toBe(paint('--color-interactive-primary'));

    // The fill covers score/5 of the ring, from the top, clockwise.
    await expect(fill.getAttribute('stroke-dasharray')).toBe(`${(score / 5) * 100} 100`);
    await expect(getComputedStyle(svg).transform).toBe('matrix(0, -1, 1, 0, 0, 0)');

    // Label: the fraction, or 100% for a perfect score, in Body M Bold, centered in the ring.
    await expect(label).toHaveTextContent(score === 5 ? '100%' : `${score}/5`);
    const ls = getComputedStyle(label);
    await expect(ls.fontSize).toBe(token('--type-body-m-bold-fontSize'));
    await expect(ls.fontWeight).toBe(token('--type-body-m-bold-fontWeight'));
    await expect(ls.lineHeight).toBe(token('--type-body-m-bold-lineHeight'));
    await expect(ls.letterSpacing).toBe(token('--type-body-m-bold-letterSpacing'));
    const range = document.createRange();
    range.selectNodeContents(label);
    const text = range.getBoundingClientRect();
    // The trailing letter space (1px) shifts the text half a pixel left of true center.
    await expect(Math.abs(text.left + text.width / 2 - (box.left + box.width / 2))).toBeLessThan(1);
    await expect(Math.abs(text.top + text.height / 2 - (box.top + box.height / 2))).toBeLessThan(1);

    await expect(meter).toHaveAttribute('role', 'img');
    await expect(meter).toHaveAccessibleName(score === 5 ? '5 out of 5, 100%' : `${score} out of 5`);
  },
} satisfies Meta<typeof ProgressMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Score1: Story = { name: 'score=1', args: { score: 1 } };
export const Score2: Story = { name: 'score=2', args: { score: 2 } };
export const Score3: Story = { name: 'score=3', args: { score: 3 } };
export const Score4: Story = { name: 'score=4', args: { score: 4 } };
export const Score5: Story = { name: 'score=5', args: { score: 5 } };
