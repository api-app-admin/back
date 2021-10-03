import 'reflect-metadata'
import * as tq from 'type-graphql'
import { ApolloServer } from 'apollo-server-fastify'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { applyMiddleware } from 'graphql-middleware'

import { resolvers } from './resolvers'
import { createContext } from './context'
import { permissions } from './permissions'

export const getGraphqlServer = async () => {
  const schema = await tq.buildSchema({
    resolvers: resolvers,
  })

  const graphql = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    introspection: true,
    context: createContext,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  })
  return {
    graphql,
  }
}
