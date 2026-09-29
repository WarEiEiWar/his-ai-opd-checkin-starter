import type { Patient } from '@/mocks/patients';

export function SelectedPatientSummary({ patient }: { patient: Patient }) {
  return (
    <section aria-labelledby="selected-patient-heading" className="rounded-2xl border border-teal-700/30 bg-teal-500/10 p-5 sm:p-6">
      <h2 id="selected-patient-heading" className="text-xl font-bold">ผู้ป่วยที่เลือก</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-sm opacity-70">HN</dt>
          <dd className="font-semibold">{patient.hn}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">ชื่อ-นามสกุล</dt>
          <dd className="font-semibold">{patient.firstName} {patient.lastName}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">วันเกิด</dt>
          <dd className="font-semibold">{patient.dateOfBirth}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">เพศ</dt>
          <dd className="font-semibold">{patient.gender}</dd>
        </div>
      </dl>
    </section>
  );
}
