import { checkArgs } from '../internal/checkArgs'

/** Options forwarded to `fetch`. Defaults apply only when this argument is omitted. */
export interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: string | null
  signal?: { aborted: boolean }
  [key: string]: unknown
}

/** Thrown when the server responds with a non-2xx status. */
export class FetchError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Request failed with status: ${status}`)
    this.name = 'FetchError'
    this.status = status
  }
}

/**
 * Fetches `url` and returns parsed JSON when the response content type includes
 * `application/json`. Otherwise it returns text. A non-2xx response rejects with
 * {@link FetchError}. Network failures reject with the original error.
 *
 * When `options` is omitted, the request uses `GET` and
 * `Content-Type: application/json`. Provided options replace that default;
 * they are not merged.
 *
 * @example await fetchWrapper('https://example.com/posts/1')
 */
export const fetchWrapper = async (
  url: string,
  options?: FetchOptions
): Promise<unknown> => {
  checkArgs(url, 'string', 'First argument should be URL String!')

  const resolved: FetchOptions = options ?? {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  const response = await fetch(url, resolved as RequestInit)

  if (!response.ok) throw new FetchError(response.status)

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}
