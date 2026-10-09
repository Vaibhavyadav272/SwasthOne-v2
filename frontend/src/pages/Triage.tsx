import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Info,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { t, useLanguage } from '../i18n'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api'
import { runTriage } from '../services/triageService'
import { getPatientRecord, savePatientRecord } from '../utils/patientRecordStorage'
import type { PatientProfile } from '../types/patientRecord'



interface ScreeningData {
  _id?: string
  symptoms: string[]
  duration: string
  severity: string
  hasManualVitals: boolean
  bloodPressure: string
  pulse: string
  temperature: string
  oxygenSaturation: string
}

interface RPPGData {
  trustScore: number
  confidence: 'high' | 'low'
  demoMode?: boolean
  heartRate?: number
  heartRateVariability?: number
  respiratoryRate?: number
  systolicBP?: number
  diastolicBP?: number
}

function Triage() {
  useLanguage()

  const navigate = useNavigate()
  const location = useLocation()

  const patient =
    location.state?.patient as PatientProfile | undefined

  const screening =
    location.state?.screening as
      | ScreeningData
      | undefined

  const rppg =
    location.state?.rppg as
      | RPPGData
      | undefined

  const [triageResult, setTriageResult] = useState<{ category: 'routine' | 'consult' | 'urgent'; reasons: string[]; measurementAction: 'none' | 'retake-rppg' | 'manual-verify'; requiresProfessionalReview: boolean; triageId: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!patient?.patientId || !screening) {
      setLoading(false)
      setError('Patient or screening data is missing. Please repeat the screening.')
      return
    }

    let cancelled = false

    const run = async () => {
      try {
        if (screening._id && navigator.onLine) {
          const response = await apiFetch<{ success: boolean; category: 'routine' | 'consult' | 'urgent'; message: string; measurementAction: 'none' | 'retake-rppg' | 'manual-verify'; triageId: string }>('/triage', {
            method: 'POST',
            body: JSON.stringify({ patientId: patient.patientId, screeningId: screening._id, historyScore: 0 }),
          })

          if (!cancelled) {
            setTriageResult({
              category: response.category,
              reasons: response.message ? response.message.split('; ') : [],
              measurementAction: response.measurementAction ?? 'none',
              requiresProfessionalReview: response.category !== 'routine',
              triageId: response.triageId,
            })
          }
          return
        }

        const localResult = runTriage({
          patient: { age: Number(patient.age || 0), gender: patient.gender },
          symptoms: screening.symptoms,
          duration: screening.duration,
          severity: screening.severity,
          manualVitals: screening.hasManualVitals
            ? {
                pulse: screening.pulse ? Number(screening.pulse) : undefined,
                temperature: screening.temperature ? Number(screening.temperature) : undefined,
                systolicBP: screening.bloodPressure ? Number(screening.bloodPressure.split('/')[0]) : undefined,
                diastolicBP: screening.bloodPressure ? Number(screening.bloodPressure.split('/')[1]) : undefined,
                oxygenSaturation: screening.oxygenSaturation ? Number(screening.oxygenSaturation) : undefined,
              }
            : undefined,
          rppg: rppg
            ? {
                trustScore: rppg.trustScore,
                confidence: rppg.confidence,
                heartRate: rppg.heartRate,
                measurementAvailable: true,
              }
            : undefined,
        })

        const triageId = `offline-${crypto.randomUUID()}`
        if (!cancelled) {
          setTriageResult({
            category: localResult.category,
            reasons: localResult.reasons,
            measurementAction: localResult.measurementAction,
            requiresProfessionalReview: localResult.requiresProfessionalReview,
            triageId,
          })
        }

        const record = getPatientRecord(patient.patientId)
        if (record && !record.triageHistory.some((item) => item.triageId === triageId)) {
          record.triageHistory.push({
            triageId,
            patientId: patient.patientId,
            screeningId: screening._id,
            recordedAt: new Date().toISOString(),
            category: localResult.category,
            reasons: localResult.reasons,
            measurementAction: localResult.measurementAction,
            requiresProfessionalReview: localResult.requiresProfessionalReview,
          })
          savePatientRecord(record)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to calculate triage')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [patient?.patientId, screening?._id, screening, rppg])

  const category = triageResult?.category ?? 'routine'
  /*
   * ==========================================
   * CATEGORY CONTENT
   * ==========================================
   */

  const categoryContent = {
    routine: {
      title: t(
        'triage',
        'routineTitle',
      ),

      description: t(
        'triage',
        'routineDescription',
      ),

      action: t(
        'triage',
        'routineAction',
      ),
    },

    consult: {
      title: t(
        'triage',
        'consultTitle',
      ),

      description: t(
        'triage',
        'consultDescription',
      ),

      action: t(
        'triage',
        'consultAction',
      ),
    },

    urgent: {
      title: t(
        'triage',
        'urgentTitle',
      ),

      description: t(
        'triage',
        'urgentDescription',
      ),

      action: t(
        'triage',
        'urgentAction',
      ),
    },
  }

  const result =
    categoryContent[category]

  /*
   * ==========================================
   * NAVIGATION
   * ==========================================
   */

  const handleBack = () => {
    navigate(
      '/screening/trustscore',
      {
        state: {
          patient,
          screening,
          rppg,
        },
      },
    )
  }

  const handleContinue = () => {
    if (!triageResult) return
    navigate('/referral', {
      state: {
        patient, screening, rppg,
        triage: {
          category: triageResult.category,
          reasons: triageResult.reasons,
          measurementAction: triageResult.measurementAction,
          requiresProfessionalReview: triageResult.requiresProfessionalReview,
          triageId: triageResult.triageId,
        },
      },
    })
  }

  /*
   * ==========================================
   * UI
   * ==========================================
   */

  return (
    <div className="page-shell">
      <main className="triage-page">
        {loading && <p>Calculating triage…</p>}
        {error && <p role="alert" className="form-error">{error}</p>}

        {/* =========================
            HEADER
           ========================= */}

        <header className="form-header">
          <button
            className="back-button"
            type="button"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />

            {t(
              'common',
              'back',
            )}
          </button>

          <div className="form-heading">
            <div className="form-icon">
              <ClipboardCheck
                size={24}
              />
            </div>

            <div>
              <p className="eyebrow">
                {t(
                  'triage',
                  'eyebrow',
                )}
              </p>

              <h1>
                {t(
                  'triage',
                  'title',
                )}
              </h1>

              <p>
                {t(
                  'triage',
                  'description',
                )}
              </p>
            </div>
          </div>
        </header>

        {/* =========================
            WORKFLOW
           ========================= */}

        <div className="workflow">
          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t(
                'screening',
                'registration',
              )}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t(
                'screening',
                'symptomsStep',
              )}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t(
                'screening',
                'rppg',
              )}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step active">
            <span>4</span>

            <label>
              {t(
                'screening',
                'triage',
              )}
            </label>
          </div>
        </div>

        {/* =========================
            PATIENT
           ========================= */}

        {patient && (
          <div className="patient-strip">
            <div>
              <span>
                {t(
                  'screening',
                  'screeningFor',
                )}
              </span>

              <strong>
                {patient.name}
              </strong>
            </div>

            <div>
              <span>
                {t(
                  'screening',
                  'age',
                )}
              </span>

              <strong>
                {patient.age || '—'}
              </strong>
            </div>

            <div>
              <span>
                {t(
                  'screening',
                  'village',
                )}
              </span>

              <strong>
                {patient.village || '—'}
              </strong>
            </div>
          </div>
        )}

        {/* =========================
            RESULT
           ========================= */}

        <section
          className={`triage-result-card ${category}`}
        >
          <div className="triage-result-top">

            <div className="triage-result-icon">
              {category === 'urgent' ? (
                <AlertTriangle
                  size={30}
                />
              ) : category ===
                'consult' ? (
                <Stethoscope
                  size={30}
                />
              ) : (
                <CheckCircle2
                  size={30}
                />
              )}
            </div>

            <div>
              <p className="section-kicker">
                {t(
                  'triage',
                  'recommendation',
                )}
              </p>

              <h2>
                {result.title}
              </h2>

              <p>
                {result.description}
              </p>
            </div>
          </div>

          <div className="triage-action">
            <strong>
              {t(
                'triage',
                'nextStep',
              )}
            </strong>

            <span>
              {result.action}
            </span>
          </div>
        </section>

        {/* =========================
            TRIAGE REASONS
           ========================= */}

        <section className="triage-summary-card">
          <div className="summary-card-header">
            <ClipboardCheck
              size={19}
            />

            <h3>
              {t(
                'triage',
                'recommendation',
              )}
            </h3>
          </div>

          <div className="triage-reasons">
            {(triageResult?.reasons ?? []).map(
              (reason, index) => (
                <div
                  key={`${reason}-${index}`}
                  className="triage-reason"
                >
                  <span>
                    {reason}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        {/* =========================
            INPUT SUMMARY
           ========================= */}

        <section className="triage-summary-grid">

          {/* Symptoms */}

          <div className="triage-summary-card">
            <div className="summary-card-header">
              <ClipboardCheck
                size={19}
              />

              <h3>
                {t(
                  'triage',
                  'symptomSummary',
                )}
              </h3>
            </div>

            {screening?.symptoms
              ?.length ? (
              <div className="summary-tags">
                {screening.symptoms.map(
                  (symptom) => (
                    <span
                      key={symptom}
                    >
                      {symptom}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="empty-summary">
                {t(
                  'triage',
                  'noSymptoms',
                )}
              </p>
            )}
          </div>

          {/* TrustScore */}

          <div className="triage-summary-card">
            <div className="summary-card-header">
              <ShieldCheck
                size={19}
              />

              <h3>
                {t(
                  'triage',
                  'screeningConfidence',
                )}
              </h3>
            </div>

            <div className="confidence-summary">
              <strong>
                {rppg?.trustScore ??
                  '—'}
              </strong>

              <span>
                /100 TrustScore
              </span>
            </div>

            <p>
              {rppg?.confidence ===
              'high'
                ? t(
                    'triage',
                    'highConfidence',
                  )
                : t(
                    'triage',
                    'lowConfidence',
                  )}
            </p>
          </div>
        </section>

        {/* =========================
            MEASUREMENT ACTION
           ========================= */}

        {(triageResult?.measurementAction ?? 'none') !==
          'none' && (
          <section className="triage-safety">
            <AlertTriangle
              size={19}
            />

            <div>
              <strong>
                {t(
                  'trustScore',
                  'retake',
                )}
              </strong>

              <p>
                {t(
                  'trustScore',
                  'retakeDescription',
                )}
              </p>
            </div>
          </section>
        )}

        {/* =========================
            PROFESSIONAL REVIEW
           ========================= */}

        {triageResult?.requiresProfessionalReview && (
          <section className="triage-safety">
            <Stethoscope
              size={19}
            />

            <div>
              <strong>
                {t(
                  'triage',
                  'decisionSupport',
                )}
              </strong>

              <p>
                {t(
                  'triage',
                  'decisionSupportText',
                )}
              </p>
            </div>
          </section>
        )}

        {/* =========================
            SAFETY
           ========================= */}

        {!triageResult?.requiresProfessionalReview &&
          triageResult?.measurementAction ===
            'none' && (
          <section className="triage-safety">
            <Info size={19} />

            <div>
              <strong>
                {t(
                  'triage',
                  'decisionSupport',
                )}
              </strong>

              <p>
                {t(
                  'triage',
                  'decisionSupportText',
                )}
              </p>
            </div>
          </section>
        )}

        {/* =========================
            FOOTER
           ========================= */}

        <div className="form-footer triage-footer">
          <p>
            {t(
              'triage',
              'footerNote',
            )}
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={handleContinue}
          >
            {result.action}

            <ArrowRight
              size={18}
            />
          </button>
        </div>

        {/* =========================
            PROTOTYPE MARKER
           ========================= */}

        <div className="prototype-note">
          <Info size={16} />

          <span>
            {t(
              'triage',
              'prototypeNote',
            )}
          </span>
        </div>

      </main>
    </div>
  )
}

export default Triage