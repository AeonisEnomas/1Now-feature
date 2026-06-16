import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import { isAIConfigured } from '../lib/ollama'
import BrandMark from './BrandMark'
import { IconHome, IconCar, IconLogout, IconSettings } from './Icons'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconHome },
  { to: '/fleet', label: 'Fleet', Icon: IconCar },
  { to: '/settings', label: 'Settings', Icon: IconSettings },
]

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const initials = (user?.name || user?.email || '?').slice(0, 2).toUpperCase()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark size={40} />
          <div>
            <div className="brand-name">1Now</div>
            <div className="brand-sub">Social Studio</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <Icon width={19} height={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isSupabaseConfigured && (
            <div className="mode-badge">Demo mode · local storage</div>
          )}
          {!isAIConfigured && (
            <div className="mode-badge">AI offline · templates</div>
          )}
          <div className="user-row">
            <div className="avatar">{initials}</div>
            <div className="user-meta">
              <div className="user-name">{user?.name}</div>
              <div className="user-email" title={user?.email}>{user?.email}</div>
            </div>
            <button className="icon-btn" title="Log out" onClick={handleLogout}>
              <IconLogout width={18} height={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
