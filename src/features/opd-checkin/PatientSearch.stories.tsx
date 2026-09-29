import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, mocked, userEvent, within } from 'storybook/test';
import type { Patient } from '@/mocks/patients';
import { searchPatients } from '@/services/patient-service';
import { PatientSearch } from './PatientSearch';

const meta = {
  title: 'OPD/PatientSearch',
  component: PatientSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PatientSearch>;
export default meta;
type Story = StoryObj<typeof meta>;

function SelectablePatientSearch() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  return (
    <PatientSearch
      selectedPatientId={selectedPatient?.id}
      onSelectPatient={setSelectedPatient}
    />
  );
}

export const Default: Story = {
  args: { search: fn(searchPatients) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), '   {Enter}');
    await expect(args.search).not.toHaveBeenCalled();
    await expect(canvas.queryByText(/ไม่พบผู้ป่วย/)).not.toBeInTheDocument();
    await userEvent.clear(canvas.getByRole('textbox'));
  },
};
export const SingleResult: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), '65000123');
    await userEvent.click(canvas.getByRole('button', { name: 'ค้นหา' }));
    await expect(await canvas.findByText('Somchai Jaidee')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
  },
};
export const MultipleResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Jaidee{Enter}');
    await expect(await canvas.findByText('Somying Jaidee')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
  },
};
export const Loading: Story = {
  args: { search: fn((query: string) => searchPatients(query, 'slow')) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Jaidee{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('กำลังค้นหา');
    await expect(canvas.getByRole('button', { name: 'ค้นหา' })).toBeDisabled();
    await expect(input).toBeEnabled();
    await userEvent.clear(input);
    await userEvent.type(input, '65000123{Enter}');
    await expect(args.search).toHaveBeenCalledTimes(1);
    await expect(await canvas.findByText('Somying Jaidee', {}, { timeout: 4000 })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('Jaidee');
    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByText(/พบ 1 รายการ/, {}, { timeout: 4000 })).toBeVisible();
    await expect(canvas.queryByText('Somying Jaidee')).not.toBeInTheDocument();
  },
};
export const Empty: Story = {
  args: { search: (query) => searchPatients(query, 'empty') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Jaidee{Enter}');
    await expect(await canvas.findByText(/ไม่พบผู้ป่วย/)).toBeVisible();
  },
};
export const Error: Story = {
  args: { search: fn((query: string) => searchPatients(query, 'error')) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Jaidee{Enter}');
    await userEvent.clear(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), '65000123');
    await userEvent.click(await canvas.findByRole('button', { name: 'ลองอีกครั้ง' }));
    await expect(args.search).toHaveBeenLastCalledWith('Jaidee');
    await expect(args.search).toHaveBeenCalledTimes(2);
    await expect(canvas.getByRole('status')).toHaveTextContent('ไม่สำเร็จ');
  },
};
export const RetrySuccess: Story = {
  args: { search: fn(searchPatients) },
  beforeEach: ({ args }) => {
    mocked(args.search!).mockReset().mockImplementation(searchPatients)
      .mockImplementationOnce((query: string) => searchPatients(query, 'error'));
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), '65000123{Enter}');
    await userEvent.click(await canvas.findByRole('button', { name: 'ลองอีกครั้ง' }));
    await expect(await canvas.findByText('Somchai Jaidee')).toBeVisible();
  },
};

export const SelectPatient: Story = {
  render: () => <SelectablePatientSearch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Jaidee{Enter}');

    const somchai = await canvas.findByRole('button', { name: /Somchai Jaidee/ });
    const somying = canvas.getByRole('button', { name: /Somying Jaidee/ });
    await userEvent.click(somchai);
    await expect(somchai).toHaveAttribute('aria-pressed', 'true');
    await expect(somying).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(somying);
    await expect(somchai).toHaveAttribute('aria-pressed', 'false');
    await expect(somying).toHaveAttribute('aria-pressed', 'true');
  },
};
