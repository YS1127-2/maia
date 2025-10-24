import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Protected route component that requires authentication
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login page with the return URL
    return <Navigate to="/authentication/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
