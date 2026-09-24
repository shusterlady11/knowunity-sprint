import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { InputModeToggle, type InputMode, type InputModeToggleProps } from './InputModeToggle';

const figmaDescription = `Lets the student switch between speaking and typing an answer at any point in the recall loop. Replaces the earlier can't-speak quiz swap. The whole pill is one tap target (96×48); a tap anywhere switches the mode, the knob slides to the chosen side.

inputMode (voice / keyboard): which input is active. The knob sits behind the active icon, and the active icon uses icon/primary. The inactive icon uses icon/tertiary.

micBlocked (false / true): true only when mic permission has been denied. The only valid combination is inputMode=keyboard + micBlocked=true (voice+blocked is intentionally absent, since you can't be in voice mode without mic access). The mic glyph shows a slash. Tapping the mic side in this state does NOT switch modes; it opens the re-enable-permission flow. The knob stays on keyboard until permission is granted.

Defaults: voice when mic permission is granted; keyboard + micBlocked=true when denied; keyboard (micBlocked=false) after the student declines the mic primer.

Tokens: track and knob fill interactive/secondary (knob stacks on the track), Radius/Full, slots Space/1200, all padding/gap Space/0. Knob bevel: effect style Bevel/100.

Accessibility: expose as a two-option segmented control ("Speak" / "Type") with the selected state announced, not as two icon buttons. When micBlocked, the Speak option's label should say mic access is off.

**In code:** \`inputMode\` and \`micBlocked\` use Figma's names; \`micBlocked\` is a boolean (Figma's "false" / "true"), and the types don't allow the omitted voice + blocked combination. It's a radio group named "Answer input" with two options, "Speak" (or "Speak, mic access is off" when blocked) and "Type". The Arrow keys switch sides. \`onInputModeChange\` receives the mode the student switched to. When \`micBlocked\` is true a tap doesn't switch: it calls \`onBlockedMicClick\` for the re-enable-permission flow, and that goes for a tap on either side, since neither side can lead anywhere else.

**Knob size:** the 48px slots each keep a 40px knob by insetting it \`Space/100\` (Figma's knob is a typed-in 40px, the same as \`Control/M\`, but it isn't a control height).

**Motion:** the knob slides to the chosen side in \`motion.duration.toggle\` (200ms) with \`motion.easing.standard\`. These are code-only tokens in \`tokens/motion.json\`, since Figma can't hold motion values. With reduced motion turned on, the knob moves instantly; the active icon color still shows the mode.

**Contrast:** the dimmed icon (\`icon/tertiary\`, 48%) is about 4.3:1 against the pill and the bright one about 10:1 against the knob, so both pass the 3:1 minimum for graphics.`;

// Records interactions without the click event, so Storybook doesn't serialize it (which froze the docs page).
const switchSpy = fn();
const blockedSpy = fn();

// The component is controlled, so the stories keep the mode in state: a tap switches sides and the knob
// slides. Changing the inputMode control still sets the mode directly.
function Interactive(props: InputModeToggleProps) {
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
  } as InputModeToggleProps;
  return <InputModeToggle {...current} />;
}

const meta = {
  title: 'Components/inputModeToggle',
  component: InputModeToggle,
  render: (args) => <Interactive {...args} />,
  tags: ['autodocs'],
  args: {
    onInputModeChange: (mode) => switchSpy(mode),
    onBlockedMicClick: () => blockedSpy(),
  },
  argTypes: { onInputModeChange: { control: false }, onBlockedMicClick: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    switchSpy.mockClear();
    blockedSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const mode = args.inputMode ?? 'voice';
    const blocked = args.micBlocked ?? false;
    const pill = canvasElement.querySelector('.inputModeToggle') as HTMLElement;
    const knob = pill.querySelector('.inputModeToggle__knob') as HTMLElement;
    const [voiceSlot, keyboardSlot] = [...pill.querySelectorAll('.inputModeToggle__slot')] as HTMLElement[];
    const root = getComputedStyle(document.documentElement);
    const px = (name: string) => parseFloat(root.getPropertyValue(name));
    const token = (name: string) => root.getPropertyValue(name).trim();
    const paint = (property: 'color' | 'backgroundColor' | 'boxShadow', cssVar: string) => {
      const probe = document.createElement('span');
      probe.style[property] = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe)[property];
      probe.remove();
      return value;
    };

    // Geometry: a 96 x 48 pill of two 48px slots, with a 40px knob behind the active one.
    const pillBox = pill.getBoundingClientRect();
    await expect(pillBox.width).toBe(2 * px('--space-1200'));
    await expect(pillBox.height).toBe(px('--space-1200'));
    await expect(getComputedStyle(pill).borderTopLeftRadius).toBe(token('--radius-full'));
    await expect(getComputedStyle(pill).backgroundColor).toBe(paint('backgroundColor', '--color-interactive-secondary'));
    for (const slot of [voiceSlot, keyboardSlot]) {
      await expect(slot.getBoundingClientRect().width).toBe(px('--space-1200'));
      await expect(slot.getBoundingClientRect().height).toBe(px('--space-1200'));
    }
    const knobMotion = getComputedStyle(knob);
    await expect(knobMotion.transitionProperty).toBe('transform');
    await expect(knobMotion.transitionDuration).toBe(`${px('--motion-duration-toggle') / 1000}s`);
    await expect(knobMotion.transitionTimingFunction).toBe(token('--motion-easing-standard'));
    const knobBox = knob.getBoundingClientRect();
    const inset = px('--space-100');
    await expect(knobBox.width).toBe(px('--space-1200') - 2 * inset);
    await expect(knobBox.height).toBe(px('--space-1200') - 2 * inset);
    await expect(knobBox.left - pillBox.left).toBe(inset + (mode === 'keyboard' ? px('--space-1200') : 0));
    await expect(knobBox.top - pillBox.top).toBe(inset);
    await expect(getComputedStyle(knob).backgroundColor).toBe(paint('backgroundColor', '--color-interactive-secondary'));
    await expect(getComputedStyle(knob).boxShadow).toBe(paint('boxShadow', '--bevel-100'));

    // Icons: 16px tall, centered in their slot; the active one is bright, the other dimmed.
    for (const [slot, active] of [[voiceSlot, mode === 'voice'], [keyboardSlot, mode === 'keyboard']] as const) {
      const icon = slot.querySelector('.inputModeToggle__icon') as SVGElement;
      const iconBox = icon.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();
      await expect(iconBox.height).toBe(px('--icon-200'));
      await expect(iconBox.left + iconBox.width / 2).toBeCloseTo(slotBox.left + slotBox.width / 2, 1);
      await expect(iconBox.top + iconBox.height / 2).toBeCloseTo(slotBox.top + slotBox.height / 2, 1);
      await expect(getComputedStyle(slot).color).toBe(paint('color', active ? '--color-icon-primary' : '--color-icon-tertiary'));
    }

    // Accessibility: a two-option radio group; the checked option is the current mode.
    await expect(pill).toHaveAttribute('role', 'radiogroup');
    await expect(voiceSlot).toHaveAccessibleName(blocked ? 'Speak, mic access is off' : 'Speak');
    await expect(keyboardSlot).toHaveAccessibleName('Type');
    await expect(voiceSlot).toHaveAttribute('aria-checked', String(mode === 'voice'));
    await expect(keyboardSlot).toHaveAttribute('aria-checked', String(mode === 'keyboard'));

    // A tap on either side switches to the other mode, or opens the permission flow when blocked.
    await userEvent.click(mode === 'voice' ? voiceSlot : keyboardSlot);
    if (blocked) {
      await expect(blockedSpy).toHaveBeenCalledTimes(1);
      await expect(switchSpy).not.toHaveBeenCalled();
      await userEvent.click(voiceSlot);
      await expect(blockedSpy).toHaveBeenCalledTimes(2);
    } else {
      await expect(switchSpy).toHaveBeenLastCalledWith(mode === 'voice' ? 'keyboard' : 'voice');
      await userEvent.click(mode === 'voice' ? keyboardSlot : voiceSlot);
      await expect(switchSpy).toHaveBeenCalledTimes(2);
      await expect(blockedSpy).not.toHaveBeenCalled();
    }
  },
} satisfies Meta<typeof InputModeToggle>;

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
