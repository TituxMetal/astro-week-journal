import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

import { createBetterAuthConfig } from '../src/auth/infrastructure/config/betterAuth.config'

// Create Prisma adapter for local SQLite database
const adapter = new PrismaLibSQL({
  url: 'file:./prisma/replica.db'
})

// Initialize PrismaClient with adapter
const prisma = new PrismaClient({
  adapter
})

// Initialize Better Auth for password hashing
const auth = createBetterAuthConfig(prisma)

/**
 * Default password for development users
 * ⚠️ NEVER use this in production!
 */
const DEFAULT_PASSWORD = 'Password123!'

/**
 * Type definition for seed user data
 */
type SeedUser = {
  email: string
  password: string
  name: string
  role: 'admin' | 'editor' | 'user'
}

/**
 * Centralized seed data configuration
 * Add or modify users here to change seed data
 */
const SEED_USERS: SeedUser[] = [
  {
    email: 'admin@example.com',
    password: DEFAULT_PASSWORD,
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'editor@example.com',
    password: DEFAULT_PASSWORD,
    name: 'Editor User',
    role: 'editor'
  },
  {
    email: 'user@example.com',
    password: DEFAULT_PASSWORD,
    name: 'Regular User',
    role: 'user'
  }
]

/**
 * Clean database by deleting all existing data
 * Uses transaction to ensure atomic cleanup
 * Cascade deletes will handle related sessions and accounts
 */
const cleanDatabase = async (): Promise<void> => {
  console.log('🧹 Cleaning database...')

  try {
    await prisma.$transaction(async tx => {
      // Delete verifications (no cascade, needs explicit deletion)
      const deletedVerifications = await tx.verification.deleteMany()
      console.log(`   Deleted ${deletedVerifications.count} verifications`)

      // Delete users (cascade will handle sessions and accounts)
      const deletedUsers = await tx.user.deleteMany()
      console.log(`   Deleted ${deletedUsers.count} users (+ related sessions/accounts)`)
    })

    console.log('✅ Database cleaned\n')
  } catch (error) {
    console.error('❌ Failed to clean database:', error)
    throw error
  }
}

/**
 * Create a single user with the specified data
 * Uses Better Auth for password hashing and user creation
 * Updates role and emailVerified after creation
 */
const createUser = async (userData: SeedUser): Promise<void> => {
  try {
    // Create user via Better Auth (handles password hashing)
    await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name
      }
    })

    // Update role and verify email
    // Better Auth creates users with default 'user' role
    await prisma.user.update({
      where: { email: userData.email },
      data: {
        role: userData.role,
        emailVerified: true
      }
    })

    console.log(`✅ Created ${userData.role} user: ${userData.email}`)
  } catch (error) {
    console.error(`❌ Failed to create user ${userData.email}:`, error)
    throw error // Re-throw to fail the entire seed process
  }
}

/**
 * Main seed function
 * Implements idempotent seeding with clean slate approach
 */
const seed = async (): Promise<void> => {
  console.log('🌱 Starting database seed...')
  console.log('⚠️  Using default password for all users:', DEFAULT_PASSWORD)
  console.log()

  // Step 1: Clean database (ensures idempotent seeding)
  await cleanDatabase()

  // Step 2: Create all users
  console.log('👥 Creating users...')
  for (const userData of SEED_USERS) {
    await createUser(userData)
  }

  // Step 3: Display summary
  console.log()
  console.log('📝 Default credentials for development:')
  SEED_USERS.forEach(user => {
    console.log(`   Email: ${user.email} | Password: ${DEFAULT_PASSWORD} | Role: ${user.role}`)
  })
  console.log()
  console.log('✅ Seeding completed successfully')
}

// Execute seed with error handling
seed()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
