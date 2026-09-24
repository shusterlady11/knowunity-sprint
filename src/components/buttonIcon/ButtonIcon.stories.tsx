import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ButtonIcon } from './ButtonIcon';
import { XIcon } from '../../icons/XIcon';

const figmaDescription = `Icon-only button — the same Primary/Secondary/Tertiary x S/M/L x Default/Pressed/Disabled/Loading structure as button, but icon-only with no text label. USE: for compact, self-explanatory icon actions in a top nav bar or button group. DON'T: use it for an action whose meaning isn't obvious from the icon alone — there's no text label to fall back on. NOTE: only the Secondary variant was found in use on the Example Screens page (inside buttonGroup and topNavigation), so guidance for Primary/Tertiary is inferred from the parallel button component, not observed directly.

**In code:** \`variant\`, \`size\` and \`state\` use the same names and options as Figma. Figma's icon container is empty in the component (each instance puts its icon in), so the icon is an \`icon\` prop that takes an icon such as \`XIcon\`. \`aria-label\` is required: with no text, it's the button's only name for screen readers. It reuses the button's styles, so the two behave alike:

- **Sizes:** the visible circle is Control/S, Control/M or Control/L (32, 40, 56px) with a 16, 20 or 24px icon (Icon/200, 250, 300). The tap area is at least Control/Touch Target (48px).
- **Pressed** loses its bevel and moves down 1px (2px on L) using top padding on the tap area. It can be shown on its own with \`state="Pressed"\`; a real press looks the same.
- **Disabled** is a real disabled button, with the icon dimmed (\`icon/disabled\`).
- **Loading** replaces the icon with the spinner (one turn every 800ms). The button is marked busy, keeps its name, and ignores taps. With "reduce motion" on, the spinner stops turning but stays visible.
- **Tertiary** has square corners, which only show as the shape of the keyboard focus ring; it is fully round while pressed, as in Figma.
- **Icon color:** Figma sets it per instance. Here it's \`icon/primary\` on Secondary and Tertiary, \`interactive/onPrimary\` on the Primary fill, and \`icon/disabled\` when disabled.

**Primary outline:** in Figma the Primary icon button has a 1px inside outline (\`border/default\`) in every state except Disabled; the text \`button\`'s Primary has none. It's built as Figma has it here, and the difference between the two sets is worth a look.`;

// The click handler records the call but not the click event: Storybook serializes call arguments,
// and serializing the event froze the docs page for about a second after every click.
const clickSpy = fn();

const meta = {
  title: 'Components/buttonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  args: { icon: <XIcon />, 'aria-label': 'Close', onClick: () => clickSpy() },
  argTypes: { icon: { control: false }, onClick: { control: false } },
  beforeEach: () => {
    clickSpy.mockClear();
  },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvas, args, userEvent }) => {
    const variant = args.variant ?? 'Primary';
    const size = args.size ?? 'S';
    const state = args.state ?? 'Default';
    const button = canvas.getByRole('button', { name: 'Close' });
    const face = button.querySelector('.button__face') as HTMLElement;
    const iconSlot = button.querySelector('.iconSlot') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const paint = (property: 'color' | 'backgroundColor' | 'boxShadow', value: string) => {
      const probe = document.createElement('span');
      probe.style[property] = value;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe)[property];
      probe.remove();
      return computed;
    };
    const controlToken = `--control-${size.toLowerCase()}`;
    const iconToken = { S: '--icon-200', M: '--icon-250', L: '--icon-300' }[size];
    const bevelToken = size === 'L' ? '--bevel-200' : '--bevel-100';
    const outline = 'inset 0 0 0 var(--stroke-border) var(--color-border-default)';

    // Sizes: a circle of the control's size inside a tap area of at least 48px, with the icon centered.
    const faceBox = face.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    await expect(faceBox.width).toBe(px(controlToken));
    await expect(faceBox.height).toBe(px(controlToken));
    await expect(buttonBox.width).toBe(Math.max(px('--control-touch-target'), px(controlToken)));
    await expect(buttonBox.height).toBe(Math.max(px('--control-touch-target'), px(controlToken)));
    const iconBox = iconSlot.getBoundingClientRect();
    await expect(iconBox.width).toBe(px(iconToken));
    await expect(iconBox.height).toBe(px(iconToken));
    await expect(iconBox.left + iconBox.width / 2).toBeCloseTo(faceBox.left + faceBox.width / 2, 1);
    await expect(iconBox.top + iconBox.height / 2).toBeCloseTo(faceBox.top + faceBox.height / 2, 1);

    // Pressed: the face sits lower by half the tap area's top padding (1px on S and M, 2px on L).
    const shift = state === 'Pressed' ? px(size === 'L' ? '--space-100' : '--space-050') / 2 : 0;
    await expect(faceBox.top - buttonBox.top).toBeCloseTo((buttonBox.height - faceBox.height) / 2 + shift, 1);

    // Shape: round, except Tertiary at rest (square, as in Figma).
    const isSquare = variant === 'Tertiary' && state !== 'Pressed';
    await expect(getComputedStyle(face).borderTopLeftRadius).toBe(isSquare ? '0px' : token('--radius-full'));

    // Fill: Primary is the primary color (grey when disabled), Secondary the surface color, Tertiary none.
    const expectedFill =
      variant === 'Tertiary'
        ? 'rgba(0, 0, 0, 0)'
        : variant === 'Primary' && state !== 'Disabled'
          ? paint('backgroundColor', 'var(--color-interactive-primary)')
          : paint('backgroundColor', 'var(--color-background-surface)');
    await expect(getComputedStyle(face).backgroundColor).toBe(expectedFill);

    // Bevel and outline: filled buttons have the bevel unless pressed; Primary also has the 1px outline
    // except when disabled.
    const bevel = paint('boxShadow', `var(${bevelToken})`);
    const both = paint('boxShadow', `var(${bevelToken}), ${outline}`);
    const outlineOnly = paint('boxShadow', outline);
    const shadow = getComputedStyle(face).boxShadow;
    if (variant === 'Tertiary') await expect(shadow).toBe('none');
    else if (variant === 'Secondary') await expect(shadow).toBe(state === 'Pressed' ? 'none' : bevel);
    else await expect(shadow).toBe(state === 'Pressed' ? outlineOnly : state === 'Disabled' ? bevel : both);

    // Icon color.
    const iconColor =
      state === 'Disabled'
        ? '--color-icon-disabled'
        : variant === 'Primary'
          ? '--color-interactive-onPrimary'
          : '--color-icon-primary';
    await expect(getComputedStyle(button).color).toBe(paint('color', `var(${iconColor})`));

    // Behavior: disabled is a real disabled button; loading shows the spinner, is busy and ignores taps.
    if (state === 'Disabled') {
      await expect(button).toBeDisabled();
    } else if (state === 'Loading') {
      await expect(button).toHaveAttribute('aria-busy', 'true');
      await expect(button.querySelector('.button__spinner')).not.toBeNull();
      await userEvent.click(button);
      await expect(clickSpy).not.toHaveBeenCalled();
    } else {
      await userEvent.click(button);
      await expect(clickSpy).toHaveBeenCalled();
    }
  },
} satisfies Meta<typeof ButtonIcon>;

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
