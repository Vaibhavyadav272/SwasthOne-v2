import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Activity, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'

function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!consent) {
      setError('Please accept the account and healthcare-data consent to continue.')
      return
    }

    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role: 'patient' }),
      })
      navigate('/login', {
        replace: true,
        state: { role: 'patient', message: 'Account created successfully. Please log in to continue.' },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon"><Activity size={24} /></div>
          <div>
            <strong>SwasthOne</strong>
            <span>Healthcare, closer to you</span>
          </div>
        </div>

        <div className="login-heading">
          <p className="section-kicker">Patient account</p>
          <h1>Create your account</h1>
          <p>Sign up to use SwasthOne directly as a patient. An ASHA/ANM worker can also create a patient profile for assisted care.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="signup-name">Full name</label>
            <div className="input-with-icon">
              <UserRound size={18} />
              <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" autoComplete="name" required />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">Email address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" required />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="signup-password">Password</label>
            <div className="input-with-icon">
              <LockKeyhole size={18} />
              <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" required />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="signup-confirm">Confirm password</label>
            <div className="input-with-icon">
              <LockKeyhole size={18} />
              <input id="signup-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" required />
            </div>
          </div>

          <label className="auth-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>I agree to create a SwasthOne account and allow my health information to be recorded for screening and care coordination.</span>
          </label>

          {error && <p role="alert" className="form-error">{error}</p>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create patient account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <button type="button" onClick={() => navigate('/login', { state: { role: 'patient' } })}>Log in</button></p>
        <button className="login-back-button" type="button" onClick={() => navigate('/')}>← Back</button>
      </div>
    </div>
  )
}

export default Signup
