import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { AnswerCard } from '../answerCard/AnswerCard';
import { AppBar } from '../appBar/AppBar';
import { BottomSheet } from '../bottomSheet/BottomSheet';
import { Button } from '../button/Button';
import { ButtonGroup } from '../buttonGroup/ButtonGroup';
import { MascotSlot } from '../mascotSlot/MascotSlot';
import { MicButton } from '../micButton/MicButton';
import { ToggleGroup } from '../toggleGroup/ToggleGroup';
import { TopicPill } from '../topicPill/TopicPill';
import { Scaffold } from './Scaffold';

const figmaDescription = `Used to quickly create screens using our components, making use of Figma Slots. Allows for quickly testing how designs look on different device types.

**In code:** every screen is a \`scaffold\` plus what goes in its four slots. The slots are props with Figma's names: \`topNavigation\` (usually an appBar), \`middleContent\` (the screen's content; the only part that scrolls), \`bottomContent\` (the primary actions, pinned to the bottom) and \`bottomSheetOnly\` (a bottomSheet, placed at the bottom over everything). The three switches keep Figma's names and defaults: \`showTopNavSlot\` (on), \`showBottomNavSlot\` (on) and \`showBottomSheetBackground\` (off, the scrim behind a sheet).

**Layout:** the frame fills the width it's given and is one screen tall, with rounded corners (\`Radius/600\`) on \`background/page\`, as in Figma. From the top: a 48px area where the status bar goes (\`Space/1200\`; the status bar is system UI and isn't built, but its height is kept so everything lines up), the top navigation with \`Space/100\` between items, the content taking all the remaining height, and the bottom actions. The content has \`Space/200\` above and below and \`Space/400\` at the sides, with \`Space/200\` between items, and scrolls when it's too long. The bottom actions have \`Space/400\` all round, with \`Space/100\` between items. The scrim (\`background/scrim\`) covers the whole screen and the sheet sits at the very bottom above it.

**Only one size:** Figma's set has eight sizes (iPhone 13, 17 Pro Max, iPhone SE, four tablet and iPad layouts, and a laptop). Only \`iPhone 13\`, the 390px phone the prototype is drawn for, is built; the other layouts are out of scope this sprint.

**Differences from Figma, by decision:** the sheet slot shows whenever a sheet is passed. In Figma its visibility is wired to \`showBottomNavSlot\`, which looks like a mistake, so hiding the bottom actions would also hide the sheet. Figma's hidden "Scrim" gradient at the bottom of the content slot (a scroll fade) isn't wired to any property and isn't built.

**The samples** put built components in the slots: a question screen (the voice state) and the mic permission sheet over it. The screen's parts are laid out in the slots here, not by the scaffold.`;

// A centered column for the samples: the scaffold's content slot is left-aligned, as in Figma.
function Centered({ children, gap = 'var(--space-400)' }: { children: ReactNode; gap?: string }) {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap, width: '100%' }}>{children}</div>;
}

const questionScreen = {
  topNavigation: <AppBar progress={25} xp={2} />,
  middleContent: (
    <Centered>
      <TopicPill label="Energy flow in ecosystems" />
      <MascotSlot size="2XL" expression="standby" />
      <AnswerCard state="question" message="Can you explain the difference between producers and consumers, in your own words?" />
    </Centered>
  ),
  bottomContent: (
    <Centered>
      <MicButton />
      <ToggleGroup inputMode="voice" />
    </Centered>
  ),
};

const meta = {
  title: 'Components/scaffold',
  component: Scaffold,
  tags: ['autodocs'],
  argTypes: {
    topNavigation: { control: false },
    middleContent: { control: false },
    bottomContent: { control: false },
    bottomSheetOnly: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    // The frame is one screen tall, so each docs example runs in its own phone-sized window.
    docs: { description: { component: figmaDescription }, story: { inline: false, iframeHeight: 844 } },
  },
  play: async ({ canvasElement, args }) => {
    const showTop = args.showTopNavSlot ?? true;
    const showBottom = args.showBottomNavSlot ?? true;
    const showScrim = args.showBottomSheetBackground ?? false;
    const screen = canvasElement.querySelector('.scaffold') as HTMLElement;
    const status = screen.querySelector('.scaffold__statusArea') as HTMLElement;
    const top = screen.querySelector('.scaffold__topNavigation') as HTMLElement | null;
    const middle = screen.querySelector('.scaffold__middleContent') as HTMLElement;
    const bottom = screen.querySelector('.scaffold__bottomContent') as HTMLElement | null;
    const scrim = screen.querySelector('.scaffold__scrim') as HTMLElement | null;
    const sheet = screen.querySelector('.scaffold__bottomSheetOnly') as HTMLElement | null;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.backgroundColor = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return value;
    };

    // The frame: fills the width and the height of the screen, rounded, on the page color, clipped.
    const box = screen.getBoundingClientRect();
    const ss = getComputedStyle(screen);
    await expect(box.width).toBe(document.documentElement.clientWidth);
    await expect(box.height).toBe(window.innerHeight);
    await expect(ss.borderTopLeftRadius).toBe(token('--radius-600'));
    await expect(ss.backgroundColor).toBe(paint('--color-background-page'));
    await expect(ss.overflow).toBe('hidden');

    // From the top: the status area (48px), the top navigation, the content, the bottom actions.
    const statusBox = status.getBoundingClientRect();
    await expect(statusBox.top).toBe(box.top);
    await expect(statusBox.height).toBe(px('--space-1200'));
    let cursor = statusBox.bottom;
    if (showTop) {
      await expect(top!.getBoundingClientRect().top).toBe(cursor);
      cursor = top!.getBoundingClientRect().bottom;
      await expect(getComputedStyle(top!).rowGap).toBe(token('--space-100'));
    } else {
      await expect(top).toBeNull();
    }
    const middleBox = middle.getBoundingClientRect();
    await expect(middleBox.top).toBe(cursor);
    const ms = getComputedStyle(middle);
    await expect(ms.paddingTop).toBe(token('--space-200'));
    await expect(ms.paddingBottom).toBe(token('--space-200'));
    await expect(ms.paddingLeft).toBe(token('--space-400'));
    await expect(ms.paddingRight).toBe(token('--space-400'));
    await expect(ms.rowGap).toBe(token('--space-200'));
    await expect(ms.overflowY).toBe('auto');
    await expect(middle.tagName).toBe('MAIN');
    if (showBottom) {
      const bottomBox = bottom!.getBoundingClientRect();
      await expect(bottomBox.bottom).toBe(box.bottom);
      await expect(middleBox.bottom).toBe(bottomBox.top);
      const bs = getComputedStyle(bottom!);
      await expect(bs.paddingTop).toBe(token('--space-400'));
      await expect(bs.paddingRight).toBe(token('--space-400'));
      await expect(bs.paddingBottom).toBe(token('--space-400'));
      await expect(bs.paddingLeft).toBe(token('--space-400'));
      await expect(bs.rowGap).toBe(token('--space-100'));
    } else {
      await expect(bottom).toBeNull();
      await expect(middleBox.bottom).toBe(box.bottom);
    }

    // The scrim: only when asked for; over the whole screen, in the scrim color.
    if (showScrim) {
      const scrimBox = scrim!.getBoundingClientRect();
      await expect(scrimBox.width).toBe(box.width);
      await expect(scrimBox.height).toBe(box.height);
      await expect(getComputedStyle(scrim!).backgroundColor).toBe(paint('--color-background-scrim'));
    } else {
      await expect(scrim).toBeNull();
    }

    // The sheet slot: only when a sheet is given; at the very bottom, full width, above the scrim.
    if (args.bottomSheetOnly == null) {
      await expect(sheet).toBeNull();
    } else {
      const sheetBox = sheet!.getBoundingClientRect();
      await expect(sheetBox.bottom).toBe(box.bottom);
      await expect(sheetBox.width).toBe(box.width);
      if (scrim) await expect(Boolean(scrim.compareDocumentPosition(sheet!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    }
  },
} satisfies Meta<typeof Scaffold>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IPhone13: Story = {
  name: 'size=iPhone 13',
  args: {
    size: 'iPhone 13',
    topNavigation: <AppBar progress={25} xp={2} />,
    middleContent: (
      <Centered>
        <TopicPill label="Energy flow in ecosystems" />
      </Centered>
    ),
    bottomContent: (
      <Centered>
        <Button variant="Primary" size="L" CTA="Continue" />
      </Centered>
    ),
  },
};

// Not Figma variants: the switches, and two real screens.
export const NoTopNavigation: Story = {
  name: 'showTopNavSlot=false',
  args: { ...questionScreen, topNavigation: undefined, showTopNavSlot: false },
};

export const NoBottomContent: Story = {
  name: 'showBottomNavSlot=false',
  args: { ...questionScreen, showBottomNavSlot: false },
};

export const QuestionScreen: Story = {
  name: 'Question screen (voice)',
  args: questionScreen,
};

export const MicPermission: Story = {
  name: 'Mic permission (sheet over scrim)',
  args: {
    ...questionScreen,
    showBottomSheetBackground: true,
    bottomSheetOnly: (
      <BottomSheet
        appBar={{ type: 'Default' }}
        label="Turn on your microphone"
        middleSection={
          <Centered gap="var(--space-600)">
            <MascotSlot size="3XL" expression="approving" />
            <p style={{ margin: 0, textAlign: 'center', color: 'var(--color-text-primary)', font: 'var(--type-headline-s-fontWeight) var(--type-headline-s-fontSize)/var(--type-headline-s-lineHeight) var(--type-headline-s-fontFamily)' }}>
              Turn on your microphone settings to start practicing.
            </p>
          </Centered>
        }
        bottomSection={
          <ButtonGroup variant="Vertical" size="L">
            <Button variant="Primary" size="L" CTA="Turn on" />
            <Button variant="Secondary" size="L" CTA="Not now" />
          </ButtonGroup>
        }
      />
    ),
  },
};
