import type { Patient } from '@/mocks/patients';

type PatientSearchResultsProps = {
  patients: Patient[];
  selectedPatientId?: string;
  onSelectPatient?: (patient: Patient) => void;
};

const focusClass = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';

export function PatientSearchResults({ patients, selectedPatientId, onSelectPatient }: PatientSearchResultsProps) {
  return (
    <ul aria-label="ผลการค้นหาผู้ป่วย" className="space-y-3">
      {patients.map((patient) => {
        const selected = patient.id === selectedPatientId;
        const content = (
          <>
            <span className="block font-semibold">{patient.firstName} {patient.lastName}</span>
            <span className="mt-1 block text-sm opacity-75">HN {patient.hn}</span>
          </>
        );

        return (
          <li key={patient.id} className="break-words">
            {onSelectPatient ? (
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectPatient(patient)}
                className={`w-full rounded-xl border p-4 text-left ${focusClass} ${selected
                  ? 'border-teal-700 bg-teal-500/10 dark:border-teal-300'
                  : 'border-black/15 dark:border-white/20'}`}
              >
                {content}
                {selected && <span className="mt-2 block text-sm font-semibold text-teal-700 dark:text-teal-300">เลือกแล้ว</span>}
              </button>
            ) : (
              <div className="rounded-xl border border-black/15 p-4 dark:border-white/20">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
