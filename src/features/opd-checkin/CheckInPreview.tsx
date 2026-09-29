"use client";

import type { Patient } from '@/mocks/patients';
import type { ClinicOption } from './CheckInForm';
import { SelectedPatientSummary } from './SelectedPatientSummary';

type CheckInPreviewProps = {
  patient: Patient;
  clinic: ClinicOption;
  chiefComplaint: string;
  onBack: () => void;
  onConfirm: () => void;
};

const focusClass = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600';

export function CheckInPreview({ patient, clinic, chiefComplaint, onBack, onConfirm }: CheckInPreviewProps) {
  return (
    <section aria-labelledby="check-in-preview-heading" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">ตรวจสอบก่อนยืนยัน</p>
        <h2 id="check-in-preview-heading" className="mt-2 text-2xl font-bold">ตัวอย่างการเช็กอิน</h2>
      </div>

      <SelectedPatientSummary patient={patient} />

      <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 dark:border-white/20 dark:bg-white/5">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm opacity-70">คลินิก</dt>
            <dd className="font-semibold">{clinic.name}</dd>
          </div>
          {chiefComplaint && (
            <div>
              <dt className="text-sm opacity-70">อาการสำคัญ</dt>
              <dd className="whitespace-pre-wrap break-words font-semibold">{chiefComplaint}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onBack} className={`rounded-xl border border-black/40 px-5 py-3 font-semibold dark:border-white/40 ${focusClass}`}>
            กลับไปแก้ไข
          </button>
          <button type="button" onClick={onConfirm} className={`rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white ${focusClass}`}>
            ยืนยันการเช็กอิน
          </button>
        </div>
      </div>
    </section>
  );
}
