import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import AuthLayout from './AuthLayout'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const { needsConfirmation } = await signUp(form)
      if (needsConfirmation) setConfirmSent(true)        // gate: stay off the dashboard
      else navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setBusy(false)
    }
  }

  if (confirmSent) {
    return (
      <AuthLayout>
        <h2 className="auth-title">Confirm your email</h2>
        <p className="auth-desc" style={{ marginTop: 12 }}>
          We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your
          account, then sign in. The card &amp; post generators unlock once your email is confirmed.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 24 }}>
          Go to sign in
        </Link>
        <p className="auth-foot">
          Wrong address? <Link to="/signup" onClick={() => setConfirmSent(false)}>Start over</Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-desc">Start generating share-ready posts in seconds.</p>

      <form onSubmit={submit} className="col" style={{ gap: 16, marginTop: 22 }}>
        <div className="field">
          <label>Full name</label>
          <input className="input" type="text" required placeholder="Jordan Rivera"
            value={form.name} onChange={set('name')} autoComplete="name" />
        </div>
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" required placeholder="you@company.com"
            value={form.email} onChange={set('email')} autoComplete="email" />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" required minLength={6} placeholder="At least 6 characters"
            value={form.password} onChange={set('password')} autoComplete="new-password" />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
          {busy ? <span className="spinner" /> : 'Create account'}
        </button>
        {isSupabaseConfigured && (
          <p className="hint" style={{ textAlign: 'center' }}>
            You may need to confirm your email before signing in.
          </p>
        )}
      </form>

      <p className="auth-foot">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
