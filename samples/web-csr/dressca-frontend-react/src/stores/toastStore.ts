import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastState {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

/**
 * Toast notification store
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = `${Date.now()}-${Math.random()}`
    const toast: Toast = { id, message, type }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  clearAll: () => {
    set({ toasts: [] })
  },
}))
