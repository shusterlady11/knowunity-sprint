import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { StatusPill } from './StatusPill';

const figmaDescription = `Small colored label reporting how a spoken answer was judged, shown inside the Answer feedback sheet after a student speaks a term aloud.

USE: exactly one per feedback moment, right after Knowie has judged an answer — correct, partial, wrong, or a mishearing. States: correct (feedback.success), wrong (feedback.error), partial (feedback.partial, its own tone — not a downgraded success), notCaught (feedback.neutral). notCaught means the app didn't hear or transcribe the answer; it's not a judgment on the student, so it must never read as a failure state or reuse feedback.error.

Each variant carries its own fixed label text and icon (Check / ArrowCounterClockwise / ArrowsClockwise / QuestionMark) — not editable free text, since the wording is part of the state's meaning. The leading icon can be hidden via the "left icon" property if a screen needs the pill without one, but the icon set per state shouldn't be swapped.

DON'T: don't use this for anything other than the outcome of a single spoken-answer attempt (it's not a generic status/tag component — see chips for that). Don't combine states, invent a new state without a matching feedback/* token pair, or pick colors by eye — every fill and text color here is bound to a feedback/* variable and should stay that way.

**In code:** \`state\` uses Figma's options (correct, partial, wrong, notCaught), and \`leftIcon\` is Figma's "left icon" switch. Figma also has a \`Label\` text property, but its own description says the wording is fixed per state, so the code has no label prop: each state always shows "Correct", "Almost there", "Try again" or "Didn't catch that". The icon sits in an \`iconSlot\` at size 150 (12px) and is hidden from screen readers; the label carries the meaning.

**Known issue:** wrong and partial use near-identical rotating-arrow icons, so color is the only real difference between them. See "Open design questions" in component-spec.md.`;

const expected = {
  correct: { label: 'Correct', tone: 'success' },
  partial: { label: 'Almost there', tone: 'partial' },
  wrong: { label: 'Try again', tone: 'error' },
  notCaught: { label: "Didn't catch that", tone: 'neutral' },
} as const;

const meta = {
  title: 'Components/statusPill',
  component: StatusPill,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const state = args.state ?? 'correct';
    const pill = canvasElement.querySelector('.statusPill') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const resolve = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const { label, tone } = expected[state];

    await expect(pill).toHaveTextContent(label);
    await expect(getComputedStyle(pill).backgroundColor).toBe(resolve(`--color-feedback-${tone}-bold`));
    await expect(getComputedStyle(pill).color).toBe(resolve(`--color-feedback-${tone}-onBold`));
    await expect(getComputedStyle(pill).paddingTop).toBe(token('--space-100'));
    await expect(getComputedStyle(pill).paddingLeft).toBe(token('--space-200'));

    const icon = pill.querySelector('.iconSlot') as HTMLElement | null;
    if (args.leftIcon === false) {
      await expect(icon).toBeNull();
    } else {
      await expect(icon).not.toBeNull();
      await expect(getComputedStyle(icon!).width).toBe(token('--icon-150'));
      await expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Correct: Story = { name: 'state=correct', args: { state: 'correct' } };
export const Partial: Story = { name: 'state=partial', args: { state: 'partial' } };
export const Wrong: Story = { name: 'state=wrong', args: { state: 'wrong' } };
export const NotCaught: Story = { name: 'state=notCaught', args: { state: 'notCaught' } };

export const CorrectNoIcon: Story = {
  name: 'state=correct, left icon=false',
  args: { state: 'correct', leftIcon: false },
};
