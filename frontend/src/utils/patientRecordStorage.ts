import type { PatientRecord } from '../types/patientRecord'

const STORAGE_KEY = 'swasthone_patient_records'

function getRecords(): PatientRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecords(records: PatientRecord[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records),
  )
}

export function getPatientRecords(): PatientRecord[] {
  return getRecords()
}

export function getPatientRecord(
  patientId: string,
): PatientRecord | undefined {
  return getRecords().find(
    (record) => record.patient.patientId === patientId,
  )
}

export function savePatientRecord(
  patientRecord: PatientRecord,
): PatientRecord {
  const records = getRecords()

  const existingIndex = records.findIndex(
    (record) =>
      record.patient.patientId ===
      patientRecord.patient.patientId,
  )

  if (existingIndex >= 0) {
    records[existingIndex] = patientRecord
  } else {
    records.push(patientRecord)
  }

  saveRecords(records)

  return patientRecord
}
