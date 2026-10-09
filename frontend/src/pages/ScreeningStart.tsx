import { useEffect, useState } from 'react'
import { Activity, ArrowRight, UserPlus, Users, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { apiFetch, getStoredUser } from '../services/api'

type Patient = {
  _id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone?: string
  village?: string
  emergencyContact?: string
  createdAt: string
}

function ScreeningStart() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFamily, setShowFamily] = useState(false)

  useEffect(() => {
    if (!showFamily) return
    setLoading(true)
    setError('')
    apiFetch<{ success: boolean; patients: Patient[] }>('/patients')
      .then((response) => setPatients(response.patients || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load family members'))
      .finally(() => setLoading(false))
  }, [showFamily])

  const selectPatient = (patient: Patient) => {
    navigate('/screening', {
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

  return (
    <div className="app-shell">
      <Sidebar activeItem="Screening" />
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SwasthOne screening</p>
            <h1>Who are you screening?</h1>
          </div>
          <div className="topbar-actions">
            <LanguageSelector />
          </div>
        </header>

        <section className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-icon"><Activity size={25} /></div>
            <div>
              <p className="welcome-label">Family-friendly screening</p>
              <h2>Screen yourself or a family member.</h2>
              <p>Your account can keep separate health records for each family member, even when they do not have their own smartphone.</p>
            </div>
          </div>
        </section>

        {!showFamily ? (
          <section className="choice-grid">
            <button className="choice-card" type="button" onClick={() => setShowFamily(true)}>
              <div className="choice-card-icon"><Users size={25} /></div>
              <div>
                <strong>Existing family member</strong>
                <p>Choose a person already registered under this account and continue their screening.</p>
              </div>
              <ArrowRight size={20} />
            </button>

            <button className="choice-card" type="button" onClick={() => navigate('/patients/register', { state: { returnTo: '/screening/start' } })}>
              <div className="choice-card-icon"><UserPlus size={25} /></div>
              <div>
                <strong>New patient / family member</strong>
                <p>Add a new person. Their own baseline and screening history will stay separate.</p>
              </div>
              <ArrowRight size={20} />
            </button>
          </section>
        ) : (
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">{user?.role === 'patient' ? 'Your family records' : 'Patient registry'}</p>
                <h3>Select a person to screen</h3>
              </div>
              <button className="text-button" type="button" onClick={() => setShowFamily(false)}>Back</button>
            </div>

            {loading && <p>Loading family members…</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            {!loading && !error && patients.length === 0 && (
              <div className="role-info-card">
                <div className="role-info-icon"><UserRound size={22} /></div>
                <div><strong>No family members registered yet</strong><span>Add the first patient/family member to start a screening.</span></div>
                <button className="primary-button" type="button" onClick={() => navigate('/patients/register', { state: { returnTo: '/screening/start' } })}><UserPlus size={16} /> Add member</button>
              </div>
            )}

            <div className="quick-actions">
              {patients.map((patient) => (
                <div className="role-info-card" key={patient._id}>
                  <div className="role-info-icon"><UserRound size={22} /></div>
                  <div>
                    <strong>{patient.name}</strong>
                    <span>{patient.age} years · {patient.gender} · {patient.village || 'Location not provided'}</span>
                  </div>
                  <button className="primary-button" type="button" onClick={() => selectPatient(patient)}><Activity size={16} /> Start screening</button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="trust-banner">
          <div className="trust-banner-icon"><Users size={22} /></div>
          <div><strong>One account, separate records.</strong><p>Each family member keeps their own baseline, screening history, referrals and follow-up record.</p></div>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}

export default ScreeningStart
