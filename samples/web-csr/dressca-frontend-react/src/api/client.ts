import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { ProblemDetails } from '@/types'
import {
  HttpError,
  NetworkError,
  UnauthorizedError,
  ServerError,
  UnknownError,
} from '@/lib/errors'

/**
 * Creates and configures an axios instance with error handling interceptors
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ProblemDetails>) => {
      // Network error (no response)
      if (!error.response) {
        throw new NetworkError('Network error: Unable to reach server')
      }

      const { status, data } = error.response

      // Unauthorized error
      if (status === 401) {
        throw new UnauthorizedError(
          data?.title || 'Unauthorized',
          data
        )
      }

      // Server error (500+)
      if (status >= 500) {
        throw new ServerError(
          status,
          data?.title || 'Server error occurred',
          data
        )
      }

      // Other HTTP errors
      if (data) {
        throw new HttpError(status, data.title || 'HTTP error occurred', data)
      }

      // Unknown error
      throw new UnknownError('An unexpected error occurred')
    }
  )

  return client
}

// Export a singleton instance
export const apiClient = createApiClient()
