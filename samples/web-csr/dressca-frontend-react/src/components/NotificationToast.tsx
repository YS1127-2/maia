import { useToastStore } from '@/stores'
import { XMarkIcon } from '@heroicons/react/24/solid'

/**
 * Toast notification component
 */
export function NotificationToast() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-blue-500 text-white'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between rounded-lg px-4 py-3 shadow-lg min-w-[300px] ${getToastStyles(toast.type)}`}
        >
          <span className="mr-2">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-75"
            aria-label="Close notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
