// API client for backend communication
// All auth and business logic happens in the backend

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

export const apiClient = {
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Login failed')
    }
    return response.json()
  },

  async signup(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Signup failed')
    }
    return response.json()
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Logout failed')
    }
    return response.json()
  },

  async getSession() {
    const response = await fetch(`${API_BASE_URL}/auth/session`, {
      credentials: 'include'
    })
    if (!response.ok) {
      return null
    }
    return response.json()
  }
}

