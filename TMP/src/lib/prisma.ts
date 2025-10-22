import { PrismaClient } from '@prisma/client'
// 1. Import libSQL and the Prisma libSQL driver adapter
import { createClient } from '@libsql/client'
import path from 'node:path'

const dbPath = path.join(process.cwd(), 'prisma', 'replica.db')

// 2. Instantiate libSQL
// Sync is currently disabled due to configuration issues with Prisma adapter 6.17.1.
// Specifically, enabling sync with the current adapter causes connection/authentication
// errors when using the TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.
// Once these issues are resolved, sync can be re-enabled by uncommenting the 'authToken',
// 'syncUrl', and 'syncInterval' lines below, and ensuring the required environment variables are set.
export const libsql = createClient({
  url: `file://${dbPath}`
  // authToken: process.env.TURSO_AUTH_TOKEN!,
  // syncUrl: process.env.TURSO_DATABASE_URL!,
  // syncInterval: 600
})

// 3. Temporarily use Prisma without adapter for testing
export const prisma = new PrismaClient()
