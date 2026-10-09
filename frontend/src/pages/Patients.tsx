import { Activity, Bell, Plus, ShieldCheck, Stethoscope, UserRound, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
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

function Patients() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const role = user?.role === 'health_worker' ? 'asha' : (user?.role || 'patient')
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<{ success: boolean; patients: Patient[] }>('/patients')
      .then((response) => setPatients(response.patients || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load patients'))
      .finally(() => setLoading(false))
  }, [])

  const openRecord = (patient: Patient) => {
    navigate('/patient-record', {
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

  const startScreening = (patient: Patient) => {
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
      <Sidebar activeItem={role === 'patient' ? 'My Profile' : 'Patients'} />
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SwasthOne care network</p>
            <h1>{role === 'patient' ? 'My health profile' : 'Patients'}</h1>
          </div>
          <div className="topbar-actions">
            <LanguageSelector />
            <button className="notification-button" type="button" aria-label="Notifications"><Bell size={21} /><span className="notification-dot" /></button>
          </div>
        </header>

        <section className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-icon">
              {role === 'doctor' ? <Stethoscope size={25} /> : role === 'admin' ? <ShieldCheck size={25} /> : <Users size={25} />}
            </div>
            <div>
              <p className="welcome-label">{role === 'patient' ? 'Your patient record' : 'Shared patient registry'}</p>
              <h2>{role === 'patient' ? 'Your care journey stays connected.' : 'Select an existing patient to continue care.'}</h2>
              <p>{role === 'patient' ? 'Complete your profile once, then use the same record for screening, triage, referrals and follow-up.' : 'ASHA/ANM workers can register patients once; doctors and administrators can review the shared records.'}</p>
            </div>
          </div>
          {role === 'asha' && (
            <button className="primary-button" type="button" onClick={() => navigate('/patients/register')}><Plus size={18} /> Register patient</button>
          )}
        </section>

        {error && <p className="form-error" role="alert">{error}</p>}

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">{role === 'patient' ? 'My record' : 'Patient registry'}</p>
              <h3>{loading ? 'Loading…' : `${patients.length} patient${patients.length === 1 ? '' : 's'}`}</h3>
            </div>
          </div>

          {!loading && patients.length === 0 && (
            <div className="role-info-card">
              <div className="role-info-icon"><UserRound size={22} /></div>
              <div><strong>{role === 'patient' ? 'Complete your patient profile' : 'No patients yet'}</strong><span>{role === 'patient' ? 'Register your health profile once before starting screening.' : 'Register a patient to begin the assisted-care workflow.'}</span></div>
              <button className="text-button" type="button" onClick={() => navigate('/patients/register')}>Continue</button>
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
                <button className="text-button" type="button" onClick={() => openRecord(patient)}>Health record</button>
                <button className="primary-button" type="button" onClick={() => startScreening(patient)}><Activity size={16} /> Screen</button>
              </div>
            ))}
          </div>
        </section>

        <section className="trust-banner">
          <div className="trust-banner-icon"><ShieldCheck size={22} /></div>
          <div><strong>One patient, one longitudinal record.</strong><p>The same patient record can be used across direct patient care and ASHA-assisted care, without re-registering the person for every screening.</p></div>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}

export default Patients
