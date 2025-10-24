import { useAuthStore } from '@/stores'

/**
 * Custom hook for authentication
 */
export function useAuth() {
  const { buyerId, isAuthenticated, signIn, signOut } = useAuthStore()

  return {
    buyerId,
    isAuthenticated,
    signIn,
    signOut,
  }
}
