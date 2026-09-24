import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { LoadingDots } from './LoadingDots';

const figmaDescription = `Indeterminate loading indicator, paired with micButton's Disabled state while voice processing resolves. Single static frame, no variants — the pulse (opacity/scale per dot) is applied in code or a Figma prototype, not as separate component states. Not a progress meter — don't use anywhere a percentage or step count is knowable.

**In code:** three dots, gap \`Space/100\`, each \`Indicator/Dot\` (6px) in \`accent/brand/bold\`, as in Figma. It has no props, as in Figma.

**Pulse (added in code, since Figma leaves it to code):** each dot fades from dim to full and back in \`motion.duration.pulse\` (1200ms) with \`motion.easing.inOut\`, dimmest at \`motion.opacity.pulseDim\` (30%). Dot 2 starts \`motion.duration.pulseStagger\` (150ms) after dot 1 and dot 3 a step after that, so the pulse travels left to right. These are code-only tokens in \`tokens/motion.json\`.

**Reduced motion:** the pulse stops and the dots stay at full brightness. It's a status region labelled "Thinking", so the wait is still announced to screen readers.`;

const meta = {
  title: 'Components/loadingDots',
  component: LoadingDots,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelector('.loadingDots') as HTMLElement;
    const items = [...dots.querySelectorAll('.loadingDots__dot')] as HTMLElement[];
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const seconds = (name: string) => `${parseFloat(token(name)) / 1000}s`;
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };

    // Layout: three 6px dots with a 4px gap, hugging to 26 x 6, as in Figma.
    await expect(items).toHaveLength(3);
    const box = dots.getBoundingClientRect();
    await expect(box.width).toBe(3 * px('--indicator-dot') + 2 * px('--space-100'));
    await expect(box.height).toBe(px('--indicator-dot'));
    for (const dot of items) {
      const cs = getComputedStyle(dot);
      await expect(cs.width).toBe(token('--indicator-dot'));
      await expect(cs.height).toBe(token('--indicator-dot'));
      await expect(cs.borderTopLeftRadius).toBe(token('--radius-full'));
      await expect(cs.backgroundColor).toBe(paint('--color-accent-brand-bold'));
      await expect(cs.animationName).toBe('loadingDotsPulse');
      await expect(cs.animationDuration).toBe(seconds('--motion-duration-pulse'));
      await expect(cs.animationTimingFunction).toBe(token('--motion-easing-inOut'));
      await expect(cs.animationIterationCount).toBe('infinite');
    }
    // Stagger: each dot starts one step after the last.
    const step = parseFloat(token('--motion-duration-pulseStagger')) / 1000;
    await expect(items.map((dot) => getComputedStyle(dot).animationDelay)).toEqual(['0s', `${step}s`, `${step * 2}s`]);

    // Pulse range: dimmest at the token value, brightest at full opacity.
    const keyframes = (items[0].getAnimations()[0].effect as KeyframeEffect).getKeyframes();
    await expect(keyframes.map((k) => Number(k.opacity))).toEqual([px('--motion-opacity-pulseDim'), 1, px('--motion-opacity-pulseDim')]);

    // A status region, so the wait is announced.
    await expect(dots).toHaveAttribute('role', 'status');
    await expect(dots).toHaveAccessibleName('Thinking');
  },
} satisfies Meta<typeof LoadingDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'loadingDots' };
