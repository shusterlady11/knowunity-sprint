import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { XpCounter } from './XpCounter';

const figmaDescription = `Shows the student's XP for the session: a lightningIcon and the number. USE: on the right of appBar during a question set. DON'T: use it as a button or filter, or for anything other than XP. Set the number through the xp property. Text is Headline XS Bold in accent/blue/onSubtle.

**In code:** \`xp\` is Figma's "xp" text property (the same default, 2); it takes a number or text. The bolt is the \`lightningIcon\` (24px, \`Icon/300\`), a two-tone icon with fixed colors (outer \`accent/blue/onSubtle\`, inner \`accent/blue/subtle\`) that isn't recolored. The counter hugs its content, with \`Space/100\` at the sides and between the bolt and the number. It's a plain image for screen readers, named "<number> XP", and isn't interactive.`;

const meta = {
  title: 'Components/xpCounter',
  component: XpCounter,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const xp = String(args.xp ?? 2);
    const counter = canvasElement.querySelector('.xpCounter') as HTMLElement;
    const slot = counter.querySelector('.iconSlot') as HTMLElement;
    const value = counter.querySelector('.xpCounter__value') as HTMLElement;
    const paths = [...counter.querySelectorAll('svg path')] as SVGPathElement[];
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();
      return computed;
    };

    // Layout: Space/100 at the sides and between, the bolt 24px, the whole thing as tall as the bolt.
    const box = counter.getBoundingClientRect();
    const cs = getComputedStyle(counter);
    const slotBox = slot.getBoundingClientRect();
    const valueBox = value.getBoundingClientRect();
    await expect(cs.paddingLeft).toBe(token('--space-100'));
    await expect(cs.paddingRight).toBe(token('--space-100'));
    await expect(cs.paddingTop).toBe('0px');
    await expect(cs.columnGap).toBe(token('--space-100'));
    await expect(slotBox.width).toBe(px('--icon-300'));
    await expect(slotBox.height).toBe(px('--icon-300'));
    await expect(box.height).toBe(px('--icon-300'));
    await expect(slotBox.left).toBe(box.left + px('--space-100'));
    await expect(valueBox.left).toBe(slotBox.right + px('--space-100'));
    await expect(box.right).toBeCloseTo(valueBox.right + px('--space-100'), 1);
    await expect(slotBox.top + slotBox.height / 2).toBeCloseTo(valueBox.top + valueBox.height / 2, 1);

    // The number: Headline XS Bold in the blue.
    await expect(value).toHaveTextContent(xp);
    const vs = getComputedStyle(value);
    await expect(vs.fontSize).toBe(token('--type-headline-xs-bold-fontSize'));
    await expect(vs.fontWeight).toBe(token('--type-headline-xs-bold-fontWeight'));
    await expect(vs.lineHeight).toBe(token('--type-headline-xs-bold-lineHeight'));
    await expect(vs.letterSpacing).toBe(token('--type-headline-xs-bold-letterSpacing'));
    await expect(vs.color).toBe(paint('--color-accent-blue-onSubtle'));

    // The bolt's two fixed colors.
    await expect(paths).toHaveLength(2);
    await expect(getComputedStyle(paths[0]).fill).toBe(paint('--color-accent-blue-onSubtle'));
    await expect(getComputedStyle(paths[1]).fill).toBe(paint('--color-accent-blue-subtle'));

    // An image for screen readers, not a control.
    await expect(counter).toHaveAttribute('role', 'img');
    await expect(counter).toHaveAccessibleName(`${xp} XP`);
  },
} satisfies Meta<typeof XpCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'xpCounter' };

// Not a Figma variant: a bigger number.
export const LargeNumber: Story = { name: 'xpCounter, xp="1250"', args: { xp: 1250 } };
