import { rule } from 'graphql-shield'
import { ApolloError } from 'apollo-server-errors'

import { Error, RoleName } from '@generated/type-graphql'

import { Context } from '../context'

export const isAuthenticated = rule({ cache: 'contextual' })((parent, args, ctx: Context) => {
  return !!ctx.user || new ApolloError('Not Authorised!', Error.NOT_AUTHORIZED)
})

export const isAdmin = rule({ cache: 'contextual' })((parent, args, ctx: Context) => {
  return ctx.user && !!ctx.user.roles?.find(({ name }) => name === RoleName.ADMIN)
    ? true
    : new ApolloError('Not Admin!', Error.NOT_ADMIN)
})
