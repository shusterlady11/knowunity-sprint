import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Button } from '../button/Button';
import { ButtonIcon } from '../buttonIcon/ButtonIcon';
import { XIcon } from '../../icons/XIcon';
import { ButtonGroup } from './ButtonGroup';
import type { ButtonGroupProps } from './ButtonGroup';

const figmaDescription = `Container that arranges a row or column of buttons/buttonIcons with consistent spacing, in Horizontal or Vertical orientation and M or L size. USE: to group related actions together, such as a bottom CTA row. DON'T: place unrelated actions in the same group — its shared spacing implies the items are alternatives or steps in one task. NOTE: only Horizontal/L was found in use on the Example Screens page (in a bottomCta area), so Vertical orientation and M size are unconfirmed by observed usage.

**In code:** \`variant\` and \`size\` use Figma's names and options. Figma's group has no properties for its contents (each use edits the buttons inside), so code takes them as \`children\`: pass \`button\` components, and in a Horizontal group at most one \`buttonIcon\` first. Give the children the same \`size\` as the group. The group only lays them out.

**Layout:** it fills its container (319px in Figma, the width of a bottom sheet's content). A Vertical group stacks the buttons at full width; a Horizontal group puts them in a row, with the text buttons sharing the width and an icon button keeping its own. The gap is measured between the buttons' tap areas: Vertical M has none (\`Space/0\`), Horizontal M has \`Space/100\`, and both L variants have \`Space/200\`. A size M button's 48px tap area is taller than its 40px face, so all four end up with about 8px between the visible buttons.

**The samples** use the mic-permission pair ("Turn on" / "Not now") for Vertical and a close icon with "Continue" for Horizontal; the group has no fixed labels.`;

function Sample(props: ButtonGroupProps) {
  const size = props.size ?? 'M';
  return props.variant === 'Horizontal' ? (
    <ButtonGroup {...props}>
      <ButtonIcon variant="Secondary" size={size} icon={<XIcon />} aria-label="Close" />
      <Button variant="Primary" size={size} CTA="Continue" />
    </ButtonGroup>
  ) : (
    <ButtonGroup {...props}>
      <Button variant="Primary" size={size} CTA="Turn on" />
      <Button variant="Secondary" size={size} CTA="Not now" />
    </ButtonGroup>
  );
}

const meta = {
  title: 'Components/buttonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  render: (args) => <Sample {...args} />,
  argTypes: { children: { control: false } },
  args: { children: null },
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const variant = args.variant ?? 'Vertical';
    const size = args.size ?? 'M';
    const group = canvasElement.querySelector('.buttonGroup') as HTMLElement;
    const kids = [...group.children] as HTMLElement[];
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));

    // The group fills its container, with no padding of its own.
    const gs = getComputedStyle(group);
    const gBox = group.getBoundingClientRect();
    const parent = group.parentElement as HTMLElement;
    await expect(gBox.width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    await expect(gs.paddingTop).toBe('0px');
    await expect(gs.paddingLeft).toBe('0px');
    await expect(group).toHaveAttribute('role', 'group');
    await expect(kids).toHaveLength(2);

    // Direction and gap: Vertical M has none, Horizontal M is Space/100, both L are Space/200.
    await expect(gs.flexDirection).toBe(variant === 'Vertical' ? 'column' : 'row');
    const gapToken = size === 'L' ? '--space-200' : variant === 'Vertical' ? '--space-0' : '--space-100';
    const gap = variant === 'Vertical' ? gs.rowGap : gs.columnGap;
    await expect(gap === 'normal' ? '0px' : gap).toBe(token(gapToken));

    // Heights: a button's tap area is at least 48px (56px for L).
    const tap = Math.max(px('--control-touch-target'), px(`--control-${size.toLowerCase()}`));
    const boxes = kids.map((k) => k.getBoundingClientRect());
    if (variant === 'Vertical') {
      await expect(gBox.height).toBe(2 * tap + (gap === 'normal' ? 0 : parseFloat(gap)));
      for (const box of boxes) {
        await expect(box.width).toBe(gBox.width);
        await expect(box.height).toBe(tap);
      }
      await expect(boxes[1].top).toBe(boxes[0].bottom + parseFloat(gap === 'normal' ? '0' : gap));
    } else {
      await expect(gBox.height).toBe(tap);
      // The icon button keeps its own size and the text button takes the rest of the row.
      await expect(boxes[0].width).toBe(tap);
      await expect(boxes[1].width).toBe(gBox.width - tap - parseFloat(gap));
      await expect(boxes[1].left).toBe(boxes[0].right + parseFloat(gap));
      await expect(boxes[1].right).toBe(gBox.right);
    }

    // The visible gap between the faces is 8px in every variant.
    const faces = kids.map((k) => (k.querySelector('.button__face') as HTMLElement).getBoundingClientRect());
    const visibleGap = variant === 'Vertical' ? faces[1].top - faces[0].bottom : faces[1].left - faces[0].right;
    await expect(visibleGap).toBe(px('--space-200'));
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalM: Story = {
  name: 'variant=Vertical, size=M',
  args: { variant: 'Vertical', size: 'M' },
};

export const HorizontalM: Story = {
  name: 'variant=Horizontal, size=M',
  args: { variant: 'Horizontal', size: 'M' },
};

export const VerticalL: Story = {
  name: 'variant=Vertical, size=L',
  args: { variant: 'Vertical', size: 'L' },
};

export const HorizontalL: Story = {
  name: 'variant=Horizontal, size=L',
  args: { variant: 'Horizontal', size: 'L' },
};
