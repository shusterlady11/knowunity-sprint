import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Button } from './Button';
import { SquareIcon } from '../iconSlot/SquareIcon';

const figmaDescription = `Text button with a label, optional leading/trailing icons, in 3 visual weights (Primary/Secondary/Tertiary), 3 sizes (S/M/L) and 4 states (Default/Pressed/Disabled/Loading). USE: Primary/L for the single most important action on a screen (e.g. a bottom CTA); Tertiary/S for lower-emphasis inline or grouped actions. DON'T: use more than one Primary button in the same view — in the Example Screens, Primary appears only once per screen, always at L size. NOTE: Secondary was not found in use on the Example Screens page, so its real-world usage is inferred from the variant scale, not observed directly.

**In code:** \`variant\`, \`size\` and \`state\` use the same names and options as Figma, \`showLeftIcon\` and \`showRightIcon\` are the same on/off switches, and \`CTA\` is the label text. \`leftIcon\` and \`rightIcon\` are two additions Figma can't express: the icons to show, since designers swap them by hand inside the button. Icons sit in an \`iconSlot\`.

- **Disabled** is a real disabled button.
- **Loading** hides the label and side icons and shows a spinner that turns once every 800ms. The button is marked busy, keeps its name for screen readers, and ignores taps. When a student has "reduce motion" turned on, the spinner stops turning but stays visible.
- **Pressed** loses its bevel and moves down 1px (2px on L) using top padding on the tap area. It does not darken the fill. It can be shown on its own with \`state="Pressed"\`; a real press looks the same.
- **L labels** are set in Inter Bold. Figma's Greed Condensed is an unlicensed trial font that can't be published, so L labels come out wider than in Figma.
- **Tertiary** has square corners, which only show as the shape of the keyboard focus ring; it is fully round while pressed, as in Figma.
- The button has two layers. The tap area has a minimum height of Control/Touch Target (48px), and the visible button is Control/S, Control/M or Control/L tall.`;

// The click handler records the call but not the click event: Storybook serializes call arguments,
// and serializing the event froze the docs page for about a second after every click.
const clickSpy = fn();

const meta = {
  title: 'Components/button',
  component: Button,
  tags: ['autodocs'],
  args: { CTA: 'Next question', onClick: () => clickSpy() },
  beforeEach: () => {
    clickSpy.mockClear();
  },
  argTypes: { leftIcon: { control: false }, rightIcon: { control: false }, onClick: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole('button', { name: args.CTA });
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();

    const face = button.querySelector('.button__face') as HTMLElement;
    await expect(getComputedStyle(face).height).toBe(token(`--control-${(args.size ?? 'S').toLowerCase()}`));
    await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(parseFloat(token('--control-touch-target')));

    const hasBevel = args.variant !== 'Tertiary' && args.state !== 'Pressed';
    await expect(getComputedStyle(face).boxShadow === 'none').toBe(!hasBevel);

    const isFilled = args.variant !== 'Tertiary';
    const expectedRadius = args.variant === 'Tertiary' && args.state !== 'Pressed' ? '0px' : token('--radius-full');
    await expect(getComputedStyle(face).borderTopLeftRadius).toBe(expectedRadius);

    const label = button.querySelector('.button__label') as HTMLElement | null;
    if (label) {
      const tracking = args.size === 'L' ? '--type-headline-s-letterSpacing' : '--type-body-s-bold-letterSpacing';
      const appliedTracking = getComputedStyle(label).letterSpacing;
      await expect(appliedTracking === 'normal' ? '0px' : appliedTracking).toBe(token(tracking));
      const labelRect = label.getBoundingClientRect();
      const faceBox = face.getBoundingClientRect();
      const lift = isFilled ? parseFloat(token(args.size === 'L' ? '--space-100' : '--space-050')) / 2 : 0;
      await expect((labelRect.top + labelRect.height / 2) - (faceBox.top + faceBox.height / 2)).toBeCloseTo(-lift, 1);
    }

    const pressedPadding = args.state === 'Pressed' ? parseFloat(token(args.size === 'L' ? '--space-100' : '--space-050')) : 0;
    const buttonRect = button.getBoundingClientRect();
    const faceRect = face.getBoundingClientRect();
    await expect(faceRect.top - buttonRect.top).toBeCloseTo((buttonRect.height - faceRect.height) / 2 + pressedPadding / 2, 1);

    if (args.state === 'Disabled') {
      await expect(button).toBeDisabled();
    } else if (args.state === 'Loading') {
      await expect(button).toHaveAttribute('aria-busy', 'true');
      await userEvent.click(button);
      await expect(clickSpy).not.toHaveBeenCalled();
    } else {
      await userEvent.click(button);
      await expect(clickSpy).toHaveBeenCalled();
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimarySDefault: Story = {
  name: 'variant=Primary, size=S, state=Default',
  args: { variant: 'Primary', size: 'S', state: 'Default' },
};

export const PrimarySPressed: Story = {
  name: 'variant=Primary, size=S, state=Pressed',
  args: { variant: 'Primary', size: 'S', state: 'Pressed' },
};

export const PrimarySDisabled: Story = {
  name: 'variant=Primary, size=S, state=Disabled',
  args: { variant: 'Primary', size: 'S', state: 'Disabled' },
};

export const PrimarySLoading: Story = {
  name: 'variant=Primary, size=S, state=Loading',
  args: { variant: 'Primary', size: 'S', state: 'Loading' },
};

export const PrimaryMDefault: Story = {
  name: 'variant=Primary, size=M, state=Default',
  args: { variant: 'Primary', size: 'M', state: 'Default' },
};

export const PrimaryMPressed: Story = {
  name: 'variant=Primary, size=M, state=Pressed',
  args: { variant: 'Primary', size: 'M', state: 'Pressed' },
};

export const PrimaryMDisabled: Story = {
  name: 'variant=Primary, size=M, state=Disabled',
  args: { variant: 'Primary', size: 'M', state: 'Disabled' },
};

export const PrimaryMLoading: Story = {
  name: 'variant=Primary, size=M, state=Loading',
  args: { variant: 'Primary', size: 'M', state: 'Loading' },
};

export const PrimaryLDefault: Story = {
  name: 'variant=Primary, size=L, state=Default',
  args: { variant: 'Primary', size: 'L', state: 'Default' },
};

export const PrimaryLPressed: Story = {
  name: 'variant=Primary, size=L, state=Pressed',
  args: { variant: 'Primary', size: 'L', state: 'Pressed' },
};

export const PrimaryLDisabled: Story = {
  name: 'variant=Primary, size=L, state=Disabled',
  args: { variant: 'Primary', size: 'L', state: 'Disabled' },
};

export const PrimaryLLoading: Story = {
  name: 'variant=Primary, size=L, state=Loading',
  args: { variant: 'Primary', size: 'L', state: 'Loading' },
};

export const SecondarySDefault: Story = {
  name: 'variant=Secondary, size=S, state=Default',
  args: { variant: 'Secondary', size: 'S', state: 'Default' },
};

export const SecondarySPressed: Story = {
  name: 'variant=Secondary, size=S, state=Pressed',
  args: { variant: 'Secondary', size: 'S', state: 'Pressed' },
};

export const SecondarySDisabled: Story = {
  name: 'variant=Secondary, size=S, state=Disabled',
  args: { variant: 'Secondary', size: 'S', state: 'Disabled' },
};

export const SecondarySLoading: Story = {
  name: 'variant=Secondary, size=S, state=Loading',
  args: { variant: 'Secondary', size: 'S', state: 'Loading' },
};

export const SecondaryMDefault: Story = {
  name: 'variant=Secondary, size=M, state=Default',
  args: { variant: 'Secondary', size: 'M', state: 'Default' },
};

export const SecondaryMPressed: Story = {
  name: 'variant=Secondary, size=M, state=Pressed',
  args: { variant: 'Secondary', size: 'M', state: 'Pressed' },
};

export const SecondaryMDisabled: Story = {
  name: 'variant=Secondary, size=M, state=Disabled',
  args: { variant: 'Secondary', size: 'M', state: 'Disabled' },
};

export const SecondaryMLoading: Story = {
  name: 'variant=Secondary, size=M, state=Loading',
  args: { variant: 'Secondary', size: 'M', state: 'Loading' },
};

export const SecondaryLDefault: Story = {
  name: 'variant=Secondary, size=L, state=Default',
  args: { variant: 'Secondary', size: 'L', state: 'Default' },
};

export const SecondaryLPressed: Story = {
  name: 'variant=Secondary, size=L, state=Pressed',
  args: { variant: 'Secondary', size: 'L', state: 'Pressed' },
};

export const SecondaryLDisabled: Story = {
  name: 'variant=Secondary, size=L, state=Disabled',
  args: { variant: 'Secondary', size: 'L', state: 'Disabled' },
};

export const SecondaryLLoading: Story = {
  name: 'variant=Secondary, size=L, state=Loading',
  args: { variant: 'Secondary', size: 'L', state: 'Loading' },
};

export const TertiarySDefault: Story = {
  name: 'variant=Tertiary, size=S, state=Default',
  args: { variant: 'Tertiary', size: 'S', state: 'Default' },
};

export const TertiarySPressed: Story = {
  name: 'variant=Tertiary, size=S, state=Pressed',
  args: { variant: 'Tertiary', size: 'S', state: 'Pressed' },
};

export const TertiarySDisabled: Story = {
  name: 'variant=Tertiary, size=S, state=Disabled',
  args: { variant: 'Tertiary', size: 'S', state: 'Disabled' },
};

export const TertiarySLoading: Story = {
  name: 'variant=Tertiary, size=S, state=Loading',
  args: { variant: 'Tertiary', size: 'S', state: 'Loading' },
};

export const TertiaryMDefault: Story = {
  name: 'variant=Tertiary, size=M, state=Default',
  args: { variant: 'Tertiary', size: 'M', state: 'Default' },
};

export const TertiaryMPressed: Story = {
  name: 'variant=Tertiary, size=M, state=Pressed',
  args: { variant: 'Tertiary', size: 'M', state: 'Pressed' },
};

export const TertiaryMDisabled: Story = {
  name: 'variant=Tertiary, size=M, state=Disabled',
  args: { variant: 'Tertiary', size: 'M', state: 'Disabled' },
};

export const TertiaryMLoading: Story = {
  name: 'variant=Tertiary, size=M, state=Loading',
  args: { variant: 'Tertiary', size: 'M', state: 'Loading' },
};

export const TertiaryLDefault: Story = {
  name: 'variant=Tertiary, size=L, state=Default',
  args: { variant: 'Tertiary', size: 'L', state: 'Default' },
};

export const TertiaryLPressed: Story = {
  name: 'variant=Tertiary, size=L, state=Pressed',
  args: { variant: 'Tertiary', size: 'L', state: 'Pressed' },
};

export const TertiaryLDisabled: Story = {
  name: 'variant=Tertiary, size=L, state=Disabled',
  args: { variant: 'Tertiary', size: 'L', state: 'Disabled' },
};

export const TertiaryLLoading: Story = {
  name: 'variant=Tertiary, size=L, state=Loading',
  args: { variant: 'Tertiary', size: 'L', state: 'Loading' },
};

export const ShowLeftIcon: Story = {
  name: 'variant=Primary, size=L, state=Default, showLeftIcon=true',
  args: { variant: 'Primary', size: 'L', showLeftIcon: true, leftIcon: <SquareIcon /> },
};

export const ShowRightIcon: Story = {
  name: 'variant=Primary, size=L, state=Default, showRightIcon=true',
  args: { variant: 'Primary', size: 'L', showRightIcon: true, rightIcon: <SquareIcon /> },
};

export const ShowBothIcons: Story = {
  name: 'variant=Primary, size=L, state=Default, showLeftIcon=true, showRightIcon=true',
  args: { variant: 'Primary', size: 'L', showLeftIcon: true, showRightIcon: true, leftIcon: <SquareIcon />, rightIcon: <SquareIcon /> },
};
