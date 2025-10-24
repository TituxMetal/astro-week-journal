import { defineMiddleware } from 'astro:middleware'

import { authApi } from '~/lib/api/auth'

const PUBLIC_ROUTES = ['/', '/login', '/signup']

const isPublicRoute = (pathname: string): boolean => PUBLIC_ROUTES.includes(pathname)

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  // Early return for public routes
  if (isPublicRoute(pathname)) {
    return next()
  }

  // Get cookies from incoming request to forward to backend
  const cookieHeader = context.request.headers.get('cookie') || ''

  // Check session with backend
  try {
    const session = await authApi.getSession(cookieHeader)

    // Early return if no session
    if (!session) {
      return context.redirect('/login')
    }

    // Add user to locals for use in pages
    context.locals.user = session.user
    return next()
  } catch {
    return context.redirect('/login')
  }
})
