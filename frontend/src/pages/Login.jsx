import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './AuthLayout'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await signIn(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-desc">Sign in to your Social Studio.</p>

      <form onSubmit={submit} className="col" style={{ gap: 16, marginTop: 22 }}>
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" required placeholder="you@company.com"
            value={form.email} onChange={set('email')} autoComplete="email" />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" required placeholder="••••••••"
            value={form.password} onChange={set('password')} autoComplete="current-password" />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
          {busy ? <span className="spinner" /> : 'Sign in'}
        </button>
      </form>

      <p className="auth-foot">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  )
}
