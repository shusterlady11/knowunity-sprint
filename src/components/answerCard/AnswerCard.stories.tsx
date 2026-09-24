import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { AnswerCard } from './AnswerCard';

const figmaDescription = `The single scrollable card for whatever Knowie is currently saying or asking in the recall flow. One instance per turn.

USE
Pick the Property 1 variant for the moment:
• Default — generic "Knowie is talking, not posing a question" card (e.g. the welcome/intro message). Plain text, no pill.
• question — the question text itself.
• processing: loading message + 3 skeleton bars. Default copy is "Thinking...". Keep wait copy calm and literal (e.g. "Thinking...", "Checking your answer..."). No jokes or playful lines.
• answer-correct / answer-partial / answer-error / answer-notcaught — a statusPill (state=correct/partial/wrong/notCaught, paired with its matching icon: Check/ArrowCounterClockwise/ArrowsClockwise/QuestionMark) plus a grounded feedback message.

DON'T
Don't put question copy in Default or vice versa. Don't hand-color the statusPill or its icon — tone comes from the pill's own state property.

**In code:** \`state\` has Figma's seven options, named exactly as in Figma (the description above still says "Property 1", the property's old name). \`message\` is the card's text; Figma has no text property for it. Key words can be wrapped in \`<strong>\` to set them in \`font/weight/bold\`, as the question does with "Q:", "producers" and "consumers" (in Figma these are bold overrides on Body M Regular, not a text style). processing defaults to "Thinking..." and answer-notcaught to "I couldn’t understand that take.". The answer states use the \`statusPill\` component (answer-correct → correct, answer-partial → partial, answer-error → wrong, answer-notcaught → notCaught). The card fills the width it's given (358px inside a 390px screen with 16px margins). Answer and processing cards are announced to screen readers when they appear; processing is also marked busy, and its placeholder bars are hidden from them.

**Differences from Figma, by decision:** the skeleton bars are \`Space/300\` (12px) tall (Figma: 14px, which has no token), 100%, 88% and 60% of the card wide, and one \`font/lineHeight/md\` (24px) apart. "Thinking..." (\`text/secondary\`) and the bars (\`interactive/secondary\`) use the same tokens as Figma.`;

const pillFor = {
  'answer-correct': 'correct',
  'answer-partial': 'partial',
  'answer-error': 'wrong',
  'answer-notcaught': 'notCaught',
} as const;

const meta = {
  title: 'Components/answerCard',
  component: AnswerCard,
  tags: ['autodocs'],
  argTypes: { message: { control: 'text' } },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const state = args.state ?? 'Default';
    const card = canvasElement.querySelector('.answerCard') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const resolveColor = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const cs = getComputedStyle(card);

    await expect(cs.paddingTop).toBe(token('--space-400'));
    await expect(cs.borderTopLeftRadius).toBe(token('--radius-400'));
    await expect(cs.backgroundColor).toBe(
      resolveColor(state === 'question' ? '--color-background-surfaceQuestion' : '--color-background-surface'),
    );

    const message = card.querySelector('.answerCard__message') as HTMLElement;
    await expect(getComputedStyle(message).fontSize).toBe(token('--type-body-m-regular-fontSize'));
    await expect(getComputedStyle(message).color).toBe(
      resolveColor(state === 'processing' ? '--color-text-secondary' : '--color-text-primary'),
    );

    const pill = card.querySelector('.statusPill');
    if (state in pillFor) {
      await expect(pill).toHaveAttribute('data-state', pillFor[state as keyof typeof pillFor]);
      await expect(card).toHaveAttribute('role', 'status');
    } else {
      await expect(pill).toBeNull();
    }

    const bars = [...card.querySelectorAll('.answerCard__bar')] as HTMLElement[];
    if (state === 'processing') {
      await expect(card).toHaveAttribute('aria-busy', 'true');
      await expect(bars).toHaveLength(3);
      await expect(getComputedStyle(bars[0]).height).toBe(token('--space-300'));
      await expect(getComputedStyle(bars[0]).backgroundColor).toBe(resolveColor('--color-interactive-secondary'));
      const pitch = bars[1].getBoundingClientRect().top - bars[0].getBoundingClientRect().top;
      await expect(`${pitch}px`).toBe(token('--font-lineHeight-md'));
    } else {
      await expect(bars).toHaveLength(0);
    }
  },
} satisfies Meta<typeof AnswerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'state=Default',
  args: { state: 'Default', message: 'Welcome! Let’s test your knowledge on energy flow in ecosystems.' },
};

export const Question: Story = {
  name: 'state=question',
  args: {
    state: 'question',
    message: (
      <>
        <strong>Q:</strong> Can you explain the difference between <strong>producers</strong> and{' '}
        <strong>consumers</strong>, in your own words?
      </>
    ),
  },
  play: async (context) => {
    await meta.play!(context);
    const strong = context.canvasElement.querySelectorAll('.answerCard__message strong');
    await expect(strong).toHaveLength(3);
    await expect(getComputedStyle(strong[1]).fontWeight).toBe(
      getComputedStyle(document.documentElement).getPropertyValue('--font-weight-bold').trim(),
    );
  },
};

export const Processing: Story = {
  name: 'state=processing',
  args: { state: 'processing' },
};

export const AnswerCorrect: Story = {
  name: 'state=answer-correct',
  args: {
    state: 'answer-correct',
    message: 'You nailed it with the producers providing a food source for the consumers.',
  },
};

export const AnswerPartial: Story = {
  name: 'state=answer-partial',
  args: {
    state: 'answer-partial',
    message:
      'You correctly identified that consumers eat other organisms, but your explanation includes herbivores in the producer category.',
  },
};

export const AnswerError: Story = {
  name: 'state=answer-error',
  args: { state: 'answer-error', message: 'No worries! Remember that they have a symbiotic relationships.' },
};

export const AnswerNotcaught: Story = {
  name: 'state=answer-notcaught',
  args: { state: 'answer-notcaught' },
};
