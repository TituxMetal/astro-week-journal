import { useState } from 'react'

import { Button } from '~/components/Button'
import { authApi } from '~/lib/api/auth'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const authAction = isLogin
        ? () => authApi.signIn({ email, password })
        : () => authApi.signUp({ email, password, name })

      await authAction()
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => setIsLogin(!isLogin)

  return (
    <form onSubmit={handleSubmit} className='mx-auto w-full max-w-md space-y-4 p-6'>
      {error && (
        <aside
          role='alert'
          className='rounded border border-red-400 bg-red-900/20 px-4 py-3 text-red-400'
        >
          {error}
        </aside>
      )}

      {!isLogin && (
        <div>
          <label htmlFor='name' className='mb-1 block text-sm font-medium'>
            Name
          </label>
          <input
            id='name'
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>
      )}

      <div>
        <label htmlFor='email' className='mb-1 block text-sm font-medium'>
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
        />
      </div>

      <div>
        <label htmlFor='password' className='mb-1 block text-sm font-medium'>
          Password
        </label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
        />
      </div>

      <Button type='submit' disabled={loading} className='w-full'>
        {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
      </Button>

      <Button
        type='button'
        variant='secondary'
        onClick={toggleMode}
        aria-label={isLogin ? 'Switch to sign up form' : 'Switch to sign in form'}
        className='w-full text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900'
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </Button>
    </form>
  )
}
