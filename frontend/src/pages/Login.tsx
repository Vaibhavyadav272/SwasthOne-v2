import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Activity, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, clearAuth, setToken } from '../services/api'

type UserRole = 'patient' | 'asha' | 'doctor' | 'admin'

interface LoginState {
  role?: UserRole
  message?: string
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as LoginState
  const [role, setRole] = useState<UserRole>(state.role || 'patient')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (state.role) setRole(state.role)
  }, [state.role])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await apiFetch<{
        success: boolean
        token: string
        user: { id: string; name: string; email: string; role: 'admin' | 'doctor' | 'health_worker' | 'patient' }
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: identifier.trim(), password }),
      })

      const expectedBackendRole = role === 'asha' ? 'health_worker' : role
      if (response.user.role !== expectedBackendRole) {
        throw new Error('This account does not match the selected role.')
      }

      setToken(response.token)
      localStorage.setItem('swasthone_user', JSON.stringify(response.user))
      const frontendRole = response.user.role === 'health_worker' ? 'asha' : response.user.role
      localStorage.setItem('swasthone_role', frontendRole)
      navigate(`/${frontendRole}`, { replace: true })
    } catch (err) {
      clearAuth()
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Activity size={24} />
          </div>
          <div>
            <strong>SwasthOne</strong>
            <span>Healthcare, closer to you</span>
          </div>
        </div>

        <div className="login-heading">
          <p className="section-kicker">Secure access</p>
          <h1>Welcome back</h1>
          <p>Log in to continue your SwasthOne healthcare workflow.</p>
        </div>

        {state.message && (
          <p className="auth-success" role="status">
            {state.message}
          </p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="role">Continue as</label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <option value="patient">Patient</option>
              <option value="asha">ASHA / ANM</option>
              <option value="doctor">Doctor / Medical Officer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="identifier">Email address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                id="identifier"
                type="email"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <LockKeyhole size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {role === "patient" && (
          <p className="auth-switch">
            New to SwasthOne?{" "}
            <button type="button" onClick={() => navigate("/signup")}>
              Create a patient account
            </button>
          </p>
        )}

        <div className="login-security">
          <ShieldCheck size={18} />
          <div>
            <strong>Protected healthcare access</strong>
            <span>
              Use your own patient account or an authorized ASHA/ANM, doctor, or
              administrator account.
            </span>
          </div>
        </div>

        <button
          className="login-back-button"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to SwasthOne
        </button>
      </div>
    </div>
  );
}

export default Login
