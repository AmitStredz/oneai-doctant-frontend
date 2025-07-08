import './App.css'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'

export const BASE_URL = "http://127.0.0.1:8000"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><PatientList /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><DashboardWrapper /></RequireAuth>} />
      </Routes>
    </Router>
  )
}

function RequireAuth({ children }) {
  const token = localStorage.getItem('auth_token')
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

function DashboardWrapper() {
  const location = useLocation()
  const patient = location.state?.patient || null
  return <Dashboard initialPatient={patient} />
}

export default App
