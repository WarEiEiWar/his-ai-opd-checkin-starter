"use client";

import { useId, useRef, useState, type FormEvent } from 'react';
import type { Patient } from '@/mocks/patients';
import { searchPatients } from '@/services/patient-service';
import { PatientSearchResults } from './PatientSearchResults';

type Search = (query: string) => Promise<Patient[]>;
type PatientSearchProps = {
  search?: Search;
  selectedPatientId?: string;
  onSelectPatient?: (patient: Patient) => void;
};
type SearchState =
  | { status: 'idle' }
  | { status: 'loading' | 'error'; query: string }
  | { status: 'complete'; query: string; patients: Patient[] };

const buttonClass = 'rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60';

export function PatientSearch({ search = searchPatients, selectedPatientId, onSelectPatient }: PatientSearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const pending = useRef(false);

  async function runSearch(value: string) {
    const submittedQuery = value.trim();
    if (pending.current || !submittedQuery) return;
    pending.current = true;
    setState({ status: 'loading', query: submittedQuery });
    try {
      const patients = await search(submittedQuery);
      setState({ status: 'complete', query: submittedQuery, patients });
    } catch {
      setState({ status: 'error', query: submittedQuery });
    } finally {
      pending.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(query);
  }

  return (
    <section aria-labelledby={`${inputId}-heading`} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 dark:border-white/20 dark:bg-white/5">
      <h2 id={`${inputId}-heading`} className="text-xl font-bold">ค้นหาผู้ป่วย</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor={inputId} className="block text-sm font-semibold">HN หรือชื่อผู้ป่วย</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id={inputId} value={query} onChange={(event) => setQuery(event.target.value)}
            aria-describedby={`${inputId}-hint`} autoComplete="off" type="text"
            className="min-w-0 flex-1 rounded-xl border border-black/50 bg-transparent px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-white/30" />
          <button type="submit" disabled={state.status === 'loading'} className={buttonClass}>ค้นหา</button>
        </div>
        <p id={`${inputId}-hint`} className="mt-2 text-sm opacity-75">กรอก HN หรือชื่อผู้ป่วย แล้วกดค้นหาหรือ Enter</p>
      </form>
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-5 break-words">
        {state.status === 'loading' && <p>กำลังค้นหา…</p>}
        {state.status === 'complete' && (
          <p>{state.patients.length ? `พบ ${state.patients.length} รายการ` : 'ไม่พบผู้ป่วย'} สำหรับ “{state.query}”</p>
        )}
        {state.status === 'error' && <p>ค้นหา “{state.query}” ไม่สำเร็จ กรุณาลองอีกครั้ง</p>}
      </div>
      {state.status === 'error' && (
        <button type="button" onClick={() => void runSearch(state.query)} className={`${buttonClass} mt-3`}>ลองอีกครั้ง</button>
      )}
      {state.status === 'complete' && state.patients.length > 0 && (
        <div className="mt-3">
          <PatientSearchResults
            patients={state.patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={onSelectPatient}
          />
        </div>
      )}
    </section>
  );
}
