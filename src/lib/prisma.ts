import { PrismaClient } from '@prisma/client'
// 1. Import libSQL and the Prisma libSQL driver adapter
import { createClient } from '@libsql/client'
import path from 'node:path'

const dbPath = path.join(process.cwd(), 'prisma', 'replica.db')

// Debug environment variables
console.log('Environment variables:', {
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? 'SET' : 'UNDEFINED',
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? 'SET' : 'UNDEFINED'
})

// 2. Instantiate libSQL (temporarily without sync for testing)
export const libsql = createClient({
  url: `file://${dbPath}`
  // authToken: process.env.TURSO_AUTH_TOKEN!,
  // syncUrl: process.env.TURSO_DATABASE_URL!,
  // syncInterval: 600
})

// 3. Temporarily use Prisma without adapter for testing
export const prisma = new PrismaClient()
