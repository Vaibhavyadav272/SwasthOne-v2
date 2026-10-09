import { Activity, HeartPulse, ShieldCheck, Stethoscope, Users } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getStoredUser, getToken } from '../services/api'

function AuthLanding() {
  const navigate = useNavigate()
  const token = getToken()
  const user = getStoredUser()

  if (token && user) {
    const role = user.role === 'health_worker' ? 'asha' : user.role
    if (role === 'patient' || role === 'asha' || role === 'doctor' || role === 'admin') {
      return <Navigate to={`/${role}`} replace />
    }
  }

  return (
    <div className="auth-landing-page">
      <div className="auth-landing-shell">
        <div className="auth-landing-brand">
          <div className="login-brand-icon"><Activity size={26} /></div>
          <div>
            <strong>SwasthOne</strong>
            <span>Healthcare, closer to you</span>
          </div>
        </div>

        <div className="auth-landing-heading">
          <p className="section-kicker">Welcome to SwasthOne</p>
          <h1>Healthcare access, screening and follow-up in one place.</h1>
          <p>Choose how you want to use SwasthOne. Patients can use the platform directly, while ASHA/ANM workers and doctors have dedicated clinical workflows.</p>
        </div>

        <div className="auth-choice-grid">
          <section className="auth-choice-card patient">
            <div className="auth-choice-icon"><HeartPulse size={24} /></div>
            <div>
              <h2>I'm a patient</h2>
              <p>Create your own account, complete your health profile and use screening, triage, referrals and follow-up.</p>
            </div>
            <div className="auth-choice-actions">
              <button className="login-button" type="button" onClick={() => navigate('/login', { state: { role: 'patient' } })}>Log in</button>
              <button className="secondary-auth-button" type="button" onClick={() => navigate('/signup')}>Create account</button>
            </div>
          </section>

          <section className="auth-choice-card">
            <div className="auth-choice-icon"><Users size={24} /></div>
            <div>
              <h2>I'm an ASHA / ANM worker</h2>
              <p>Register and screen patients, record measurements, triage cases, manage referrals and follow-ups.</p>
            </div>
            <button className="login-button" type="button" onClick={() => navigate('/login', { state: { role: 'asha' } })}>ASHA / ANM login</button>
          </section>

          <section className="auth-choice-card">
            <div className="auth-choice-icon"><Stethoscope size={24} /></div>
            <div>
              <h2>I'm a doctor / medical officer</h2>
              <p>Review patient records, screening context, triage and referrals from the clinical workspace.</p>
            </div>
            <button className="login-button" type="button" onClick={() => navigate('/login', { state: { role: 'doctor' } })}>Doctor login</button>
          </section>

          <section className="auth-choice-card">
            <div className="auth-choice-icon"><ShieldCheck size={24} /></div>
            <div>
              <h2>I'm an administrator</h2>
              <p>Manage the SwasthOne demo workspace, users and healthcare records.</p>
            </div>
            <button className="login-button" type="button" onClick={() => navigate('/login', { state: { role: 'admin' } })}>Admin login</button>
          </section>
        </div>

        <div className="login-security">
          <ShieldCheck size={18} />
          <div>
            <strong>Protected healthcare access</strong>
            <span>Patient accounts and healthcare-worker accounts use separate role-based workflows.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLanding
