import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, waitFor, type within } from 'storybook/test';
import { durationMs } from '../../lib/motion';
import { ChatInput } from './ChatInput';

const figmaDescription = `A local copy of Chat Input, whose source component is not in this file. Used for typing an answer when a student can't talk (the typing route in the recall loop), and for chat.

STATES. Inactive: empty, placeholder. Typing: caret, still empty. Ready to send: text entered, send button shown. Long input: the field grows with the answer. Loading: sent, waiting for a reply. Recording: voice capture in the bar.

showLeadingButton: the Secondary button on the left (plus, or close while recording). Turn it off for the typing route; attaching things has no meaning when answering.

CHANGES FROM THE SOURCE. Text uses Greed/Body M Regular (was Inter 14 SemiBold, no style). Placeholder uses text/placeholder (was text/disabled, which failed contrast on background/input). The old icon buttons are swapped for buttonIcon: Secondary L on the left, Primary S to send.

PROPERTIES. placeholder: text in Inactive, Typing and Loading. answer: text in Ready to send. longAnswer: text in Long input, where the field grows to fit a multi-line answer. Text follows the Body M Regular style (18/26); don't bind line height directly.

RECORDING. waveform is 33 bars, 2px wide, heights are sample data; in code they come from live input amplitude.

GROWTH (build rule). The bar grows upward from just above the keyboard, one line at a time, up to 6 lines of answer text (6 x 26px). Past that it stops growing and the text scrolls inside the field, so the question above stays visible. The keyboard never moves. In Figma this is shown as a static Long input on 'keyboard open'; screens can't reflow live inside the scaffold.

EMPTYING THE FIELD (build rule). If the student deletes all text, the bar goes to Typing (empty, caret, keyboard still up, no send button) and the toggleGroup row reappears above it: inputModeToggle to switch back to the mic, and Skip. While the field has text, that row is hidden. The screen returns to Inactive and 'keyboard option selected' only when the keyboard is dismissed.

OPEN. The mic inside the field could be the way back to voice, which is not decided.

**In code:** the props use Figma's names: \`status\` (Figma's "Status"), \`placeholder\`, \`answer\`, \`longAnswer\` and \`showLeadingButton\`. \`showMic\` is code-only: Figma always draws the mic in the empty field, but it isn't a button, so the typing route turns it off and the voice/keyboard toggle is the way back to voice (D14, decided 2026-10-05). \`status\` is only where the bar starts. After that, what the student does sets it: an empty field is Inactive (with or without the caret), one line of text is Ready to send, more than one line is Long input, and tapping send moves it to Loading. \`onStatusChange\` reports each change, so the typing screen can hide the toggleGroup row while there's text. \`onSend\` gets the text when send is tapped. \`label\` names the field for screen readers ("Your answer" by default). The leading and send buttons are the library's \`buttonIcon\` (Secondary L with \`plus\`, Primary S with \`send-03\`), and the icons are exported from Figma.

**Typing is not built (decided 2026-10-09):** Figma's Typing (empty, caret) looks the same as Inactive here, so the bar has no Typing status. An empty field is Inactive, with or without the caret.

**Loading (built 2026-10-09):** the student taps send and the answer is on its way. The text stays in the field but goes dim (\`text/placeholder\`, the color Figma gives Loading's text), there is no caret, and the loading icon (\`interactive/onSecondary\`, as in Figma) turns where the send button was, in a box the send button's size so nothing moves. It turns at the same pace as button's spinner (\`motion.duration.spinner\`); under reduced motion it holds still, and the field is marked busy. The field is read-only, so the answer can't be edited or sent twice. It lasts until the screen changes the bar's props. \`status\` can also start the bar in Loading, using \`answer\` as the text. Figma's Loading frame shows the placeholder, not the sent text; this follows the sprint's flow instead (text, send, dim, loader). The typing screen goes to the processing screen on send, so no screen shows Loading for long.

**Not built yet:** Recording. There's no real mic in this build.

**Differences from Figma, by decision (2026-09-30):**
- No side padding on the bar. It fills the width it's given, and the screen's 16px margin is the inset, so the field lines up with the cards above it (16..374 on a 390 screen). Figma's bar has Space/300 at the sides only because it sits at x=4.
- Every status is at least Control/L (56px) tall. Figma's Typing and Loading fields hug to 38px, which would make the bar shrink when the student taps in or sends.
- The in-field mic is drawn but isn't a button: what it does is still open.
- The mic uses icon/primary and the caret text/primary. Figma binds both to background/inverse, a fill token for tooltips and toasts; the values are the same.
- There's no focus ring on the field: the caret shows where focus is, as in Figma.

**Tokens:** text/placeholder and its primitive color/alpha/light-55 were added from Figma, and background/input now points at color/alpha/light-10 (white at 10%), as in Figma.`;

// Record calls without the event objects, so Storybook doesn't try to serialize them.
const sendSpy = fn();
const statusSpy = fn();

const meta = {
  title: 'Components/chatInput',
  component: ChatInput,
  tags: ['autodocs'],
  args: {
    onSend: (text) => sendSpy(text),
    onStatusChange: (status) => statusSpy(status),
  },
  argTypes: { onSend: { control: false }, onStatusChange: { control: false } },
  // Full-bleed, so the decorator's 16px is the only margin, as on a real screen.
  parameters: { layout: 'fullscreen', docs: { description: { component: figmaDescription } } },
  // The screen's 16px margin, so the bar gets the 358px a 390 screen gives it.
  decorators: [
    (Story) => (
      <div style={{ boxSizing: 'border-box', width: '100%', padding: 'var(--space-400)' }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    sendSpy.mockClear();
    statusSpy.mockClear();
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const px = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));

const parts = (canvasElement: HTMLElement) => {
  const bar = canvasElement.querySelector('.chatInput') as HTMLElement;
  return {
    bar,
    field: bar.querySelector('.chatInput__field') as HTMLElement,
    text: bar.querySelector('.chatInput__text') as HTMLTextAreaElement,
  };
};

export const Inactive: Story = {
  name: 'Status=Inactive',
  args: { status: 'Inactive' },
  play: async ({ canvasElement, canvas }) => {
    const { bar, field } = parts(canvasElement);
    await expect(bar).toHaveAttribute('data-status', 'Inactive');
    await expect(canvas.getByRole('textbox', { name: 'Your answer' })).toHaveAttribute('placeholder', 'Type your answer...');
    await expect(canvas.getByRole('button', { name: 'Add' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Send' })).toBeNull();
    await expect(field.querySelector('.chatInput__mic')).not.toBeNull();
    await expect(field.getBoundingClientRect().height).toBeCloseTo(px('--control-l'), 0);
  },
};

export const ReadyToSend: Story = {
  name: 'Status=Ready to send',
  args: { status: 'Ready to send', answer: 'Producers make food.' },
  play: async ({ canvasElement, canvas }) => {
    const { bar, field } = parts(canvasElement);
    await expect(bar).toHaveAttribute('data-status', 'Ready to send');
    await expect(field.querySelector('.chatInput__mic')).toBeNull();
    await expect(getComputedStyle(field).borderTopLeftRadius).toBe(`${px('--radius-full')}px`);
    // The send button is there; tapping it (and the Loading that follows) is tested in the sending story, so this
    // one stays at Ready to send for its snapshot.
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeVisible();
  },
};

export const LongInput: Story = {
  name: 'Status=Long input',
  args: { status: 'Long input' },
  play: async ({ canvasElement, canvas }) => {
    const { bar, field } = parts(canvasElement);
    await expect(bar).toHaveAttribute('data-status', 'Long input');
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeVisible();
    // More than one line: the corners drop from Radius/Full to Radius/600.
    await expect(getComputedStyle(field).borderTopLeftRadius).toBe(`${px('--radius-600')}px`);
  },
};

// Colors are compared as the browser computes them, since a token's own text can differ (0.4 vs .4 once minified).
const computedColor = (token: string, property: 'color' = 'color') => {
  const probe = document.createElement('span');
  probe.style[property] = `var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe)[property];
  probe.remove();
  return value;
};

// What Loading looks like, after the student sent an answer: the text stays but goes dim, there is no caret,
// send or mic, and the loader turns where the send button was.
const expectLoading = async (canvasElement: HTMLElement, canvas: ReturnType<typeof within>, answer: string) => {
  const { bar, field, text } = parts(canvasElement);
  await expect(bar).toHaveAttribute('data-status', 'Loading');
  await expect(text).toHaveValue(answer);
  await expect(text).toHaveAttribute('readonly');
  await expect(text).toHaveAttribute('aria-busy', 'true');
  await expect(text).not.toHaveFocus();
  await expect(getComputedStyle(text).color).toBe(computedColor('--color-text-placeholder'));
  await expect(canvas.queryByRole('button', { name: 'Send' })).toBeNull();
  await expect(field.querySelector('.chatInput__mic')).toBeNull();
  await expect(field.getBoundingClientRect().height).toBeGreaterThanOrEqual(px('--control-l') - 1);

  // The loader takes the send button's place, in interactive/onSecondary, and turns unless reduced motion is asked for.
  const spinner = field.querySelector('.chatInput__spinner') as HTMLElement;
  const icon = field.querySelector('.chatInput__spinnerIcon') as SVGElement;
  await expect(spinner).not.toBeNull();
  await expect(spinner).toHaveAttribute('aria-hidden', 'true');
  await expect(spinner.getBoundingClientRect().width).toBeCloseTo(px('--control-touch-target'), 0);
  await expect(getComputedStyle(spinner).color).toBe(computedColor('--color-interactive-onSecondary'));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cs = getComputedStyle(icon);
    await expect(cs.animationName).toBe('chatInputSpin');
    // The browser reports seconds; the token is read by unit, since the production CSS build rewrites 800ms as .8s.
    await expect(parseFloat(cs.animationDuration) * 1000).toBeCloseTo(durationMs('--motion-duration-spinner'), 0);
    await expect(cs.animationIterationCount).toBe('infinite');
  }
};

export const Loading: Story = {
  name: 'Status=Loading',
  args: { status: 'Loading', answer: 'Producers make food.' },
  play: async ({ canvasElement, canvas }) => {
    await expectLoading(canvasElement, canvas, 'Producers make food.');
    await expect(canvas.getByRole('button', { name: 'Add' })).toBeVisible();
  },
};

// The flow: text entered, send pressed, the text goes dim and the loader turns. The text and the field's height stay.
export const SendingMovesToLoading: Story = {
  name: 'Rule: sending dims the text and starts the loader',
  args: { status: 'Inactive', showLeadingButton: false },
  play: async ({ canvasElement, canvas, userEvent }) => {
    const { field, text } = parts(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Your answer' }), 'Producers make food.');
    await expect(getComputedStyle(text).color).toBe(computedColor('--color-text-primary'));
    const before = field.getBoundingClientRect().height;
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(sendSpy).toHaveBeenCalledWith('Producers make food.');
    await expectLoading(canvasElement, canvas, 'Producers make food.');
    // Nothing moves: the loader is the send button's size.
    await expect(field.getBoundingClientRect().height).toBeCloseTo(before, 0);
    // No more typing, and no second send.
    await userEvent.type(text, ' more');
    await expect(text).toHaveValue('Producers make food.');
    await expect(sendSpy).toHaveBeenCalledTimes(1);
  },
};

// The typing route: no leading button, so the field takes the whole bar.
export const NoLeadingButton: Story = {
  name: 'showLeadingButton=false',
  args: { status: 'Inactive', showLeadingButton: false },
  play: async ({ canvasElement, canvas }) => {
    const { bar, field } = parts(canvasElement);
    await expect(canvas.queryByRole('button', { name: 'Add' })).toBeNull();
    await expect(field.getBoundingClientRect().width).toBeCloseTo(bar.getBoundingClientRect().width, 0);
  },
};

// Not a Figma variant: the typing route, with the in-field mic hidden (D14). The field is empty and has no send
// button or mic; typing still brings up send.
export const NoMic: Story = {
  name: 'showMic=false (typing route)',
  args: { status: 'Inactive', showLeadingButton: false, showMic: false },
  play: async ({ canvasElement, canvas, userEvent }) => {
    const { field } = parts(canvasElement);
    await expect(field.querySelector('.chatInput__mic')).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'Send' })).toBeNull();
    await userEvent.type(canvas.getByRole('textbox', { name: 'Your answer' }), 'Producers make food.');
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeVisible();
    await expect(field.querySelector('.chatInput__mic')).toBeNull();
  },
};

// Growth rule: one line at a time, up to 6 lines (6 × 26px), then it stops and scrolls inside the field.
export const GrowsToSixLinesThenScrolls: Story = {
  name: 'Rule: grows up to 6 lines, then scrolls',
  args: { status: 'Inactive', showLeadingButton: false },
  play: async ({ canvasElement, userEvent }) => {
    const { bar, text } = parts(canvasElement);
    const line = px('--font-lineHeight-body-md');
    await userEvent.click(text);
    await userEvent.paste('Producers make their own food from sunlight.');
    await waitFor(() => expect(bar).toHaveAttribute('data-status', 'Long input'));
    await expect(text.getBoundingClientRect().height).toBeCloseTo(line * 2, 0);
    await userEvent.paste(' Consumers get their energy by eating producers or other consumers.'.repeat(4));
    await waitFor(() => expect(text.getBoundingClientRect().height).toBeCloseTo(line * 6, 0));
    await expect(text.scrollHeight).toBeGreaterThan(text.clientHeight);
    await expect(getComputedStyle(text).overflowY).toBe('auto');
  },
};

// Emptying rule: deleting all the text goes back to Inactive (empty, no send button), with the caret still in the
// field, since Inactive and the old Typing look the same.
export const EmptyingReturnsToInactive: Story = {
  name: 'Rule: emptying the field returns to Inactive',
  args: { status: 'Ready to send', showLeadingButton: false, answer: 'Producers make food.' },
  play: async ({ canvasElement, canvas, userEvent }) => {
    const { bar, text } = parts(canvasElement);
    await userEvent.clear(text);
    await expect(bar).toHaveAttribute('data-status', 'Inactive');
    await expect(text).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: 'Send' })).toBeNull();
    await expect(statusSpy).toHaveBeenLastCalledWith('Inactive');
  },
};

// Width rule: it fills whatever width the screen gives it, never a fixed 358px. The story shows it at the normal width,
// like the others; the play function narrows the frame to prove the bar follows it, then puts it back.
export const FillsGivenWidth: Story = {
  name: 'Rule: fills the width it is given',
  args: { status: 'Ready to send' },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const { bar } = parts(canvasElement);
    const frame = bar.parentElement as HTMLElement;
    const width = () => bar.getBoundingClientRect().width;
    await expect(bar).toHaveAttribute('data-status', 'Ready to send');
    await expect(width()).toBeCloseTo(frame.getBoundingClientRect().width, 0);
    frame.style.width = '250px';
    await expect(width()).toBeCloseTo(250, 0);
    frame.style.width = '';
    await expect(width()).toBeCloseTo(frame.getBoundingClientRect().width, 0);
  },
};
