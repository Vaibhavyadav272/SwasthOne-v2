import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { ArrowLeft, CheckCircle2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { t, useLanguage } from '../i18n'
import type {
  PatientProfile,
} from '../types/patientRecord'
import { savePatientRecord } from '../utils/patientRecordStorage'
import { apiFetch } from '../services/api'

interface PatientData {
  name: string
  age: string
  gender: string
  phone: string
  village: string
  emergencyContact: string
}

function PatientRegistration() {
  useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState<PatientData>({
    name: '',
    age: '',
    gender: '',
    phone: '',
    village: '',
    emergencyContact: '',
  })

  const [consent, setConsent] = useState(false)

  const updateField = (
    field: keyof PatientData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!consent) return
    setError('')
    setLoading(true)
    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender === 'Female' ? 'female' : form.gender === 'Male' ? 'male' : 'other',
      phone: form.phone || undefined,
      village: form.village.trim(),
      emergencyContact: form.emergencyContact || undefined,
    }
    try {
      const response = await apiFetch<{ success: boolean; patient: { _id: string; name: string; age: number; gender: 'male' | 'female' | 'other'; phone?: string; village?: string; emergencyContact?: string; createdAt: string } }>('/patients', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const p = response.patient
      const patient: PatientProfile = {
        patientId: p._id, name: p.name, age: p.age, gender: p.gender,
        phone: p.phone, village: p.village || '', emergencyContact: p.emergencyContact, createdAt: p.createdAt,
      }
      savePatientRecord({ patient, screenings: [], triageHistory: [], referrals: [], followUps: [] })
      navigate('/patients/profile', { state: { patient } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="form-page">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          {t('registration', 'backToDashboard')}
        </button>

        <div className="form-header">
          <div className="form-title-icon">
            <UserRound size={25} />
          </div>

          <div>
            <p className="section-kicker">
              {t('registration', 'patientWorkflow')}
            </p>

            <h1>
              {t('registration', 'title')}
            </h1>

            <p>
              {t('registration', 'description')}
            </p>
          </div>
        </div>

        <div className="workflow-steps">
          <div className="workflow-step active">
            <span>1</span>
            {t('registration', 'eyebrow')}
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>2</span>
            {t('screening', 'symptomsStep')}
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>3</span>
            {t('screening', 'rppg')}
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>4</span>
            {t('screening', 'triage')}
          </div>
        </div>

        {error && <p role="alert" className="form-error">{error}</p>}

        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >
          <section className="form-section">
            <div className="form-section-heading">
              <h2>
                {t('registration', 'basicInformation')}
              </h2>

              <p>
                {t(
                  'registration',
                  'basicInformationDescription',
                )}
              </p>
            </div>

            <div className="form-grid">
              <label className="field full-width">
                <span>
                  {t('registration', 'fullName')} *
                </span>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      'name',
                      event.target.value,
                    )
                  }
                  placeholder={t(
                    'registration',
                    'fullNamePlaceholder',
                  )}
                  required
                />
              </label>

              <label className="field">
                <span>
                  {t('registration', 'age')} *
                </span>

                <input
                  type="number"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={(event) =>
                    updateField(
                      'age',
                      event.target.value,
                    )
                  }
                  placeholder={t(
                    'registration',
                    'agePlaceholder',
                  )}
                  required
                />
              </label>

              <label className="field">
                <span>
                  {t('registration', 'gender')} *
                </span>

                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateField(
                      'gender',
                      event.target.value,
                    )
                  }
                  required
                >
                  <option value="">
                    {t(
                      'registration',
                      'selectGender',
                    )}
                  </option>

                  <option value="Female">
                    {t('registration', 'female')}
                  </option>

                  <option value="Male">
                    {t('registration', 'male')}
                  </option>

                  <option value="Other">
                    {t('registration', 'other')}
                  </option>

                  <option value="Prefer not to say">
                    {t(
                      'registration',
                      'preferNotToSay',
                    )}
                  </option>
                </select>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <h2>
                {t('registration', 'contactLocation')}
              </h2>

              <p>
                {t(
                  'registration',
                  'contactLocationDescription',
                )}
              </p>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>
                  {t('registration', 'phone')}
                </span>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value,
                    )
                  }
                  placeholder={t(
                    'registration',
                    'phonePlaceholder',
                  )}
                  maxLength={10}
                />
              </label>

              <label className="field">
                <span>
                  {t('registration', 'village')} *
                </span>

                <input
                  type="text"
                  value={form.village}
                  onChange={(event) =>
                    updateField(
                      'village',
                      event.target.value,
                    )
                  }
                  placeholder={t(
                    'registration',
                    'villagePlaceholder',
                  )}
                  required
                />
              </label>

              <label className="field full-width">
                <span>
                  {t(
                    'registration',
                    'emergencyContact',
                  )}
                </span>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.emergencyContact}
                  onChange={(event) =>
                    updateField(
                      'emergencyContact',
                      event.target.value,
                    )
                  }
                  placeholder={t(
                    'registration',
                    'emergencyPlaceholder',
                  )}
                  maxLength={10}
                />
              </label>
            </div>
          </section>

          <section className="consent-box">
            <label className="consent-label">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) =>
                  setConsent(event.target.checked)
                }
              />

              <span>
                {t(
                  'registration',
                  'consentText',
                )}
              </span>
            </label>
          </section>

          <div className="form-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate('/')}
            >
              {t('registration', 'cancel')}
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={loading || !consent}
            >
              <CheckCircle2 size={18} />

              {t(
                'registration',
                'continue',
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default PatientRegistration