import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { Patient } from '@/mocks/patients';
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

function SelectableResults() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  return (
    <PatientSearchResults
      patients={patients.slice(0, 2)}
      selectedPatientId={selectedPatient?.id}
      onSelectPatient={setSelectedPatient}
    />
  );
}

export const Selectable: Story = {
  args: { patients: patients.slice(0, 2) },
  render: () => <SelectableResults />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstPatient = canvas.getByRole('button', { name: /Somchai Jaidee/ });
    firstPatient.focus();
    await userEvent.keyboard('{Enter}');
    await expect(firstPatient).toHaveAttribute('aria-pressed', 'true');
  },
};
