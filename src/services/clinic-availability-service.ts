export type ClinicAvailability = 'available' | 'unavailable';
export type CheckClinicAvailability = (clinicId: string) => Promise<ClinicAvailability>;
export type ClinicAvailabilityScenario = 'normal' | 'transient-error';

const availabilityByClinicId: Record<string, ClinicAvailability> = {
  'gen-med': 'available',
  ent: 'unavailable',
};

export function createClinicAvailabilityChecker(
  scenario: ClinicAvailabilityScenario = 'normal',
): CheckClinicAvailability {
  let attempts = 0;

  return async (clinicId) => {
    attempts += 1;
    if (scenario === 'transient-error' && attempts === 1) {
      throw new Error('Synthetic clinic availability error');
    }

    return availabilityByClinicId[clinicId] ?? 'unavailable';
  };
}

export const checkClinicAvailability = createClinicAvailabilityChecker();
