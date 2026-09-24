import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Shadows } from './Shadows';

const meta = {
  title: 'Foundations/Shadows',
  component: Shadows,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Shadows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
