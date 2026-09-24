import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TopicPill } from './TopicPill';

const figmaDescription = `Names the topic the student is being quizzed on, so they keep context as they move through questions. USE: at the top of a question set, and on results pages for that set. DON'T: use on splash pages or higher-level screens such as a study plan overview; it labels one topic's session, not navigation between topics. The label uses Caption M Bold and the dot uses Indicator/Dot.

**In code:** \`label\` is Figma's "Label" text property (sentence case, like every label). The dot is decoration and hidden from screen readers. The pill sizes itself to its label on one line, as in Figma.

**Values:** padding \`Space/150\` and \`Space/300\`, gap \`Space/150\`, corners \`Radius/Full\` and the outline width \`stroke/border\`. In Figma these four are typed-in numbers that happen to equal those tokens.`;

const meta = {
  title: 'Components/topicPill',
  component: TopicPill,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const pill = canvasElement.querySelector('.topicPill') as HTMLElement;
    const dot = pill.querySelector('.topicPill__dot') as HTMLElement;
    const label = pill.querySelector('.topicPill__label') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const color = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };

    await expect(label).toHaveTextContent(args.label);
    await expect(pill.getBoundingClientRect().height).toBe(
      2 * parseFloat(token('--space-150')) + parseFloat(token('--type-caption-m-bold-lineHeight')),
    );
    await expect(getComputedStyle(pill).paddingLeft).toBe(token('--space-300'));
    await expect(getComputedStyle(pill).columnGap).toBe(token('--space-150'));
    await expect(getComputedStyle(pill).backgroundColor).toBe(color('--color-background-surface'));
    await expect(getComputedStyle(pill).boxShadow).toContain(color('--color-accent-brand-bold'));

    await expect(getComputedStyle(dot).width).toBe(token('--indicator-dot'));
    await expect(getComputedStyle(dot).backgroundColor).toBe(color('--color-accent-brand-bold'));
    await expect(dot).toHaveAttribute('aria-hidden', 'true');

    await expect(getComputedStyle(label).fontSize).toBe(token('--type-caption-m-bold-fontSize'));
    await expect(getComputedStyle(label).fontWeight).toBe(token('--type-caption-m-bold-fontWeight'));
    await expect(getComputedStyle(label).letterSpacing).toBe(token('--type-caption-m-bold-letterSpacing'));
  },
} satisfies Meta<typeof TopicPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'topicPill',
  args: { label: 'Energy flow in ecosystems' },
};
