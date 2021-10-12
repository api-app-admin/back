import { Prisma } from '@prisma/client'

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

export const userData: Prisma.UserCreateInput[] = [
  {
    id: 'f848d912-5fcd-49e7-a84c-faff589c0977',
    email: 'admin@admin.com',
    password: '$2a$10$bmE6wNL7WPVRfIM6ugcAjuHCgVa2vC.IjW7MWbSTN8MOuQhohB1uC', // AdminAdmin
    roles: {
      connect: [
        {
          name: 'ADMIN',
        },
      ],
    },
  },
  {
    id: 'a5a1d258-f754-42ec-af1d-50ba50950bb1',
    email: 'user@user.com',
    password: '$2a$10$1u/W/3XPBSOuPz1HB0IwS.md4rKcF75mp9tvWdh5sEteqEC2pOrhO', //UserUser
    roles: {
      connect: [
        {
          name: 'USER',
        },
      ],
    },
  },
]
