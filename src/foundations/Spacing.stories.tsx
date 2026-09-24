import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spacing } from './Spacing';

const meta = {
  title: 'Foundations/Spacing',
  component: Spacing,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Spacing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
