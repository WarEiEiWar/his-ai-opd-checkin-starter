import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  createClinicAvailabilityChecker,
  type CheckClinicAvailability,
} from '@/services/clinic-availability-service';
import { OpdCheckInFlow } from './OpdCheckInFlow';

const meta = {
  title: 'OPD/OpdCheckInFlow',
  component: OpdCheckInFlow,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OpdCheckInFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

function TransientErrorFlow() {
  const [checkAvailability] = useState<CheckClinicAvailability>(
    () => createClinicAvailabilityChecker('transient-error'),
  );
  return <OpdCheckInFlow checkAvailability={checkAvailability} />;
}

async function reachCheckInForm(canvas: ReturnType<typeof within>) {
  await userEvent.type(canvas.getByRole('textbox'), '65000123{Enter}');
  await userEvent.click(await canvas.findByRole('button', { name: /Somchai Jaidee/ }));
}

export const CompleteFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await reachCheckInForm(canvas);

    const selectedPatient = within(canvas.getByRole('region', { name: 'ผู้ป่วยที่เลือก' }));
    await expect(selectedPatient.getByText('65000123')).toBeVisible();
    await expect(selectedPatient.getByText('Somchai Jaidee')).toBeVisible();
    await expect(selectedPatient.getByText('1984-04-12')).toBeVisible();
    await expect(selectedPatient.getByText('male')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('คลินิก'), 'gen-med');
    await expect(await canvas.findByText('คลินิกพร้อมรับผู้ป่วย')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)'), 'ปวดศีรษะ 2 วัน');
    await userEvent.click(canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' }));

    await expect(canvas.getByRole('heading', { name: 'ตัวอย่างการเช็กอิน' })).toBeVisible();
    await expect(canvas.getByText('อายุรกรรมทั่วไป')).toBeVisible();
    await expect(canvas.getByText('ปวดศีรษะ 2 วัน')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'กลับไปแก้ไข' }));
    await expect(canvas.getByLabelText('คลินิก')).toHaveValue('gen-med');
    const complaint = canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)');
    await expect(complaint).toHaveValue('ปวดศีรษะ 2 วัน');
    await expect(within(canvas.getByRole('region', { name: 'ผู้ป่วยที่เลือก' })).getByText('Somchai Jaidee')).toBeVisible();

    await userEvent.clear(complaint);
    await userEvent.type(complaint, 'ปวดศีรษะ 3 วัน');
    await userEvent.click(canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' }));
    await expect(canvas.getByText('ปวดศีรษะ 3 วัน')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'ยืนยันการเช็กอิน' }));
    await expect(canvas.getByRole('heading', { name: 'เช็กอินสำเร็จ' })).toBeVisible();
    await expect(canvas.getByLabelText('หมายเลขคิว A012')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'เริ่มเช็กอินใหม่' }));
    await expect(canvas.getByRole('heading', { name: 'ค้นหาผู้ป่วย' })).toBeVisible();
    await expect(canvas.getByRole('textbox')).toHaveValue('');
    await expect(canvas.queryByText('Somchai Jaidee')).not.toBeInTheDocument();
  },
};

export const UnavailableThenAvailable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await reachCheckInForm(canvas);

    const complaint = canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)');
    const clinic = canvas.getByLabelText('คลินิก');
    const preview = canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' });
    await userEvent.type(complaint, 'เจ็บคอ 2 วัน');
    await userEvent.selectOptions(clinic, 'ent');

    await expect(await canvas.findByText(/ไม่พร้อมรับผู้ป่วยชั่วคราว/)).toBeVisible();
    await expect(preview).toBeDisabled();
    await expect(canvas.queryByRole('heading', { name: 'ตัวอย่างการเช็กอิน' })).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText('หมายเลขคิว A012')).not.toBeInTheDocument();
    await expect(within(canvas.getByRole('region', { name: 'ผู้ป่วยที่เลือก' })).getByText('Somchai Jaidee')).toBeVisible();
    await expect(complaint).toHaveValue('เจ็บคอ 2 วัน');

    await userEvent.selectOptions(clinic, 'gen-med');
    await expect(await canvas.findByText('คลินิกพร้อมรับผู้ป่วย')).toBeVisible();
    await expect(complaint).toHaveValue('เจ็บคอ 2 วัน');
    await userEvent.click(preview);
    await expect(canvas.getByRole('heading', { name: 'ตัวอย่างการเช็กอิน' })).toBeVisible();
    await expect(canvas.getByText('เจ็บคอ 2 วัน')).toBeVisible();
  },
};

export const ErrorRetrySuccess: Story = {
  render: () => <TransientErrorFlow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await reachCheckInForm(canvas);

    const complaint = canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)');
    await userEvent.type(complaint, 'ปวดศีรษะ 2 วัน');
    await userEvent.selectOptions(canvas.getByLabelText('คลินิก'), 'gen-med');

    await expect(await canvas.findByRole('alert')).toHaveTextContent('ตรวจสอบสถานะคลินิกไม่สำเร็จ');
    const preview = canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' });
    await expect(preview).toBeDisabled();
    await expect(canvas.queryByRole('heading', { name: 'ตัวอย่างการเช็กอิน' })).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText('หมายเลขคิว A012')).not.toBeInTheDocument();
    await expect(within(canvas.getByRole('region', { name: 'ผู้ป่วยที่เลือก' })).getByText('Somchai Jaidee')).toBeVisible();
    await expect(complaint).toHaveValue('ปวดศีรษะ 2 วัน');

    await userEvent.click(canvas.getByRole('button', { name: 'ลองตรวจสอบอีกครั้ง' }));
    await expect(await canvas.findByText('คลินิกพร้อมรับผู้ป่วย')).toBeVisible();
    await expect(complaint).toHaveValue('ปวดศีรษะ 2 วัน');
    await userEvent.click(preview);
    await expect(canvas.getByRole('heading', { name: 'ตัวอย่างการเช็กอิน' })).toBeVisible();
    await expect(canvas.getByText('ปวดศีรษะ 2 วัน')).toBeVisible();
  },
};
