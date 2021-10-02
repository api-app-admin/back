import { NonEmptyArray } from 'type-graphql'
import {
  FindUniqueUserResolver,
  FindUniqueRoleResolver,
  FindManyUserResolver,
  FindManyRoleResolver,
  CreateUserResolver,
  CreateRoleResolver,
  UpdateUserResolver,
  UpdateRoleResolver,
  relationResolvers,
} from '@generated/type-graphql'

export const prismaResolvers: NonEmptyArray<Function> = [
  FindUniqueUserResolver,
  FindUniqueRoleResolver,
  FindManyUserResolver,
  FindManyRoleResolver,
  CreateUserResolver,
  CreateRoleResolver,
  UpdateUserResolver,
  UpdateRoleResolver,
  ...relationResolvers,
]
