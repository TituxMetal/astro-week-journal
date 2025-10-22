import type { APIContext, MiddlewareNext } from 'astro'
import { sequence } from 'astro:middleware'
import { lucia } from './lib/auth'

const dbSync = async (_: unknown, next: MiddlewareNext) => {
  if (import.meta.env.DEV) {
    // TODO: Database sync is temporarily disabled due to configuration issues with Prisma adapter 6.17.1
    // and libSQL client 0.15.15. The adapter fails to properly handle TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
    // environment variables, causing "URL_INVALID: The URL 'undefined' is not in a valid format" errors.
    // Re-enable `await libsql.sync()` when adapter configuration is fixed.
    console.log('Database sync temporarily disabled')
    // await libsql.sync()
  }

  return next()
}

const auth = async (context: APIContext, next: MiddlewareNext) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId) {
    context.locals.user = null
    context.locals.session = null

    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)

    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()

    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  context.locals.session = session
  context.locals.user = user

  return next()
}

export const onRequest = sequence(dbSync, auth)
