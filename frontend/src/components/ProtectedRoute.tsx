import { Navigate, Outlet } from 'react-router-dom'

type UserRole = 'patient' | 'asha' | 'doctor' | 'admin'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const storedRole = localStorage.getItem('swasthone_role') as UserRole | null
  const token = localStorage.getItem('swasthone_token')

  if (!storedRole || !token) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(storedRole)) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}

export default ProtectedRoute
