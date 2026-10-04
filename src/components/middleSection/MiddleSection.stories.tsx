import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { MiddleSection } from './MiddleSection';

const figmaDescription = `Figma has no description for this component, so this is written from its layers. It's the top of a question screen: the topic pill, then Knowie peeking out from behind two answer cards, an intro message ("Welcome! Let’s test your knowledge on energy flow in ecosystems.") and the question. It has no properties; the pill's label and the cards' text are set on the nested instances.

**In code:** \`topic\` is the nested topicPill's "Label", and \`intro\` and \`question\` are the two cards' text (answerCard Default and question; Figma has no text property on them). \`showIntro\` is added in code, since Figma always draws the intro card: the screens show it on question 1 until the student answers, then drop it so Knowie's reply fits (decided 2026-10-01 and 2026-10-04). Knowie is \`mascotSlot\` 2XL, \`standby\`.

**Built from:** \`topicPill\`, \`mascotSlot\` and two \`answerCard\`s.

**Layout:** it fills the width it's given. \`Space/400\` above the pill, then the cards \`Space/2400\` (96px) below it, \`Space/200\` apart. Knowie is centered and the cards cover its lower 44px (Figma: 43), so it peeks out from behind them. Figma's 16px at the sides is left out, because the screen's \`scaffold\` already gives it.

**Not the question frames:** the core flow's question screens draw this from loose layers, with Knowie resized to 84px over a shadow and no intro card. This component uses the real 120px 2XL size.`;

const question = (
  <>
    <strong>Q:</strong> Can you explain the difference between <strong>producers</strong> and <strong>consumers</strong>, in your own words?
  </>
);

const meta = {
  title: 'Components/middleSection',
  component: MiddleSection,
  tags: ['autodocs'],
  args: {
    topic: 'Energy flow in ecosystems',
    intro: 'Welcome! Let’s test your knowledge on energy flow in ecosystems.',
    question,
  },
  argTypes: { question: { control: false }, intro: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvas, canvasElement, args }) => {
    const section = canvasElement.querySelector('.middleSection') as HTMLElement;
    const pill = section.querySelector('.topicPill') as HTMLElement;
    const conversation = section.querySelector('.middleSection__conversation') as HTMLElement;
    const mascot = section.querySelector('.mascotSlot') as HTMLElement;
    const cards = [...section.querySelectorAll<HTMLElement>('.answerCard')];
    const root = getComputedStyle(document.documentElement);
    const px = (name: string) => parseFloat(root.getPropertyValue(name).trim());
    const box = (el: HTMLElement) => el.getBoundingClientRect();
    const showIntro = args.showIntro ?? true;

    // The topic, and the cards: intro then question, or the question alone.
    await expect(canvas.getByText(args.topic)).toBeInTheDocument();
    await expect(cards.length).toBe(showIntro ? 2 : 1);
    await expect(cards.at(-1)).toHaveAttribute('data-state', 'question');
    if (showIntro) await expect(cards[0]).toHaveTextContent('Welcome!');

    // Space/400 above the pill, the cards Space/2400 below it, Space/200 between the cards.
    await expect(box(pill).top - box(section).top).toBe(px('--space-400'));
    await expect(box(conversation).top - box(pill).bottom).toBe(px('--space-2400'));
    if (showIntro) await expect(box(cards[1]).top - box(cards[0]).bottom).toBe(px('--space-200'));

    // Knowie: 2XL, centered, with the first card over its lower 44px.
    await expect(box(mascot).width).toBe(px('--illustration-1500'));
    await expect(Math.round(box(mascot).left + box(mascot).width / 2)).toBe(Math.round(box(section).left + box(section).width / 2));
    await expect(box(mascot).bottom - box(cards[0]).top).toBe(px('--space-1200') - px('--space-100'));

    // The card paints over Knowie where they overlap.
    const x = box(mascot).left + box(mascot).width / 2;
    const y = box(cards[0]).top + px('--space-200');
    await expect(cards[0].contains(document.elementFromPoint(x, y))).toBe(true);

    // It fills the width it's given.
    await expect(box(section).width).toBe(box(section.parentElement as HTMLElement).width);
  },
} satisfies Meta<typeof MiddleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'middleSection' };

// Not a Figma variant: the intro card hidden, as on questions 2 to 5.
export const NoIntro: Story = { name: 'middleSection, showIntro=false', args: { showIntro: false } };
