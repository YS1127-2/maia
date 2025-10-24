import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  buyerId: string | null
  isAuthenticated: boolean
  signIn: (buyerId: string) => void
  signOut: () => void
}

/**
 * Authentication store with sessionStorage persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      buyerId: null,
      isAuthenticated: false,

      signIn: (buyerId: string) => {
        set({ buyerId, isAuthenticated: true })
      },

      signOut: () => {
        set({ buyerId: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    }
  )
)
