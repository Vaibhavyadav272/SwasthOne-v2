import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  ShieldCheck,
  Activity,
  HeartPulse,
  Wind,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { t, useLanguage } from '../i18n'

interface Patient {
  name: string
  age: string
  gender: string
  phone: string
  village: string
  emergencyContact: string
}

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

type AnalysisState = 'processing' | 'result'

interface RPPGData {
  heartRate: number
  motion: number
  motionStability?: number
  trustScore: number
  confidence: 'high' | 'medium' | 'low'
  accept?: boolean
  temporalStability?: number
  regionAgreement?: number
  demoMode?: boolean
  algorithmAgreement?: number
  signalQuality?: number
  lighting?: number
  methods?: {method:string;heartRate:number|null;quality?:number}[]
}

function TrustScore() {
  useLanguage()

  const navigate = useNavigate()
  const location = useLocation()

  const patient = location.state?.patient as Patient | undefined
  const screening = location.state?.screening as ScreeningData | undefined
  const rppg = location.state?.rppg as RPPGData | undefined

  const [analysisState, setAnalysisState] =
    useState<AnalysisState>('processing')

  const trustScore = rppg?.trustScore ?? 0
  const isHighConfidence = trustScore >= 70 && (rppg?.accept ?? true)
  const isMediumConfidence = trustScore >= 40 && !isHighConfidence

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnalysisState('result')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [])

  const handleRetake = () => {
    navigate('/screening/rppg', {
      state: {
        patient,
        screening,
      },
    })
  }

  const handleContinue = () => {
    navigate('/screening/triage', {
      state: {
        patient,
        screening,
        rppg: rppg ?? {
          trustScore,
          confidence: isHighConfidence ? 'high' : 'low',
          demoMode: true,
        },
      },
    })
  }

  const scoreColorClass =
    trustScore >= 70
      ? 'trust-high'
      : trustScore >= 40
        ? 'trust-medium'
        : 'trust-low'

  return (
    <div className="page-shell">
      <main className="trust-page">
        {/* Header */}
        <header className="form-header">
          <button
            className="back-button"
            type="button"
            onClick={handleRetake}
          >
            <ArrowLeft size={18} />
            {t('common', 'back')}
          </button>

          <div className="form-heading">
            <div className="form-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <p className="eyebrow">
                {t('trustScore', 'eyebrow')}
              </p>

              <h1>
                {t('trustScore', 'title')}
              </h1>

              <p>
                {t('trustScore', 'description')}
              </p>
            </div>
          </div>
        </header>

        {/* Workflow */}
        <div className="workflow">
          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t('screening', 'registration')}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t('screening', 'symptomsStep')}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step completed">
            <span>✓</span>

            <label>
              {t('screening', 'rppg')}
            </label>
          </div>

          <div className="workflow-line active" />

          <div className="workflow-step active">
            <span>4</span>

            <label>
              {t('trustScore', 'trustScore')}
            </label>
          </div>
        </div>

        {/* Patient */}
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

              <strong>
                {patient.age || '—'}
              </strong>
            </div>

            <div>
              <span>
                {t('screening', 'village')}
              </span>

              <strong>
                {patient.village || '—'}
              </strong>
            </div>
          </div>
        )}

        {analysisState === 'processing' ? (
          <section className="analysis-card">
            <div className="analysis-animation">
              <div className="analysis-ring">
                <Activity size={36} />
              </div>
            </div>

            <h2>
              {t(
                'trustScore',
                'processing',
              )}
            </h2>

            <p>
              {t(
                'trustScore',
                'processingTime',
              )}
            </p>

            <div className="analysis-checks">
              <div>
                <span className="check-loading" />

                {t(
                  'trustScore',
                  'qualityFactors',
                )}
              </div>

              <div>
                <span className="check-loading" />

                {t(
                  'trustScore',
                  'faceStability',
                )}
              </div>

              <div>
                <span className="check-loading" />

                {t(
                  'trustScore',
                  'measurementConsistency',
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Main TrustScore */}
            <section className="trust-result-card">
              <div className="trust-result-header">
                <div>
                  <p className="section-kicker">
                    {t(
                      'trustScore',
                      'eyebrow',
                    )}
                  </p>

                  <h2>
                    {t(
                      'trustScore',
                      'measurementQuality',
                    )}
                  </h2>
                </div>

                {isHighConfidence ? (
                  <span className="confidence-badge high"><CheckCircle2 size={15} />{t('trustScore','high')}</span>
                ) : isMediumConfidence ? (
                  <span className="confidence-badge medium"><AlertTriangle size={15} />Medium confidence</span>
                ) : (
                  <span className="confidence-badge low"><AlertTriangle size={15} />{t('trustScore','low')}</span>
                )}
              </div>

              <div className="trust-score-layout">
                <div
                  className={`trust-score-circle ${scoreColorClass}`}
                >
                  <div>
                    <strong>
                      {trustScore}
                    </strong>

                    <span>
                      /100
                    </span>
                  </div>

                  <small>
                    {t(
                      'trustScore',
                      'trustScore',
                    )}
                  </small>
                </div>

                <div className="trust-summary">
                  {isHighConfidence ? (
                    <>
                      <h3>
                        {t(
                          'trustScore',
                          'good',
                        )}
                      </h3>

                      <p>
                        {t(
                          'trustScore',
                          'goodDescription',
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>
                        {t(
                          'trustScore',
                          'retake',
                        )}
                      </h3>

                      <p>
                        {t(
                          'trustScore',
                          'lowDescription',
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Quality factors */}
              <div className="quality-grid">
                <QualityItem label={t('trustScore','signalQuality')} value={`${rppg?.signalQuality ?? 0}%`} good={(rppg?.signalQuality ?? 0) >= 70} />
                <QualityItem label={t('trustScore','movement')} value={`${rppg?.motionStability ?? rppg?.motion ?? 0}% stable`} good={(rppg?.motionStability ?? rppg?.motion ?? 0) >= 70} />
                <QualityItem label={t('trustScore','lighting')} value={`${rppg?.lighting ?? 0}%`} good={(rppg?.lighting ?? 0) >= 70} />
                <QualityItem label="Algorithm agreement" value={`${rppg?.algorithmAgreement ?? 0}%`} good={(rppg?.algorithmAgreement ?? 0) >= 50} />
                <QualityItem label="Temporal stability" value={`${rppg?.temporalStability ?? 0}%`} good={(rppg?.temporalStability ?? 0) >= 60} />
                <QualityItem label="Region agreement" value={`${rppg?.regionAgreement ?? 0}%`} good={(rppg?.regionAgreement ?? 0) >= 66} />
              </div>
            </section>

            {/* Screening outputs */}
            {isHighConfidence && (
              <section className="screening-results-card">
                <div className="section-heading">
                  <div>
                    <span className="section-number">
                      01
                    </span>

                    <h2>
                      {t(
                        'trustScore',
                        'screeningInformation',
                      )}
                    </h2>
                  </div>

                  <p>
                    {t(
                      'trustScore',
                      'clinicalConfirmation',
                    )}
                  </p>
                </div>

                <div className="result-metrics">
                  <div className="result-metric">
                    <div className="metric-icon">
                      <HeartPulse size={21} />
                    </div>

                    <div>
                      <span>
                        {t(
                          'trustScore',
                          'heartRate',
                        )}
                      </span>

                      <strong>{rppg?.heartRate ?? '—'}</strong>

                      <small>
                        bpm
                      </small>
                    </div>
                  </div>

                  <div className="result-metric">
                    <div className="metric-icon">
                      <Activity size={21} />
                    </div>

                    <div>
                      <span>
                        {t(
                          'trustScore',
                          'heartRateVariability',
                        )}
                      </span>

                      <strong>
                        {t(
                          'trustScore',
                          'awaitingAnalysis',
                        )}
                      </strong>

                      <small>
                        HRV
                      </small>
                    </div>
                  </div>

                  <div className="result-metric">
                    <div className="metric-icon">
                      <Wind size={21} />
                    </div>

                    <div>
                      <span>
                        {t(
                          'trustScore',
                          'respiratoryRate',
                        )}
                      </span>

                      <strong>
                        {t(
                          'trustScore',
                          'awaitingAnalysis',
                        )}
                      </strong>

                      <small>
                        breaths/min
                      </small>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Safety */}
            <section
              className={
                isHighConfidence
                  ? 'trust-safety-card'
                  : 'trust-safety-card warning'
              }
            >
              {isHighConfidence ? (
                <ShieldCheck size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}

              <div>
                <strong>
                  {isHighConfidence
                    ? t(
                        'trustScore',
                        'confidencePassed',
                      )
                    : t(
                        'trustScore',
                        'retake',
                      )}
                </strong>

                <p>
                  {isHighConfidence
                    ? t(
                        'trustScore',
                        'confidencePassedDescription',
                      )
                    : t(
                        'trustScore',
                        'retakeDescription',
                      )}
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="trust-disclaimer">
              <Info size={16} />

              <p>
                <strong>
                  {t(
                    'trustScore',
                    'safetyTitle',
                  )}
                </strong>{' '}

                {t(
                  'trustScore',
                  'safetyText',
                )}
              </p>
            </div>

            {/* Footer */}
            <div className="form-footer trust-footer">
              <button
                className="secondary-button"
                type="button"
                onClick={handleRetake}
              >
                {t(
                  'trustScore',
                  'retake',
                )}
              </button>

              <button
                className="primary-button"
                type="button"
                onClick={handleContinue}
                disabled={!isHighConfidence}
              >
                {t(
                  'trustScore',
                  'continueTriage',
                )}

                <ArrowRight size={18} />
              </button>
            </div>


          </>
        )}
      </main>
    </div>
  )
}

function QualityItem({
  label,
  value,
  good,
}: {
  label: string
  value: string
  good: boolean
}) {
  return (
    <div className="quality-item">
      <div
        className={`quality-indicator ${
          good ? 'good' : 'bad'
        }`}
      />

      <div>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  )
}

export default TrustScore