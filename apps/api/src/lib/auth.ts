import { PrismaClient } from '@prisma/client'
import type { BetterAuthOptions } from 'better-auth'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const prisma = new PrismaClient()

const authConfig = {
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: 'sqlite'
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  },
  trustedOrigins: ['http://localhost:4321', 'http://localhost:3000']
} satisfies BetterAuthOptions

export const auth = betterAuth(authConfig) as ReturnType<typeof betterAuth>
