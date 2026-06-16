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

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await signUp(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setBusy(false)
    }
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
