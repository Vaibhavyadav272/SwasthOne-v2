import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hospital,
  Info,
  MapPin,
  Send,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { t, useLanguage } from '../i18n'
import { apiFetch } from '../services/api'
import type {
  PatientProfile,
  ReferralRecord,
} from '../types/patientRecord'
import {
  getPatientRecord,
  savePatientRecord,
} from '../utils/patientRecordStorage'


interface ScreeningData {
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
  triageId?: string
}

interface TriageData {
  category:
    | 'routine'
    | 'consult'
    | 'urgent'
  reasons?: string[]
  measurementAction?:
    | 'none'
    | 'retake-rppg'
    | 'manual-verify'
  requiresProfessionalReview?: boolean
  demoMode?: boolean
  triageId?: string
}

interface Facility {
  id: string
  name: string
  type: string
  distance: string
  doctor: string
  availability: string
  queue: string
}

function Referral() {
  useLanguage()

  const navigate = useNavigate()
  const location = useLocation()

  const patient =
    location.state?.patient as
      | PatientProfile
      | undefined

  const screening =
    location.state?.screening as
      | ScreeningData
      | undefined

  const rppg =
    location.state?.rppg as
      | RPPGData
      | undefined

  const triage =
    location.state?.triage as
      | TriageData
      | undefined

  const facilities: Facility[] = [
    {
      id: 'phc-1',
      name: 'Primary Health Centre',
      type: 'PHC',
      distance: '3.2 km',
      doctor: 'Doctor available',
      availability: 'Available today',
      queue: '4 patients',
    },
    {
      id: 'phc-2',
      name: 'Community Health Centre',
      type: 'CHC',
      distance: '8.7 km',
      doctor:
        'Medical Officer available',
      availability: 'Available today',
      queue: '7 patients',
    },
    {
      id: 'phc-3',
      name: 'District Hospital',
      type: 'DH',
      distance: '18.4 km',
      doctor: 'Specialist service',
      availability: 'By appointment',
      queue: '12 patients',
    },
  ]

  const [availableFacilities, setAvailableFacilities] = useState<Facility[]>(facilities)
  const [selectedFacility, setSelectedFacility] = useState<Facility>(facilities[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!navigator.onLine) return

    apiFetch<{ success: boolean; facilities: Array<{
      facilityId: string
      name: string
      type: string
      phone?: string
    }> }>('/facilities')
      .then((response) => {
        if (!response.facilities?.length) return
        const mapped = response.facilities.map((facility) => ({
          id: facility.facilityId,
          name: facility.name,
          type: facility.type.toUpperCase(),
          distance: '—',
          doctor: 'Facility data available',
          availability: 'Available',
          queue: '—',
        }))
        setAvailableFacilities(mapped)
        setSelectedFacility(mapped[0])
      })
      .catch(() => {
        // Keep the demo fallback facilities when the API is unavailable.
      })
  }, [])

  const handleBack = () => {
    navigate('/screening/triage', {
      state: {
        patient,
        screening,
        rppg,
      },
    })
  }

  const handleCreateReferral = async () => {
    if (!patient?.patientId || !triage?.triageId) { setError('Patient or triage ID is missing.'); return }
    setLoading(true); setError('')
    try {
      const preferredDate = new Date()
      preferredDate.setDate(preferredDate.getDate() + 1)
      const reason = triage.category === 'urgent'
        ? 'Urgent clinical review'
        : 'Clinical review'
      const patientRecord = getPatientRecord(patient.patientId)

      if (!navigator.onLine) {
        if (!patientRecord) {
          setError('Patient record is not available offline.')
          return
        }

        const offlineReferral: ReferralRecord = {
          referralId: `offline-${crypto.randomUUID()}`,
          patientId: patient.patientId,
          triageId: triage.triageId,
          createdAt: new Date().toISOString(),
          destination: selectedFacility.name,
          reason,
          status: 'pending',
        }

        patientRecord.referrals.push(offlineReferral)
        savePatientRecord(patientRecord)

        navigate('/referral/tracking', {
          state: {
            patient,
            screening,
            rppg,
            triage,
            facility: selectedFacility,
            referral: {
              _id: offlineReferral.referralId,
              status: 'sent',
              facilityId: selectedFacility.id,
              preferredDate: preferredDate.toISOString(),
              reason,
            },
          },
        })
        return
      }

      const response = await apiFetch<{
        success: boolean
        referral: {
          _id: string
          status: 'sent' | 'accepted' | 'completed' | 'cancelled'
          facilityId: string
          preferredDate: string
          reason: string
        }
      }>('/referrals', {
        method: 'POST',
        body: JSON.stringify({
          patientId: patient.patientId,
          triageId: triage.triageId,
          triageCategory: triage.category,
          facilityId: selectedFacility.id,
          preferredDate: preferredDate.toISOString(),
          reason,
        }),
      })

      if (patientRecord) {
        patientRecord.referrals.push({
          referralId: response.referral._id,
          patientId: patient.patientId,
          triageId: triage.triageId,
          createdAt: new Date().toISOString(),
          destination: selectedFacility.name,
          reason: response.referral.reason,
          status: response.referral.status === 'sent'
            ? 'pending'
            : response.referral.status as ReferralRecord['status'],
        })
        savePatientRecord(patientRecord)
      }

      navigate('/referral/tracking', {
        state: {
          patient,
          screening,
          rppg,
          triage,
          facility: selectedFacility,
          referral: response.referral,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create referral')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <main className="referral-page">
        {error && <p role="alert" className="form-error">{error}</p>}

        {/* Header */}

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
              <Send size={24} />
            </div>

            <div>
              <p className="eyebrow">
                {t(
                  'referral',
                  'eyebrow',
                )}
              </p>

              <h1>
                {t(
                  'referral',
                  'title',
                )}
              </h1>

              <p>
                {t(
                  'referral',
                  'description',
                )}
              </p>
            </div>
          </div>
        </header>

        {/* Workflow */}

        <div className="workflow referral-workflow">
          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t(
                'referral',
                'triage',
              )}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step active">
            <span>2</span>

            <label>
              {t(
                'referral',
                'facility',
              )}
            </label>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>3</span>

            <label>
              {t(
                'referral',
                'referral',
              )}
            </label>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>4</span>

            <label>
              {t(
                'referral',
                'followUp',
              )}
            </label>
          </div>
        </div>

        {/* Patient */}

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

        {/* Triage summary */}

        <section className="referral-summary">
          <div>
            <span className="section-kicker">
              {t(
                'referral',
                'triageResult',
              )}
            </span>

            <h2>
              {triage?.category ===
              'urgent'
                ? t(
                    'referral',
                    'urgent',
                  )
                : triage?.category ===
                    'consult'
                  ? t(
                      'referral',
                      'consult',
                    )
                  : t(
                      'referral',
                      'routine',
                    )}
            </h2>

            <p>
              {t(
                'referral',
                'triageSummary',
              )}
            </p>
          </div>

          <div className="referral-score">
            <ShieldCheck size={18} />

            <span>
              TrustScore
            </span>

            <strong>
              {rppg?.trustScore ??
                '—'}
              /100
            </strong>
          </div>
        </section>

        {/* Facility */}

        <section className="facility-section">
          <div className="section-heading">
            <div>
              <span className="section-number">
                01
              </span>

              <h2>
                {t(
                  'referral',
                  'chooseFacility',
                )}
              </h2>
            </div>

            <p>
              {t(
                'referral',
                'facilityDemo',
              )}
            </p>
          </div>

          <div className="facility-list">
            {availableFacilities.map(
              (facility) => (
                <button
                  key={
                    facility.id
                  }
                  className={`facility-card ${
                    facility.id === selectedFacility.id ? 'selected' : ''
                  }`}
                  type="button"
                  onClick={() => setSelectedFacility(facility)}
                >
                  <div className="facility-icon">
                    <Hospital size={22} />
                  </div>

                  <div className="facility-main">
                    <div className="facility-title-row">
                      <h3>
                        {facility.name}
                      </h3>

                      {facility.id ===
                        selectedFacility.id && (
                        <span className="selected-facility">
                          <CheckCircle2
                            size={
                              14
                            }
                          />

                          {t(
                            'referral',
                            'recommended',
                          )}
                        </span>
                      )}
                    </div>

                    <div className="facility-meta">
                      <span>
                        <MapPin
                          size={
                            14
                          }
                        />

                        {facility.distance}
                      </span>

                      <span>
                        <Stethoscope
                          size={
                            14
                          }
                        />

                        {facility.doctor}
                      </span>

                      <span>
                        <Clock3
                          size={
                            14
                          }
                        />

                        {facility.queue}
                      </span>
                    </div>

                    <p>
                      {facility.availability}
                    </p>
                  </div>
                </button>
              ),
            )}
          </div>
        </section>

        {/* Referral details */}

        <section className="referral-details">
          <div className="section-heading">
            <div>
              <span className="section-number">
                02
              </span>

              <h2>
                {t(
                  'referral',
                  'referralDetails',
                )}
              </h2>
            </div>
          </div>

          <div className="referral-detail-grid">
            <div className="detail-box">
              <CalendarDays
                size={18}
              />

              <div>
                <span>
                  {t(
                    'referral',
                    'preferredDate',
                  )}
                </span>

                <strong>
                  {t(
                    'screening',
                    'today',
                  )}
                </strong>
              </div>
            </div>

            <div className="detail-box">
              <Stethoscope
                size={18}
              />

              <div>
                <span>
                  {t(
                    'referral',
                    'reason',
                  )}
                </span>

                <strong>
                  {triage?.category ===
                  'urgent'
                    ? t(
                        'referral',
                        'urgentReview',
                      )
                    : t(
                        'referral',
                        'clinicalReview',
                      )}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Safety */}

        <section className="referral-safety">
          <Info size={19} />

          <div>
            <strong>
              {t(
                'referral',
                'safetyTitle',
              )}
            </strong>

            <p>
              {t(
                'referral',
                'safetyText',
              )}
            </p>
          </div>
        </section>

        {/* Footer */}

        <div className="form-footer referral-footer">
          <p>
            {t(
              'referral',
              'footerNote',
            )}
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={
              handleCreateReferral
            }
            disabled={loading}
          >
            <Send size={17} />

            {t(
              'referral',
              'createReferral',
            )}

            <ArrowRight
              size={17}
            />
          </button>
        </div>

        <div className="prototype-note">
          <Info size={16} />

          <span>
            {t(
              'referral',
              'prototypeNote',
            )}
          </span>
        </div>

      </main>
    </div>
  )
}

export default Referral