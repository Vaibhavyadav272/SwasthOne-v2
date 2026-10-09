export type TriageCategory =
  | 'routine'
  | 'consult'
  | 'urgent'

export type MeasurementAction =
  | 'none'
  | 'retake-rppg'
  | 'manual-verify'

export interface TriagePatient {
  age: number
  gender?: string
  medicalHistory?: string[]
}

export interface TriageManualVitals {
  pulse?: number
  temperature?: number
  systolicBP?: number
  diastolicBP?: number
  oxygenSaturation?: number
}

export interface TriageRPPG {
  trustScore?: number
  confidence?: 'high' | 'low'

  heartRate?: number
  heartRateVariability?: number
  respiratoryRate?: number

  systolicBP?: number
  diastolicBP?: number

  measurementAvailable: boolean
}

export interface TriageBaseline {
  averageHeartRate?: number
  averageRespiratoryRate?: number
  previousReadings?: number
}

export interface TriageInput {
  patient: TriagePatient

  symptoms: string[]

  duration?: string

  severity?: string

  manualVitals?: TriageManualVitals

  rppg?: TriageRPPG

  baseline?: TriageBaseline
}

export interface TriageResult {
  category: TriageCategory

  reasons: string[]

  measurementAction: MeasurementAction

  requiresProfessionalReview: boolean

  usedData: {
    symptoms: boolean
    manualVitals: boolean
    rppg: boolean
    baseline: boolean
  }
}