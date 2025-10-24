import type { ProblemDetails } from '@/types'

/**
 * Base custom error class
 */
export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Unknown error
 */
export class UnknownError extends CustomError {
  constructor(message = 'An unknown error occurred') {
    super(message)
  }
}

/**
 * HTTP error with response details
 */
export class HttpError extends CustomError {
  public readonly status: number
  public readonly problemDetails?: ProblemDetails

  constructor(status: number, message: string, problemDetails?: ProblemDetails) {
    super(message)
    this.status = status
    this.problemDetails = problemDetails
  }
}

/**
 * Network error (connection issues)
 */
export class NetworkError extends CustomError {
  constructor(message = 'Network error occurred') {
    super(message)
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', problemDetails?: ProblemDetails) {
    super(401, message, problemDetails)
  }
}

/**
 * Server error (500+)
 */
export class ServerError extends HttpError {
  constructor(status: number, message = 'Server error', problemDetails?: ProblemDetails) {
    super(status, message, problemDetails)
  }
}
