import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { patients } from '@/mocks/patients';
import { SelectedPatientSummary } from './SelectedPatientSummary';

const meta = {
  title: 'OPD/SelectedPatientSummary',
  component: SelectedPatientSummary,
  parameters: { layout: 'padded' },
  args: { patient: patients[0] },
} satisfies Meta<typeof SelectedPatientSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('65000123')).toBeVisible();
    await expect(canvas.getByText('Somchai Jaidee')).toBeVisible();
    await expect(canvas.getByText('1984-04-12')).toBeVisible();
    await expect(canvas.getByText('male')).toBeVisible();
  },
};
