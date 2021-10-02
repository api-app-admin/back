import { InputType, Field, Mutation, ObjectType, Ctx, Arg, Query } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-errors'

import { User, Error } from '@generated/type-graphql'

import { Context } from '../context'

@InputType()
class SignUpInput {
  @Field()
  @IsEmail()
  email!: string

  @Field()
  @Length(8)
  password!: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  surName?: string
}

@InputType()
class SignIpInput {
  @Field()
  @IsEmail()
  email!: string

  @Field()
  @Length(8)
  password!: string
}

@ObjectType()
class AuthResponse {
  @Field()
  token!: string

  @Field()
  user!: User
}

export class AuthResolvers {
  @Query(() => User)
  me(@Ctx() { user }: Context): User | null {
    return user
  }

  @Mutation(() => AuthResponse)
  async signUp(@Arg('input') input: SignUpInput, @Ctx() { prisma }: Context): Promise<AuthResponse> {
    let user = await prisma.user.findUnique({ where: { email: input.email } })
    if (user) {
      throw new ApolloError('email already in used', Error.EMAIL_ALREADY_USED)
    }
    const password = await bcrypt.hash(input.password, 10)
    user = await prisma.user.create({
      data: { ...input, password, roles: { connect: [{ name: 'USER' }] } },
    })
    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET || 'secret'),
      user,
    }
  }

  @Mutation(() => AuthResponse)
  async signIn(@Arg('input') input: SignIpInput, @Ctx() { prisma }: Context): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw new ApolloError(`No such user found for email: ${input.email}`, Error.USER_NOT_FOUND)
    }
    const passwordValid = await bcrypt.compare(input.password, user.password)
    if (!passwordValid) {
      throw new ApolloError('Invalid password', Error.INVALID_PASSWORD)
    }
    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET || 'secret'),
      user,
    }
  }
}
