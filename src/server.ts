import fastify from 'fastify'

import { createApolloServer } from './graphql'

export const startServer = async (logger: boolean) => {
  const PORT = process.env.PORT || 4000
  const server = fastify()
  const { apolloServer } = await createApolloServer()
  await apolloServer.start()
  await server.register(apolloServer.createHandler({ path: '/' }))
  const address = await server.listen(PORT,'0.0.0.0')
  logger && console.log(`Graphql server at ${address}${apolloServer.graphqlPath}`)
  return server
}
