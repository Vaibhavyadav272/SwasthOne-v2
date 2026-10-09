import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  ClipboardList,
  Cloud,
  CloudOff,
  FileHeart,
  HeartPulse,
  Plus,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import Sidebar from '../components/Sidebar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { t, useLanguage } from '../i18n'
import { apiFetch } from '../services/api'
import { getPendingRecords } from '../utils/offlineStorage'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

type Role = 'asha' | 'patient' | 'doctor' | 'admin'

interface RoleDashboardProps {
  role: Role
}

function RoleDashboard({ role }: RoleDashboardProps) {
  const navigate = useNavigate()
  const language = useLanguage()

  const isASHA = role === 'asha'
  const isPatient = role === 'patient'
  const isDoctor = role === 'doctor'
  const isAdmin = role === 'admin'

  const [doctorPatients, setDoctorPatients] = useState<Array<{
    _id: string
    name: string
    age: number
    gender: 'male' | 'female' | 'other'
    phone?: string
    village?: string
    emergencyContact?: string
    createdAt: string
  }>>([])

  useEffect(() => {
    if ((!isDoctor && !isAdmin) || !navigator.onLine) return

    apiFetch<{ success: boolean; patients: Array<{
      _id: string
      name: string
      age: number
      gender: 'male' | 'female' | 'other'
      phone?: string
      village?: string
      emergencyContact?: string
      createdAt: string
    }> }>('/patients')
      .then((response) => setDoctorPatients(response.patients))
      .catch(() => {
        // Keep the demo dashboard usable if the API is unavailable.
      })
  }, [isDoctor, isAdmin])

  const startPatientJourney = () => {
    navigate('/screening/start')
  }

  const today = new Intl.DateTimeFormat(
    language === 'hi'
      ? 'hi-IN'
      : language === 'mr'
        ? 'mr-IN'
        : 'en-IN',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(new Date())

  const greeting = isPatient
    ? t('roleDashboard', 'welcomeBack')
    : t('roleDashboard', 'goodEvening')

  return (
    <div className="app-shell">
      <Sidebar
        activeItem="Dashboard"
      />

      <main className="main-content">
        {/* HEADER */}
        <header className="topbar">
          <div>
            <p className="eyebrow">{today}</p>

            <h1>
              {greeting} 👋
            </h1>
          </div>

          <div className="topbar-actions">
            <LanguageSelector />

            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={21} />
              <span className="notification-dot" />
            </button>
          </div>
        </header>

        {/* ROLE WELCOME CARD */}
        <section className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-icon">
              {isASHA && <Users size={25} />}
              {isPatient && <HeartPulse size={25} />}
              {isDoctor && <Stethoscope size={25} />}
              {isAdmin && <ShieldCheck size={25} />}
            </div>

            <div>
              <p className="welcome-label">
                {isASHA &&
                  t('roleDashboard', 'fieldWorkflow')}

                {isPatient &&
                  t(
                    'roleDashboard',
                    'healthcareJourney',
                  )}

                {isDoctor &&
                  t(
                    'roleDashboard',
                    'clinicalWorkspace',
                  )}

                {isAdmin && 'Administration workspace'}
              </p>

              <h2>
                {isASHA &&
                  t(
                    'roleDashboard',
                    'ashaHeadline',
                  )}

                {isPatient &&
                  t(
                    'roleDashboard',
                    'patientHeadline',
                  )}

                {isDoctor &&
                  t(
                    'roleDashboard',
                    'doctorHeadline',
                  )}

                {isAdmin && 'Keep the demo care network connected.'}
              </h2>

              <p>
                {isASHA &&
                  t(
                    'roleDashboard',
                    'ashaDescription',
                  )}

                {isPatient &&
                  t(
                    'roleDashboard',
                    'patientDescription',
                  )}

                {isDoctor &&
                  t(
                    'roleDashboard',
                    'doctorDescription',
                  )}

                {isAdmin && 'Review users and patient activity without changing the clinical workflow.'}
              </p>
            </div>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => {
              if (isDoctor) {
                navigate('/patients')
              } else if (isAdmin) {
                navigate('/patients')
              } else if (isPatient) {
                startPatientJourney()
              } else {
                navigate('/patients/register')
              }
            }}
          >
            <Plus size={18} />

            {isDoctor
              ? t('roleDashboard', 'reviewPatients')
              : isAdmin
                ? 'View patients'
                : t('roleDashboard', 'startScreening')}
          </button>
        </section>

        {/* =================================================
            ASHA DASHBOARD
           ================================================= */}

        {isASHA && (
          <>
            <section className="stats-grid">
              <StatCard
                icon={<Users size={21} />}
                label={t(
                  'roleDashboard',
                  'patientsToday',
                )}
                value="24"
                note={t(
                  'roleDashboard',
                  'fromYesterday',
                )}
                iconClass="teal"
              />

              <StatCard
                icon={<Activity size={21} />}
                label={t(
                  'roleDashboard',
                  'screenings',
                )}
                value="18"
                note={t(
                  'roleDashboard',
                  'completed',
                )}
                iconClass="green"
              />

              <StatCard
                icon={<CalendarDays size={21} />}
                label={t(
                  'roleDashboard',
                  'followUps',
                )}
                value="7"
                note={t(
                  'roleDashboard',
                  'dueToday',
                )}
                iconClass="orange"
              />
            </section>

            <div className="content-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <p className="section-kicker">
                      {t(
                        'roleDashboard',
                        'patientWorkflow',
                      )}
                    </p>

                    <h3>
                      {t(
                        'roleDashboard',
                        'quickActions',
                      )}
                    </h3>
                  </div>
                </div>

                <div className="quick-actions">
                  <ActionCard
                    icon={<Users size={21} />}
                    title={t(
                      'roleDashboard',
                      'registerPatient',
                    )}
                    description={t(
                      'roleDashboard',
                      'registerDescription',
                    )}
                    onClick={() =>
                      navigate('/patients/register')
                    }
                  />

                  <ActionCard
                    icon={<Activity size={21} />}
                    title={t(
                      'roleDashboard',
                      'continueScreening',
                    )}
                    description={t(
                      'roleDashboard',
                      'continueDescription',
                    )}
                    onClick={() =>
                      navigate('/patients')
                    }
                  />

                  <ActionCard
                    icon={<ClipboardList size={21} />}
                    title={t(
                      'roleDashboard',
                      'viewReferrals',
                    )}
                    description={t(
                      'roleDashboard',
                      'referralDescription',
                    )}
                    onClick={() =>
                      navigate('/referral/tracking')
                    }
                  />
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <p className="section-kicker">
                      {t(
                        'roleDashboard',
                        'recentActivity',
                      )}
                    </p>

                    <h3>
                      {t(
                        'roleDashboard',
                        'patientsAttention',
                      )}
                    </h3>
                  </div>
                </div>

                <PatientList
                  patients={[
                    {
                      initials: 'RK',
                      name: 'Ramesh Kumar',
                      status: t(
                        'roleDashboard',
                        'routine',
                      ),
                      statusClass: 'routine',
                    },
                    {
                      initials: 'SP',
                      name: 'Sunita Patel',
                      status: t(
                        'roleDashboard',
                        'consult',
                      ),
                      statusClass: 'consult',
                    },
                    {
                      initials: 'AM',
                      name: 'Anil Mehta',
                      status: t(
                        'roleDashboard',
                        'urgent',
                      ),
                      statusClass: 'urgent',
                    },
                  ]}
                />
              </section>
            </div>

            <OfflineStatus />
          </>
        )}

        {/* =================================================
            PATIENT DASHBOARD
           ================================================= */}

        {isPatient && (
          <>
            <section className="stats-grid">
              <StatCard
                icon={<HeartPulse size={21} />}
                label={t(
                  'roleDashboard',
                  'latestTrustScore',
                )}
                value="86"
                note={t(
                  'roleDashboard',
                  'screeningConfidence',
                )}
                iconClass="teal"
              />

              <StatCard
                icon={<FileHeart size={21} />}
                label={t(
                  'roleDashboard',
                  'healthRecords',
                )}
                value="3"
                note={t(
                  'roleDashboard',
                  'availableRecords',
                )}
                iconClass="green"
              />

              <StatCard
                icon={<CalendarDays size={21} />}
                label={t(
                  'roleDashboard',
                  'nextFollowUp',
                )}
                value={
                  language === 'en'
                    ? 'Tomorrow'
                    : language === 'hi'
                      ? 'कल'
                      : 'उद्या'
                }
                note={t(
                  'roleDashboard',
                  'recommended',
                )}
                iconClass="orange"
              />
            </section>

            <div className="content-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <p className="section-kicker">
                      {t(
                        'roleDashboard',
                        'myHealthcare',
                      )}
                    </p>

                    <h3>
                      {t(
                        'roleDashboard',
                        'whatToDo',
                      )}
                    </h3>
                  </div>
                </div>

                <div className="quick-actions">
                  <ActionCard
                    icon={<Activity size={21} />}
                    title={t(
                      'roleDashboard',
                      'startScreening',
                    )}
                    description={t(
                      'roleDashboard',
                      'startScreeningDescription',
                    )}
                    onClick={startPatientJourney}
                  />

                  <ActionCard
                    icon={<FileHeart size={21} />}
                    title={t(
                      'roleDashboard',
                      'healthRecords',
                    )}
                    description={t(
                      'roleDashboard',
                      'healthRecordsDescription',
                    )}
                    onClick={() =>
                      navigate('/patients')
                    }
                  />

                  <ActionCard
                    icon={<ClipboardList size={21} />}
                    title={t(
                      'roleDashboard',
                      'myReferrals',
                    )}
                    description={t(
                      'roleDashboard',
                      'myReferralsDescription',
                    )}
                    onClick={() =>
                      navigate('/patients')
                    }
                  />
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <p className="section-kicker">
                      {t(
                        'roleDashboard',
                        'nextStep',
                      )}
                    </p>

                    <h3>
                      {t(
                        'roleDashboard',
                        'followUpCare',
                      )}
                    </h3>
                  </div>
                </div>

                <div className="role-info-card">
                  <div className="role-info-icon">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <strong>
                      {t(
                        'roleDashboard',
                        'followUpTomorrow',
                      )}
                    </strong>

                    <span>
                      {t(
                        'roleDashboard',
                        'followUpDescription',
                      )}
                    </span>
                  </div>

                  <ArrowRight size={18} />
                </div>
              </section>
            </div>

            <section className="trust-banner">
              <div className="trust-banner-icon">
                <ShieldCheck size={22} />
              </div>

              <div>
                <strong>
                  {t(
                    'roleDashboard',
                    'healthConnectedTitle',
                  )}
                </strong>

                <p>
                  {t(
                    'roleDashboard',
                    'healthConnectedDescription',
                  )}
                </p>
              </div>
            </section>
          </>
        )}

        {/* =================================================
            ADMIN DASHBOARD
           ================================================= */}

        {isAdmin && (
          <>
            <section className="stats-grid">
              <StatCard icon={<Users size={21} />} label="Patient records" value={doctorPatients.length ? String(doctorPatients.length) : '—'} note="Accessible in this demo workspace" iconClass="teal" />
              <StatCard icon={<Stethoscope size={21} />} label="Clinical users" value="2" note="ASHA / Doctor demo accounts" iconClass="green" />
              <StatCard icon={<ShieldCheck size={21} />} label="System status" value="Ready" note="Local demo environment" iconClass="orange" />
            </section>

            <div className="content-grid">
              <section className="panel">
                <div className="panel-header"><div><p className="section-kicker">Administration</p><h3>Workspace actions</h3></div></div>
                <div className="quick-actions">
                  <ActionCard icon={<Users size={21} />} title="View patients" description="Review the shared patient registry." onClick={() => navigate('/patients')} />
                  <ActionCard icon={<Stethoscope size={21} />} title="View clinical users" description="Demo ASHA and doctor accounts are seeded locally." onClick={() => navigate('/patients')} />
                  <ActionCard icon={<ClipboardList size={21} />} title="View referrals" description="Open the referral tracking workspace." onClick={() => navigate('/referral/tracking')} />
                </div>
              </section>

              <section className="panel">
                <div className="panel-header"><div><p className="section-kicker">Demo access</p><h3>Seeded accounts</h3></div></div>
                <div className="quick-actions">
                  <div className="role-info-card"><div className="role-info-icon"><Users size={22} /></div><div><strong>ASHA / ANM</strong><span>asha@swasthone.demo</span></div></div>
                  <div className="role-info-card"><div className="role-info-icon"><Stethoscope size={22} /></div><div><strong>Doctor</strong><span>doctor@swasthone.demo</span></div></div>
                  <div className="role-info-card"><div className="role-info-icon"><ShieldCheck size={22} /></div><div><strong>Administrator</strong><span>admin@swasthone.demo</span></div></div>
                </div>
              </section>
            </div>
          </>
        )}

        {/* =================================================
            DOCTOR DASHBOARD
           ================================================= */}

        {isDoctor && (
          <>
            <section className="stats-grid">
              <StatCard
                icon={<Users size={21} />}
                label={t(
                  'roleDashboard',
                  'patientsAwaitingReview',
                )}
                value="8"
                note={t(
                  'roleDashboard',
                  'needsClinicalReview',
                )}
                iconClass="teal"
              />

              <StatCard
                icon={<Activity size={21} />}
                label={t(
                  'roleDashboard',
                  'urgentCases',
                )}
                value="2"
                note={t(
                  'roleDashboard',
                  'requiresAttention',
                )}
                iconClass="orange"
              />

              <StatCard
                icon={<CalendarDays size={21} />}
                label={t(
                  'roleDashboard',
                  'todaysConsultations',
                )}
                value="6"
                note={t(
                  'roleDashboard',
                  'scheduledToday',
                )}
                iconClass="green"
              />
            </section>

            <section className="panel doctor-review-panel">
              <div className="panel-header">
                <div>
                  <p className="section-kicker">
                    {t(
                      'roleDashboard',
                      'clinicalReview',
                    )}
                  </p>

                  <h3>
                    {t(
                      'roleDashboard',
                      'patientsAwaitingReview',
                    )}
                  </h3>
                </div>

                <span className="doctor-review-count">
                  8{' '}
                  {t(
                    'roleDashboard',
                    'pending',
                  )}
                </span>
              </div>

              <div className="doctor-patient-list">
                {(doctorPatients.length > 0 ? doctorPatients.slice(0, 3) : [
                  { _id: 'demo-1', name: 'Anil Mehta', age: 52, gender: 'male' as const, village: 'Demo Village', createdAt: new Date().toISOString() },
                  { _id: 'demo-2', name: 'Sunita Patel', age: 41, gender: 'female' as const, village: 'Demo Village', createdAt: new Date().toISOString() },
                  { _id: 'demo-3', name: 'Ramesh Kumar', age: 35, gender: 'male' as const, village: 'Demo Village', createdAt: new Date().toISOString() },
                ]).map((patient, index) => {
                  const reasons = ['Chest discomfort', 'Fever + elevated pulse', 'Routine screening']
                  const statuses = ['urgent', 'consult', 'routine'] as const
                  const status = statuses[index] ?? 'routine'
                  const initials = patient.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()

                  return (
                    <DoctorPatient
                      key={patient._id}
                      initials={initials}
                      name={patient.name}
                      age={`${patient.age} years`}
                      reason={reasons[index] ?? 'Screening review'}
                      status={t('roleDashboard', status)}
                      statusClass={status}
                      onClick={() =>
                        patient._id.startsWith('demo-')
                          ? undefined
                          : navigate('/patient-record', {
                              state: {
                                patient: {
                                  patientId: patient._id,
                                  name: patient.name,
                                  age: patient.age,
                                  gender: patient.gender,
                                  phone: patient.phone,
                                  village: patient.village || '',
                                  emergencyContact: patient.emergencyContact,
                                  createdAt: patient.createdAt,
                                },
                              },
                            })
                      }
                    />
                  )
                })}
              </div>
            </section>

            <section className="trust-banner">
              <div className="trust-banner-icon">
                <Stethoscope size={22} />
              </div>

              <div>
                <strong>
                  {t(
                    'roleDashboard',
                    'reviewSafetyTitle',
                  )}
                </strong>

                <p>
                  {t(
                    'roleDashboard',
                    'reviewSafetyDescription',
                  )}
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  label,
  value,
  note,
  iconClass,
}: {
  icon: ReactNode
  label: string
  value: string
  note: string
  iconClass: string
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        {icon}
      </div>

      <div>
        <span className="stat-label">
          {label}
        </span>

        <strong>{value}</strong>

        <small>{note}</small>
      </div>
    </div>
  )
}

/* =========================================================
   ACTION CARD
   ========================================================= */

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      className="action-card"
      type="button"
      onClick={onClick}
    >
      <div className="action-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <ArrowRight size={18} />
    </button>
  )
}

/* =========================================================
   PATIENT LIST
   ========================================================= */

function PatientList({
  patients,
}: {
  patients: {
    initials: string
    name: string
    status: string
    statusClass: string
  }[]
}) {
  return (
    <div className="patient-list">
      {patients.map((patient) => (
        <div
          className="patient-row"
          key={patient.name}
        >
          <div className="patient-avatar">
            {patient.initials}
          </div>

          <div className="patient-info">
            <strong>{patient.name}</strong>

            <span>
              {t(
                'roleDashboard',
                'recentlyScreened',
              )}
            </span>
          </div>

          <span
            className={`status-pill ${patient.statusClass}`}
          >
            {patient.status}
          </span>
        </div>
      ))}
    </div>
  )
}

/* =========================================================
   DOCTOR PATIENT
   ========================================================= */

function DoctorPatient({
  initials,
  name,
  age,
  reason,
  status,
  statusClass,
  onClick,
}: {
  initials: string
  name: string
  age: string
  reason: string
  status: string
  statusClass: string
  onClick: () => void
}) {
  return (
    <button
      className="doctor-patient-row"
      type="button"
      onClick={onClick}
    >
      <div className="patient-avatar">
        {initials}
      </div>

      <div className="doctor-patient-info">
        <strong>{name}</strong>

        <span>
          {age} · {reason}
        </span>
      </div>

      <span
        className={`status-pill ${statusClass}`}
      >
        {status}
      </span>

      <ArrowRight size={18} />
    </button>
  )
}

/* =========================================================
   OFFLINE STATUS
   ========================================================= */

function OfflineStatus() {
  const isOnline = useOnlineStatus()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const updatePendingCount = () => {
      setPendingCount(getPendingRecords().length)
    }

    updatePendingCount()

    window.addEventListener(
      'storage',
      updatePendingCount,
    )

    return () => {
      window.removeEventListener(
        'storage',
        updatePendingCount,
      )
    }
  }, [isOnline])

  return (
    <section className="offline-status-card">
      {isOnline ? (
        <Cloud size={21} />
      ) : (
        <CloudOff size={21} />
      )}

      <div>
        <strong>
          {isOnline
            ? t('roleDashboard', 'online')
            : t(
                'roleDashboard',
                'offlineMode',
              )}
        </strong>

        <span>
          {isOnline
            ? pendingCount > 0
              ? `${pendingCount} ${t(
                  'roleDashboard',
                  'pendingSync',
                )}`
              : t(
                  'roleDashboard',
                  'allSynced',
                )
            : t(
                'roleDashboard',
                'offlineDescription',
              )}
        </span>
      </div>

      {isOnline && pendingCount > 0 && (
        <span className="offline-pending">
          {pendingCount}{' '}
          {t(
            'roleDashboard',
            'pending',
          )}
        </span>
      )}
    </section>
  )
}

export default RoleDashboard