import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CompanyInfo from './pages/CompanyInfo'
import CarDetails from './pages/CarDetails'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="center" style={{ height: '100vh' }}>
        <div className="spinner dark" />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<CompanyInfo />} />
        <Route path="/fleet" element={<CarDetails />} />
        {/* keep old links working */}
        <Route path="/business-card" element={<Navigate to="/settings" replace />} />
        <Route path="/car-post" element={<Navigate to="/fleet" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
