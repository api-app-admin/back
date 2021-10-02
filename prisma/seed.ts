import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export const rolesData: Prisma.RoleCreateInput[] = [
  {
    id: 'a41aebc9-0381-4966-876c-fd5c0f14a4b1',
    name: 'USER',
  },
  {
    id: 'a7850a4a-5427-4242-aeab-de3325bf6736',
    name: 'ADMIN',
  },
]

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'admin@admin.com',
    password: '$2a$10$lTlNdIBQvCho0BoQg21KWu/VVKwlYsGwAa5r7ctOV41EKXRQ31ING',
    roles: {
      connect: [
        {
          name: 'ADMIN',
        },
      ],
    },
  },
  {
    email: 'user@user.com',
    password: '$2a$10$TLtC603wy85MM./ot/pvEec0w2au6sjPaOmLpLQFbxPdpJH9fDwwS',
    roles: {
      connect: [
        {
          name: 'USER',
        },
      ],
    },
  },
]

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
