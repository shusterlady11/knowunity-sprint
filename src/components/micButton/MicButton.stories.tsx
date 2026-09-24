import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { MicButton } from './MicButton';

const figmaDescription = `Mic entry point for voice-based active recall. Two independent properties: "listeningState" (idle / listening) tracks whether the mic is actively capturing; "interactionState" (ready / pressed / disabled) tracks interaction/availability. 5 of 6 combinations exist — listening+disabled is intentionally omitted, since the button can't be actively listening and disabled at the same time.

Use idle+ready as the resting/default state. Use pressed (with either idle or listening) for momentary press feedback only. Use idle+disabled while Knowie is processing the answer (the processing screen), paired with loadingDots. It is not a generic greyed-out/inactive button.

Do not use this component for mic-permission-denied. Denied is handled by inputModeToggle (inputMode=keyboard, micBlocked=true): the student is in keyboard mode and micButton is not shown. Tapping the slashed mic on the toggle opens the re-enable-permission flow.

There is currently no icon instance-swap property — each variant's icon is hard-set on that variant, not swappable at the instance level. This is intentional: Figma shares one live icon value across every variant bound to the same instance-swap property, so re-adding a shared property would force all bound variants back onto a single icon. If per-instance icon overrides are needed later, that tradeoff has to be made deliberately, not casually re-added.

recordingGlow (the 4-ellipse halo, separate component) is not part of this button — it's a separate instance meant to sit behind micButton during Listening, composed independently so the two can animate on their own.

**In code:** \`listeningState\` and \`interactionState\` use Figma's names and options, and the types don't allow the omitted listening + disabled combination. The button is a push-to-talk toggle named "Record answer": it reports whether it's listening to screen readers (pressed = listening), and a tap starts or stops recording. While disabled it is marked busy and unavailable but keeps keyboard focus, and taps are ignored. When pressed the bevel goes and the face sits 2px lower, as in Figma (\`Space/100\` top padding on the fixed frame centers the face), and a real press shows the same look. The icon takes \`accent/brand/bold\` normally, \`accent/brand/onSubtle\` when pressed and \`icon/disabled\` when disabled.

**Size:** \`Control/Mic\` (96px) for both the outer frame and the visible circle. The circle is well above the touch-target minimum, so there's no separate tap area.

**Known issue:** in the listening state Figma keeps the violet icon on the darker pressed fill, about 2.3:1 contrast, below the 3:1 minimum for graphics. The listening state is also the one that must be unmistakable, so recordingGlow must always be shown behind it.`;

// Records taps without the click event, so Storybook doesn't serialize a click event (which froze the docs page).
const tapSpy = fn();

const meta = {
  title: 'Components/micButton',
  component: MicButton,
  tags: ['autodocs'],
  args: { onClick: () => tapSpy() },
  argTypes: { onClick: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    tapSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const listening = args.listeningState ?? 'idle';
    const interaction = args.interactionState ?? 'ready';
    const button = canvasElement.querySelector('.micButton') as HTMLElement;
    const icon = button.querySelector('.micButton__icon') as SVGElement;
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
    const face = button.querySelector('.micButton__face') as HTMLElement;
    const cs = getComputedStyle(face);

    await expect(getComputedStyle(button).width).toBe(token('--control-mic'));
    await expect(getComputedStyle(button).height).toBe(token('--control-mic'));
    await expect(cs.width).toBe(token('--control-mic'));
    await expect(cs.height).toBe(token('--control-mic'));
    await expect(cs.borderTopLeftRadius).toBe(token('--radius-full'));

    // Pressed moves the face down by half of Space/100 (the frame's top padding, centered).
    const shift = face.getBoundingClientRect().top - button.getBoundingClientRect().top;
    await expect(shift).toBe(interaction === 'pressed' ? parseFloat(token('--space-100')) / 2 : 0);
    await expect(getComputedStyle(icon).height).toBe(token('--icon-400'));

    const fill =
      interaction === 'disabled'
        ? '--color-background-surface'
        : interaction === 'pressed' || listening === 'listening'
          ? '--color-interactive-primaryActive'
          : '--color-interactive-primary';
    await expect(cs.backgroundColor).toBe(color(fill));

    const shadow = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.boxShadow = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).boxShadow;
      probe.remove();
      return value;
    };
    // Ready keeps the bevel; pressed removes it; disabled swaps it for a 1px border ring.
    if (interaction === 'ready') await expect(cs.boxShadow).toBe(shadow('--bevel-300'));
    else if (interaction === 'pressed') await expect(cs.boxShadow).toBe('none');
    else await expect(cs.boxShadow).not.toBe(shadow('--bevel-300'));

    const iconColor =
      interaction === 'disabled'
        ? '--color-icon-disabled'
        : interaction === 'pressed'
          ? '--color-accent-brand-onSubtle'
          : '--color-accent-brand-bold';
    await expect(getComputedStyle(button).color).toBe(color(iconColor));

    await expect(button).toHaveAttribute('aria-pressed', listening === 'listening' ? 'true' : 'false');
    await expect(button).toHaveAccessibleName('Record answer');

    if (interaction === 'disabled') {
      await expect(button).toHaveAttribute('aria-disabled', 'true');
      await expect(button).toHaveAttribute('aria-busy', 'true');
      await userEvent.click(button);
      await expect(tapSpy).not.toHaveBeenCalled();
    } else {
      await userEvent.click(button);
      await expect(tapSpy).toHaveBeenCalledTimes(1);
    }
  },
} satisfies Meta<typeof MicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IdleReady: Story = {
  name: 'listeningState=idle, interactionState=ready',
  args: { listeningState: 'idle', interactionState: 'ready' },
};

export const IdlePressed: Story = {
  name: 'listeningState=idle, interactionState=pressed',
  args: { listeningState: 'idle', interactionState: 'pressed' },
};

export const IdleDisabled: Story = {
  name: 'listeningState=idle, interactionState=disabled',
  args: { listeningState: 'idle', interactionState: 'disabled' },
};

export const ListeningReady: Story = {
  name: 'listeningState=listening, interactionState=ready',
  args: { listeningState: 'listening', interactionState: 'ready' },
};

export const ListeningPressed: Story = {
  name: 'listeningState=listening, interactionState=pressed',
  args: { listeningState: 'listening', interactionState: 'pressed' },
};
