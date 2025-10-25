import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { apiClient } from './client'

// Mock fetch globally
const mockFetch = mock(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: () => Promise.resolve('{"success": true}')
  })
)

// @ts-expect-error - Override global fetch for testing
global.fetch = mockFetch

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('POST requests', () => {
    it('should make POST request with correct parameters', async () => {
      const testData = { username: 'test', password: 'password123' }

      await apiClient.post('/auth/signin', testData)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/signin',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(testData)
        })
      )
    })

    it('should include cookie header when provided', async () => {
      const testData = { email: 'test@example.com' }
      const cookieHeader = 'session=abc123'

      await apiClient.post('/api/test', testData, cookieHeader)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Cookie: cookieHeader
          })
        })
      )
    })
  })

  describe('GET requests', () => {
    it('should make GET request with correct parameters', async () => {
      await apiClient.get('/api/user')

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/user',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should include cookie header in GET requests', async () => {
      const cookieHeader = 'auth-token=xyz789'

      await apiClient.get('/api/profile', cookieHeader)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profile',
        expect.objectContaining({
          headers: expect.objectContaining({
            Cookie: cookieHeader
          })
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should throw error for failed requests', async () => {
      const errorFetch = mock(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          text: () => Promise.resolve('{"error": "Invalid credentials"}')
        })
      )

      // @ts-expect-error - Override global fetch for error testing
      global.fetch = errorFetch

      expect(apiClient.post('/auth/signin', {})).rejects.toThrow('API Error: 401 Unauthorized')
    })

    it('should handle empty responses', async () => {
      const emptyFetch = mock(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve('')
        })
      )

      // @ts-expect-error - Override global fetch for empty response testing
      global.fetch = emptyFetch

      const result = await apiClient.post('/auth/signout', {})
      expect(result).toBeUndefined()
    })
  })
})
