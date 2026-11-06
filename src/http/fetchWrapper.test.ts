import { FetchError, fetchWrapper } from './fetchWrapper'

describe('fetchWrapper', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    globalThis.fetch = fetchMock as typeof fetch
  })

  it('returns JSON and applies the default request', async () => {
    const data = { id: 1, title: 'delectus aut autem' }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json; charset=utf-8' },
      json: async () => data
    })

    await expect(
      fetchWrapper('https://jsonplaceholder.typicode.com/todos/1')
    ).resolves.toEqual(data)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/todos/1',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      }
    )
  })

  it('returns text for a non-JSON response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => 'hello'
    })
    await expect(
      fetchWrapper('https://example.com', { method: 'POST' })
    ).resolves.toBe('hello')
  })

  it('rejects a non-2xx response instead of resolving with the error', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: { get: () => 'text/plain' }
    })

    const error = await fetchWrapper('https://example.com/missing').catch(
      (caught: unknown) => caught
    )
    expect(error).toBeInstanceOf(FetchError)
    expect(error).toMatchObject({
      status: 404,
      message: 'Request failed with status: 404'
    })
  })

  it('lets network failures reject', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'))
    await expect(fetchWrapper('https://example.com')).rejects.toThrow('offline')
  })
})
