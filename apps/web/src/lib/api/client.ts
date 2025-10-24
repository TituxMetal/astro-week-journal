const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

interface RequestOptions extends RequestInit {
  cookieHeader?: string
}

const request = async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  // Add existing headers
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value
      }
    })
  }

  // Add cookie header if provided (for server-side requests)
  if (options?.cookieHeader) {
    headers['Cookie'] = options.cookieHeader
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export const apiClient = {
  post: async <T>(endpoint: string, data: unknown, cookieHeader?: string): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      cookieHeader
    })
  },

  get: async <T>(endpoint: string, cookieHeader?: string): Promise<T> => {
    return request<T>(endpoint, {
      method: 'GET',
      cookieHeader
    })
  }
}
