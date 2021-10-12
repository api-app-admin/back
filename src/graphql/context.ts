import { PrismaClient } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

import { User } from '@generated/type-graphql'

const prisma = new PrismaClient()

export type Context = {
  prisma: PrismaClient
  user: User | null
}

export type ContextArgs = {
  request: FastifyRequest
  reply: FastifyReply
}

export const createContext = async ({ request }: ContextArgs): Promise<Context> => {
  const user = await getAuthUser(request.headers.authorization)
  return {
    user,
    prisma: prisma,
  }
}

const getAuthUser = async (authorization?: string): Promise<User | null> => {
  if (!authorization) return null
  const token = authorization.replace('Bearer ', '')
  try {
    const { userId } = jwt.verify(token, process.env.APP_SECRET || 'secret') as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: true } })
    return user || null
  } catch (error) {
    return null
  }
}
