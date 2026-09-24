import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { IconSlot } from './IconSlot';
import { SquareIcon } from './SquareIcon';

const figmaDescription = `Low-level sizing wrapper around a swappable icon instance — pick a size (100-400) and swap in whichever icon is needed via its instance-swap property. USE: as the icon slot nested inside other components (buttons, chips, nav items, etc.) wherever an icon needs a fixed, consistent size. DON'T: rename or repurpose the 'Size (IGNORE)' property — despite its name it's the live variant property that actually controls size, not a leftover to disregard. NOTE: this is the most-used component in the file by far (165 instances found on the Example Screens page alone), almost always nested inside another component rather than placed directly on a screen.

**In code:** \`size\` is Figma's "Size (IGNORE)" variant and \`children\` is its instance-swap property. The icon takes the surrounding text color, and the slot is hidden from screen readers because it is decoration; a control that needs an accessible name (such as buttonIcon) supplies its own.`;

const meta = {
  title: 'Components/iconSlot',
  component: IconSlot,
  tags: ['autodocs'],
  args: { children: <SquareIcon /> },
  argTypes: { children: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const slot = canvasElement.querySelector('[data-size]') as HTMLElement;
    const expected = getComputedStyle(document.documentElement)
      .getPropertyValue(`--icon-${args.size ?? '400'}`)
      .trim();
    await expect(getComputedStyle(slot).width).toBe(expected);
    await expect(getComputedStyle(slot).height).toBe(expected);
    await expect(slot).toHaveAttribute('aria-hidden', 'true');
  },
} satisfies Meta<typeof IconSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Size100: Story = { name: 'Size (IGNORE)=100', args: { size: '100' } };
export const Size150: Story = { name: 'Size (IGNORE)=150', args: { size: '150' } };
export const Size200: Story = { name: 'Size (IGNORE)=200', args: { size: '200' } };
export const Size250: Story = { name: 'Size (IGNORE)=250', args: { size: '250' } };
export const Size300: Story = { name: 'Size (IGNORE)=300', args: { size: '300' } };
export const Size400: Story = { name: 'Size (IGNORE)=400', args: { size: '400' } };
