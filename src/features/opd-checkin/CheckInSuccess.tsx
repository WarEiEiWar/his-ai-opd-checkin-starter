"use client";

type CheckInSuccessProps = {
  queueNumber: string;
  onNewCheckIn: () => void;
};

export function CheckInSuccess({ queueNumber, onNewCheckIn }: CheckInSuccessProps) {
  return (
    <section aria-labelledby="check-in-success-heading" className="rounded-2xl border border-green-700/30 bg-green-500/10 p-6 text-center sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-800 dark:text-green-300">สำเร็จ</p>
      <h2 id="check-in-success-heading" className="mt-2 text-2xl font-bold">เช็กอินสำเร็จ</h2>
      <p className="mt-6 text-sm opacity-75">หมายเลขคิว</p>
      <p className="mt-1 text-4xl font-bold tracking-wide" aria-label={`หมายเลขคิว ${queueNumber}`}>{queueNumber}</p>
      <button
        type="button"
        onClick={onNewCheckIn}
        className="mt-8 w-full rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 sm:w-auto"
      >
        เริ่มเช็กอินใหม่
      </button>
    </section>
  );
}
