import type { PatientRecord } from '../types/patientRecord'

export type OfflineRecordType =
  | 'patient'
  | 'screening'
  | 'referral'
  | 'patient-record'

export interface OfflineRecord {
  id: string
  type: OfflineRecordType
  data: unknown
  createdAt: string
  synced: boolean
}

const STORAGE_KEY = 'swasthone_offline_records'

function getRecords(): OfflineRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecords(records: OfflineRecord[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records),
  )
}

export function saveOfflineRecord(
  type: OfflineRecordType,
  data: unknown,
) {
  const records = getRecords()

  const record: OfflineRecord = {
    id: crypto.randomUUID(),
    type,
    data,
    createdAt: new Date().toISOString(),
    synced: false,
  }

  records.push(record)
  saveRecords(records)

  return record
}

export function getOfflineRecords() {
  return getRecords()
}

export function getPendingRecords() {
  return getRecords().filter(
    (record) => !record.synced,
  )
}

export function getPatientRecords(): PatientRecord[] {
  return getRecords()
    .filter((record) => record.type === 'patient-record')
    .map((record) => record.data as PatientRecord)
}

export function getPatientRecord(
  patientId: string,
): PatientRecord | undefined {
  return getPatientRecords().find(
    (record) => record.patient.patientId === patientId,
  )
}

export function savePatientRecord(
  patientRecord: PatientRecord,
) {
  const records = getRecords()

  const existingIndex = records.findIndex(
    (record) =>
      record.type === 'patient-record' &&
      (record.data as PatientRecord).patient.patientId ===
        patientRecord.patient.patientId,
  )

  const record: OfflineRecord = {
    id:
      existingIndex >= 0
        ? records[existingIndex].id
        : crypto.randomUUID(),
    type: 'patient-record',
    data: patientRecord,
    createdAt: new Date().toISOString(),
    synced: false,
  }

  if (existingIndex >= 0) {
    records[existingIndex] = record
  } else {
    records.push(record)
  }

  saveRecords(records)

  return record
}

export function markRecordSynced(id: string) {
  const records = getRecords().map((record) =>
    record.id === id
      ? { ...record, synced: true }
      : record,
  )

  saveRecords(records)
}

export function clearSyncedRecords() {
  const records = getRecords().filter(
    (record) => !record.synced,
  )

  saveRecords(records)
}