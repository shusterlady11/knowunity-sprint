import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Colors } from './Colors';

const meta = {
  title: 'Foundations/Colors',
  component: Colors,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
