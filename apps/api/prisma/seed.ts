import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

// Create Prisma adapter for local SQLite database
const adapter = new PrismaLibSQL({
  url: 'file:./prisma/replica.db'
})

// Initialize PrismaClient with adapter
const prisma = new PrismaClient({
  adapter
})

const seed = async () => {
  console.log('Start seeding ...')

  console.log('Add your seed operations in prisma/seed.ts file')

  console.log('Seeding finished')
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
