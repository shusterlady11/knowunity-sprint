import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TypeScale } from './TypeScale';

const meta = {
  title: 'Foundations/Type',
  component: TypeScale,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypeScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
