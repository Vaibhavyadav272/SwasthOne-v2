import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, HeartPulse, Stethoscope } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { saveOfflineRecord } from '../utils/offlineStorage'
import { t, useLanguage } from '../i18n'
import type { PatientProfile } from '../types/patientRecord'
import { apiFetch } from '../services/api'


const symptomOptions = [
  'Fever',
  'Cough',
  'Breathing difficulty',
  'Chest discomfort',
  'Dizziness',
  'Headache',
  'Fatigue',
  'Other',
]

function Screening() {
  useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const patient = location.state?.patient as PatientProfile | undefined

  const [symptoms, setSymptoms] = useState<string[]>([])
  const [duration, setDuration] = useState('')
  const [severity, setSeverity] = useState('')

  const [hasManualVitals, setHasManualVitals] = useState(false)

  const [bloodPressure, setBloodPressure] = useState('')
  const [pulse, setPulse] = useState('')
  const [temperature, setTemperature] = useState('')
  const [oxygenSaturation, setOxygenSaturation] = useState('')

  const toggleSymptom = (symptom: string) => {
    setSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom],
    )
  }

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!patient?.patientId) { setError('Patient ID is missing.'); return }
    setError('')
    setLoading(true)
    const [systolic, diastolic] = bloodPressure.split('/').map(Number)
    const severityValue = severity === 'Mild' ? 2 : severity === 'Moderate' ? 5 : severity === 'Severe' ? 8 : undefined
    const screeningData = { symptoms, duration, severity, hasManualVitals, bloodPressure, pulse, temperature, oxygenSaturation }
    try {
      if (!navigator.onLine) {
        saveOfflineRecord('screening', { patient, screening: screeningData })
        navigate('/screening/rppg', { state: { patient, screening: { ...screeningData, patientId: patient.patientId } } })
        return
      }
      const response = await apiFetch<{ success: boolean; screening: { _id: string; patient: string; createdAt: string; symptoms: string[]; duration?: string; severity?: number; hasManualVitals: boolean; bloodPressure?: { systolic?: number; diastolic?: number }; oxygenSaturation?: number; heartRate?: number; temperature?: number; rppg?: unknown } }>('/screenings', {
        method: 'POST',
        body: JSON.stringify({
          patientId: patient.patientId, symptoms, duration: duration || undefined, severity: severityValue, hasManualVitals,
          bloodPressure: hasManualVitals && Number.isFinite(systolic) && Number.isFinite(diastolic) ? { systolic, diastolic } : undefined,
          heartRate: pulse ? Number(pulse) : undefined, temperature: temperature ? Number(temperature) : undefined,
          oxygenSaturation: oxygenSaturation ? Number(oxygenSaturation) : undefined,
        }),
      })
      navigate('/screening/rppg', { state: { patient, screening: { ...screeningData, _id: response.screening._id, patientId: patient.patientId } } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save screening')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-shell">
      <main className="form-page">
        <header className="form-header">
          <button
            className="back-button"
            type="button"
            onClick={() =>
              navigate('/patients/profile', {
                state: { patient },
              })
            }
          >
            <ArrowLeft size={18} />
            {t('common', 'back')}
          </button>

          <div className="form-heading">
            <div className="form-icon">
              <HeartPulse size={24} />
            </div>

            <div>
              <p className="eyebrow">
                {t('screening', 'eyebrow')}
              </p>

              <h1>
                {t('screening', 'title')}
              </h1>

              <p>
                {t('screening', 'description')}
              </p>
            </div>
          </div>
        </header>

        <div className="workflow">
          <div className="workflow-step completed">
            <span>
              <Check size={14} />
            </span>

            <label>
              {t('screening', 'registration')}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step active">
            <span>2</span>

            <label>
              {t('screening', 'symptomsStep')}
            </label>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>3</span>

            <label>
              {t('screening', 'rppg')}
            </label>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>4</span>

            <label>
              {t('screening', 'triage')}
            </label>
          </div>
        </div>

        {patient && (
          <div className="patient-strip">
            <div>
              <span>
                {t('screening', 'screeningFor')}
              </span>

              <strong>{patient.name}</strong>
            </div>

            <div>
              <span>
                {t('screening', 'age')}
              </span>

              <strong>{patient.age || '—'}</strong>
            </div>

            <div>
              <span>
                {t('screening', 'village')}
              </span>

              <strong>{patient.village || '—'}</strong>
            </div>
          </div>
        )}

        {error && <p role="alert" className="form-error">{error}</p>}

        <form
          className="screening-form"
          onSubmit={handleSubmit}
        >
          <section className="form-section">
            <div className="section-heading">
              <div>
                <span className="section-number">
                  01
                </span>

                <h2>
                  {t(
                    'screening',
                    'symptomsTitle',
                  )}
                </h2>
              </div>

              <p>
                {t('screening', 'selectAll')}
              </p>
            </div>

            <div className="symptom-grid">
              {symptomOptions.map((symptom) => {
                const selected =
                  symptoms.includes(symptom)

                return (
                  <button
                    key={symptom}
                    type="button"
                    className={`symptom-card ${
                      selected ? 'selected' : ''
                    }`}
                    onClick={() =>
                      toggleSymptom(symptom)
                    }
                  >
                    <span>{symptom}</span>

                    {selected && (
                      <span className="symptom-check">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <div>
                <span className="section-number">
                  02
                </span>

                <h2>
                  {t(
                    'screening',
                    'moreTitle',
                  )}
                </h2>
              </div>

              <p>
                {t(
                  'screening',
                  'optional',
                )}
              </p>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>
                  {t(
                    'screening',
                    'duration',
                  )}
                </span>

                <select
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    {t(
                      'screening',
                      'selectDuration',
                    )}
                  </option>

                  <option value="Today">
                    {t(
                      'screening',
                      'today',
                    )}
                  </option>

                  <option value="2-3 days">
                    {t(
                      'screening',
                      'days23',
                    )}
                  </option>

                  <option value="4-7 days">
                    {t(
                      'screening',
                      'days47',
                    )}
                  </option>

                  <option value="More than a week">
                    {t(
                      'screening',
                      'moreWeek',
                    )}
                  </option>
                </select>
              </label>

              <label className="field">
                <span>
                  {t(
                    'screening',
                    'severity',
                  )}
                </span>

                <select
                  value={severity}
                  onChange={(event) =>
                    setSeverity(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    {t(
                      'screening',
                      'selectSeverity',
                    )}
                  </option>

                  <option value="Mild">
                    {t(
                      'screening',
                      'mild',
                    )}
                  </option>

                  <option value="Moderate">
                    {t(
                      'screening',
                      'moderate',
                    )}
                  </option>

                  <option value="Severe">
                    {t(
                      'screening',
                      'severe',
                    )}
                  </option>
                </select>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <div>
                <span className="section-number">
                  03
                </span>

                <h2>
                  {t(
                    'screening',
                    'measurementsTitle',
                  )}
                </h2>
              </div>

              <p>
                {t(
                  'screening',
                  'measurementsOptional',
                )}
              </p>
            </div>

            <div className="vitals-choice">
              <button
                type="button"
                className={`choice-card ${
                  !hasManualVitals
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setHasManualVitals(false)
                }
              >
                <div className="choice-radio">
                  {!hasManualVitals && (
                    <span />
                  )}
                </div>

                <div>
                  <strong>
                    {t(
                      'screening',
                      'noMeasurements',
                    )}
                  </strong>

                  <p>
                    {t(
                      'screening',
                      'noMeasurementsDescription',
                    )}
                  </p>
                </div>
              </button>

              <button
                type="button"
                className={`choice-card ${
                  hasManualVitals
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setHasManualVitals(true)
                }
              >
                <div className="choice-radio">
                  {hasManualVitals && (
                    <span />
                  )}
                </div>

                <div>
                  <strong>
                    {t(
                      'screening',
                      'yesMeasurements',
                    )}
                  </strong>

                  <p>
                    {t(
                      'screening',
                      'yesMeasurementsDescription',
                    )}
                  </p>
                </div>
              </button>
            </div>

            {hasManualVitals && (
              <div className="vitals-panel">
                <div className="vitals-heading">
                  <Stethoscope size={19} />

                  <div>
                    <h3>
                      {t(
                        'screening',
                        'recordedMeasurements',
                      )}
                    </h3>

                    <p>
                      {t(
                        'screening',
                        'recordedDescription',
                      )}
                    </p>
                  </div>
                </div>

                <div className="field-grid four-columns">
                  <label className="field">
                    <span>
                      {t(
                        'screening',
                        'bloodPressure',
                      )}
                    </span>

                    <div className="input-with-unit">
                      <input
                        type="text"
                        placeholder="120/80"
                        value={bloodPressure}
                        onChange={(event) =>
                          setBloodPressure(
                            event.target.value,
                          )
                        }
                      />

                      <span>mmHg</span>
                    </div>
                  </label>

                  <label className="field">
                    <span>
                      {t(
                        'screening',
                        'pulse',
                      )}
                    </span>

                    <div className="input-with-unit">
                      <input
                        type="number"
                        placeholder="72"
                        value={pulse}
                        onChange={(event) =>
                          setPulse(
                            event.target.value,
                          )
                        }
                      />

                      <span>bpm</span>
                    </div>
                  </label>

                  <label className="field">
                    <span>
                      {t(
                        'screening',
                        'temperature',
                      )}
                    </span>

                    <div className="input-with-unit">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="98.6"
                        value={temperature}
                        onChange={(event) =>
                          setTemperature(
                            event.target.value,
                          )
                        }
                      />

                      <span>°F</span>
                    </div>
                  </label>

                  <label className="field">
                    <span>
                      {t(
                        'screening',
                        'oxygen',
                      )}
                    </span>

                    <div className="input-with-unit">
                      <input
                        type="number"
                        placeholder="98"
                        value={oxygenSaturation}
                        onChange={(event) =>
                          setOxygenSaturation(
                            event.target.value,
                          )
                        }
                      />

                      <span>%</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </section>

          <div className="form-footer">
            <p>
              {t(
                'screening',
                'continueNote',
              )}
            </p>

            <button
              className="primary-button"
              type="submit" disabled={loading}
            >
              {t(
                'screening',
                'continueScreening',
              )}

              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Screening