import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Radius } from './Radius';

const meta = {
  title: 'Foundations/Radius',
  component: Radius,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Radius>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
