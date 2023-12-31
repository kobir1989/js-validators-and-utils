/**
 * @function fetchWrapper
 * @param {string} url - The URL for the fetch request.
 * @param {object} options - Optional fetch options (e.g., method, headers, body).
 * @returns {Promise<unknown>} - A Promise that resolves to the fetched data or rejects with an error.
 */

import { checkArgs } from '../../lib/checkArgs'

type RequestInit = {
  method?: string
  headers?: Record<string, string>
  body?: string | FormData | URLSearchParams | ReadableStream<Uint8Array> | null
}

type AdditionalOptions = RequestInit & {
  [key: string]: unknown
}

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }
}

export const fetchWrapper = async (
  url: string,
  options: AdditionalOptions = defaultOptions
): Promise<unknown> => {
  // Check if the URL is a valid string
  checkArgs(url, 'string', 'First argument should be URL String!')

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text()
    }
  } catch (error: unknown) {
    return error
  }
}
