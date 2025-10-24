import { useToastStore } from '@/stores'

/**
 * Custom hook for toast notifications
 */
export function useToast() {
  const { showToast, removeToast, clearAll } = useToastStore()

  return {
    showSuccess: (message: string, duration?: number) =>
      showToast(message, 'success', duration),
    showError: (message: string, duration?: number) =>
      showToast(message, 'error', duration),
    showInfo: (message: string, duration?: number) =>
      showToast(message, 'info', duration),
    showWarning: (message: string, duration?: number) =>
      showToast(message, 'warning', duration),
    removeToast,
    clearAll,
  }
}
