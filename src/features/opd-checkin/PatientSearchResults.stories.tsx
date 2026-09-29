import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { patients } from '@/mocks/patients';
import { PatientSearchResults } from './PatientSearchResults';

const meta = {
  title: 'OPD/PatientSearchResults',
  component: PatientSearchResults,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PatientSearchResults>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SingleResult: Story = { args: { patients: patients.slice(0, 1) } };
export const MultipleResults: Story = { args: { patients: patients.slice(0, 2) } };
