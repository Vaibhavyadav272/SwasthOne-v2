export type PatientGender = 'male' | 'female' | 'other' | 'unknown'

export type TriageCategory = 'routine' | 'consult' | 'urgent'

export interface PatientProfile {
  patientId: string
  name: string
  age: number
  gender: PatientGender
  phone?: string
  village: string
  emergencyContact?: string
  createdAt: string
}

export interface ManualVitals {
  bloodPressure?: string
  pulse?: number
  temperature?: number
  oxygenSaturation?: number
}

export interface RPPGMeasurement {
  trustScore?: number
  confidence?: 'high' | 'low'
  heartRate?: number
  heartRateVariability?: number
  respiratoryRate?: number
  measurementAvailable: boolean
  demoMode?: boolean
}

export interface ScreeningRecord {
  screeningId: string
  patientId: string
  recordedAt: string

  symptoms: string[]
  duration?: string
  severity?: string

  manualVitals?: ManualVitals
  rppg?: RPPGMeasurement
}

export interface TriageRecord {
  triageId: string
  patientId: string
  screeningId?: string
  recordedAt: string

  category: TriageCategory
  reasons: string[]

  measurementAction:
    | 'none'
    | 'retake-rppg'
    | 'manual-verify'

  requiresProfessionalReview: boolean
}

export interface ReferralRecord {
  referralId: string
  patientId: string
  screeningId?: string
  triageId?: string
  createdAt: string

  destination?: string
  reason?: string

  status:
    | 'pending'
    | 'accepted'
    | 'completed'
    | 'cancelled'
}

export interface FollowUpRecord {
  followUpId: string
  patientId: string
  createdAt: string

  scheduledDate: string
  reminderMethod:
    | 'sms'
    | 'call'
    | 'asha'

  status:
    | 'scheduled'
    | 'completed'
    | 'missed'
    | 'cancelled'
}

export interface PatientBaseline {
  averageHeartRate?: number
  averageRespiratoryRate?: number
  previousReadings: number
  lastUpdatedAt?: string
}

export interface PatientRecord {
  patient: PatientProfile

  screenings: ScreeningRecord[]
  triageHistory: TriageRecord[]
  referrals: ReferralRecord[]
  followUps: FollowUpRecord[]

  baseline?: PatientBaseline
}