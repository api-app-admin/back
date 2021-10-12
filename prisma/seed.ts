import { PrismaClient } from '@prisma/client'

import { rolesData, userData } from './seedData'

const prisma = new PrismaClient()

const createDefaultRoles = async () => {
  const count = await prisma.role.count()
  if (count) return
  for (const data of rolesData) {
    const role = await prisma.role.create({
      data,
    })
    console.log(`Created role with id: ${role.id}`)
  }
}

const createDefaultUsers = async () => {
  const count = await prisma.user.count()
  if (count) return
  for (const data of userData) {
    const role = await prisma.user.create({
      data,
    })
    console.log(`Created user with id: ${role.id}`)
  }
}

const main = async () => {
  console.log(`Start seeding ...`)
  await createDefaultRoles()
  await createDefaultUsers()
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
