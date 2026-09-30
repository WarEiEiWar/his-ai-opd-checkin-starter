"use client";

import { useId, useRef, useState, type FormEvent } from 'react';
import type { ClinicOption } from '@/mocks/clinics';
import type { CheckClinicAvailability } from '@/services/clinic-availability-service';

export type { ClinicOption } from '@/mocks/clinics';

export type CheckInFormValues = {
  clinicId: string;
  chiefComplaint: string;
};

type CheckInFormProps = {
  clinics: ClinicOption[];
  onPreview: (values: CheckInFormValues) => void;
  initialValues?: CheckInFormValues;
  checkAvailability?: CheckClinicAvailability;
  initialAvailability?: 'available';
};

type AvailabilityState =
  | { status: 'idle' }
  | { status: 'checking' | 'available' | 'unavailable' | 'error'; clinicId: string };

const fieldClass = 'w-full rounded-xl border border-black/50 bg-transparent px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-white/30';

export function CheckInForm({
  clinics,
  onPreview,
  initialValues,
  checkAvailability,
  initialAvailability,
}: CheckInFormProps) {
  const clinicId = useId();
  const complaintId = useId();
  const clinicErrorId = `${clinicId}-error`;
  const [selectedClinicId, setSelectedClinicId] = useState(initialValues?.clinicId ?? '');
  const [chiefComplaint, setChiefComplaint] = useState(initialValues?.chiefComplaint ?? '');
  const [clinicError, setClinicError] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityState>(
    initialValues?.clinicId && initialAvailability
      ? { status: initialAvailability, clinicId: initialValues.clinicId }
      : { status: 'idle' },
  );
  const availabilityRequest = useRef(0);
  const availabilityMessageId = `${clinicId}-availability`;

  async function runAvailabilityCheck(value: string) {
    const request = ++availabilityRequest.current;
    if (!checkAvailability || !value) {
      setAvailability({ status: 'idle' });
      return;
    }

    setAvailability({ status: 'checking', clinicId: value });

    try {
      const result = await checkAvailability(value);
      if (request !== availabilityRequest.current) return;
      setAvailability({ status: result, clinicId: value });
    } catch {
      if (request !== availabilityRequest.current) return;
      setAvailability({ status: 'error', clinicId: value });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClinicId) {
      setClinicError(true);
      return;
    }

    if (checkAvailability && (
      availability.status !== 'available' || availability.clinicId !== selectedClinicId
    )) return;

    setClinicError(false);
    onPreview({ clinicId: selectedClinicId, chiefComplaint });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 dark:border-white/20 dark:bg-white/5"
    >
      <div>
        <label htmlFor={clinicId} className="block text-sm font-semibold">
          คลินิก
        </label>
        <select
          id={clinicId}
          value={selectedClinicId}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedClinicId(value);
            if (value) setClinicError(false);
            void runAvailabilityCheck(value);
          }}
          aria-invalid={clinicError}
          aria-describedby={[
            clinicError ? clinicErrorId : undefined,
            availability.status !== 'idle' ? availabilityMessageId : undefined,
          ].filter(Boolean).join(' ') || undefined}
          className={`${fieldClass} mt-2 ${clinicError ? 'border-red-700 dark:border-red-400' : ''}`}
        >
          <option value="">เลือกคลินิก</option>
          {clinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </option>
          ))}
        </select>
        {clinicError && (
          <p id={clinicErrorId} role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
            กรุณาเลือกคลินิก
          </p>
        )}
        {availability.status !== 'idle' && (
          <div id={availabilityMessageId} className="mt-2 text-sm" aria-live="polite">
            {availability.status === 'checking' && <p>กำลังตรวจสอบสถานะคลินิก…</p>}
            {availability.status === 'available' && (
              <p className="font-medium text-teal-800 dark:text-teal-200">คลินิกพร้อมรับผู้ป่วย</p>
            )}
            {availability.status === 'unavailable' && (
              <p className="font-medium text-amber-900 dark:text-amber-200">
                คลินิกนี้ไม่พร้อมรับผู้ป่วยชั่วคราว กรุณาเลือกคลินิกอื่น
              </p>
            )}
            {availability.status === 'error' && (
              <div role="alert" className="rounded-xl border border-red-700/40 bg-red-500/10 p-3 text-red-900 dark:text-red-200">
                <p>ตรวจสอบสถานะคลินิกไม่สำเร็จ กรุณาลองอีกครั้ง</p>
                <button
                  type="button"
                  onClick={() => void runAvailabilityCheck(selectedClinicId)}
                  className="mt-3 rounded-xl border border-red-700/50 px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:border-red-300/60"
                >
                  ลองตรวจสอบอีกครั้ง
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor={complaintId} className="block text-sm font-semibold">
          อาการสำคัญ (ไม่บังคับ)
        </label>
        <textarea
          id={complaintId}
          value={chiefComplaint}
          onChange={(event) => setChiefComplaint(event.target.value)}
          rows={4}
          className={`${fieldClass} mt-2 resize-y`}
        />
      </div>

      <div className="mt-6 flex">
        <button
          type="submit"
          disabled={Boolean(selectedClinicId && checkAvailability && (
            availability.status !== 'available' || availability.clinicId !== selectedClinicId
          ))}
          className="w-full rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto"
        >
          ดูตัวอย่างการเช็กอิน
        </button>
      </div>
    </form>
  );
}
