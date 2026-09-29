import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { OpdCheckInFlow } from './OpdCheckInFlow';

const meta = {
  title: 'OPD/OpdCheckInFlow',
  component: OpdCheckInFlow,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OpdCheckInFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), '65000123{Enter}');
    await userEvent.click(await canvas.findByRole('button', { name: /Somchai Jaidee/ }));

    await expect(canvas.getByText('65000123')).toBeVisible();
    await expect(canvas.getByText('Somchai Jaidee')).toBeVisible();
    await expect(canvas.getByText('1984-04-12')).toBeVisible();
    await expect(canvas.getByText('male')).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText('คลินิก'), 'gen-med');
    await userEvent.type(canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)'), 'ปวดศีรษะ 2 วัน');
    await userEvent.click(canvas.getByRole('button', { name: 'ดูตัวอย่างการเช็กอิน' }));

    await expect(canvas.getByRole('heading', { name: 'ตัวอย่างการเช็กอิน' })).toBeVisible();
    await expect(canvas.getByText('อายุรกรรมทั่วไป')).toBeVisible();
    await expect(canvas.getByText('ปวดศีรษะ 2 วัน')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'กลับไปแก้ไข' }));
    await expect(canvas.getByLabelText('คลินิก')).toHaveValue('gen-med');
    const complaint = canvas.getByLabelText('อาการสำคัญ (ไม่บังคับ)');
    await expect(complaint).toHaveValue('ปวดศีรษะ 2 วัน');
    await expect(canvas.getByText('Somchai Jaidee')).toBeVisible();

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
