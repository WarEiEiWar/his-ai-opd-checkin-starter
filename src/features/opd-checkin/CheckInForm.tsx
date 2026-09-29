"use client";

import { useId, useState, type FormEvent } from 'react';

export type ClinicOption = {
  id: string;
  name: string;
};

export type CheckInFormValues = {
  clinicId: string;
  chiefComplaint: string;
};

type CheckInFormProps = {
  clinics: ClinicOption[];
  onPreview: (values: CheckInFormValues) => void;
};

const fieldClass = 'w-full rounded-xl border border-black/50 bg-transparent px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-white/30';

export function CheckInForm({ clinics, onPreview }: CheckInFormProps) {
  const clinicId = useId();
  const complaintId = useId();
  const clinicErrorId = `${clinicId}-error`;
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicError, setClinicError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClinicId) {
      setClinicError(true);
      return;
    }

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
            setSelectedClinicId(event.target.value);
            if (event.target.value) setClinicError(false);
          }}
          aria-invalid={clinicError}
          aria-describedby={clinicError ? clinicErrorId : undefined}
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
          className="w-full rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 sm:ml-auto sm:w-auto"
        >
          ดูตัวอย่างการเช็กอิน
        </button>
      </div>
    </form>
  );
}
