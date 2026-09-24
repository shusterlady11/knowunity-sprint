import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import type { InputMode } from '../inputModeToggle/InputModeToggle';
import { ToggleGroup } from './ToggleGroup';
import type { ToggleGroupProps } from './ToggleGroup';

const figmaDescription = `Bottom row on the question screens: the voice/keyboard input toggle on the left, "Skip" on the right. Used on the question screens before the student answers.

Variants mirror inputModeToggle so the two always match:
• inputMode=voice, micBlocked=false: mic permission granted, student is speaking.
• inputMode=keyboard, micBlocked=false: student switched to typing, or declined the mic primer. Mic can still be requested.
• inputMode=keyboard, micBlocked=true: mic permission denied at OS level. Slashed mic; tapping it opens the re-enable-permission flow, not recording. micButton is hidden on this screen.

There is no voice + blocked variant, because you can't be in voice mode without mic access.

Layout: horizontal auto layout, fixed 358 wide (matches the question card), hug height (48), space-between (gap Auto), padding Space/0. Don't bind a variable to the gap: a bound gap overrides space-between and packs Skip against the toggle.

DON'T: set the nested inputModeToggle's properties on an instance. Pick this component's variant instead, so the row and the toggle can't disagree.

**In code:** it's built from the \`inputModeToggle\` and \`button\` (Tertiary, size S, labelled "Skip") components, so it takes \`inputMode\` and \`micBlocked\` (same names, options and rules as inputModeToggle) and passes them straight down. Callbacks: \`onInputModeChange\`, \`onBlockedMicClick\` (both from inputModeToggle) and \`onSkip\`. The label is fixed to "Skip", as in Figma.

**Width:** it fills its container, as the other components do, so it's 358px wide when the screen gives it its 16px side gutters. Figma's fixed 358 is the same number.`;

// Records interactions without the click event, so Storybook doesn't serialize it (which froze the docs page).
const switchSpy = fn();
const blockedSpy = fn();
const skipSpy = fn();

// The row is controlled, so the stories keep the mode in state: a tap switches sides and the knob slides.
function Interactive(props: ToggleGroupProps) {
  const [mode, setMode] = useState<InputMode>(props.inputMode ?? 'voice');
  const [seenMode, setSeenMode] = useState(props.inputMode);
  if (props.inputMode !== seenMode) {
    setSeenMode(props.inputMode);
    setMode(props.inputMode ?? 'voice');
  }
  // The union type can't express "any mode with this blocked value", so cast once.
  const current = {
    ...props,
    inputMode: mode,
    onInputModeChange: (next: InputMode) => {
      setMode(next);
      props.onInputModeChange?.(next);
    },
  } as ToggleGroupProps;
  return <ToggleGroup {...current} />;
}

const meta = {
  title: 'Components/toggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  render: (args) => <Interactive {...args} />,
  args: {
    onInputModeChange: (mode) => switchSpy(mode),
    onBlockedMicClick: () => blockedSpy(),
    onSkip: () => skipSpy(),
  },
  argTypes: {
    onInputModeChange: { control: false },
    onBlockedMicClick: { control: false },
    onSkip: { control: false },
  },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    switchSpy.mockClear();
    blockedSpy.mockClear();
    skipSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const mode = args.inputMode ?? 'voice';
    const blocked = args.micBlocked ?? false;
    const row = canvasElement.querySelector('.toggleGroup') as HTMLElement;
    const toggle = row.querySelector('.inputModeToggle') as HTMLElement;
    const skip = row.querySelector('.button') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const px = (name: string) => parseFloat(root.getPropertyValue(name));

    // Layout: toggle at the left edge, Skip at the right edge, hugging the 48px height, no padding.
    const rowBox = row.getBoundingClientRect();
    const toggleBox = toggle.getBoundingClientRect();
    const skipBox = skip.getBoundingClientRect();
    await expect(rowBox.width).toBe(row.parentElement!.getBoundingClientRect().width - parseFloat(getComputedStyle(row.parentElement!).paddingLeft) - parseFloat(getComputedStyle(row.parentElement!).paddingRight));
    await expect(rowBox.height).toBe(px('--space-1200'));
    await expect(toggleBox.left).toBe(rowBox.left);
    await expect(skipBox.right).toBe(rowBox.right);
    await expect(toggleBox.width).toBe(2 * px('--space-1200'));
    await expect(skipBox.width).toBeGreaterThanOrEqual(px('--control-touch-target'));
    await expect(skipBox.height).toBe(px('--control-touch-target'));
    await expect(getComputedStyle(row).paddingTop).toBe('0px');
    await expect(getComputedStyle(row).columnGap).toBe('normal');

    // The nested toggle mirrors the variant, and Skip is the Tertiary S button.
    await expect(toggle).toHaveAttribute('data-input-mode', mode);
    await expect(toggle).toHaveAttribute('data-mic-blocked', String(blocked));
    await expect(skip).toHaveAttribute('data-variant', 'Tertiary');
    await expect(skip).toHaveAttribute('data-size', 'S');
    await expect(skip).toHaveTextContent('Skip');

    // Taps: Skip records a skip; the toggle switches mode, or opens the permission flow when blocked.
    await userEvent.click(skip);
    await expect(skipSpy).toHaveBeenCalledTimes(1);
    const toggleSlot = toggle.querySelector('.inputModeToggle__slot') as HTMLElement;
    await userEvent.click(toggleSlot);
    if (blocked) {
      await expect(blockedSpy).toHaveBeenCalledTimes(1);
      await expect(switchSpy).not.toHaveBeenCalled();
    } else {
      await expect(switchSpy).toHaveBeenCalledTimes(1);
      await expect(blockedSpy).not.toHaveBeenCalled();
    }
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VoiceNotBlocked: Story = {
  name: 'inputMode=voice, micBlocked=false',
  args: { inputMode: 'voice', micBlocked: false },
};

export const KeyboardNotBlocked: Story = {
  name: 'inputMode=keyboard, micBlocked=false',
  args: { inputMode: 'keyboard', micBlocked: false },
};

export const KeyboardBlocked: Story = {
  name: 'inputMode=keyboard, micBlocked=true',
  args: { inputMode: 'keyboard', micBlocked: true },
};
