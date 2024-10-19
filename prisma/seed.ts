import { prisma } from '~/lib/prisma'

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
