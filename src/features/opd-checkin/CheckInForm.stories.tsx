import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
