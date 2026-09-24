import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sizes } from './Sizes';

const meta = {
  title: 'Foundations/Sizes',
  component: Sizes,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sizes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  globals: { viewport: { value: '100pct-100pct', isRotated: false } },
};
