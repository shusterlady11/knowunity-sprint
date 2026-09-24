import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Motion } from './Motion';

const meta = {
  title: 'Foundations/Motion',
  component: Motion,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Motion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
