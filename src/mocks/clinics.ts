export type ClinicOption = {
  id: string;
  name: string;
};

// Synthetic data for the US-001 training flow. These are not production clinic records.
export const clinics: ClinicOption[] = [
  { id: 'gen-med', name: 'อายุรกรรมทั่วไป' },
];
