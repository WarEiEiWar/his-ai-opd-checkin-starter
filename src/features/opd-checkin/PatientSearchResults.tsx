import type { Patient } from '@/mocks/patients';

export function PatientSearchResults({ patients }: { patients: Patient[] }) {
  return (
    <ul aria-label="ผลการค้นหาผู้ป่วย" className="space-y-3">
      {patients.map((patient) => (
        <li key={patient.id} className="rounded-xl border border-black/15 p-4 break-words dark:border-white/20">
          <p className="font-semibold">{patient.firstName} {patient.lastName}</p>
          <p className="mt-1 text-sm opacity-75">HN {patient.hn}</p>
        </li>
      ))}
    </ul>
  );
}
