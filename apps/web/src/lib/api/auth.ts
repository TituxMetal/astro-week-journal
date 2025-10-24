import { apiClient } from '~/lib/api/client'

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name?: string
}

export interface Session {
  user: User
  session: {
    id: string
    expiresAt: string
  }
}

export const authApi = {
  signUp: async (data: SignUpData): Promise<Session> => {
    return apiClient.post('/api/auth/sign-up/email', data)
  },

  signIn: async (data: SignInData): Promise<Session> => {
    return apiClient.post('/api/auth/sign-in/email', data)
  },

  signOut: async (cookieHeader?: string): Promise<void> => {
    return apiClient.post('/api/auth/sign-out', {}, cookieHeader)
  },

  getSession: async (cookieHeader?: string): Promise<Session | null> => {
    try {
      return await apiClient.get('/api/auth/get-session', cookieHeader)
    } catch {
      return null
    }
  }
}
