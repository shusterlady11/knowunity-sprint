import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TapToAnswer } from './TapToAnswer';

const figmaDescription = `Figma has no description for this component, so this is written from how it's used. It's a single line of dimmed, centered text that tells the student how to answer. Its one property, \`Text\`, says "Tap to answer" by default. The core flow uses it in the keyboard states (the typing screen and the typing screen with the keyboard open), where the text is changed to a "Type an answer" hint.

**In code:** \`text\` is Figma's "Text" property, with the same default. It's a plain paragraph, not a button: the input field is what the student taps. It fills the width it's given and centers the text. The type is Body S Regular in \`text/secondary\`, with the line height and letter spacing that Figma binds.

**Known issue:** every use on the core flow screens reads "Tyoe an answer", a typo for "Type an answer".`;

const meta = {
  title: 'Components/tapToAnswer',
  component: TapToAnswer,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const hint = canvasElement.querySelector('.tapToAnswer') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const cs = getComputedStyle(hint);

    // The words, in Figma's default when none are given.
    await expect(hint).toHaveTextContent(args.text ?? 'Tap to answer');

    // Body S Regular, dimmed, centered, with Figma's bound line height.
    await expect(cs.fontSize).toBe(token('--type-body-s-regular-fontSize'));
    await expect(cs.fontWeight).toBe(token('--type-body-s-regular-fontWeight'));
    await expect(cs.lineHeight).toBe(token('--font-lineHeight-sm'));
    await expect(cs.letterSpacing).toBe(token('--type-body-s-regular-letterSpacing'));
    await expect(cs.color).toBe(paint('--color-text-secondary'));
    await expect(cs.textAlign).toBe('center');

    // It fills its container, one 20px line tall, and isn't interactive.
    const parent = hint.parentElement as HTMLElement;
    await expect(hint.getBoundingClientRect().width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    await expect(hint.getBoundingClientRect().height).toBe(parseFloat(token('--font-lineHeight-sm')));
    await expect(hint.tagName).toBe('P');
  },
} satisfies Meta<typeof TapToAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'tapToAnswer' };

// Not a Figma variant: the text changed, as the keyboard screens do.
export const TypeAnAnswer: Story = {
  name: 'tapToAnswer, Text="Type an answer"',
  args: { text: 'Type an answer' },
};
