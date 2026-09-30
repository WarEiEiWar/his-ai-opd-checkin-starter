import { describe, expect, it } from 'vitest';
import { checkClinicAvailability, createClinicAvailabilityChecker } from './clinic-availability-service';

describe('clinic availability mock service', () => {
  it('reports GEN as available', async () => {
    await expect(checkClinicAvailability('gen-med')).resolves.toBe('available');
  });

  it('reports ENT as unavailable', async () => {
    await expect(checkClinicAvailability('ent')).resolves.toBe('unavailable');
  });

  it('fails once and succeeds on retry in the transient error scenario', async () => {
    const checkAvailability = createClinicAvailabilityChecker('transient-error');

    await expect(checkAvailability('gen-med')).rejects.toThrow('Synthetic clinic availability error');
    await expect(checkAvailability('gen-med')).resolves.toBe('available');
  });
});
