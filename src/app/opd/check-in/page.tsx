import { OpdCheckInFlow } from '@/features/opd-checkin/OpdCheckInFlow';
import { TrainingNotice } from '@/components/TrainingNotice';

export default function OpdCheckInPage() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">US-001 · Training workspace</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">OPD Patient Check-in</h1>
          <p className="mt-3 max-w-3xl opacity-70">Your task is to turn the requirement into reviewed product components and an integrated flow. Do not connect to a real HIS backend.</p>
        </header>
        <TrainingNotice />
        <OpdCheckInFlow />
      </div>
    </main>
  );
}
