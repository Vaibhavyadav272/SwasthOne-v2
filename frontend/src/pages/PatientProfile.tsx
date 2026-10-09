import { ArrowRight, CalendarDays, MapPin, Phone, UserRound } from 'lucide-react'
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

function PatientProfile() {
  useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const patient = location.state?.patient as Patient | undefined

  if (!patient) {
    return (
      <div className="app-shell">
        <main className="form-page">
          <h1>{t('profile', 'notFound')}</h1>
          <p>{t('profile', 'registerFirst')}</p>

          <button
            className="primary-button"
            type="button"
            onClick={() => navigate('/patients/register')}
          >
            {t('profile', 'registerPatient')}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="form-page">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate('/patients/register')}
        >
          ← {t('profile', 'backToRegistration')}
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            {patient.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <p className="section-kicker">
              {t('profile', 'eyebrow')}
            </p>

            <h1>{patient.name}</h1>

            <p>
              {t('profile', 'registrationSuccess')}
            </p>
          </div>

          <span className="registered-badge">
            {t('profile', 'registered')}
          </span>
        </div>

        <section className="profile-grid">
          <div className="profile-info-card">
            <div className="profile-info-icon">
              <UserRound size={19} />
            </div>

            <div>
              <span>{t('profile', 'ageGender')}</span>
              <strong>
                {patient.age} {t('profile', 'years')} · {patient.gender}
              </strong>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Phone size={19} />
            </div>

            <div>
              <span>{t('profile', 'mobile')}</span>
              <strong>
                {patient.phone || t('profile', 'notProvided')}
              </strong>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <MapPin size={19} />
            </div>

            <div>
              <span>{t('profile', 'location')}</span>
              <strong>{patient.village}</strong>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>{t('profile', 'registration')}</span>
              <strong>{t('profile', 'today')}</strong>
            </div>
          </div>
        </section>

        <section className="next-step-card">
          <div>
            <p className="section-kicker">
              {t('profile', 'nextStep')}
            </p>

            <h2>
              {t('profile', 'startHealthScreening')}
            </h2>

            <p>
              {t('profile', 'screeningDescription')}
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              navigate('/screening', {
                state: { patient },
              })
            }
          >
            {t('profile', 'continue')}
            <ArrowRight size={18} />
          </button>
        </section>

        <div className="profile-safety-note">
          {t('profile', 'safetyNote')}
        </div>
      </main>
    </div>
  )
}

export default PatientProfile