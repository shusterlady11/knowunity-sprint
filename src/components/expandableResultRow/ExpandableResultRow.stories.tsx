import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { ExpandableResultRow } from './ExpandableResultRow';
import type { ExpandableResultRowProps, ExpandableResultRowState } from './ExpandableResultRow';

const figmaDescription = `One row in the results screen's Good Explanations / Needs Practice / skipped-questions lists. \`state\` (collapsed/expanded) controls the chevron rotation and whether the transcript detail is shown — accordion logic (only one row open at a time) is real interaction logic to build in code, not something this static set can demonstrate beyond a reference frame. \`tone\` (success/error/neutral) sets the leading icon (Check/X/DotOutline) and the row fill from the feedback token set. \`transcript\` holds only the raw spoken-answer text — the "What you said:" label is fixed structure, not a property. Never put a summary or hint in \`transcript\`.

**In code:** \`state\`, \`tone\` and \`transcript\` use Figma's names and options. Figma types the concept name and the question into the layers instead of exposing them (and no layer is linked to the \`transcript\` property), so code adds two required props, \`label\` and \`question\`. The transcript is shown in curly quotes; leave it out for a skipped question and the row says "Not answered.", as the neutral variant does.

**Opening and closing:** the header is a real button that says whether the row is open. Tapping it calls \`onToggle\` with the state asked for; the parent decides, so it can keep only one row open at a time. The stories keep the state themselves, so a tap opens and closes them.

**Layout:** the row fills its container. Its whole top (padding included) is the tap target, so it's taller than the one text line and well over the 48px minimum. The chevron points right when collapsed and turns a quarter turn clockwise to point down when open, as in Figma (whose -90 rotation is counterclockwise-positive). The detail is indented \`Space/700\` to line up under the label. Icons: Check, X and DotOutline in \`feedback/success/onSubtle\`, \`feedback/error/onSubtle\` and \`interactive/onSecondary\`; the chevron is \`interactive/primary\`.`;

// Records the toggle without the click event, so Storybook doesn't serialize it (which froze the docs page).
const toggleSpy = fn();

// The row is controlled, so the stories keep the state: a tap opens and closes the row.
function Interactive(props: ExpandableResultRowProps) {
  const [state, setState] = useState<ExpandableResultRowState>(props.state ?? 'collapsed');
  const [seenState, setSeenState] = useState(props.state);
  if (props.state !== seenState) {
    setSeenState(props.state);
    setState(props.state ?? 'collapsed');
  }
  return (
    <ExpandableResultRow
      {...props}
      state={state}
      onToggle={(next) => {
        setState(next);
        props.onToggle?.(next);
      }}
    />
  );
}

const meta = {
  title: 'Components/expandableResultRow',
  component: ExpandableResultRow,
  tags: ['autodocs'],
  render: (args) => <Interactive {...args} />,
  args: {
    label: 'Natural selection',
    question: 'Describe natural selection in your own words.',
    transcript:
      'Natural selection is when organisms with traits that help them survive and reproduce pass those traits to their offspring more often, so over time those traits become more common in the population.',
    onToggle: (next) => toggleSpy(next),
  },
  argTypes: { onToggle: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    toggleSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const state = args.state ?? 'collapsed';
    const tone = args.tone ?? 'success';
    const row = canvasElement.querySelector('.expandableResultRow') as HTMLElement;
    const header = row.querySelector('.expandableResultRow__header') as HTMLButtonElement;
    const icon = row.querySelector('.expandableResultRow__icon .iconSlot') as HTMLElement;
    const arrow = row.querySelector('.expandableResultRow__arrow') as HTMLElement;
    const label = row.querySelector('.expandableResultRow__label') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const paint = (property: 'color' | 'backgroundColor', cssVar: string) => {
      const probe = document.createElement('span');
      probe.style[property] = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe)[property];
      probe.remove();
      return value;
    };

    // The card: fills its container, 16px padding, 16px corners, tinted by tone.
    const rowBox = row.getBoundingClientRect();
    const rowStyle = getComputedStyle(row);
    const parent = row.parentElement as HTMLElement;
    await expect(rowBox.width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    await expect(rowStyle.paddingTop).toBe(token('--space-400'));
    await expect(rowStyle.paddingLeft).toBe(token('--space-400'));
    await expect(rowStyle.borderTopLeftRadius).toBe(token('--radius-400'));
    await expect(rowStyle.rowGap).toBe(token('--space-200'));
    const fill = { success: '--color-feedback-success-subtle', error: '--color-feedback-error-subtle', neutral: '--color-background-surface' }[tone];
    await expect(rowStyle.backgroundColor).toBe(paint('backgroundColor', fill));

    // The header line: icon, label and chevron, one Body M line tall (26px), so a collapsed row is 58px.
    const lineHeight = px('--type-body-m-regular-lineHeight');
    if (state === 'collapsed') await expect(rowBox.height).toBe(2 * px('--space-400') + lineHeight);
    const headerBox = header.getBoundingClientRect();
    await expect(headerBox.left).toBe(rowBox.left);
    await expect(headerBox.width).toBe(rowBox.width);
    await expect(headerBox.top).toBe(rowBox.top);
    await expect(headerBox.height).toBe(2 * px('--space-400') + lineHeight);
    await expect(headerBox.height).toBeGreaterThanOrEqual(px('--control-touch-target'));
    const iconBox = icon.getBoundingClientRect();
    await expect(iconBox.width).toBe(px('--icon-200'));
    await expect(iconBox.height).toBe(px('--icon-200'));
    await expect(iconBox.left).toBe(rowBox.left + px('--space-400'));
    await expect(iconBox.top + iconBox.height / 2).toBeCloseTo(rowBox.top + px('--space-400') + lineHeight / 2, 1);
    const iconColor = { success: '--color-feedback-success-onSubtle', error: '--color-feedback-error-onSubtle', neutral: '--color-interactive-onSecondary' }[tone];
    await expect(getComputedStyle(icon.parentElement as HTMLElement).color).toBe(paint('color', iconColor));
    await expect(label.getBoundingClientRect().left).toBe(iconBox.right + px('--space-200'));
    const ls = getComputedStyle(label);
    await expect(ls.fontSize).toBe(token('--type-body-m-regular-fontSize'));
    await expect(ls.fontWeight).toBe(token('--type-body-m-regular-fontWeight'));
    await expect(ls.lineHeight).toBe(token('--type-body-m-regular-lineHeight'));
    await expect(ls.color).toBe(paint('color', '--color-text-primary'));
    const arrowSlot = arrow.querySelector('.iconSlot') as HTMLElement;
    const arrowBox = arrowSlot.getBoundingClientRect();
    await expect(arrowBox.width).toBe(px('--icon-250'));
    await expect(arrowBox.right).toBe(rowBox.right - px('--space-400'));
    await expect(getComputedStyle(arrow).color).toBe(paint('color', '--color-interactive-primary'));
    await expect(getComputedStyle(arrow).transform).toBe(state === 'expanded' ? 'matrix(0, 1, -1, 0, 0, 0)' : 'none');

    // Accessibility: the header says whether the row is open, and points at the detail when it is.
    await expect(header).toHaveAttribute('aria-expanded', String(state === 'expanded'));
    const detail = row.querySelector('.expandableResultRow__detail') as HTMLElement | null;
    if (state === 'collapsed') {
      await expect(detail).toBeNull();
    } else {
      await expect(detail).not.toBeNull();
      await expect(header).toHaveAttribute('aria-controls', detail!.id);
      // The detail: 8px under the header line, indented Space/700, with fixed labels.
      await expect(detail!.getBoundingClientRect().top).toBe(rowBox.top + px('--space-400') + lineHeight + px('--space-200'));
      await expect(getComputedStyle(detail!).paddingLeft).toBe(token('--space-700'));
      const [questionLabel, question, saidLabel, said] = [...detail!.querySelectorAll('p')] as HTMLElement[];
      await expect(questionLabel).toHaveTextContent('Question');
      await expect(question).toHaveTextContent(args.question);
      await expect(saidLabel).toHaveTextContent('What you said');
      await expect(said).toHaveTextContent(args.transcript ? `“${args.transcript}”` : 'Not answered.');
      const cap = getComputedStyle(questionLabel);
      await expect(cap.fontSize).toBe(token('--type-caption-m-bold-fontSize'));
      await expect(cap.fontWeight).toBe(token('--type-caption-m-bold-fontWeight'));
      await expect(cap.color).toBe(paint('color', '--color-text-secondary'));
      const body = getComputedStyle(said);
      await expect(body.fontSize).toBe(token('--type-body-s-regular-fontSize'));
      await expect(body.lineHeight).toBe(token('--type-body-s-regular-lineHeight'));
      await expect(body.color).toBe(paint('color', '--color-text-primary'));
      await expect(question.getBoundingClientRect().left).toBe(rowBox.left + px('--space-400') + px('--space-700'));
    }

    // Tapping the header asks for the other state; a second tap asks for the original one again.
    await userEvent.click(header);
    await expect(toggleSpy).toHaveBeenLastCalledWith(state === 'collapsed' ? 'expanded' : 'collapsed');
    await expect(header).toHaveAttribute('aria-expanded', String(state !== 'expanded'));
    await userEvent.click(header);
    await expect(toggleSpy).toHaveBeenLastCalledWith(state);
    await expect(header).toHaveAttribute('aria-expanded', String(state === 'expanded'));
  },
} satisfies Meta<typeof ExpandableResultRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CollapsedSuccess: Story = {
  name: 'state=collapsed, tone=success',
  args: { state: 'collapsed', tone: 'success' },
};

export const ExpandedSuccess: Story = {
  name: 'state=expanded, tone=success',
  args: { state: 'expanded', tone: 'success' },
};

export const CollapsedError: Story = {
  name: 'state=collapsed, tone=error',
  args: { state: 'collapsed', tone: 'error' },
};

export const ExpandedError: Story = {
  name: 'state=expanded, tone=error',
  args: { state: 'expanded', tone: 'error' },
};

export const CollapsedNeutral: Story = {
  name: 'state=collapsed, tone=neutral',
  args: { state: 'collapsed', tone: 'neutral', transcript: undefined },
};

export const ExpandedNeutral: Story = {
  name: 'state=expanded, tone=neutral',
  args: { state: 'expanded', tone: 'neutral', transcript: undefined },
};
