import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { MicButton } from '../micButton/MicButton';
import { RecordingGlow } from './RecordingGlow';

const figmaDescription = `Voice listening feedback for the mic button. Idle: two blurred, animated glow ellipses (layer2 outer, layer3 inner), no static rings. Listening: same two ellipses breathe on a 3400ms asymmetric cycle (glow core/halo), plus a speech-reactive ripple pool (interactive/secondary stroke) layered on top. Spec: claude/recordingglow-listening-spec.md in the Knowunity Voice Recall Sprint project.

**In code:** it has no props, as in Figma, and is hidden from screen readers because it's decoration. Two circles, centered on each other: the halo is \`Control/Mic\` × 1.74 (167.04px; Figma rounds to 168) in \`interactive/voiceFeedback/layer2\`, blurred \`motion.blur.glowHalo\` (20px); the core is × 1.42 (136.32px) in \`layer3\`, blurred \`motion.blur.glowCore\` (2px).

**Breathing:** both circles loop on \`motion.duration.breathe\` (3400ms) with \`motion.easing.inOut\`, rising over the first 25% and falling over the rest, a quick inhale and a long exhale (docs/recordingglow-listening-spec.md §3). The halo goes from scale 0.92 to 1.12 and opacity 0.3 to 0.56; the core from 0.94 to 1.1 and 0.5 to 0.88, all \`motion.scale.breathe*\` and \`motion.opacity.breathe*\` tokens. Under reduced motion they stop and hold 0.42 (halo) and 0.75 (core).

**Not built in this sprint:** the speech-reactive ripples. No real microphone is used, so nothing should look like it's hearing the student (docs/sprint-context.md).

**Always show it while listening:** the listening micButton only differs from its resting look by a darker fill, so this halo is what makes recording unmistakable.`;

const meta = {
  title: 'Components/recordingGlow',
  component: RecordingGlow,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: figmaDescription } } },
  play: async ({ canvasElement }) => {
    const glow = canvasElement.querySelector('.recordingGlow') as HTMLElement;
    const circles = [...glow.querySelectorAll<HTMLElement>('.recordingGlow__circle')];
    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(name).trim();
    const mic = parseFloat(token('--control-mic'));
    const paint = (value: string) => {
      const probe = document.createElement('span');
      probe.style.backgroundColor = value;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return computed;
    };

    // Two circles, halo then core, as multiples of Control/Mic. offsetWidth is the size before the
    // breathing scale, which keeps changing.
    const expected = [
      { scale: 1.74, fill: '--color-interactive-voiceFeedback-layer2', blur: '--motion-blur-glowHalo', name: 'recordingGlow-halo' },
      { scale: 1.42, fill: '--color-interactive-voiceFeedback-layer3', blur: '--motion-blur-glowCore', name: 'recordingGlow-core' },
    ];
    await expect(glow.offsetWidth).toBeCloseTo(mic * 1.74, 0);
    await expect(circles).toHaveLength(2);
    for (const [i, circle] of circles.entries()) {
      const cs = getComputedStyle(circle);
      await expect(circle.offsetWidth).toBeCloseTo(mic * expected[i].scale, 0);
      await expect(circle.offsetHeight).toBeCloseTo(mic * expected[i].scale, 0);
      // Concentric: every circle shares the glow's center (offset values are whole pixels, so within 1px).
      await expect(Math.abs(circle.offsetLeft + circle.offsetWidth / 2 - glow.offsetWidth / 2)).toBeLessThanOrEqual(1);
      await expect(Math.abs(circle.offsetTop + circle.offsetHeight / 2 - glow.offsetHeight / 2)).toBeLessThanOrEqual(1);
      await expect(cs.borderTopLeftRadius).toBe(token('--radius-full'));
      await expect(cs.backgroundColor).toBe(paint(`var(${expected[i].fill})`));
      await expect(cs.filter).toBe(`blur(${token(expected[i].blur)})`);

      // Breathing, unless the viewer asked for reduced motion.
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await expect(cs.animationName).toBe(expected[i].name);
        await expect(cs.animationDuration).toBe(`${parseFloat(token('--motion-duration-breathe')) / 1000}s`);
        await expect(cs.animationIterationCount).toBe('infinite');
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
