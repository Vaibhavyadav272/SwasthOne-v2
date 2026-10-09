import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  MessageSquare,
  Phone,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { t, useLanguage } from '../i18n'
import { apiFetch } from '../services/api'
import { useEffect, useState } from 'react'
import {
  getPatientRecord,
  savePatientRecord,
} from '../utils/patientRecordStorage'
import type {
  PatientProfile,
  FollowUpRecord,
} from '../types/patientRecord'

function FollowUp() {
  useLanguage()

  const navigate = useNavigate()
  const location = useLocation()

  const patient = location.state?.patient as PatientProfile | undefined

  const [error, setError] = useState('')
  const [latestReferralId, setLatestReferralId] = useState<string | null>(null)

  useEffect(() => {
    if (!patient?.patientId || !navigator.onLine) return

    const localReferral = getPatientRecord(patient.patientId)?.referrals.at(-1)?.referralId
    if (localReferral) {
      setLatestReferralId(localReferral)
      return
    }

    apiFetch<{
      success: boolean
      referrals: Array<{ _id: string }>
    }>(`/referrals/patient/${patient.patientId}`)
      .then((response) => {
        const latest = response.referrals?.[0]?._id
        if (latest) setLatestReferralId(latest)
      })
      .catch(() => {
        // Local cache remains the fallback.
      })
  }, [patient?.patientId])

  const patientData = patient ?? {
    name: 'Patient',
    phone: '—',
    village: '—',
  }

  return (
    <div className="page-shell">
      <main className="followup-page">

        <header className="form-header">
          <button
            className="back-button"
            type="button"
            onClick={() =>
              navigate('/patient-record', {
                state: { patient: patientData },
              })
            }
          >
            <ArrowLeft size={18} />
            {t('common', 'back')}
          </button>

          <div className="form-heading">
            <div className="form-icon">
              <CalendarDays size={24} />
            </div>

            <div>
              <p className="eyebrow">
                {t('followUp', 'eyebrow')}
              </p>

              <h1>
                {t('followUp', 'title')}
              </h1>

              <p>
                {t('followUp', 'description')}
              </p>
            </div>
          </div>
        </header>

        {/* Patient */}

        <section className="followup-patient">
          <div className="followup-patient-avatar">
            {patientData.name
              .split(' ')
              .map((part: string) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <span>
              {t('followUp', 'patient')}
            </span>

            <strong>
              {patientData.name}
            </strong>

            <p>
              {patientData.village || '—'}
            </p>
          </div>
        </section>

        {/* Schedule */}

        <section className="followup-form-card">
          <div className="section-heading">
            <div>
              <span className="section-number">
                01
              </span>

              <h2>
                {t('followUp', 'scheduleTitle')}
              </h2>
            </div>
          </div>

          <div className="followup-option-grid">

            <button
              className="followup-option selected"
              type="button"
            >
              <CalendarDays size={21} />

              <div>
                <strong>
                  {t('screening', 'today') === 'Today'
                    ? 'Tomorrow'
                    : t('followUp', 'tomorrow')}
                </strong>

                <span>
                  {t('followUp', 'recommendedFollowUp')}
                </span>
              </div>

              <CheckCircle2 size={18} />
            </button>

            <button
              className="followup-option"
              type="button"
            >
              <CalendarDays size={21} />

              <div>
                <strong>
                  {t('followUp', 'in3Days')}
                </strong>

                <span>
                  {t('followUp', 'standardFollowUp')}
                </span>
              </div>
            </button>

            <button
              className="followup-option"
              type="button"
            >
              <CalendarDays size={21} />

              <div>
                <strong>
                  {t('followUp', 'in7Days')}
                </strong>

                <span>
                  {t('followUp', 'laterFollowUp')}
                </span>
              </div>
            </button>

          </div>
        </section>

        {/* Reminder */}

        <section className="followup-form-card">
          <div className="section-heading">
            <div>
              <span className="section-number">
                02
              </span>

              <h2>
                {t('followUp', 'reminderTitle')}
              </h2>
            </div>
          </div>

          <div className="reminder-options">

            <div className="reminder-option active">
              <Bell size={19} />

              <div>
                <strong>
                  {t('followUp', 'smsReminder')}
                </strong>

                <span>
                  {patientData.phone}
                </span>
              </div>

              <CheckCircle2 size={17} />
            </div>

            <div className="reminder-option">
              <Phone size={19} />

              <div>
                <strong>
                  {t('followUp', 'callReminder')}
                </strong>

                <span>
                  {t('followUp', 'callDescription')}
                </span>
              </div>
            </div>

            <div className="reminder-option">
              <MessageSquare size={19} />

              <div>
                <strong>
                  {t('followUp', 'ashaReminder')}
                </strong>

                <span>
                  {t('followUp', 'ashaDescription')}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Follow-up purpose */}

        <section className="followup-purpose">
          <Clock3 size={19} />

          <div>
            <strong>
              {t('followUp', 'purposeTitle')}
            </strong>

            <p>
              {t('followUp', 'purposeText')}
            </p>
          </div>
        </section>

        {/* Footer */}

        <div className="form-footer followup-footer">
          <p>
            {t('followUp', 'footerNote')}
          </p>

          {error && <p role="alert" className="form-error">{error}</p>}

          <button
            className="primary-button"
            type="button"
            onClick={async () => {
              if (!patient?.patientId) { setError('Patient ID is missing.'); return }
              const patientRecord = getPatientRecord(patient.patientId)
              const referralId = latestReferralId ?? patientRecord?.referrals.at(-1)?.referralId
              if (!referralId) { setError('Create a referral before scheduling a follow-up.'); return }
              try {
                const scheduledDate = new Date()
                scheduledDate.setDate(scheduledDate.getDate() + 1)

                if (!navigator.onLine) {
                  if (!patientRecord) {
                    setError('Patient record is not available offline.')
                    return
                  }

                  const followUp: FollowUpRecord = {
                    followUpId: `offline-${crypto.randomUUID()}`,
                    patientId: patient.patientId,
                    createdAt: new Date().toISOString(),
                    scheduledDate: scheduledDate.toISOString(),
                    reminderMethod: 'sms',
                    status: 'scheduled',
                  }
                  patientRecord.followUps.push(followUp)
                  savePatientRecord(patientRecord)
                  navigate('/patient-record', { state: { patient: patientData } })
                  return
                }

                const response = await apiFetch<{
                  success: boolean
                  followUp: {
                    _id: string
                    scheduledDate: string
                    method: 'sms' | 'call' | 'asha'
                    status: 'scheduled' | 'completed' | 'missed' | 'cancelled'
                  }
                }>('/followups', {
                  method: 'POST',
                  body: JSON.stringify({
                    patientId: patient.patientId,
                    referralId,
                    scheduledDate: scheduledDate.toISOString(),
                    method: 'sms',
                  }),
                })

                if (patientRecord) {
                  const followUp: FollowUpRecord = {
                    followUpId: response.followUp._id,
                    patientId: patient.patientId,
                    createdAt: new Date().toISOString(),
                    scheduledDate: response.followUp.scheduledDate,
                    reminderMethod: response.followUp.method,
                    status: response.followUp.status,
                  }
                  patientRecord.followUps.push(followUp)
                  savePatientRecord(patientRecord)
                }

                navigate('/patient-record', { state: { patient: patientData } })
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Unable to schedule follow-up')
              }
            }}
          >
            <CheckCircle2 size={17} />

            {t('followUp', 'confirm')}
          </button>
        </div>

        <div className="prototype-note">
          <Info size={16} />

          <span>
            {t('followUp', 'prototypeNote')}
          </span>
        </div>

      </main>
    </div>
  )
}

export default FollowUp