import 'reflect-metadata'
import * as tq from 'type-graphql'
import { ApolloServer } from 'apollo-server-fastify'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'
import { applyMiddleware } from 'graphql-middleware'

import { resolvers } from './resolvers'
import { createContext } from './context'
import { permissions } from './permissions'

export const createApolloServer = async () => {
  const schema = await tq.buildSchema({
    resolvers: resolvers,
  })

  const apolloServer = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    introspection: true,
    context: createContext,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageLocalDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  })
  return {
    apolloServer,
  }
}
