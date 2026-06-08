/**
 * API Helper Utilities
 * Utilities untuk membantu debugging dan error handling
 */

/**
 * Log API Request
 * @param method HTTP method
 * @param url Endpoint URL
 * @param data Request payload
 */
export function logApiRequest(method: string, url: string, data?: unknown) {
  const timestamp = new Date().toLocaleTimeString()
  console.group(`[${timestamp}] 📤 API Request: ${method.toUpperCase()} ${url}`)
  if (data) {
    console.log('Payload:', data)
  }
  console.groupEnd()
}

/**
 * Log API Response
 * @param method HTTP method
 * @param url Endpoint URL
 * @param code Response code
 * @param data Response data
 */
export function logApiResponse(
  method: string,
  url: string,
  code: number,
  data: unknown,
) {
  const timestamp = new Date().toLocaleTimeString()
  const emoji = code >= 200 && code < 300 ? '✅' : code >= 400 ? '❌' : '⚠️'
  console.group(`[${timestamp}] ${emoji} API Response: ${method.toUpperCase()} ${url} (${code})`)
  console.log('Data:', data)
  console.groupEnd()
}

/**
 * Log API Error
 * @param method HTTP method
 * @param url Endpoint URL
 * @param error Error object
 * @param message Error message
 */
export function logApiError(
  method: string,
  url: string,
  error: unknown,
  message: string,
) {
  const timestamp = new Date().toLocaleTimeString()
  console.group(`[${timestamp}] ❌ API Error: ${method.toUpperCase()} ${url}`)
  console.error('Message:', message)
  console.error('Error:', error)
  console.groupEnd()
}

/**
 * Format error message untuk user-friendly display
 * @param error Error dari API
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null) {
    if ('message' in error) {
      return String(error.message)
    }
  }

  return 'Terjadi kesalahan yang tidak terduga'
}

/**
 * Is Validation Error
 * Check if error adalah validation error dari backend
 */
export function isValidationError(message: string): boolean {
  return (
    message.includes('tidak boleh') ||
    message.includes('harus') ||
    message.includes('invalid') ||
    message.includes('validation') ||
    message.includes('Required')
  )
}

/**
 * Is Network Error
 * Check if error adalah network error
 */
export function isNetworkError(message: string): boolean {
  return (
    message.includes('tidak dapat terhubung') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('ERR_NETWORK') ||
    message.includes('ECONNREFUSED')
  )
}

/**
 * Is Authentication Error
 * Check if error adalah auth error (401)
 */
export function isAuthError(message: string): boolean {
  return (
    message.includes('401') ||
    message.includes('unauthorized') ||
    message.includes('tidak terautentikasi') ||
    message.includes('token') ||
    message.includes('expired')
  )
}

/**
 * Parse Error for Display
 * Determine best way to display error to user
 */
export function parseErrorForDisplay(error: unknown): {
  title: string
  message: string
  type: 'error' | 'warning' | 'info'
} {
  const message = formatErrorMessage(error)

  if (isNetworkError(message)) {
    return {
      title: 'Koneksi Error',
      message: 'Tidak dapat terhubung ke server. Pastikan backend running.',
      type: 'error',
    }
  }

  if (isAuthError(message)) {
    return {
      title: 'Autentikasi Error',
      message: 'Sesi Anda telah berakhir. Silakan login kembali.',
      type: 'warning',
    }
  }

  if (isValidationError(message)) {
    return {
      title: 'Validasi Error',
      message: message,
      type: 'warning',
    }
  }

  return {
    title: 'Error',
    message: message,
    type: 'error',
  }
}
