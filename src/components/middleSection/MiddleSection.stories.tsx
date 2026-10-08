import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { durationMs } from '../../lib/motion';
import { MiddleSection } from './MiddleSection';

const figmaDescription = `Figma has no description for this component, so this is written from its layers. It's the top of a question screen: the topic pill, then Knowie peeking out from behind two answer cards, an intro message ("Welcome! Let’s test your knowledge on energy flow in ecosystems.") and the question. It has no properties; the pill's label and the cards' text are set on the nested instances.

**In code:** \`topic\` is the nested topicPill's "Label", and \`intro\` and \`question\` are the two cards' text (answerCard Default and question; Figma has no text property on them). \`showIntro\` is added in code, since Figma always draws the intro card: the question screen shows it only the very first time on question 1, until the student starts answering (decided 2026-10-05). Knowie is \`mascotSlot\` 2XL, \`standby\`. When \`showIntro\` turns off after the card was shown, the card fades out while its space collapses, so the question card slides up into its place (\`motion.duration.introExit\`, 600ms, \`motion.easing.inOut\`; instant under reduced motion). The question screen does this when the student starts dictating (decided 2026-10-05). \`animateIn\` is also added in code: when the section first appears, Knowie and the cards rise \`Space/600\` into place together while they fade in, at the same pace and curve as that slide (\`motion.duration.questionEnter\`, a reference to \`introExit\`, and \`motion.easing.inOut\`), so a question arriving and the intro card leaving read as one motion. Under reduced motion they fade in without rising. The screens turn it on only when moving from one question to another, not for the first question shown or when the same question comes back on the dictating, processing or result screen (decided 2026-10-07).

**Built from:** \`topicPill\`, \`mascotSlot\` and two \`answerCard\`s.

**Layout:** it fills the width it's given. Nothing above the pill (decided 2026-10-06; Figma has \`Space/400\`, which left 32px under the app bar's progress bar), then the cards \`Space/2400\` (96px) below it, \`Space/200\` apart. Knowie is centered and the cards cover its lower 44px (Figma: 43), so it peeks out from behind them. Figma's 16px at the sides is left out, because the screen's \`scaffold\` already gives it.

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

    // Nothing above the pill, the cards Space/2400 below it, Space/200 between the cards.
    await expect(box(pill).top - box(section).top).toBe(px('--space-0'));
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

// Not a Figma variant: the intro card leaving, as when the student taps the mic. The question card slides up
// into the intro card's place.
function IntroLeaves() {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <div>
      <MiddleSection topic={meta.args.topic} intro={meta.args.intro} question={question} showIntro={showIntro} />
      <button type="button" onClick={() => setShowIntro(false)}>Start dictating</button>
    </div>
  );
}

export const IntroLeavesStory: Story = {
  name: 'middleSection, intro card leaves',
  render: () => <IntroLeaves />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const intro = canvasElement.querySelector('.middleSection__intro') as HTMLElement;
    const questionCard = canvasElement.querySelector('.answerCard[data-state="question"]') as HTMLElement;
    const introTop = intro.getBoundingClientRect().top;
    await userEvent.click(canvas.getByRole('button', { name: 'Start dictating' }));

    // The card is hidden from screen readers at once, then fades and collapses; the question ends up where the
    // intro card started.
    await expect(intro).toHaveAttribute('aria-hidden', 'true');
    await waitFor(
      async () => {
        await expect(Math.round(questionCard.getBoundingClientRect().top)).toBe(Math.round(introTop));
        await expect(getComputedStyle(intro).opacity).toBe('0');
      },
      { timeout: 2000 },
    );
  },
};

// Not a Figma variant: a new question opening. Knowie and the question card rise Space/600 into place while
// they fade in; the topic pill stays put. "Next question" mounts it again to replay.
function NewQuestion() {
  const [n, setN] = useState(2);
  return (
    <div>
      <MiddleSection key={n} topic={meta.args.topic} question={question} showIntro={false} animateIn />
      <button type="button" onClick={() => setN(n + 1)}>Next question</button>
    </div>
  );
}

export const AnimateInStory: Story = {
  name: 'middleSection, animateIn',
  render: () => <NewQuestion />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    await userEvent.click(canvas.getByRole('button', { name: 'Next question' }));
    const conversation = canvasElement.querySelector('.middleSection__conversation') as HTMLElement;
    const cs = getComputedStyle(conversation);

    // The rise and fade, at the intro card's pace and curve, on Knowie and the cards together; the pill stays.
    await expect(conversation).toHaveAttribute('data-animate-in', 'true');
    await expect(cs.animationName).toBe('middleSection-enter');
    // The browser reports seconds (0.6s); the token may be 600ms or .6s, since the production CSS build rewrites it.
    await expect(parseFloat(cs.animationDuration) * 1000).toBe(durationMs('--motion-duration-questionEnter'));
    await expect(token('--motion-duration-questionEnter')).toBe(token('--motion-duration-introExit'));
    await expect(cs.animationTimingFunction).toBe(token('--motion-easing-inOut'));
    await expect(getComputedStyle(canvasElement.querySelector('.middleSection') as HTMLElement).animationName).toBe('none');

    // It settles fully in place and visible.
    await waitFor(
      async () => {
        await expect(getComputedStyle(conversation).opacity).toBe('1');
        // At rest: no offset (the animation's end state reports as the identity matrix).
        await expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(getComputedStyle(conversation).transform);
      },
      { timeout: 2000 },
    );
  },
};
