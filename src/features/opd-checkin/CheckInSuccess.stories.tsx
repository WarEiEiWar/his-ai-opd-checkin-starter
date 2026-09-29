import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckInSuccess } from './CheckInSuccess';

const meta = {
  title: 'OPD/CheckInSuccess',
  component: CheckInSuccess,
  parameters: { layout: 'padded' },
  args: {
    queueNumber: 'A012',
    onNewCheckIn: fn(),
  },
} satisfies Meta<typeof CheckInSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('หมายเลขคิว A012')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'เริ่มเช็กอินใหม่' }));
    await expect(args.onNewCheckIn).toHaveBeenCalledOnce();
  },
};
