"use client";

import { useState } from 'react';
import { clinics } from '@/mocks/clinics';
import type { Patient } from '@/mocks/patients';
import { CheckInForm, type CheckInFormValues } from './CheckInForm';
import { CheckInPreview } from './CheckInPreview';
import { CheckInSuccess } from './CheckInSuccess';
import { PatientSearch } from './PatientSearch';
import { SelectedPatientSummary } from './SelectedPatientSummary';

type FlowState =
  | { step: 'search' }
  | { step: 'form'; patient: Patient; draft?: CheckInFormValues }
  | { step: 'preview'; patient: Patient; draft: CheckInFormValues }
  | { step: 'success' };

export function OpdCheckInFlow() {
  const [flow, setFlow] = useState<FlowState>({ step: 'search' });

  if (flow.step === 'search') {
    return <PatientSearch onSelectPatient={(patient) => setFlow({ step: 'form', patient })} />;
  }

  if (flow.step === 'form') {
    return (
      <div className="space-y-6">
        <SelectedPatientSummary patient={flow.patient} />
        <CheckInForm
          clinics={clinics}
          initialValues={flow.draft}
          onPreview={(draft) => setFlow({ step: 'preview', patient: flow.patient, draft })}
        />
      </div>
    );
  }

  if (flow.step === 'preview') {
    const clinic = clinics.find((item) => item.id === flow.draft.clinicId);
    if (!clinic) return null;

    return (
      <CheckInPreview
        patient={flow.patient}
        clinic={clinic}
        chiefComplaint={flow.draft.chiefComplaint}
        onBack={() => setFlow({ step: 'form', patient: flow.patient, draft: flow.draft })}
        onConfirm={() => setFlow({ step: 'success' })}
      />
    );
  }

  return <CheckInSuccess queueNumber="A012" onNewCheckIn={() => setFlow({ step: 'search' })} />;
}
