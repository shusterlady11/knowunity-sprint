import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { MicButton } from '../micButton/MicButton';
import { RecordingGlow } from './RecordingGlow';

const figmaDescription = `Animated glow around micButton while it is recording. USE: behind micButton, only while listeningState=listening. DON'T: show it for idle or disabled, or use it around other buttons. Sizes are proportional to Control/Mic (96): rings at 1.1x, 1.24x, 1.42x and 1.74x the mic diameter (Figma rounds to 106 / 120 / 136 / 168). Fills use interactive/voiceFeedback/layer2 and layer3; the two outlines use interactive/secondary at Stroke/Hairline.

**In code:** it has no props, as in Figma, and is hidden from screen readers because it's decoration. Each ring is \`Control/Mic\` times its ratio (1.1, 1.24, 1.42, 1.74), so the exact sizes are 105.6, 119.04, 136.32 and 167.04px; Figma shows them rounded. The rings are centered on each other, so placing the glow's center on the mic button's center keeps it centered. The outlines are drawn inside the edge at \`Stroke/Hairline\`, as a shadow rather than a border, because browsers round a border this thin to whole device pixels.

**Always show it while listening:** the listening micButton only differs from its resting look by a darker fill, so this halo is what makes recording unmistakable.

**Not animated yet:** the Figma description calls it an animated glow but doesn't say how. The component is static until that's decided (which ring moves, how, and how long).`;

const meta = {
  title: 'Components/recordingGlow',
  component: RecordingGlow,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement }) => {
    const glow = canvasElement.querySelector('.recordingGlow') as HTMLElement;
    const rings = [...glow.querySelectorAll('.recordingGlow__ring')] as HTMLElement[];
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const mic = parseFloat(token('--control-mic'));
    const paint = (property: 'backgroundColor' | 'boxShadow', value: string) => {
      const probe = document.createElement('span');
      probe.style[property] = value;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe)[property];
      probe.remove();
      return computed;
    };

    // Ratios of Control/Mic, outermost first: 1.74, 1.42 (filled), then 1.24 and 1.1 (outlines).
    const expected = [
      { scale: 1.74, fill: '--color-interactive-voiceFeedback-layer2' },
      { scale: 1.42, fill: '--color-interactive-voiceFeedback-layer3' },
      { scale: 1.24, line: true },
      { scale: 1.1, line: true },
    ];
    const glowBox = glow.getBoundingClientRect();
    await expect(glowBox.width).toBeCloseTo(mic * 1.74, 1);
    await expect(glowBox.height).toBeCloseTo(mic * 1.74, 1);
    await expect(rings).toHaveLength(4);
    for (const [i, ring] of rings.entries()) {
      const box = ring.getBoundingClientRect();
      const cs = getComputedStyle(ring);
      await expect(box.width).toBeCloseTo(mic * expected[i].scale, 1);
      await expect(box.height).toBeCloseTo(mic * expected[i].scale, 1);
      // Concentric: every ring shares the glow's center.
      await expect(box.left + box.width / 2).toBeCloseTo(glowBox.left + glowBox.width / 2, 1);
      await expect(box.top + box.height / 2).toBeCloseTo(glowBox.top + glowBox.height / 2, 1);
      await expect(cs.borderTopLeftRadius).toBe(token('--radius-full'));
      if (expected[i].line) {
        await expect(cs.backgroundColor).toBe('rgba(0, 0, 0, 0)');
        await expect(cs.boxShadow).toBe(paint('boxShadow', 'inset 0 0 0 var(--stroke-hairline) var(--color-interactive-secondary)'));
      } else {
        await expect(cs.backgroundColor).toBe(paint('backgroundColor', `var(${expected[i].fill})`));
        await expect(cs.boxShadow).toBe('none');
      }
    }
    await expect(glow).toHaveAttribute('aria-hidden', 'true');
  },
} satisfies Meta<typeof RecordingGlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'recordingGlow' };

// Not a Figma variant: the glow in use, centered behind the listening mic button.
export const BehindMicButton: Story = {
  name: 'Behind micButton (listening)',
  render: () => (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{ gridArea: '1 / 1', display: 'flex' }}>
        <RecordingGlow />
      </div>
      <div style={{ gridArea: '1 / 1', display: 'flex' }}>
        <MicButton listeningState="listening" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const glow = canvasElement.querySelector('.recordingGlow') as HTMLElement;
    const mic = canvasElement.querySelector('.micButton') as HTMLElement;
    const g = glow.getBoundingClientRect();
    const m = mic.getBoundingClientRect();
    await expect(m.left + m.width / 2).toBeCloseTo(g.left + g.width / 2, 1);
    await expect(m.top + m.height / 2).toBeCloseTo(g.top + g.height / 2, 1);
  },
};
