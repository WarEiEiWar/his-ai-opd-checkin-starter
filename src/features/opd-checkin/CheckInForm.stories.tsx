import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, mocked, userEvent, within } from 'storybook/test';
import { clinics as availabilityClinics } from '@/mocks/clinics';
import {
  checkClinicAvailability,
  createClinicAvailabilityChecker,
} from '@/services/clinic-availability-service';
import { CheckInForm, type ClinicOption } from './CheckInForm';

const storyClinics: ClinicOption[] = [
  { id: 'clinic-001', name: 'คลินิกตัวอย่าง' },
  { id: 'clinic-002', name: 'คลินิกทดสอบ' },
];

const meta = {
  title: 'OPD/CheckInForm',
  component: CheckInForm,
  parameters: { layout: 'padded' },
  args: {
    clinics: storyClinics,
    onPreview: fn(),
  },
} satisfies Meta<typeof CheckInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('คลินิก')).toHaveValue('');
    await expect(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)')).toHaveValue('');
    await expect(canvas.queryByText('กรุณาเลือกคลินิก')).not.toBeInTheDocument();
  },
};

export const ReadyForPreview: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const clinic = canvas.getByLabelText('คลินิก');

    await userEvent.selectOptions(clinic, 'clinic-001');
    await expect(clinic).toHaveValue('clinic-001');
    await expect(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)')).toHaveValue('');

    await userEvent.click(canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' }));
    await expect(args.onPreview).toHaveBeenCalledOnce();
    await expect(args.onPreview).toHaveBeenCalledWith({
      clinicId: 'clinic-001',
      chiefComplaint: '',
    });
  },
};

export const ValidationError: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const clinic = canvas.getByLabelText('คลินิก');

    await userEvent.click(canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' }));

    const error = await canvas.findByRole('alert');
    await expect(error).toHaveTextContent('กรุณาเลือกคลินิก');
    await expect(clinic).toHaveAttribute('aria-invalid', 'true');
    await expect(clinic).toHaveAttribute('aria-describedby', error.id);
    await expect(args.onPreview).not.toHaveBeenCalled();
  },
};

export const RestoredValues: Story = {
  args: {
    initialValues: {
      clinicId: 'clinic-001',
      chiefComplaint: 'ปวดศีรษะ 2 วัน',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('คลินิก')).toHaveValue('clinic-001');
    await expect(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)')).toHaveValue('ปวดศีรษะ 2 วัน');
  },
};

export const Available: Story = {
  args: {
    clinics: availabilityClinics,
    checkAvailability: fn(checkClinicAvailability),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByLabelText('คลินิก'), 'gen-med');
    await expect(await canvas.findByText('คลินิกพร้อมรับผู้ป่วย')).toBeVisible();
    const preview = canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' });
    await expect(preview).toBeEnabled();
    await userEvent.click(preview);
    await expect(args.onPreview).toHaveBeenCalledWith({ clinicId: 'gen-med', chiefComplaint: '' });
  },
};

export const Unavailable: Story = {
  args: {
    clinics: availabilityClinics,
    checkAvailability: fn(checkClinicAvailability),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)'), 'เจ็บคอ');
    await userEvent.selectOptions(canvas.getByLabelText('คลินิก'), 'ent');
    await expect(await canvas.findByText(/ไม่พร้อมรับผู้ป่วยชั่วคราว/)).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' })).toBeDisabled();
    await expect(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)')).toHaveValue('เจ็บคอ');
    await expect(args.onPreview).not.toHaveBeenCalled();
  },
};

export const ErrorRetrySuccess: Story = {
  args: {
    clinics: availabilityClinics,
    checkAvailability: fn(),
  },
  beforeEach: ({ args }) => {
    mocked(args.checkAvailability!).mockReset()
      .mockImplementation(createClinicAvailabilityChecker('transient-error'));
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)'), 'ปวดศีรษะ');
    await userEvent.selectOptions(canvas.getByLabelText('คลินิก'), 'gen-med');

    await expect(await canvas.findByRole('alert')).toHaveTextContent('ตรวจสอบสถานะคลินิกไม่สำเร็จ');
    const preview = canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' });
    await expect(preview).toBeDisabled();
    await expect(args.onPreview).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: 'ลองตรวจสอบอีกครั้ง' }));
    await expect(await canvas.findByText('คลินิกพร้อมรับผู้ป่วย')).toBeVisible();
    await expect(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)')).toHaveValue('ปวดศีรษะ');
    await expect(preview).toBeEnabled();
    await userEvent.click(preview);
    await expect(args.onPreview).toHaveBeenCalledWith({
      clinicId: 'gen-med',
      chiefComplaint: 'ปวดศีรษะ',
    });
  },
};
