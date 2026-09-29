import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { clinics } from '@/mocks/clinics';
import { patients } from '@/mocks/patients';
import { CheckInPreview } from './CheckInPreview';

const meta = {
  title: 'OPD/CheckInPreview',
  component: CheckInPreview,
  parameters: { layout: 'padded' },
  args: {
    patient: patients[0],
    clinic: clinics[0],
    chiefComplaint: 'ปวดศีรษะ 2 วัน',
    onBack: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof CheckInPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithChiefComplaint: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('ปวดศีรษะ 2 วัน')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'กลับไปแก้ไข' }));
    await expect(args.onBack).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'ยืนยันการเช็กอิน' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};

export const WithoutChiefComplaint: Story = {
  args: { chiefComplaint: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('อาการสำคัญ')).not.toBeInTheDocument();
    await expect(canvas.getByText('อายุรกรรมทั่วไป')).toBeVisible();
  },
};
