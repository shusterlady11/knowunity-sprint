import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ResultsSummary } from './ResultsSummary';
import type { ResultsSummaryRow } from './ResultsSummary';

const figmaDescription = `The end-of-session results list. Each of the three Property 1 variants (good-explanations / needs-practice / skipped-questions) has its own independent row 1-row 5 slots - up to 5 rows, matching the fixed 5-question session length.

USE
Show once the recall session ends. Pick the Property 1 variant for the card being shown. Fill only as many rows as that card has content for (1-5) and leave the rest empty.

HIDE RULES (business rule, not optional)
- A card must not appear at all when it has zero items for that category. Don't show an empty Needs Practice card, for example.
- Any empty trailing row slot (row 4, row 5, or any row beyond what you filled) must have its SLOT node's visible set to false, not just left empty.

SPACING
Rows within one card: Space/100 (4px) itemSpacing on the Items List frame. Card's own paddingBottom: Space/100 (4px), bound to the variable. Between separate top-level resultsSummary cards, when more than one is shown on a screen (e.g. Needs Practice + Skipped Questions stacked, as in "Here's how it went"): Space/200 (8px), set on the parent frame that stacks the instances, not on this component.

TONE
Default row content per variant is toned: good-explanations rows are tone=success, needs-practice rows are tone=error, skipped-questions rows are tone=neutral.

ROW DEFAULT STATE
All rows default to collapsed (state=collapsed).

DON'T
Don't exceed 5 rows per variant (sessions are fixed at 5 questions). Don't repurpose a row slot for anything other than that variant's own rows - each variant's rows are independent now, not shared.

**In code:** Figma's variant property is still called "Property 1", which can't be a prop name, so it's \`category\` here with Figma's three options (the stories keep Figma's variant names). Instead of five slots, the card takes a \`rows\` array of \`{ label, question, transcript }\` and draws an \`expandableResultRow\` for each, with the tone set by the category. It shows at most 5 rows, and with none it draws nothing (the "no empty cards" rule). The card's title is fixed per category.

**Opening rows:** all rows start collapsed, and the card keeps one row open at a time itself. For one open row across several cards on a screen, pass \`openRow\` (the open row's index, or null) and \`onOpenRowChange\` to control it from the parent.

**Layout:** the card fills its container (358px inside the screen gutters). Padding is \`Space/400\` on top and \`Space/100\` on the other sides, gap \`Space/300\` between the title and the list, \`Space/100\` between rows, corners \`Radius/600\`. Cards are stacked by the parent with \`Space/200\` between them. The title is set in the Button L style at 24px with a 20px line height, using the font tokens Figma binds.

**Known issue:** the title is near-white on the green and coral cards, which is only about 2.1:1 and 2.5:1 contrast; the dark on-primary color (used on the neutral card) would pass on both (about 8.5:1 and 7:1).`;

const good: ResultsSummaryRow[] = [
  { label: 'Natural selection', question: 'Describe natural selection in your own words.', transcript: 'Natural selection is when organisms with traits that help them survive and reproduce pass those traits on more often.' },
  { label: 'Photosynthesis', question: 'What does a plant make during photosynthesis?', transcript: 'Plants use light, water and carbon dioxide to make sugar and oxygen.' },
  { label: 'The water cycle', question: 'Explain how water moves through the water cycle.', transcript: 'Water evaporates, condenses into clouds and falls again as rain or snow.' },
];

const needsPractice: ResultsSummaryRow[] = [
  { label: 'Cellular respiration', question: 'Where does cellular respiration happen?', transcript: 'It happens in the chloroplasts of the cell.' },
  { label: 'Mitosis and meiosis', question: 'How is meiosis different from mitosis?', transcript: 'Meiosis makes two identical cells.' },
  { label: 'Food webs', question: 'What does a food web show?', transcript: 'It shows how much sunlight plants get.' },
];

const skipped: ResultsSummaryRow[] = [
  { label: 'Osmosis', question: 'What is osmosis?' },
  { label: 'Genetic drift', question: 'What is genetic drift?' },
  { label: 'Adaptation', question: 'What is an adaptation?' },
];

// Records the change without any event, so Storybook doesn't serialize it.
const changeSpy = fn();

const meta = {
  title: 'Components/resultsSummary',
  component: ResultsSummary,
  tags: ['autodocs'],
  args: { rows: good, onOpenRowChange: (openRow) => changeSpy(openRow) },
  argTypes: { rows: { control: false }, onOpenRowChange: { control: false } },
  parameters: { docs: { description: { component: figmaDescription } } },
  beforeEach: () => {
    changeSpy.mockClear();
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const category = args.category ?? 'good-explanations';
    const rows = args.rows.slice(0, 5);
    const card = canvasElement.querySelector('.resultsSummary') as HTMLElement | null;
    if (args.rows.length === 0) {
      // The "no empty cards" rule: nothing is drawn.
      await expect(card).toBeNull();
      return;
    }
    const cardEl = card as HTMLElement;
    const title = cardEl.querySelector('.resultsSummary__title') as HTMLElement;
    const items = [...cardEl.querySelectorAll('.resultsSummary__item')] as HTMLElement[];
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

    // The card: fills its container; Space/400 above, Space/100 at the sides and bottom; Radius/600 corners.
    const cardBox = cardEl.getBoundingClientRect();
    const cs = getComputedStyle(cardEl);
    const parent = cardEl.parentElement as HTMLElement;
    await expect(cardBox.width).toBe(parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight));
    await expect(cs.paddingTop).toBe(token('--space-400'));
    await expect(cs.paddingLeft).toBe(token('--space-100'));
    await expect(cs.paddingRight).toBe(token('--space-100'));
    await expect(cs.paddingBottom).toBe(token('--space-100'));
    await expect(cs.rowGap).toBe(token('--space-300'));
    await expect(cs.borderTopLeftRadius).toBe(token('--radius-600'));
    const fill = { 'good-explanations': '--color-accent-green-bold', 'needs-practice': '--color-feedback-error-bold', 'skipped-questions': '--color-feedback-neutral-bold' }[category];
    await expect(cs.backgroundColor).toBe(paint('backgroundColor', fill));

    // The title: fixed per category, centered, Button L style with the bound line height and spacing.
    const titleText = { 'good-explanations': 'Good explanations', 'needs-practice': 'Needs practice', 'skipped-questions': 'Skipped questions' }[category];
    await expect(title).toHaveTextContent(titleText);
    const ts = getComputedStyle(title);
    await expect(ts.fontSize).toBe(token('--type-headline-s-fontSize'));
    await expect(ts.fontWeight).toBe(token('--type-headline-s-fontWeight'));
    await expect(ts.lineHeight).toBe(token('--font-lineHeight-sm'));
    await expect(ts.letterSpacing).toBe(token('--font-tracking-loose'));
    await expect(ts.textAlign).toBe('center');
    await expect(ts.color).toBe(paint('color', category === 'skipped-questions' ? '--color-interactive-onPrimary' : '--color-interactive-primary'));
    await expect(title.getBoundingClientRect().height).toBe(px('--font-lineHeight-sm'));
    await expect(title.getBoundingClientRect().top).toBe(cardBox.top + px('--space-400'));

    // The rows: one per item (at most 5), toned by category, all collapsed, 4px apart, inside the padding.
    await expect(items).toHaveLength(rows.length);
    const tone = { 'good-explanations': 'success', 'needs-practice': 'error', 'skipped-questions': 'neutral' }[category];
    for (const [i, item] of items.entries()) {
      const row = item.querySelector('.expandableResultRow') as HTMLElement;
      await expect(row).toHaveAttribute('data-tone', tone);
      await expect(row).toHaveAttribute('data-state', 'collapsed');
      await expect(row.getBoundingClientRect().width).toBe(cardBox.width - 2 * px('--space-100'));
      await expect(row.getBoundingClientRect().left).toBe(cardBox.left + px('--space-100'));
      if (i > 0) {
        const previous = items[i - 1].getBoundingClientRect();
        await expect(item.getBoundingClientRect().top).toBe(previous.bottom + px('--space-100'));
      }
    }
    // Collapsed rows are as tall as the padding plus one Body M line (58px), so the card is: top padding + title + gap + rows + gaps + bottom padding.
    const rowHeight = 2 * px('--space-400') + px('--type-body-m-regular-lineHeight');
    await expect(cardBox.height).toBe(px('--space-400') + px('--font-lineHeight-sm') + px('--space-300') + rows.length * rowHeight + (rows.length - 1) * px('--space-100') + px('--space-100'));

    // One row open at a time: opening another closes the first; tapping the open row closes it.
    const headers = items.map((item) => item.querySelector('.expandableResultRow__header') as HTMLElement);
    const states = () => items.map((item) => (item.querySelector('.expandableResultRow') as HTMLElement).getAttribute('data-state'));
    await userEvent.click(headers[0]);
    await expect(states()).toEqual(rows.map((_, i) => (i === 0 ? 'expanded' : 'collapsed')));
    await expect(changeSpy).toHaveBeenLastCalledWith(0);
    if (rows.length > 1) {
      await userEvent.click(headers[1]);
      await expect(states()).toEqual(rows.map((_, i) => (i === 1 ? 'expanded' : 'collapsed')));
      await expect(changeSpy).toHaveBeenLastCalledWith(1);
      await userEvent.click(headers[1]);
    } else {
      await userEvent.click(headers[0]);
    }
    await expect(states()).toEqual(rows.map(() => 'collapsed'));
    await expect(changeSpy).toHaveBeenLastCalledWith(null);
  },
} satisfies Meta<typeof ResultsSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GoodExplanations: Story = {
  name: 'Property 1=good-explanations',
  args: { category: 'good-explanations', rows: good },
};

export const NeedsPractice: Story = {
  name: 'Property 1=needs-practice',
  args: { category: 'needs-practice', rows: needsPractice },
};

export const SkippedQuestions: Story = {
  name: 'Property 1=skipped-questions',
  args: { category: 'skipped-questions', rows: skipped },
};

// Not Figma variants: the full five rows, and the empty list, which draws nothing.
export const FiveRows: Story = {
  name: 'Five rows (needs-practice)',
  args: {
    category: 'needs-practice',
    rows: [
      ...needsPractice,
      { label: 'Enzymes', question: 'What does an enzyme do?', transcript: 'It stores energy for the cell.' },
      { label: 'The nitrogen cycle', question: 'Why do plants need nitrogen?', transcript: 'They breathe it in through their leaves.' },
    ],
  },
};

export const EmptyList: Story = {
  name: 'No rows (nothing is drawn)',
  args: { category: 'needs-practice', rows: [] },
};
