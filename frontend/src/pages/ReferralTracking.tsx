import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Hospital,
  Info,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { t, useLanguage } from '../i18n'
import { apiFetch } from '../services/api'
import {
  getPatientRecord,
  savePatientRecord,
} from '../utils/patientRecordStorage'
import type {
  PatientProfile,
  ReferralRecord,
} from '../types/patientRecord'

interface ReferralApiRecord {
  _id: string
  status: 'sent' | 'accepted' | 'completed' | 'cancelled'
  facilityId: string
  preferredDate: string
  reason: string
}

function ReferralTracking() {
  useLanguage()

  const navigate = useNavigate()
  const location = useLocation()

  const patient = location.state?.patient as PatientProfile | undefined

  const storedRecord = patient?.patientId
    ? getPatientRecord(patient.patientId)
    : undefined

  const localReferral: ReferralRecord | undefined =
    storedRecord && storedRecord.referrals.length > 0
      ? storedRecord.referrals[storedRecord.referrals.length - 1]
      : undefined

  const [serverReferral, setServerReferral] = useState<ReferralApiRecord | null>(
    location.state?.referral ?? null,
  )
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const referralId = serverReferral?._id ?? localReferral?.referralId
    if (!referralId || !navigator.onLine) return

    apiFetch<{ success: boolean; referral: ReferralApiRecord }>(`/referrals/${referralId}`)
      .then((response) => setServerReferral(response.referral))
      .catch(() => {
        // Keep local referral data when the API is temporarily unavailable.
      })
  }, [serverReferral?._id, localReferral?.referralId])

  const referralStatus = serverReferral?.status ??
    (localReferral?.status === 'pending' ? 'sent' : localReferral?.status) ??
    'sent'

  const facility = location.state?.facility ?? {
    name: localReferral?.destination ?? 'Primary Health Centre',
    type: 'PHC',
    distance: '3.2 km',
  }

  const statusRank: Record<string, number> = {
    sent: 1,
    accepted: 2,
    completed: 5,
    cancelled: 0,
  }

  const rank = statusRank[referralStatus] ?? 1

  const steps = [
    {
      title: t('referral', 'created'),
      description: t('referral', 'createdDescription'),
      completed: referralStatus !== 'cancelled',
    },
    {
      title: t('referral', 'sent'),
      description: t('referral', 'sentDescription'),
      completed: rank >= 1,
    },
    {
      title: t('referral', 'accepted'),
      description: t('referral', 'acceptedDescription'),
      completed: rank >= 2,
    },
    {
      title: t('referral', 'appointment'),
      description: t('referral', 'appointmentDescription'),
      completed: rank >= 5,
    },
    {
      title: t('referral', 'consulted'),
      description: t('referral', 'consultedDescription'),
      completed: rank >= 5,
    },
    {
      title: t('referral', 'followUp'),
      description: t('referral', 'followUpDescription'),
      completed: false,
    },
  ]

  const handleAdvanceStatus = async () => {
    if (!serverReferral?._id || serverReferral._id.startsWith('offline-') || !navigator.onLine) return

    const nextStatus =
      serverReferral.status === 'sent'
        ? 'accepted'
        : serverReferral.status === 'accepted'
          ? 'completed'
          : null

    if (!nextStatus) return

    setUpdatingStatus(true)
    try {
      const response = await apiFetch<{ success: boolean; referral: ReferralApiRecord }>(
        `/referrals/${serverReferral._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus }),
        },
      )
      setServerReferral(response.referral)

      if (patient?.patientId) {
        const record = getPatientRecord(patient.patientId)
        const index = record?.referrals.findIndex(
          (item) => item.referralId === response.referral._id,
        )
        if (record && index != null && index >= 0) {
          record.referrals[index].status =
            response.referral.status === 'sent'
              ? 'pending'
              : response.referral.status
          savePatientRecord(record)
        }
      }
    } catch {
      // The current server state remains visible if the update fails.
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="page-shell">
      <main className="tracking-page">

        <header className="form-header">
          <button
            className="back-button"
            type="button"
            onClick={() => navigate('/referral')}
          >
            <ArrowLeft size={18} />
            {t('common', 'back')}
          </button>

          <div className="form-heading">
            <div className="form-icon">
              <Send size={24} />
            </div>

            <div>
              <p className="eyebrow">
                {t('referral', 'trackingEyebrow')}
              </p>

              <h1>
                {t('referral', 'trackingTitle')}
              </h1>

              <p>
                {t('referral', 'trackingDescription')}
              </p>
            </div>
          </div>
        </header>

        {patient && (
          <div className="patient-strip">
            <div>
              <span>{t('screening', 'screeningFor')}</span>
              <strong>{patient.name}</strong>
            </div>

            <div>
              <span>{t('screening', 'age')}</span>
              <strong>{patient.age || '—'}</strong>
            </div>

            <div>
              <span>{t('screening', 'village')}</span>
              <strong>{patient.village || '—'}</strong>
            </div>
          </div>
        )}

        {/* Referral status */}

        <section className="tracking-status-card">
          <div className="tracking-status-icon">
            <Send size={24} />
          </div>

          <div>
            <span className="section-kicker">
              {t('referral', 'currentStatus')}
            </span>

            <h2>{referralStatus === 'accepted' ? t('referral', 'accepted') : referralStatus === 'completed' ? 'Completed' : referralStatus === 'cancelled' ? 'Cancelled' : t('referral', 'sent')}</h2>

            <p>
              {t('referral', 'statusDescription')}
            </p>
          </div>

          <span className="tracking-status-badge">
            <Clock3 size={14} />
            {referralStatus === 'sent'
              ? 'Pending acceptance'
              : referralStatus}
          </span>
        </section>

        {/* Facility */}

        <section className="tracking-facility-card">
          <div className="tracking-facility-icon">
            <Hospital size={23} />
          </div>

          <div className="tracking-facility-info">
            <span>{facility.type}</span>

            <h2>{facility.name}</h2>

            <p>
              <MapPin size={14} />
              {facility.distance}
            </p>
          </div>

          <button
            className="secondary-button"
            type="button"
          >
            <Phone size={16} />
            Contact facility
          </button>
        </section>

        {/* Timeline */}

        <section className="timeline-card">
          <div className="section-heading">
            <div>
              <span className="section-number">01</span>
              <h2>{t('referral', 'lifecycle')}</h2>
            </div>
          </div>

          <div className="referral-timeline">
            {steps.map((step, index) => (
              <div
                className={`timeline-step ${
                  step.completed ? 'completed' : ''
                }`}
                key={step.title}
              >
                <div className="timeline-marker">
                  {step.completed ? (
                    <Check size={15} />
                  ) : (
                    index + 1
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`timeline-connector ${
                      step.completed ? 'completed' : ''
                    }`}
                  />
                )}

                <div className="timeline-content">
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Follow-up */}

        <section className="followup-card">
          <div className="followup-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h3>{t('referral', 'continuityTitle')}</h3>

            <p>
              {t('referral', 'continuityText')}
            </p>
          </div>
        </section>

        <section className="referral-safety">
          <Info size={19} />

          <div>
            <strong>
              {t('referral', 'trackingSafetyTitle')}
            </strong>

            <p>
              {t('referral', 'trackingSafetyText')}
            </p>
          </div>
        </section>
        {(referralStatus === 'sent' || referralStatus === 'accepted') && (
          <div className="form-footer">
            <button
              className="secondary-button"
              type="button"
              onClick={handleAdvanceStatus}
              disabled={updatingStatus || serverReferral?._id.startsWith('offline-') || !navigator.onLine}
            >
              {updatingStatus
                ? 'Updating…'
                : referralStatus === 'sent'
                  ? 'Demo: Mark accepted'
                  : 'Demo: Mark completed'}
            </button>
          </div>
        )}

        <div className="form-footer tracking-footer">
          <p>
            Continue the patient's care journey in the longitudinal record.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              navigate('/patient-record', {
                state: {
                  patient,
                },
              })
            }
          >
            View patient record
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="prototype-note">
          <Info size={16} />

          <span>
            {t('referral', 'trackingPrototypeNote')}
          </span>
        </div>

      </main>
    </div>
  )
}

export default ReferralTracking