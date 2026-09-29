import { describe, expect, it } from 'vitest';
import { searchPatients } from './patient-service';

describe('searchPatients mock service', () => {
  it('finds a patient by HN', async () => {
    const result = await searchPatients('65000123');
    expect(result).toHaveLength(1);
    expect(result[0]?.firstName).toBe('Somchai');
  });

  it('supports an empty scenario', async () => {
    await expect(searchPatients('65000123', 'empty')).resolves.toEqual([]);
  });

  it('returns multiple stable matches by patient name', async () => {
    const result = await searchPatients('Jaidee');
    expect(result.map((patient) => patient.hn)).toEqual(['65000123', '65000456']);
  });

  it('supports an error scenario', async () => {
    await expect(searchPatients('65000123', 'error')).rejects.toThrow('Synthetic patient search error');
  });
  it.each(['', '   ', 'ZZZ'])('returns no results for %j', async (query) => {
    await expect(searchPatients(query)).resolves.toEqual([]);
  });

});
