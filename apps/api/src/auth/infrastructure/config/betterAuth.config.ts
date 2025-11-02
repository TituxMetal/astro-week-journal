import { PrismaClient } from '@prisma/client'
import type { BetterAuthOptions } from 'better-auth'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

/**
 * Creates Better Auth instance with the provided Prisma client.
 * This is the infrastructure configuration for authentication.
 *
 * @param prisma - Prisma client instance (injected via DI)
 * @returns Configured Better Auth instance
 */
export const createBetterAuthConfig = (prisma: PrismaClient): ReturnType<typeof betterAuth> => {
  const config = {
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
    trustedOrigins: ['http://localhost:4321', 'http://localhost:3000'],
    // 🎯 Include custom user fields in the session
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: true,
          defaultValue: 'user'
        }
      }
    },
    // 🎯 Database hooks for setting default values
    databaseHooks: {
      user: {
        create: {
          before: async user => {
            // Set default role to 'user' if not provided
            return {
              data: {
                ...user,
                role: user.role || 'user'
              }
            }
          }
        }
      }
    }
    // 🎯 Easy to add OAuth providers:
    // socialProviders: {
    //   github: {
    //     clientId: process.env.GITHUB_CLIENT_ID as string,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    //   },
    //   google: {
    //     clientId: process.env.GOOGLE_CLIENT_ID as string,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    //   },
    //   apple: {
    //     clientId: process.env.APPLE_CLIENT_ID as string,
    //     clientSecret: process.env.APPLE_CLIENT_SECRET as string
    //   }
    // },
    // 🎯 Easy to add plugins:
    // plugins: [
    //   magicLink({
    //     sendMagicLink: async ({ email, url }) => {
    //       // Send magic link email
    //     }
    //   }),
    //   twoFactor(),
    //   organization()
    // ]
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

/**
 * Type helper to extract the auth instance type
 */
export type AuthInstance = ReturnType<typeof createBetterAuthConfig>
