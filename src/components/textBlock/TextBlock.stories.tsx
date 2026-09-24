import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TextBlock } from './TextBlock';

const figmaDescription = `A title plus optional caption text pairing, in four sizes (XL/L/M/S). USE: as a section or screen heading with an optional supporting caption line beneath it. DON'T: turn on showCaption without actually filling in caption text — the property exists to hide/show the line, not to reserve empty space. NOTE: this component has zero instances in the Example Screens page, so this guidance is based on its structure and naming alone, not observed usage.

**In code:** \`variant\`, \`showCaption\`, \`title\` and \`caption\` use Figma's names, options and defaults (XL, caption on, "Header", "Caption"). The block hugs its text, and the title and caption both fill its width so they line up. XL and L are centered with \`Space/100\` between the lines, a Headline XL (76px) or Headline L (44px) title and a Headline XS caption; M and S are left-aligned with \`Space/050\` between the lines, a Body M Bold or Body S Bold title and a Caption M or Caption S caption. Colors are \`text/primary\` for the title and \`text/secondary\` for the caption. With \`showCaption\` off the caption isn't drawn and takes no space. The text is a pair of paragraphs; it doesn't choose a heading level, so when a real heading is needed, use the right heading around it.

**Fonts:** Figma sets the XL and L titles in Greed Condensed, an unlicensed trial font that can't be published, so code uses Inter for them, as everywhere else. Inter is wider, so long XL and L titles need more room than in Figma.

**Known issue:** the other set in Figma also called "textBlock" (a question card with a violet fill, used by the mascot segments) is a different design that \`answerCard\` (question state) already covers, so it isn't built.`;

const meta = {
  title: 'Components/textBlock',
  component: TextBlock,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement, args }) => {
    const variant = args.variant ?? 'XL';
    const showCaption = args.showCaption ?? true;
    const block = canvasElement.querySelector('.textBlock') as HTMLElement;
    const title = block.querySelector('.textBlock__title') as HTMLElement;
    const caption = block.querySelector('.textBlock__caption') as HTMLElement | null;
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

    // Which type style each variant uses, for the title and for the caption.
    const styles = {
      XL: { title: 'headline-xl', caption: 'headline-xs-regular', gap: '--space-100', align: 'center' },
      L: { title: 'headline-l', caption: 'headline-xs-regular', gap: '--space-100', align: 'center' },
      M: { title: 'body-m-bold', caption: 'caption-m-regular', gap: '--space-050', align: 'left' },
      S: { title: 'body-s-bold', caption: 'caption-s-regular', gap: '--space-050', align: 'left' },
    }[variant];
    const checkType = async (el: HTMLElement, style: string) => {
      const cs = getComputedStyle(el);
      await expect(cs.fontFamily.replace(/"/g, '')).toContain(token(`--type-${style}-fontFamily`));
      await expect(cs.fontWeight).toBe(token(`--type-${style}-fontWeight`));
      await expect(cs.fontSize).toBe(token(`--type-${style}-fontSize`));
      await expect(cs.lineHeight).toBe(token(`--type-${style}-lineHeight`));
      await expect(cs.letterSpacing).toBe(token(`--type-${style}-letterSpacing`));
    };

    // The words and colors.
    await expect(title).toHaveTextContent(args.title ?? 'Header');
    await expect(getComputedStyle(title).color).toBe(paint('--color-text-primary'));
    await checkType(title, styles.title);
    await expect(getComputedStyle(block).textAlign).toBe(styles.align);

    // The caption: drawn only when asked for, under the title with the variant's gap.
    if (!showCaption) {
      await expect(caption).toBeNull();
      await expect(block.getBoundingClientRect().height).toBe(px(`--type-${styles.title}-lineHeight`));
    } else {
      await expect(caption).toHaveTextContent(args.caption ?? 'Caption');
      await expect(getComputedStyle(caption!).color).toBe(paint('--color-text-secondary'));
      await checkType(caption!, styles.caption);
      await expect(getComputedStyle(block).rowGap).toBe(token(styles.gap));
      const t = title.getBoundingClientRect();
      const c = caption!.getBoundingClientRect();
      await expect(c.top).toBe(t.bottom + px(styles.gap));
      // The block's height is the two lines and the gap (100, 60, 44 and 36 with the default text).
      await expect(block.getBoundingClientRect().height).toBe(px(`--type-${styles.title}-lineHeight`) + px(styles.gap) + px(`--type-${styles.caption}-lineHeight`));
      // Both lines fill the block's width, so they line up.
      await expect(c.width).toBe(block.getBoundingClientRect().width);
    }
    await expect(title.getBoundingClientRect().width).toBe(block.getBoundingClientRect().width);
  },
} satisfies Meta<typeof TextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XL: Story = { name: 'variant=XL', args: { variant: 'XL' } };
export const L: Story = { name: 'variant=L', args: { variant: 'L' } };
export const M: Story = { name: 'variant=M', args: { variant: 'M' } };
export const S: Story = { name: 'variant=S', args: { variant: 'S' } };

// Not a Figma variant: the caption turned off.
export const MNoCaption: Story = { name: 'variant=M, showCaption=false', args: { variant: 'M', showCaption: false } };
