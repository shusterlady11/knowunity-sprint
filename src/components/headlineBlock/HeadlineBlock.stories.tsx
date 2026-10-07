import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { HeadlineBlock } from './HeadlineBlock';
import { resultsCopy } from '../../content/results';

const figmaDescription = `Centered message text: a headline with a line under it, or a single line on its own (showTitle off). Use for primer sheets, skip/empty states, and results summaries. Do not use for left-aligned body copy, or for any text inside a card.

**In code:** \`showTitle\`, \`title\`, \`body\`, \`bodyStyle\` and \`bodyEmphasis\` use Figma's names, options and defaults (title on, "Header", "Body", \`headlineS\`, \`secondary\`). The block fills the width it's given, with no side padding (\`Space/0\`; Figma had \`Space/400\` at first, which wrapped Mic skipped's title in Inter), and centers its text. The title is Headline L in \`text/primary\`; the body is Headline S (\`bodyStyle=headlineS\`) or Body M Regular (\`bodyM\`), in \`text/secondary\` or \`text/primary\` (\`bodyEmphasis\`). \`Space/300\` sits between them: Headline L's 36px line-height is shorter than its 44px letters, so less lets the title's descenders touch the body. With \`showTitle\` off the title isn't drawn and takes no space. The text is a pair of paragraphs; it doesn't choose a heading level, so when a real heading is needed, use the right heading around it.

**Used by:** the mic permission sheet (single line, \`headlineS\`, \`primary\`), Mic skipped (\`headlineS\`, \`secondary\`) and Results (\`bodyM\`, \`secondary\`). Figma component \`16138:18165\`, page "New components".

**Fonts:** Figma sets the title and Headline S in Greed Condensed, an unlicensed trial font that can't be published, so code uses Inter, as everywhere else. Inter is wider, so long titles need more room than in Figma.`;

const meta = {
  title: 'Components/headlineBlock',
  component: HeadlineBlock,
  tags: ['autodocs'],
  // Full-bleed, so the decorator's 16px is the only margin, as on a real screen.
  parameters: { layout: 'fullscreen', docs: { description: { component: figmaDescription } } },
  // The screen's 16px margin, so the block gets the 358px a 390 screen gives it.
  decorators: [
    (Story) => (
      <div style={{ boxSizing: 'border-box', width: '100%', padding: 'var(--space-400)' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, args }) => {
    const showTitle = args.showTitle ?? true;
    const bodyStyle = args.bodyStyle ?? 'headlineS';
    const bodyEmphasis = args.bodyEmphasis ?? 'secondary';
    const block = canvasElement.querySelector('.headlineBlock') as HTMLElement;
    const title = block.querySelector('.headlineBlock__title') as HTMLElement | null;
    const body = block.querySelector('.headlineBlock__body') as HTMLElement;
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const px = (name: string) => parseFloat(token(name));
    const paint = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const checkType = async (el: HTMLElement, style: string) => {
      const cs = getComputedStyle(el);
      await expect(cs.fontFamily.replace(/"/g, '')).toContain(token(`--type-${style}-fontFamily`));
      await expect(cs.fontWeight).toBe(token(`--type-${style}-fontWeight`));
      await expect(cs.fontSize).toBe(token(`--type-${style}-fontSize`));
      await expect(cs.lineHeight).toBe(token(`--type-${style}-lineHeight`));
      // A letter spacing of 0 (Headline S) computes as "normal".
      await expect(cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing).toBe(token(`--type-${style}-letterSpacing`));
    };
    const bodyType = bodyStyle === 'headlineS' ? 'headline-s' : 'body-m-regular';

    // Fills the width it's given, with no side padding, centered.
    const box = block.getBoundingClientRect();
    await expect(box.width).toBe(block.parentElement!.clientWidth - 2 * px('--space-400'));
    await expect(getComputedStyle(block).paddingLeft).toBe(token('--space-0'));
    await expect(getComputedStyle(block).paddingRight).toBe(token('--space-0'));
    await expect(getComputedStyle(block).textAlign).toBe('center');

    // The body: its words, type style and color, filling the block's width.
    await expect(body).toHaveTextContent(args.body ?? 'Body');
    await checkType(body, bodyType);
    await expect(getComputedStyle(body).color).toBe(paint(bodyEmphasis === 'primary' ? '--color-text-primary' : '--color-text-secondary'));
    await expect(body.getBoundingClientRect().width).toBe(box.width);

    // The title: drawn only when asked for, Headline L in text/primary, Space/300 above the body.
    if (!showTitle) {
      await expect(title).toBeNull();
      await expect(box.height).toBe(body.getBoundingClientRect().height);
    } else {
      await expect(title).toHaveTextContent(args.title ?? 'Header');
      await checkType(title!, 'headline-l');
      await expect(getComputedStyle(title!).color).toBe(paint('--color-text-primary'));
      await expect(getComputedStyle(block).rowGap).toBe(token('--space-300'));
      await expect(body.getBoundingClientRect().top).toBe(title!.getBoundingClientRect().bottom + px('--space-300'));
      // With the default text, one line each: 36 + 12 + 24 = 72 (headlineS) or 36 + 12 + 26 = 74 (bodyM), as in Figma.
      if (args.title === undefined && args.body === undefined) {
        await expect(box.height).toBe(px('--type-headline-l-lineHeight') + px('--space-300') + px(`--type-${bodyType}-lineHeight`));
      }
    }
  },
} satisfies Meta<typeof HeadlineBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadlineSSecondary: Story = {
  name: 'bodyStyle=headlineS, bodyEmphasis=secondary',
  args: { bodyStyle: 'headlineS', bodyEmphasis: 'secondary' },
};
export const HeadlineSPrimary: Story = {
  name: 'bodyStyle=headlineS, bodyEmphasis=primary',
  args: { bodyStyle: 'headlineS', bodyEmphasis: 'primary' },
};
export const BodyMSecondary: Story = {
  name: 'bodyStyle=bodyM, bodyEmphasis=secondary',
  args: { bodyStyle: 'bodyM', bodyEmphasis: 'secondary' },
};
export const BodyMPrimary: Story = {
  name: 'bodyStyle=bodyM, bodyEmphasis=primary',
  args: { bodyStyle: 'bodyM', bodyEmphasis: 'primary' },
};

// Not Figma variants: how the three screens use it.
export const MicPrimer: Story = {
  name: 'Mic permission sheet (single line)',
  args: {
    showTitle: false,
    body: 'Turn on your microphone settings to start practicing.',
    bodyStyle: 'headlineS',
    bodyEmphasis: 'primary',
  },
};
export const MicSkipped: Story = {
  name: 'Mic skipped',
  args: {
    title: 'Let’s switch it up.',
    body: 'Your mic is off, so you have the option to keep learning without speaking out loud. Improving your comprehension with recall also works when you type!',
  },
};
export const Results: Story = {
  args: { title: resultsCopy.perfect.headline, body: resultsCopy.perfect.line, bodyStyle: 'bodyM' },
};
