import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { MascotSlot } from './MascotSlot';
import type { MascotExpression } from './MascotSlot';

const figmaDescription = `A sizing container for the mascot illustration, offered in four large sizes (XL/2XL/3XL/4XL). USE: as the hero/focal illustration in a screen's middle or bottom content area, e.g. a celebratory or milestone moment. DON'T: reach for the smallest (XL) size for a primary hero moment — the Example Screens only ever use 2XL-4XL. NOTE: unlike iconSlot, this component set exposes no instance-swap property, so whether the illustration itself changes per use or stays fixed per size is a guess, not confirmed.

**In code:** \`size\` uses Figma's names and options (XL, 2XL, 3XL, 4XL; default XL). The slot is a square that's \`Illustration/800\`, \`/1500\`, \`/2500\` or \`/4000\` wide (64, 120, 200, 320px) with the art inset \`Space/300\` on every side, as in Figma. Because Figma's slot has no swap property, code adds \`expression\`, one of the twelve Knowie expressions in \`public/images\` (amazed, angry, approving, confused, determined, excited, giggling, laughing, over-it, sad, standby, thinking); it's standby by default, the same as Figma's base. In the screens standby is used at 2XL and approving at 3XL, with excited once.

**Accessibility:** the mascot is decoration and the text on screen carries the meaning, so the image has no description by default (\`alt=""\`); pass \`alt\` if a picture ever carries information of its own.

**The art:** the twelve images are the real Knowie expressions exported from Figma, not redrawn. The SVGs are 200×217 and the PNGs 800×867, so the art is a little taller than Figma's square mascot frame; it's fitted inside the square without stretching.`;

const expressions: MascotExpression[] = ['amazed', 'angry', 'approving', 'confused', 'determined', 'excited', 'giggling', 'laughing', 'over-it', 'sad', 'standby', 'thinking'];

const meta = {
  title: 'Components/mascotSlot',
  component: MascotSlot,
  tags: ['autodocs'],
  argTypes: { expression: { control: 'select', options: expressions } },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const size = args.size ?? 'XL';
    const expression = args.expression ?? 'standby';
    const slot = canvasElement.querySelector('.mascotSlot') as HTMLElement;
    const art = slot.querySelector('.mascotSlot__art') as HTMLElement;
    const image = slot.querySelector('img') as HTMLImageElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));

    // The slot: a square as big as the size's illustration token.
    const sizeToken = { XL: '--illustration-800', '2XL': '--illustration-1500', '3XL': '--illustration-2500', '4XL': '--illustration-4000' }[size];
    const box = slot.getBoundingClientRect();
    await expect(box.width).toBe(px(sizeToken));
    await expect(box.height).toBe(px(sizeToken));

    // The art area is inset Space/300 on every side.
    const artBox = art.getBoundingClientRect();
    const inset = px('--space-300');
    await expect(artBox.left - box.left).toBe(inset);
    await expect(artBox.top - box.top).toBe(inset);
    await expect(artBox.width).toBe(px(sizeToken) - 2 * inset);
    await expect(artBox.height).toBe(px(sizeToken) - 2 * inset);

    // The right Knowie image, from public/images, fitted inside without stretching.
    const extension = ['determined', 'sad', 'thinking'].includes(expression) ? 'png' : 'svg';
    await expect(image.getAttribute('src')).toContain(`/images/${expression}.${extension}`);
    await expect(getComputedStyle(image).objectFit).toBe('contain');
    await waitFor(() => expect(image.complete && image.naturalWidth > 0).toBe(true));

    // Decoration by default: no description for screen readers.
    await expect(image.getAttribute('alt')).toBe(args.alt ?? '');
  },
} satisfies Meta<typeof MascotSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XL: Story = { name: 'size=XL', args: { size: 'XL' } };
export const XL2: Story = { name: 'size=2XL', args: { size: '2XL' } };
export const XL3: Story = { name: 'size=3XL', args: { size: '3XL' } };
export const XL4: Story = { name: 'size=4XL', args: { size: '4XL' } };

// Not Figma variants: the two expressions the screens use, and one PNG expression.
export const Standby2XL: Story = { name: 'size=2XL, expression=standby', args: { size: '2XL', expression: 'standby' } };
export const Approving3XL: Story = { name: 'size=3XL, expression=approving', args: { size: '3XL', expression: 'approving' } };
export const Thinking3XL: Story = { name: 'size=3XL, expression=thinking (PNG)', args: { size: '3XL', expression: 'thinking' } };
