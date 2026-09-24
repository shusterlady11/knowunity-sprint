import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { BottomSheetAppBar } from './BottomSheetAppBar';

const figmaDescription = `Top bar of a bottomSheet. Type sets what it shows. Default: drag handle only (e.g. the mic-permission sheet). withTitle: handle and a centered title, no buttons. dismissOnly: X on the left and a centered title (e.g. Reveal answer). dismissAndAction: X, title, and a right-hand button that takes the student to the next screen (arrow-right by default). USE: only inside bottomSheet. DON'T: use as a screen's top bar; use appBar. Swap icons through dismissButton and actionButton, never by detaching.

**In code:** the properties are \`type\` (Figma's "Type", options as in Figma), \`title\` ("Title"), \`showCaption\` and \`caption\` ("Caption"). The two side buttons are \`buttonIcon\` (Tertiary, size M) components. Swap their icons with \`dismissIcon\` and \`actionIcon\` (an X and an arrow-right by default), and give them names for screen readers with \`dismissLabel\` ("Close") and \`actionLabel\` ("Next"). \`onDismiss\` and \`onAction\` are their taps.

**Layout:** the bar is 72px tall in every type: Space/300 above and below a row that's tall enough for a 48px tap area. The drag handle (\`Indicator/Handle Width\` by \`Indicator/Handle Height\`, \`background/floating\`) sits \`Space/150\` from the top, centered. Padding and gap follow Figma per type: Default \`Space/300\` all round; withTitle \`Space/400\` at the sides; the two button types \`Space/100\` at the sides with a \`Space/300\` gap. In dismissOnly a blank 48px space on the right keeps the title centered.

**Differences from Figma, by decision:** Figma's side buttons are the old App Bar Button Icon (a 24px icon in a 40px circle, with a hand-drawn x-close and arrow-right). Code uses \`buttonIcon\` Tertiary M, as decided earlier, which has a 20px icon and the library X (a 2px stroke); everything else about the button (48px tap area, 40px circle) is the same.`;

// Records taps without the click event, so Storybook doesn't serialize it (which froze the docs page).
const dismissSpy = fn();
const actionSpy = fn();

const meta = {
  title: 'Components/bottomSheetAppBar',
  component: BottomSheetAppBar,
  tags: ['autodocs'],
  args: { title: 'Title', onDismiss: () => dismissSpy(), onAction: () => actionSpy() },
  argTypes: { dismissIcon: { control: false }, actionIcon: { control: false }, onDismiss: { control: false }, onAction: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    dismissSpy.mockClear();
    actionSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const type = args.type ?? 'Default';
    const bar = canvasElement.querySelector('.bottomSheetAppBar') as HTMLElement;
    const handle = bar.querySelector('.bottomSheetAppBar__handle') as HTMLElement;
    const nav = bar.querySelector('.bottomSheetAppBar__nav') as HTMLElement;
    const text = bar.querySelector('.bottomSheetAppBar__text') as HTMLElement | null;
    const buttons = [...bar.querySelectorAll('.buttonIcon')] as HTMLElement[];
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
    const barBox = bar.getBoundingClientRect();

    // The bar: full width, 72px tall in every type, on the surface color.
    await expect(barBox.height).toBe(px('--control-touch-target') + 2 * px('--space-300'));
    await expect(getComputedStyle(bar).backgroundColor).toBe(paint('backgroundColor', '--color-background-surface'));

    // The drag handle: token-sized pill, Space/150 from the top, centered.
    const handleBox = handle.getBoundingClientRect();
    await expect(handleBox.width).toBe(px('--indicator-handle-width'));
    await expect(handleBox.height).toBe(px('--indicator-handle-height'));
    await expect(handleBox.top - barBox.top).toBe(px('--space-150'));
    await expect(handleBox.left + handleBox.width / 2).toBeCloseTo(barBox.left + barBox.width / 2, 1);
    await expect(getComputedStyle(handle).borderTopLeftRadius).toBe(token('--radius-full'));
    await expect(getComputedStyle(handle).backgroundColor).toBe(paint('backgroundColor', '--color-background-floating'));

    // Padding and gap follow the type.
    const ns = getComputedStyle(nav);
    const expectedPadding = { Default: '--space-300', withTitle: '--space-400', dismissOnly: '--space-100', dismissAndAction: '--space-100' }[type];
    await expect(ns.paddingLeft).toBe(token(expectedPadding));
    await expect(ns.paddingRight).toBe(token(expectedPadding));
    await expect(ns.paddingTop).toBe(token('--space-300'));
    await expect(ns.paddingBottom).toBe(token('--space-300'));
    const hasButtons = type === 'dismissOnly' || type === 'dismissAndAction';
    const gapToken = hasButtons ? '--space-300' : '--space-100';
    await expect(ns.columnGap).toBe(token(gapToken));

    // The title: none in Default; centered otherwise; the sub-title only when asked for.
    if (type === 'Default') {
      await expect(text).toBeNull();
    } else {
      const title = text!.querySelector('.bottomSheetAppBar__title') as HTMLElement;
      await expect(title).toHaveTextContent(args.title ?? 'Title');
      const ts = getComputedStyle(title);
      await expect(ts.fontSize).toBe(token('--type-body-m-bold-fontSize'));
      await expect(ts.fontWeight).toBe(token('--type-body-m-bold-fontWeight'));
      await expect(ts.letterSpacing).toBe(token('--type-body-m-bold-letterSpacing'));
      await expect(ts.color).toBe(paint('color', '--color-text-primary'));
      await expect(getComputedStyle(text!).textAlign).toBe('center');
      // With the spacer or the right-hand button balancing the left one, the title sits at the bar's center.
      const range = document.createRange();
      range.selectNodeContents(title);
      const t = range.getBoundingClientRect();
      await expect(Math.abs(t.left + t.width / 2 - (barBox.left + barBox.width / 2))).toBeLessThan(1);
      const caption = text!.querySelector('.bottomSheetAppBar__caption') as HTMLElement | null;
      if (args.showCaption) {
        await expect(caption).toHaveTextContent('Sub-title (optional)');
        await expect(getComputedStyle(caption!).color).toBe(paint('color', '--color-text-secondary'));
      } else {
        await expect(caption).toBeNull();
      }
    }

    // The side buttons: 48px Tertiary M icon buttons at each edge, plus the spacer that balances a lone left one.
    await expect(buttons).toHaveLength(type === 'dismissAndAction' ? 2 : type === 'dismissOnly' ? 1 : 0);
    for (const button of buttons) {
      await expect(button).toHaveAttribute('data-variant', 'Tertiary');
      await expect(button).toHaveAttribute('data-size', 'M');
      const b = button.getBoundingClientRect();
      await expect(b.width).toBe(px('--control-touch-target'));
      await expect(b.height).toBe(px('--control-touch-target'));
    }
    if (hasButtons) {
      await expect(buttons[0].getBoundingClientRect().left).toBe(barBox.left + px('--space-100'));
      await expect(buttons[0]).toHaveAccessibleName('Close');
    }
    if (type === 'dismissAndAction') {
      await expect(buttons[1].getBoundingClientRect().right).toBe(barBox.right - px('--space-100'));
      await expect(buttons[1]).toHaveAccessibleName('Next');
    }
    if (type === 'dismissOnly') {
      const spacer = bar.querySelector('.bottomSheetAppBar__spacer') as HTMLElement;
      await expect(spacer.getBoundingClientRect().width).toBe(px('--control-touch-target'));
      await expect(spacer.getBoundingClientRect().right).toBe(barBox.right - px('--space-100'));
    }

    // Taps.
    if (hasButtons) {
      await userEvent.click(buttons[0]);
      await expect(dismissSpy).toHaveBeenCalledTimes(1);
    }
    if (type === 'dismissAndAction') {
      await userEvent.click(buttons[1]);
      await expect(actionSpy).toHaveBeenCalledTimes(1);
    }
  },
} satisfies Meta<typeof BottomSheetAppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeDefault: Story = {
  name: 'Type=Default',
  args: { type: 'Default' },
};

export const TypeWithTitle: Story = {
  name: 'Type=withTitle',
  args: { type: 'withTitle' },
};

export const TypeDismissOnly: Story = {
  name: 'Type=dismissOnly',
  args: { type: 'dismissOnly' },
};

export const TypeDismissAndAction: Story = {
  name: 'Type=dismissAndAction',
  args: { type: 'dismissAndAction' },
};

// Not Figma variants: the sub-title turned on.
export const WithCaption: Story = {
  name: 'Type=withTitle, showCaption=true',
  args: { type: 'withTitle', showCaption: true },
};
